import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_TRACK_TYPES = new Set([
  'SCAN',
  'CLAIM',
  'REDEMPTION',
  'VIEW',
  'CLICK',
  'DIRECTIONS',
  'CALL_CLICK',
  'ENGAGEMENT',
  'SAVE',
]);

@Injectable()
export class StorefrontService {
  constructor(private readonly prisma: PrismaService) {}

  async getNextOffer(locationIdOrSlug: string) {
    let location = await this.prisma.location
      .findUnique({
        where: { id: locationIdOrSlug },
        include: { rotatorConfig: true },
      })
      .catch(() => null);

    if (!location) {
      location = await this.prisma.location
        .findUnique({
          where: { slug: locationIdOrSlug },
          include: { rotatorConfig: true },
        })
        .catch(() => null);
    }

    if (!location || !location.isActive || !location.rotatorConfig) {
      return this.getFallbackOffer(location?.rotatorConfig);
    }

    const config = location.rotatorConfig;
    const now = new Date();

    const rawValidOffers = await this.prisma.offer.findMany({
      where: {
        status: 'approved',
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    // "No Payment = No Visibility": exclude offers belonging to businesses whose
    // billing is suspended/expired or whose plan entitlement has lapsed.
    const businessNames = [
      ...new Set(rawValidOffers.map((o) => o.businessName)),
    ];
    const profiles = await this.prisma.businessProfile.findMany({
      where: { name: { in: businessNames } },
      select: { name: true, subscriptionStatus: true, planExpiresAt: true },
    });
    const lockedOut = new Map<string, boolean>();
    for (const p of profiles) {
      const isLocked =
        p.subscriptionStatus !== 'active' ||
        (p.planExpiresAt !== null && p.planExpiresAt < now);
      lockedOut.set(p.name, isLocked);
    }
    const validOffers = rawValidOffers.filter(
      (o) => !lockedOut.get(o.businessName),
    );

    if (validOffers.length === 0) {
      return this.getFallbackOffer(config);
    }

    let sortedOffers = [...validOffers];

    let weights: Record<string, number> = {};
    try {
      weights = JSON.parse(config.weights || '{}');
    } catch {
      weights = {};
    }

    if (config.type === 'random') {
      const totalWeight = validOffers.reduce(
        (sum, o) => sum + (weights[o.id] || 1),
        0,
      );
      if (totalWeight > 0) {
        let r = Math.floor(Math.random() * totalWeight);
        let selected = validOffers[0];
        for (const offer of validOffers) {
          const w = weights[offer.id] || 1;
          if (r < w) {
            selected = offer;
            break;
          }
          r -= w;
        }
        // Random doesn't necessarily increment a pointer in the same way,
        // but we might want to track total scans via pointer if we wanted.
        // For now, let's keep pointer logic separate or just return.
        return {
          offer: selected,
          location: {
            id: location.id,
            name: location.name,
            campaignName: location.campaignName,
          },
        };
      }
    }

    // Default sorting/sequence logic
    // Default sorting: Premium first, then most recent
    sortedOffers.sort((a, b) => {
      if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    let sequence: string[] = [];
    try {
      sequence = JSON.parse(config.offerSequence || '[]');
    } catch {
      sequence = [];
    }

    if (sequence.length > 0) {
      const sequenceOffers = sequence
        .map((id: any) => validOffers.find((o: any) => o.id === id))
        .filter((o): o is (typeof validOffers)[0] => !!o);

      if (config.type === 'split') {
        const expandedSequence: typeof validOffers = [];
        for (const offer of sequenceOffers) {
          const count = weights[offer.id] || 1;
          for (let i = 0; i < count; i++) {
            expandedSequence.push(offer);
          }
        }
        sortedOffers = expandedSequence;
      } else {
        const others = validOffers.filter(
          (vo: any) => !sequence.includes(vo.id),
        );
        others.sort((a: any, b: any) => {
          if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        sortedOffers = [...sequenceOffers, ...others];
      }
    }

    const selectedOffer = sortedOffers[config.pointer % sortedOffers.length];

    // --- Scarcity Logic ---
    let finalSelectedOffer = selectedOffer;
    // Compute the next pointer once and apply it in a single atomic update at the
    // end so concurrent requests can never clobber each other's pointer writes.
    let nextPointer = (config.pointer + 1) % sortedOffers.length;

    if (config.type === 'scarcity') {
      try {
        const limits = JSON.parse(config.scarcityLimits || '{}');
        // Check if the currently selected offer is exhausted
        // "scarcity" usually means click limited in this context
        if (
          limits[selectedOffer.id] !== undefined &&
          limits[selectedOffer.id] !== null
        ) {
          const limit = parseInt(limits[selectedOffer.id]);
          if (limit > 0 && selectedOffer.claims >= limit) {
            // Find the next available non-exhausted offer in the sorted list
            let found = false;
            for (let i = 1; i < sortedOffers.length; i++) {
              const nextIndex = (config.pointer + i) % sortedOffers.length;
              const nextOffer = sortedOffers[nextIndex];
              if (
                limits[nextOffer.id] === undefined ||
                limits[nextOffer.id] === null ||
                nextOffer.claims < parseInt(limits[nextOffer.id]) ||
                parseInt(limits[nextOffer.id]) === 0
              ) {
                finalSelectedOffer = nextOffer;
                // Advance past the chosen offer for better progression
                nextPointer = (nextIndex + 1) % sortedOffers.length;
                found = true;
                break;
              }
            }
            // If all exhausted, fallback happens implicitly by keeping the current one or returning fallback
            if (!found && sortedOffers.length > 0) {
              return this.getFallbackOffer(config);
            }
          }
        }
      } catch (e) {
        console.error('Failed to process scarcity logic', e);
      }
    }

    // Record the scan for the offer that was actually shown.
    await this.prisma.activity.create({
      data: {
        type: 'SCAN',
        description: `Storefront Scan: ${location.name}`,
        offerId: finalSelectedOffer.id,
        interestScore: 'low',
      },
    });

    await this.prisma.offer.update({
      where: { id: finalSelectedOffer.id },
      data: { scans: { increment: 1 } },
    });

    // Atomically advance the pointer. The `pointer` in the WHERE clause makes the
    // update conditional on the pointer value we read, so two concurrent requests
    // can't both succeed in writing different values (optimistic concurrency).
    await this.prisma.rotatorConfig.updateMany({
      where: { id: config.id, pointer: config.pointer },
      data: { pointer: nextPointer },
    });

    return {
      offer: finalSelectedOffer,
      location: {
        id: location.id,
        name: location.name,
        campaignName: location.campaignName,
      },
    };
  }

  async getOfferById(offerId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) return null;

    // Redemption codes are sensitive entitlements; never expose them via the
    // public storefront endpoint.
    const { redemptionCode, ...publicOffer } = offer;
    return publicOffer;
  }

  async trackAction(locationId: string, offerId: string, type: string) {
    if (!ALLOWED_TRACK_TYPES.has(type)) {
      throw new BadRequestException(`Unsupported engagement type: ${type}`);
    }

    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });
    if (!offer) {
      throw new BadRequestException('Offer not found');
    }

    // Increment the specific stat on the offer
    if (type === 'CLAIM' || type === 'REDEMPTION') {
      await this.prisma.offer.update({
        where: { id: offerId },
        data: { claims: { increment: 1 } },
      });
    }

    // Record the activity
    return this.prisma.activity.create({
      data: {
        type,
        description: `${type} event at location ${locationId}`,
        offerId,
        interestScore: type === 'SCAN' ? 'low' : 'high',
      },
    });
  }

  private getFallbackOffer(config?: any) {
    if (config && config.fallbackBehavior === 'link' && config.customLink) {
      return {
        action: 'redirect',
        url: config.customLink,
      };
    }

    return {
      offer: {
        id: 'fallback-branded',
        businessName: 'MCOMLINKS',
        headline: '✨ Discover Low Street Deals',
        description:
          'The automated marketing machine for high streets. Check back later for new offers!',
        imageUrl:
          'https://images.unsplash.com/photo-1556740734-75474a001421?w=600&h=400&fit=crop',
        ctaLabel: 'Visit MCOMLINKS',
        ctaType: 'redirect',
        leadDestination: 'https://mcomlinks.com',
        isPremium: true,
        status: 'approved',
        scans: 0,
        claims: 0,
        activeViewers: 0,
        startDate: new Date(),
        endDate: new Date('2099-12-31'),
      },
      location: {
        id: 'unknown',
        name: 'MCOMLINKS',
        campaignName: 'Universal Discovery',
      },
    };
  }
}

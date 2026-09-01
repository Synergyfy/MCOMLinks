import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateGlobalOfferDto,
  UpdateGlobalOfferDto,
} from './dto/create-global-offer.dto';

@Injectable()
export class AdminOffersService {
  constructor(private readonly prisma: PrismaService) {}

  async listOffers(status?: string) {
    return this.prisma.offer.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOffer(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { activities: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  async updateOfferStatus(
    id: string,
    status: string,
    rejectionReason?: string,
  ) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException('Offer not found');

    return this.prisma.offer.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
      },
    });
  }

  async createGlobalOffer(data: CreateGlobalOfferDto) {
    const offer = await this.prisma.offer.create({
      data: {
        businessName: data.businessName,
        headline: data.headline,
        description: data.description,
        mediaType: data.mediaType,
        imageUrl:
          data.mediaType === 'image'
            ? data.imageUrl || ''
            : data.videoUrl || '', // Use videoUrl as fallback if mediaType is video but stored in imageUrl
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        ctaLabel: data.ctaLabel,
        ctaType: data.ctaType,
        leadDestination:
          data.ctaType === 'claim' || data.ctaType === 'redirect'
            ? data.ctaValue
            : '',
        status: 'approved',
        visibility: data.visibility as any,
        targetPostcode: data.targetPostcode,
        isPremium: data.isPremium || false,
        ...(data.seasonId
          ? { season: { connect: { id: data.seasonId } } }
          : {}),
      },
    });

    // If a location is assigned, add this offer to its rotator sequence
    if (data.assignedLocation) {
      const location = await this.prisma.location.findFirst({
        where: { name: { contains: data.assignedLocation } },
        include: { rotatorConfig: true },
      });

      if (location?.rotatorConfig) {
        let currentSequence: string[] = [];
        try {
          currentSequence = JSON.parse(
            location.rotatorConfig.offerSequence || '[]',
          );
        } catch {
          currentSequence = [];
        }
        if (!Array.isArray(currentSequence)) currentSequence = [];
        currentSequence.push(offer.id);
        await this.prisma.rotatorConfig.update({
          where: { id: location.rotatorConfig.id },
          data: { offerSequence: JSON.stringify(currentSequence) },
        });
      }
    }

    return offer;
  }

  async duplicateOffer(id: string) {
    const original = await this.prisma.offer.findUnique({ where: { id } });
    if (!original) throw new NotFoundException('Original offer not found');

    const {
      id: _,
      createdAt: __,
      updatedAt: ___,
      scans: ____,
      claims: _____,
      activeViewers: ______,
      ...rest
    } = original;
    return this.prisma.offer.create({
      data: {
        ...rest,
        headline: `Copy of ${original.headline}`,
        status: 'draft',
        scans: 0,
        claims: 0,
        activeViewers: 0,
      },
    });
  }

  async deleteOffer(id: string) {
    return this.prisma.offer.update({
      where: { id },
      data: { status: 'expired' }, // Soft delete/Archive
    });
  }

  async updateOffer(id: string, dto: UpdateGlobalOfferDto) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException('Offer not found');

    const data: Record<string, unknown> = { ...dto };
    // Assigned location changes the rotator sequence, not the offer itself.
    delete data.assignedLocation;
    if ('seasonId' in dto) {
      (data as any).season = dto.seasonId
        ? { connect: { id: dto.seasonId } }
        : { disconnect: true };
      delete data.seasonId;
    }
    if (dto.mediaType === 'image' && dto.imageUrl !== undefined) {
      (data as any).imageUrl = dto.imageUrl;
    }

    return this.prisma.offer.update({
      where: { id },
      data: data as any,
    });
  }

  async updateBillingStatus(id: string, status: 'active' | 'suspended') {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException('Offer not found');

    // Billing state lives on the business profile. Offers are correlated to
    // their business by name (existing platform convention).
    const updated = await this.prisma.businessProfile.updateMany({
      where: { name: offer.businessName },
      data: { subscriptionStatus: status },
    });

    return {
      success: true,
      businessName: offer.businessName,
      subscriptionStatus: status,
      profilesUpdated: updated.count,
    };
  }
}

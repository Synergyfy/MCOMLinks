import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OffersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createOfferDto: CreateOfferDto) {
        const { season, ...rest } = createOfferDto;
        return this.prisma.offer.create({
            data: {
                ...rest,
                seasonId: season,
            },
        });
    }

    async findAll(status?: string) {
        const offers = await this.prisma.offer.findMany({
            where: status && status !== 'all' ? { status: status } : undefined,
            orderBy: { createdAt: 'desc' },
        });

        return offers.map((offer: any) => this.mapOffer(offer));
    }

    async getEngagement(id: string) {
        const offer = await this.prisma.offer.findUnique({ where: { id } });
        if (!offer) throw new NotFoundException('Offer not found');

        const activities = await this.prisma.activity.findMany({
            where: { offerId: id },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        // Mocking some calculations for "Engagement Gold Dust"
        // In a real app, these would be derived from actual analytics processing
        return {
            interestScoreLabel: '🔥 8.4/10',
            avgViewTime: '42s',
            repeatScannerRate: '24%',
            activities: activities.map((act: any) => ({
                id: act.id,
                visitorId: act.visitorId,
                type: act.type.toLowerCase(),
                timestamp: act.createdAt.toISOString(),
                device: act.device,
                interestScore: act.interestScore,
            })),
        };
    }

    private mapOffer(offer: any) {
        return {
            id: offer.id,
            businessName: offer.businessName,
            headline: offer.headline,
            description: offer.description,
            imageUrl: offer.imageUrl,
            performance: {
                scans: offer.scans,
                claims: offer.claims,
            },
            activeViewers: offer.activeViewers,
            startDate: offer.startDate,
            endDate: offer.endDate,
            ctaLabel: offer.ctaLabel,
            ctaType: offer.ctaType,
            leadDestination: offer.leadDestination,
            redemptionCode: offer.redemptionCode,
            mediaType: offer.mediaType,
            status: offer.status,
            createdAt: offer.createdAt,
            updatedAt: offer.updatedAt,
        };
    }

    async findOne(id: string) {
        const offer = await this.prisma.offer.findUnique({
            where: { id },
        });

        if (!offer) {
            throw new NotFoundException(`Offer with ID ${id} not found`);
        }

        return this.mapOffer(offer);
    }

    async update(id: string, updateOfferDto: UpdateOfferDto) {
        const { season, ...rest } = updateOfferDto;
        return this.prisma.offer.update({
            where: { id },
            data: {
                ...rest,
                seasonId: season,
            },
        }).catch(() => {
            throw new NotFoundException(`Offer with ID ${id} not found`);
        });
    }

    async remove(id: string) {
        return this.prisma.offer.delete({
            where: { id },
        }).catch(() => {
            throw new NotFoundException(`Offer with ID ${id} not found`);
        });
    }
}

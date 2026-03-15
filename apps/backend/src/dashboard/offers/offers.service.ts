import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OffersService {
    constructor(private readonly prisma: PrismaService) { }

    private async getBusinessName(userId: string): Promise<string> {
        const profile = await this.prisma.businessProfile.findUnique({
            where: { userId }
        });
        
        if (!profile) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            return user?.name || "My Business";
        }
        return profile.name;
    }

    async create(userId: string, createOfferDto: CreateOfferDto) {
        const { season, ...rest } = createOfferDto;
        const businessName = await this.getBusinessName(userId);
        
        return this.prisma.offer.create({
            data: {
                ...rest,
                businessName, // Automatically set businessName from profile
                seasonId: season,
            },
        });
    }

    async findAll(userId: string, status?: string) {
        const businessName = await this.getBusinessName(userId);
        
        const offers = await this.prisma.offer.findMany({
            where: {
                businessName,
                ...(status && status !== 'all' ? { status: status } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });

        return offers.map((offer: any) => this.mapOffer(offer));
    }

    async getEngagement(userId: string, id: string) {
        const businessName = await this.getBusinessName(userId);
        const offer = await this.prisma.offer.findUnique({ where: { id } });
        
        if (!offer || offer.businessName !== businessName) {
            throw new NotFoundException('Offer not found');
        }

        const activities = await this.prisma.activity.findMany({
            where: { offerId: id },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

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

    async findOne(userId: string, id: string) {
        const businessName = await this.getBusinessName(userId);
        const offer = await this.prisma.offer.findUnique({
            where: { id },
        });

        if (!offer || offer.businessName !== businessName) {
            throw new NotFoundException(`Offer with ID ${id} not found`);
        }

        return this.mapOffer(offer);
    }

    async update(userId: string, id: string, updateOfferDto: UpdateOfferDto) {
        const businessName = await this.getBusinessName(userId);
        const offer = await this.prisma.offer.findUnique({ where: { id } });

        if (!offer || offer.businessName !== businessName) {
            throw new NotFoundException(`Offer with ID ${id} not found`);
        }

        const { season, ...rest } = updateOfferDto;
        return this.prisma.offer.update({
            where: { id },
            data: {
                ...rest,
                seasonId: season,
            },
        });
    }

    async remove(userId: string, id: string) {
        const businessName = await this.getBusinessName(userId);
        const offer = await this.prisma.offer.findUnique({ where: { id } });

        if (!offer || offer.businessName !== businessName) {
            throw new NotFoundException(`Offer with ID ${id} not found`);
        }

        return this.prisma.offer.delete({
            where: { id },
        });
    }
}

import { Injectable } from '@nestjs/common';
import { DashboardStatsDto, RecentActivityDto, QuickActionDto } from './dto/dashboard-stats.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats(userId: string): Promise<DashboardStatsDto> {
        const quickActions: QuickActionDto[] = [
            { label: 'Create New Offer', link: '/dashboard/offers', type: 'primary', icon: 'plus' },
            { label: 'View Performance', link: '/dashboard/analytics', type: 'ghost' },
            { label: 'Contact James (Agent)', link: '/dashboard/support', type: 'ghost' },
        ];

        const businessName = await this.getBusinessName(userId);

        const totalScans = await this.prisma.activity.count({ 
            where: { type: 'SCAN', offer: { businessName } } 
        });
        const totalClaims = await this.prisma.activity.count({ 
            where: { type: 'CLAIM', offer: { businessName } } 
        });
        const totalRedemptions = await this.prisma.activity.count({ 
            where: { type: 'REDEMPTION', offer: { businessName } } 
        });

        // Calculate engagement growth (comparing last 30 days to the 30 days before)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const currentPeriodEngagement = await this.prisma.activity.count({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                type: { in: ['SCAN', 'CLAIM'] },
                offer: { businessName }
            }
        });

        const previousPeriodEngagement = await this.prisma.activity.count({
            where: {
                createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
                type: { in: ['SCAN', 'CLAIM'] },
                offer: { businessName }
            }
        });

        let engagementGrowth = 0;
        if (previousPeriodEngagement > 0) {
            engagementGrowth = ((currentPeriodEngagement - previousPeriodEngagement) / previousPeriodEngagement) * 100;
        } else if (currentPeriodEngagement > 0) {
            engagementGrowth = 100; // 100% growth if we went from 0 to something
        }
        engagementGrowth = parseFloat(engagementGrowth.toFixed(1));

        const activeOffers = await this.prisma.offer.count({
            where: {
                businessName,
                status: 'approved',
                startDate: { lte: now },
                endDate: { gte: now },
            }
        });

        // Conversion Rate
        const conversionRate = totalScans > 0 ? parseFloat(((totalClaims / totalScans) * 100).toFixed(1)) : 0;

        const offer = await this.prisma.offer.findFirst({
            where: { status: 'approved', businessName },
            orderBy: { createdAt: 'desc' },
        });

        const liveOffer = offer ? {
            id: offer.id,
            businessName: offer.businessName,
            headline: offer.headline,
            description: offer.description,
            imageUrl: offer.imageUrl,
            performance: { scans: offer.scans, claims: offer.claims },
            activeViewers: offer.activeViewers,
            startDate: offer.startDate.toISOString(),
            endDate: offer.endDate.toISOString(),
            ctaLabel: offer.ctaLabel,
            ctaType: offer.ctaType,
            leadDestination: offer.leadDestination,
            redemptionCode: offer.redemptionCode,
            mediaType: offer.mediaType,
            status: offer.status,
        } : null;

        return {
            totalScans,
            totalClaims,
            totalRedemptions,
            engagementGrowth,
            conversionRate,
            activeOffers,
            liveOffer: liveOffer || undefined,
            quickActions,
        };
    }

    async getRecentActivity(userId: string): Promise<RecentActivityDto[]> {
        const businessName = await this.getBusinessName(userId);

        const activities = await this.prisma.activity.findMany({
            where: { offer: { businessName } },
            take: 10,
            orderBy: { createdAt: 'desc' },
        });

        return activities.map((act: any) => ({
            timestamp: act.createdAt.toISOString(),
            type: act.type,
            description: act.description,
        }));
    }

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
}

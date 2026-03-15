import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsDataDto, AnalyticsTimelineDto } from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getAnalytics(userId: string): Promise<AnalyticsDataDto> {
        const businessName = await this.getBusinessName(userId);

        const totalScans = await this.prisma.activity.count({ 
            where: { type: 'SCAN', offer: { businessName } } 
        });
        const totalClaims = await this.prisma.activity.count({ 
            where: { type: 'CLAIM', offer: { businessName } } 
        });

        const conversionRate = totalScans > 0 ? (totalClaims / totalScans) * 100 : 0;

        // Fetch activities for the last 7 days to build the timeline
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const activities = await this.prisma.activity.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                type: { in: ['SCAN', 'CLAIM'] },
                offer: { businessName }
            },
        });

        const timelineMap = new Map<string, { scans: number, claims: number }>();

        // Initialize last 7 days including today
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            timelineMap.set(dateStr, { scans: 0, claims: 0 });
        }

        activities.forEach((act: any) => {
            const dateStr = act.createdAt.toISOString().split('T')[0];
            if (timelineMap.has(dateStr)) {
                const dayData = timelineMap.get(dateStr)!;
                if (act.type === 'SCAN') dayData.scans++;
                if (act.type === 'CLAIM') dayData.claims++;
            }
        });

        const timeline: AnalyticsTimelineDto[] = Array.from(timelineMap.entries())
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const topOffersRaw = await this.prisma.offer.findMany({
            where: { businessName },
            take: 5,
            orderBy: { scans: 'desc' },
        });

        const topOffers = topOffersRaw.map((offer: any) => ({
            id: offer.id,
            headline: offer.headline,
            scans: offer.scans,
            claims: offer.claims,
        }));

        const recentEngagementRaw = await this.prisma.activity.findMany({
            where: { offer: { businessName } },
            take: 10,
            orderBy: { createdAt: 'desc' },
        });

        const recentEngagement = recentEngagementRaw.map((act: any) => ({
            id: act.id,
            visitorId: act.visitorId,
            type: act.type.toLowerCase(),
            timestamp: act.createdAt.toISOString(),
            interestScore: act.interestScore,
            device: act.device,
        }));

        return {
            totalScans,
            totalClaims,
            conversionRate: parseFloat(conversionRate.toFixed(1)),
            timeline,
            topOffers,
            recentEngagement,
        };
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AgentPerformanceService {
    constructor(private readonly prisma: PrismaService) { }

    async getPortfolioPerformance(period: string) {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        // Get daily aggregated scans and claims
        const activities = await this.prisma.activity.findMany({
            where: {
                createdAt: { gte: startDate },
                type: { in: ['SCAN', 'CLAIM'] }
            },
            select: {
                type: true,
                createdAt: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day for the trend chart
        const dailyTrends: Record<string, { scans: number; claims: number }> = {};

        // Initialize days
        let tempDate = new Date(startDate);
        while (tempDate <= now) {
            const dateStr = tempDate.toISOString().split('T')[0];
            dailyTrends[dateStr] = { scans: 0, claims: 0 };
            tempDate.setDate(tempDate.getDate() + 1);
        }

        activities.forEach((activity: any) => {
            const dateStr = activity.createdAt.toISOString().split('T')[0];
            if (dailyTrends[dateStr]) {
                if (activity.type === 'SCAN') dailyTrends[dateStr].scans++;
                else if (activity.type === 'CLAIM') dailyTrends[dateStr].claims++;
            }
        });

        const trendData = Object.entries(dailyTrends).map(([date, counts]) => ({
            date,
            ...counts
        }));

        // Top 5 performing offers by scan volume in this period
        const topOffersData = await this.prisma.activity.groupBy({
            by: ['offerId'],
            where: {
                type: 'SCAN',
                createdAt: { gte: startDate },
                offerId: { not: null }
            },
            _count: { offerId: true },
            orderBy: { _count: { offerId: 'desc' } },
            take: 5
        });

        const topOffers = await Promise.all(
            topOffersData.map(async (item: any) => {
                const offer = await this.prisma.offer.findUnique({
                    where: { id: item.offerId! },
                    select: { headline: true, businessName: true }
                });
                return {
                    id: item.offerId,
                    headline: offer?.headline || 'Unknown Offer',
                    business: offer?.businessName || 'Unknown Business',
                    scans: item._count.offerId
                };
            })
        );

        return {
            period,
            summary: {
                totalScans: activities.filter((a: any) => a.type === 'SCAN').length,
                totalClaims: activities.filter((a: any) => a.type === 'CLAIM').length,
                avgConversion: trendData.length > 0
                    ? (activities.filter((a: any) => a.type === 'CLAIM').length / activities.filter((a: any) => a.type === 'SCAN').length * 100 || 0).toFixed(1) + '%'
                    : '0%'
            },
            trends: trendData,
            topOffers
        };
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgentDashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // New Businesses this month
        const newBusinesses = await this.prisma.businessProfile.count({
            where: {
                user: {
                    createdAt: { gte: startOfMonth }
                }
            }
        });

        // Active Offers this month (approved & not expired)
        const activeOffers = await this.prisma.offer.count({
            where: {
                status: 'approved',
                endDate: { gte: now }
            }
        });

        // Portfolio Scans this month
        const portfolioScans = await this.prisma.activity.count({
            where: {
                type: 'SCAN',
                createdAt: { gte: startOfMonth }
            }
        });

        // Portfolio Claims this month
        const portfolioClaims = await this.prisma.activity.count({
            where: {
                type: 'CLAIM',
                createdAt: { gte: startOfMonth }
            }
        });

        // Portfolio Conversion rate
        const conversionRate = portfolioScans > 0
            ? ((portfolioClaims / portfolioScans) * 100).toFixed(1)
            : '0.0';

        // Standard avg (industry baseline - static for now)
        const standardAvg = '4.2%';

        return {
            newBusinesses: {
                value: newBusinesses,
                label: 'New Businesses',
                period: 'This Month'
            },
            activeOffers: {
                value: activeOffers,
                label: 'Active Offers',
                period: 'This Month'
            },
            goal: {
                target: 20,
                current: newBusinesses,
                label: 'Monthly Onboarding Goal',
                progressPercent: Math.min(Math.round((newBusinesses / 20) * 100), 100)
            },
            portfolioScans: {
                value: portfolioScans,
                label: 'Portfolio Scans',
                period: 'Monthly'
            },
            portfolioConversion: {
                value: `${conversionRate}%`,
                label: 'Portfolio Conversion',
                claims: portfolioClaims,
                scans: portfolioScans
            },
            standardAvg: {
                value: standardAvg,
                label: 'Standard Avg Conversion'
            }
        };
    }

    async getUrgentActions() {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Offers expiring soon (within 3 days)
        const expiringOffers = await this.prisma.offer.findMany({
            where: {
                status: 'approved',
                endDate: { gte: now, lte: threeDaysFromNow }
            },
            select: { id: true, headline: true, businessName: true, endDate: true }
        });

        // Offers awaiting review (submitted)
        const pendingOffers = await this.prisma.offer.findMany({
            where: { status: 'submitted' },
            select: { id: true, headline: true, businessName: true, createdAt: true }
        });

        const actions: { type: string; message: string; severity: string; offerId?: string }[] = [];

        expiringOffers.forEach((offer: any) => {
            actions.push({
                type: 'offer_expiring',
                message: `"${offer.headline}" by ${offer.businessName} expires soon`,
                severity: 'warning',
                offerId: offer.id
            });
        });

        pendingOffers.forEach((offer: any) => {
            actions.push({
                type: 'pending_review',
                message: `"${offer.headline}" by ${offer.businessName} is awaiting admin approval`,
                severity: 'info',
                offerId: offer.id
            });
        });

        return {
            urgentActions: actions,
            count: actions.length
        };
    }

    async getLeaderboard() {
        // Get all businesses with their offer and activity performance
        const businesses = await this.prisma.businessProfile.findMany({
            include: { user: true }
        });

        // Get all scans and claims per offer in one go
        const scanCounts = await this.prisma.activity.groupBy({
            by: ['offerId'],
            where: { type: 'SCAN' },
            _count: { offerId: true }
        });
        const claimCounts = await this.prisma.activity.groupBy({
            by: ['offerId'],
            where: { type: 'CLAIM' },
            _count: { offerId: true }
        });

        const scanMap: Record<string, number> = {};
        const claimMap: Record<string, number> = {};
        scanCounts.forEach((s: any) => { if (s.offerId) scanMap[s.offerId] = s._count.offerId; });
        claimCounts.forEach((c: any) => { if (c.offerId) claimMap[c.offerId] = c._count.offerId; });

        // Get all offers to correlate by businessName
        const allOffers = await this.prisma.offer.findMany({
            select: { id: true, businessName: true, status: true }
        });

        // Build leaderboard from business data
        const leaderboard = businesses.map((biz: any, index: number) => {
            const relevantOffers = allOffers.filter((o: any) => o.businessName === biz.name);
            const totalScans = relevantOffers.reduce((sum: number, o: any) => sum + (scanMap[o.id] || 0), 0);
            const totalClaims = relevantOffers.reduce((sum: number, o: any) => sum + (claimMap[o.id] || 0), 0);
            const activeOfferCount = relevantOffers.filter((o: any) => o.status === 'approved').length;
            const conversionRate = totalScans > 0 ? ((totalClaims / totalScans) * 100).toFixed(1) : '0.0';

            return {
                rank: index + 1,
                businessId: biz.id,
                businessName: biz.name,
                plan: biz.plan,
                subscriptionStatus: biz.subscriptionStatus,
                activeOffers: activeOfferCount,
                totalScans,
                totalClaims,
                conversionRate: `${conversionRate}%`
            };
        });

        // Sort by totalScans descending and re-rank
        leaderboard.sort((a: any, b: any) => b.totalScans - a.totalScans);
        leaderboard.forEach((item: any, i: number) => { item.rank = i + 1; });

        return { leaderboard };
    }
}

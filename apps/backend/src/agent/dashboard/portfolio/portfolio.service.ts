import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AgentPortfolioService {
    constructor(private readonly prisma: PrismaService) { }

    async getPortfolio(agentId: string) {
        const businesses = await this.prisma.businessProfile.findMany({
            where: { agentId },
            include: { user: true }
        });

        const allOffers = await this.prisma.offer.findMany({
            select: { id: true, businessName: true, status: true, endDate: true }
        });

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

        const now = new Date();

        const portfolio = businesses.map((biz: any) => {
            const bizOffers = allOffers.filter((o: any) => o.businessName === biz.name);
            const activeOffers = bizOffers.filter((o: any) => o.status === 'approved' && o.endDate > now);
            const totalScans = bizOffers.reduce((sum: number, o: any) => sum + (scanMap[o.id] || 0), 0);
            const totalClaims = bizOffers.reduce((sum: number, o: any) => sum + (claimMap[o.id] || 0), 0);
            const conversionRate = totalScans > 0 ? ((totalClaims / totalScans) * 100).toFixed(1) : '0.0';

            return {
                id: biz.id,
                name: biz.name,
                email: biz.contactEmail,
                phone: biz.contactPhone,
                address: biz.address,
                plan: biz.plan,
                subscriptionStatus: biz.subscriptionStatus,
                activeOffersCount: activeOffers.length,
                totalScans,
                totalClaims,
                conversionRate: `${conversionRate}%`,
            };
        });

        return { portfolio };
    }

    async getBusinessDetail(id: string, agentId: string) {
        const biz = await this.prisma.businessProfile.findFirst({
            where: { id, agentId },
            include: { user: true }
        });

        if (!biz) throw new NotFoundException(`Business with ID ${id} not found`);

        const offers = await this.prisma.offer.findMany({
            where: { businessName: biz.name },
            orderBy: { createdAt: 'desc' }
        });

        const now = new Date();
        const activeOffers = offers.filter((o: any) => o.status === 'approved' && o.endDate > now);
        const pendingOffers = offers.filter((o: any) => o.status === 'submitted');
        const expiredOffers = offers.filter((o: any) => o.status === 'approved' && o.endDate <= now);
        const rejectedOffers = offers.filter((o: any) => o.status === 'rejected');

        const totalScans = offers.reduce((sum: number, o: any) => sum + o.scans, 0);
        const totalClaims = offers.reduce((sum: number, o: any) => sum + o.claims, 0);
        const conversionRate = totalScans > 0 ? ((totalClaims / totalScans) * 100).toFixed(1) : '0.0';

        return {
            business: {
                id: biz.id,
                name: biz.name,
                contactEmail: biz.contactEmail,
                contactPhone: biz.contactPhone,
                address: biz.address,
                plan: biz.plan,
                subscriptionStatus: biz.subscriptionStatus,
                primaryColor: biz.primaryColor,
            },
            performance: {
                totalScans,
                totalClaims,
                conversionRate: `${conversionRate}%`,
                activeOffersCount: activeOffers.length,
                pendingOffersCount: pendingOffers.length,
                expiredOffersCount: expiredOffers.length,
                rejectedOffersCount: rejectedOffers.length,
            },
            offers,
        };
    }
}

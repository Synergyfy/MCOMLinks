import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OnboardMerchantDto } from './dto/merchant.dto';

@Injectable()
export class MerchantsService {
    constructor(private readonly prisma: PrismaService) { }

    async listMerchants(statusFilter?: string) {
        const whereClause = statusFilter ? { subscriptionStatus: statusFilter } : {};

        return this.prisma.businessProfile.findMany({
            where: whereClause,
            include: { user: { select: { email: true, name: true, id: true } } },
            orderBy: { name: 'asc' }
        });
    }

    async getMerchant(id: string) {
        const merchant = await this.prisma.businessProfile.findUnique({
            where: { id },
            include: { user: { select: { email: true, name: true, id: true } } },
        });
        if (!merchant) throw new NotFoundException('Merchant not found');
        return merchant;
    }

    async onboardMerchant(data: OnboardMerchantDto) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: 'placeholder-password', // In production, send invite email
                name: data.ownerName,
                role: 'BUSINESS',
                businessProfile: {
                    create: {
                        name: data.name,
                        description: '',
                        ownerName: data.ownerName,
                        contactEmail: data.email,
                        plan: data.plan || 'Basic',
                        subscriptionStatus: 'active',
                    }
                }
            },
            include: { businessProfile: true }
        });
    }

    async updateMerchantStatus(id: string, status: string) {
        const merchant = await this.prisma.businessProfile.findUnique({ where: { id } });
        if (!merchant) throw new NotFoundException('Merchant not found');

        return this.prisma.businessProfile.update({
            where: { id },
            data: { subscriptionStatus: status },
        });
    }

    async updateMerchantPlan(id: string, plan: string) {
        const merchant = await this.prisma.businessProfile.findUnique({ where: { id } });
        if (!merchant) throw new NotFoundException('Merchant not found');

        return this.prisma.businessProfile.update({
            where: { id },
            data: { plan: plan },
        });
    }
}

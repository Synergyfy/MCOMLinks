import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async getGlobalStats() {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const totalScans = await this.prisma.activity.count({ where: { type: 'SCAN' } });
        const totalClaims = await this.prisma.activity.count({ where: { type: 'CLAIM' } });
        const dailyScans = await this.prisma.activity.count({
            where: { type: 'SCAN', createdAt: { gte: dayAgo } }
        });
        const dailyClaims = await this.prisma.activity.count({
            where: { type: 'CLAIM', createdAt: { gte: dayAgo } }
        });

        const activeOffers = await this.prisma.offer.count({ where: { status: 'approved' } });
        const totalLocations = await this.prisma.location.count();
        const activeLocations = await this.prisma.location.count({ where: { isActive: true } });
        const activeBusinesses = await this.prisma.businessProfile.count();

        // System Health Checks
        const criticalAlerts = await this.prisma.systemLog.count({
            where: { type: 'error' }
        });

        return {
            totalScans,
            totalClaims,
            dailyScans,
            dailyClaims,
            activeOffers,
            totalLocations,
            activeLocations,
            activeBusinesses,
            healthyVolume: totalScans > 0 ? 'Healthy' : 'Low',
            systemStatus: criticalAlerts > 0 ? 'Degraded' : 'Operational',
            revenueEstimated: '£12,450.00',
            growthRate: '+14.2%',
        };
    }


    // Monitoring: System Alerts
    async listAlerts() {
        return this.prisma.systemLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 10,
        });
    }

    async createAlert(level: string, message: string, category: string) {
        return this.prisma.systemLog.create({
            data: { type: level === 'critical' ? 'error' : 'warning', message, source: category }
        });
    }

    async markAlertAsRead(id: string) {
        // SystemLog doesn't have isRead, just return the log or do nothing.
        return this.prisma.systemLog.findUnique({ where: { id } });
    }

    async toggleEmergencyPause(pause: boolean) {
        return this.prisma.globalConfig.upsert({
            where: { id: 'global-settings' },
            update: { emergencyPause: pause },
            create: { id: 'global-settings', emergencyPause: pause }
        });
    }

    // Global Config for Priority Rules & Emergency Pause
    async getGlobalConfig() {
        let config = await this.prisma.globalConfig.findUnique({ where: { id: 'global-settings' } });
        if (!config) {
            config = await this.prisma.globalConfig.create({ data: { id: 'global-settings' } });
        }
        return config;
    }

    async updateGlobalConfig(data: { emergencyPause?: boolean; priorityRule?: string }) {
        return this.prisma.globalConfig.upsert({
            where: { id: 'global-settings' },
            create: { id: 'global-settings', ...data },
            update: { ...data },
        });
    }

    // Seasonal Automation
    async createSeasonalRule(data: { name: string, startDate: Date, endDate: Date }) {
        return this.prisma.seasonalRule.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                isActive: true
            }
        });
    }
}

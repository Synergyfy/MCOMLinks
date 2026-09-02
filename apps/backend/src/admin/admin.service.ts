import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalStats() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalScans = await this.prisma.activity.count({
      where: { type: 'SCAN' },
    });
    const totalClaims = await this.prisma.activity.count({
      where: { type: 'CLAIM' },
    });
    const dailyScans = await this.prisma.activity.count({
      where: { type: 'SCAN', createdAt: { gte: dayAgo } },
    });
    const dailyClaims = await this.prisma.activity.count({
      where: { type: 'CLAIM', createdAt: { gte: dayAgo } },
    });

    const activeOffers = await this.prisma.offer.count({
      where: { status: 'approved' },
    });
    const totalLocations = await this.prisma.location.count();
    const activeLocations = await this.prisma.location.count({
      where: { isActive: true },
    });
    const activeBusinesses = await this.prisma.businessProfile.count();

    // Compute growth rate comparing last 24h to previous 24h
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const prevDailyScans = await this.prisma.activity.count({
      where: { type: 'SCAN', createdAt: { gte: twoDaysAgo, lt: dayAgo } },
    });

    let growthVal = 0;
    if (prevDailyScans > 0) {
      growthVal = ((dailyScans - prevDailyScans) / prevDailyScans) * 100;
    } else if (dailyScans > 0) {
      growthVal = 100;
    }
    const growthRate = `${growthVal >= 0 ? '+' : ''}${growthVal.toFixed(1)}%`;

    // Compute estimated monthly recurring revenue based on active paid business profiles
    const activeProfiles = await this.prisma.businessProfile.findMany({
      where: { subscriptionStatus: 'active' },
      select: { plan: true },
    });
    let estimatedRevenuePounds = 0;
    activeProfiles.forEach((p: any) => {
      if (p.plan === 'Premium' || p.plan === 'National') estimatedRevenuePounds += 299;
      else if (p.plan === 'Nearby' || p.plan === 'Hyperlocal') estimatedRevenuePounds += 99;
      else if (p.plan === 'Basic') estimatedRevenuePounds += 49;
    });
    const revenueEstimated = `£${estimatedRevenuePounds.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
    const criticalAlerts = await this.prisma.systemLog.count({
      where: { type: 'error' },
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
      revenueEstimated,
      growthRate,
    };
  }


  // Monitoring: System Alerts
  async listAlerts() {
    return this.prisma.systemLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
  }

  async toggleEmergencyPause(pause: boolean) {
    return this.prisma.globalConfig.upsert({
      where: { id: 'global-settings' },
      update: { emergencyPause: pause },
      create: { id: 'global-settings', emergencyPause: pause },
    });
  }

  // Global Config for Priority Rules & Emergency Pause
  async getGlobalConfig() {
    let config = await this.prisma.globalConfig.findUnique({
      where: { id: 'global-settings' },
    });
    if (!config) {
      config = await this.prisma.globalConfig.create({
        data: { id: 'global-settings' },
      });
    }
    return config;
  }

  async updateGlobalConfig(data: {
    emergencyPause?: boolean;
    priorityRule?: string;
  }) {
    return this.prisma.globalConfig.upsert({
      where: { id: 'global-settings' },
      create: { id: 'global-settings', ...data },
      update: { ...data },
    });
  }

  // Seasonal Automation
  async createSeasonalRule(data: {
    name: string;
    startDate: Date;
    endDate: Date;
  }) {
    return this.prisma.seasonalRule.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: true,
      },
    });
  }
}

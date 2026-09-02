import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAgentStats() {
    const totalBusinesses = await this.prisma.businessProfile.count();
    const activeOffers = await this.prisma.offer.count({
      where: { status: 'approved' },
    });
    const totalScans = await this.prisma.activity.count({
      where: { type: 'SCAN' },
    });
    const totalClaims = await this.prisma.activity.count({
      where: { type: 'CLAIM' },
    });
    const pendingApprovals = await this.prisma.offer.count({
      where: { status: 'submitted' },
    });

    return {
      totalBusinesses,
      activeOffers,
      totalScans,
      totalClaims,
      pendingApprovals,
    };
  }

}

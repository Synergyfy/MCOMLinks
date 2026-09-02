import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgentCommService {
  constructor(private readonly prisma: PrismaService) {}

  async listCommLogs(businessId: string) {
    return this.prisma.agentCommLog.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCommLog(data: {
    businessId: string;
    agentId?: string;
    agentName?: string;
    type?: string;
    notes: string;
    outcome?: string;
  }) {
    // Verify business exists
    const business = await this.prisma.businessProfile.findUnique({
      where: { id: data.businessId },
    });
    if (!business) throw new NotFoundException('Business profile not found');

    return this.prisma.agentCommLog.create({
      data: {
        businessId: data.businessId,
        agentId: data.agentId || null,
        agentName: data.agentName || 'Field Agent',
        type: data.type || 'note',
        notes: data.notes,
        outcome: data.outcome || null,
      },
    });
  }
}

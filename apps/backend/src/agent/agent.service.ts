import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentService {
    constructor(private readonly prisma: PrismaService) { }

    async getAgentStats() {
        // Mocked stats for the agent's portfolio
        return {
            totalBusinesses: 5,
            activeOffers: 12,
            totalScans: 850,
            totalClaims: 120,
            pendingApprovals: 3
        };
    }
}

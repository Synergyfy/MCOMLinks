import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSystemLogDto } from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemLogs() {
    return this.prisma.systemLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  async getAuditHistory() {
    return this.prisma.systemLog.findMany({
      where: { source: 'admin_user' },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  async getEngineStatus() {
    const start = Date.now();
    let dbStatus = 'CONNECTED';
    let dbStatusType = 'optimal';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'DISCONNECTED';
      dbStatusType = 'error';
    }
    const latency = Date.now() - start;

    return [
      {
        id: 'database',
        label: 'Database Connection',
        value: dbStatus,
        status: dbStatusType,
      },
      {
        id: 'sync',
        label: 'DB Query Latency',
        value: `${latency}ms`,
        status: latency < 100 ? 'optimal' : 'warning',
      },
      {
        id: 'backup',
        label: 'Rotator Persistence',
        value: 'ACTIVE',
        status: 'optimal',
      },
    ];
  }


  async logEvent(dto: CreateSystemLogDto) {
    return this.prisma.systemLog.create({
      data: Object.assign({}, dto),
    });
  }
}

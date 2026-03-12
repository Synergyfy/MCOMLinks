import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSystemLogDto } from './dto/health.dto';

@Injectable()
export class HealthService {
    constructor(private readonly prisma: PrismaService) { }

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
        // Simulating the actual atomic persistence layer returns as per UI requirements
        return [
            { id: 'redis', label: 'Redis Pointers', value: 'CONNECTED', status: 'optimal' },
            { id: 'sync', label: 'Sync Latency', value: '12ms', status: 'optimal' },
            { id: 'backup', label: 'Data Backups', value: 'SECURE', status: 'optimal' }
        ];
    }

    async logEvent(dto: CreateSystemLogDto) {
        return this.prisma.systemLog.create({
            data: Object.assign({}, dto)
        });
    }
}

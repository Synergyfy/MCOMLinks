import { Module } from '@nestjs/common';
import { AgentPerformanceController } from './performance.controller';
import { AgentPerformanceService } from './performance.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AgentPerformanceController],
    providers: [AgentPerformanceService],
    exports: [AgentPerformanceService],
})
export class AgentPerformanceModule { }

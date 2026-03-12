import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AgentDashboardModule } from './dashboard/dashboard.module';

@Module({
    imports: [PrismaModule, AgentDashboardModule],
    controllers: [AgentController],
    providers: [AgentService],
})
export class AgentModule { }

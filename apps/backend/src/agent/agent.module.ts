import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AgentDashboardModule } from './dashboard/dashboard.module';
import { AgentCommModule } from './comm/comm.module';

@Module({
  imports: [PrismaModule, AgentDashboardModule, AgentCommModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}


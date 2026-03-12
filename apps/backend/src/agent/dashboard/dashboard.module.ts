import { Module } from '@nestjs/common';
import { AgentDashboardController } from './dashboard.controller';
import { AgentDashboardService } from './dashboard.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AgentPortfolioModule } from './portfolio/portfolio.module';
import { AgentOnboardModule } from './onboard/onboard.module';
import { AgentPerformanceModule } from './performance/performance.module';

@Module({
    imports: [PrismaModule, AgentPortfolioModule, AgentOnboardModule, AgentPerformanceModule],
    controllers: [AgentDashboardController],
    providers: [AgentDashboardService],
    exports: [AgentDashboardService],
})
export class AgentDashboardModule { }

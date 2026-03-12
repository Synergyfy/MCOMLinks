import { Module } from '@nestjs/common';
import { AgentPortfolioController } from './portfolio.controller';
import { AgentPortfolioService } from './portfolio.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AgentPortfolioController],
    providers: [AgentPortfolioService],
    exports: [AgentPortfolioService],
})
export class AgentPortfolioModule { }

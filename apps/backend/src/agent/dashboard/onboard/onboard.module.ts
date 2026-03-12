import { Module } from '@nestjs/common';
import { AgentOnboardController } from './onboard.controller';
import { AgentOnboardService } from './onboard.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AgentOnboardController],
    providers: [AgentOnboardService],
    exports: [AgentOnboardService],
})
export class AgentOnboardModule { }

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PublicPlansController } from './public-plans.controller';
import { SystemPlansController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [SystemPlansController, PublicPlansController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}

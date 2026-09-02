import { Module } from '@nestjs/common';
import { AdminPlansController } from './admin-plans.controller';
import { PlanModule } from '../../mcom/plan/plan.module';

@Module({
  imports: [PlanModule],
  controllers: [AdminPlansController],
})
export class AdminPlansModule {}

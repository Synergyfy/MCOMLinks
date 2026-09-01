import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PlanService } from './plan.service';

@ApiTags('Public Plans')
@ApiBearerAuth()
@Controller('api/v1/plans')
@UseGuards(JwtAuthGuard)
export class PublicPlansController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({
    summary: 'List active, purchasable plans for the in-app pricing/upgrade UI',
  })
  listActive() {
    return this.planService.listActivePlans();
  }
}

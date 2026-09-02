import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlanService } from './plan.service';

@ApiTags('Public Plans')
@Controller('api/v1/plans')
export class PublicPlansController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({
    summary: 'List active, purchasable plans for the pricing/upgrade UI',
  })
  listActive() {
    return this.planService.listActivePlans();
  }

  @Get('schema')
  @ApiOperation({
    summary:
      'Get plan schema descriptors for dynamic pricing comparison rendering',
  })
  getSchema() {
    return this.planService.getSchema();
  }
}

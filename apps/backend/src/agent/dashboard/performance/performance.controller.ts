import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AgentPerformanceService } from './performance.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';

@ApiTags('Agent Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('AGENT')
@Controller('agent/performance')
export class AgentPerformanceController {
  constructor(private readonly performanceService: AgentPerformanceService) {}

  @Get()
  @ApiOperation({
    summary: "Get detailed performance analytics for the agent's portfolio",
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['7d', '30d', '90d', '1y'],
    description: 'Time period for performance data',
  })
  async getPerformance(@Query('period') period: string = '30d') {
    return this.performanceService.getPortfolioPerformance(period);
  }
}

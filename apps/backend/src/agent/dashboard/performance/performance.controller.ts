import { Controller, Get, Query } from '@nestjs/common';
import { AgentPerformanceService } from './performance.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Agent Performance')
@Controller('agent/performance')
export class AgentPerformanceController {
    constructor(private readonly performanceService: AgentPerformanceService) { }

    @Get()
    @ApiOperation({ summary: 'Get detailed performance analytics for the agent\'s portfolio' })
    @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'], description: 'Time period for performance data' })
    async getPerformance(@Query('period') period: string = '30d') {
        return this.performanceService.getPortfolioPerformance(period);
    }
}

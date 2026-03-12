import { Controller, Get } from '@nestjs/common';
import { AgentDashboardService } from './dashboard.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Agent Dashboard')
@Controller('agent/dashboard')
export class AgentDashboardController {
    constructor(private readonly dashboardService: AgentDashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get agent dashboard KPI stats (new businesses, active offers, portfolio scans, conversion)' })
    async getDashboardStats() {
        return this.dashboardService.getDashboardStats();
    }

    @Get('urgent-actions')
    @ApiOperation({ summary: 'Get a list of urgent actions requiring the agent\'s attention' })
    async getUrgentActions() {
        return this.dashboardService.getUrgentActions();
    }

    @Get('leaderboard')
    @ApiOperation({ summary: 'Get portfolio leaderboard by business performance' })
    async getLeaderboard() {
        return this.dashboardService.getLeaderboard();
    }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AgentDashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@ApiTags('Agent Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('AGENT')
@Controller('agent/dashboard')
export class AgentDashboardController {
  constructor(private readonly dashboardService: AgentDashboardService) {}

  @Get('stats')
  @ApiOperation({
    summary:
      'Get agent dashboard KPI stats (new businesses, active offers, portfolio scans, conversion)',
  })
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('urgent-actions')
  @ApiOperation({
    summary: "Get a list of urgent actions requiring the agent's attention",
  })
  async getUrgentActions() {
    return this.dashboardService.getUrgentActions();
  }

  @Get('leaderboard')
  @ApiOperation({
    summary: 'Get portfolio leaderboard by business performance',
  })
  async getLeaderboard() {
    return this.dashboardService.getLeaderboard();
  }
}

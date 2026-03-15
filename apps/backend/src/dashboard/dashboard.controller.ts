import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto, RecentActivityDto } from './dto/dashboard-stats.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Business Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get business performance metrics' })
    @ApiResponse({
        status: 200,
        description: 'Returns dashboard stats',
        type: DashboardStatsDto
    })
    async getStats(@Request() req: any): Promise<DashboardStatsDto> {
        return this.dashboardService.getStats(req.user.id);
    }

    @Get('recent-activity')
    @ApiOperation({ summary: 'Get list of recent business interactions' })
    @ApiResponse({
        status: 200,
        description: 'Returns list of recent activities',
        type: [RecentActivityDto]
    })
    async getRecentActivity(@Request() req: any): Promise<RecentActivityDto[]> {
        return this.dashboardService.getRecentActivity(req.user.id);
    }
}

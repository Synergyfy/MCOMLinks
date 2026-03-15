import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsDataDto } from './dto/analytics.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Dashboard Analytics')
@Controller('dashboard/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get()
    @ApiOperation({ summary: 'Get detailed business analytics' })
    @ApiResponse({
        status: 200,
        description: 'Returns detailed analytics data',
        type: AnalyticsDataDto,
    })
    async getAnalytics(@Request() req: any): Promise<AnalyticsDataDto> {
        return this.analyticsService.getAnalytics(req.user.id);
    }
}

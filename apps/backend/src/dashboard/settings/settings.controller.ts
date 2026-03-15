import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { BusinessSettingsDto, UpdateBusinessSettingsDto } from './dto/business-settings.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Dashboard Settings')
@Controller('dashboard/settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @ApiOperation({ summary: 'Get business settings' })
    @ApiResponse({ status: 200, type: BusinessSettingsDto })
    async getSettings(@Request() req: any): Promise<BusinessSettingsDto> {
        return this.settingsService.getSettings(req.user.id);
    }

    @Patch()
    @ApiOperation({ summary: 'Update business settings' })
    @ApiResponse({ status: 200, type: BusinessSettingsDto })
    async updateSettings(@Request() req: any, @Body() dto: UpdateBusinessSettingsDto): Promise<BusinessSettingsDto> {
        return this.settingsService.updateSettings(req.user.id, dto);
    }
}

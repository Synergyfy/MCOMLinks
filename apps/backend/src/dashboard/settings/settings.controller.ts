import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { BusinessSettingsDto, UpdateBusinessSettingsDto } from './dto/business-settings.dto';

@ApiTags('Dashboard Settings')
@Controller('dashboard/settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @ApiOperation({ summary: 'Get business settings' })
    @ApiResponse({ status: 200, type: BusinessSettingsDto })
    async getSettings(): Promise<BusinessSettingsDto> {
        return this.settingsService.getSettings();
    }

    @Patch()
    @ApiOperation({ summary: 'Update business settings' })
    @ApiResponse({ status: 200, type: BusinessSettingsDto })
    async updateSettings(@Body() dto: UpdateBusinessSettingsDto): Promise<BusinessSettingsDto> {
        return this.settingsService.updateSettings(dto);
    }
}

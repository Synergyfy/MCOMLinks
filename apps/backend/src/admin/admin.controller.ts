import { Controller, Get, Patch, Param, Body, Post, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin Platform')
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get global system analytics (Gold Dust)' })
    async getGlobalStats() {
        return this.adminService.getGlobalStats();
    }


    @Get('alerts')
    @ApiOperation({ summary: 'Monitoring: Get Critical System Alerts' })
    async listAlerts() {
        return this.adminService.listAlerts();
    }

    @Patch('alerts/:id/read')
    @ApiOperation({ summary: 'Monitoring: Mark alert as read' })
    async markAlertRead(@Param('id') id: string) {
        return this.adminService.markAlertAsRead(id);
    }

    @Post('engine/pause')
    @ApiOperation({ summary: 'Quick Override: Toggle Emergency System Pause' })
    async togglePause(@Body() body: { pause: boolean }) {
        return this.adminService.toggleEmergencyPause(body.pause);
    }

    @Get('config')
    @ApiOperation({ summary: 'Get global system settings (Priority Rule, Emergency Pause)' })
    async getGlobalConfig() {
        return this.adminService.getGlobalConfig();
    }

    @Patch('config')
    @ApiOperation({ summary: 'Update global system settings (e.g. Priority Rule)' })
    async updateGlobalConfig(@Body() body: { priorityRule?: string }) {
        return this.adminService.updateGlobalConfig(body);
    }
}

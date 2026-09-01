import { Controller, Get, Patch, Body, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ToggleEmergencyPauseDto,
  UpdateGlobalConfigDto,
} from './dto/admin.dto';

@ApiTags('Admin Platform')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  @Post('engine/pause')
  @ApiOperation({ summary: 'Quick Override: Toggle Emergency System Pause' })
  async togglePause(@Body() body: ToggleEmergencyPauseDto) {
    return this.adminService.toggleEmergencyPause(body.pause);
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get global system settings (Priority Rule, Emergency Pause)',
  })
  async getGlobalConfig() {
    return this.adminService.getGlobalConfig();
  }

  @Patch('config')
  @ApiOperation({
    summary: 'Update global system settings (e.g. Priority Rule)',
  })
  async updateGlobalConfig(@Body() body: UpdateGlobalConfigDto) {
    return this.adminService.updateGlobalConfig(body);
  }
}

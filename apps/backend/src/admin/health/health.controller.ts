import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { CreateSystemLogDto } from './dto/health.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@ApiTags('Admin Health')
@Controller('admin/health')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get recent system infrastructure logs' })
  async getSystemLogs() {
    return this.healthService.getSystemLogs();
  }

  @Get('audit')
  @ApiOperation({ summary: 'Get recent admin activity history' })
  async getAuditHistory() {
    return this.healthService.getAuditHistory();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get atomic persistence and engine health metrics' })
  getEngineStatus() {
    return this.healthService.getEngineStatus();
  }

  @Post('log')
  @ApiOperation({ summary: 'Internal: Create a new system log' })
  async logEvent(@Body() dto: CreateSystemLogDto) {
    return this.healthService.logEvent(dto);
  }
}

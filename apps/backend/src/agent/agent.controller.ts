import { Controller, Get, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Agent Platform')
@Controller('agent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('AGENT')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get agent portfolio statistics' })
  getAgentStats() {
    return this.agentService.getAgentStats();
  }
}

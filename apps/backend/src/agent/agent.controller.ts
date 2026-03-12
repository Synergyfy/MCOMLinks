import { Controller, Get, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Agent Platform')
@Controller('agent')
@UseGuards(JwtAuthGuard)
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get agent portfolio statistics' })
    async getAgentStats() {
        return this.agentService.getAgentStats();
    }
}

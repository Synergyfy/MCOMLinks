import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AgentPortfolioService } from './portfolio.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { GetUser } from '../../../auth/get-user.decorator';

@ApiTags('Agent Portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agent/portfolio')
export class AgentPortfolioController {
    constructor(private readonly portfolioService: AgentPortfolioService) { }

    @Get()
    @ApiOperation({ summary: 'List all businesses in the agent portfolio with performance summary' })
    async getPortfolio(@GetUser('id') agentId: string) {
        return this.portfolioService.getPortfolio(agentId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single business\'s full performance detail' })
    async getBusinessDetail(@Param('id') id: string, @GetUser('id') agentId: string) {
        return this.portfolioService.getBusinessDetail(id, agentId);
    }
}

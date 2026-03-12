import { Controller, Post, Get, Body } from '@nestjs/common';
import { AgentOnboardService } from './onboard.service';
import { OnboardBusinessDto } from './dto/onboard-business.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Agent Onboard')
@Controller('agent/onboard')
export class AgentOnboardController {
    constructor(private readonly onboardService: AgentOnboardService) { }

    @Get('checklist')
    @ApiOperation({ summary: 'Get the onboarding checklist / steps for a new business' })
    async getChecklist() {
        return this.onboardService.getOnboardChecklist();
    }

    @Post()
    @ApiOperation({ summary: 'Onboard a new business to the agent portfolio' })
    async onboardBusiness(@Body() dto: OnboardBusinessDto) {
        return this.onboardService.onboardBusiness(dto);
    }
}

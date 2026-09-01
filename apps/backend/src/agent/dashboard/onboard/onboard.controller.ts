import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AgentOnboardService } from './onboard.service';
import { OnboardBusinessDto } from './dto/onboard-business.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';

@ApiTags('Agent Onboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('AGENT')
@Controller('agent/onboard')
export class AgentOnboardController {
  constructor(private readonly onboardService: AgentOnboardService) {}

  @Get('checklist')
  @ApiOperation({
    summary: 'Get the onboarding checklist / steps for a new business',
  })
  getChecklist() {
    return this.onboardService.getOnboardChecklist();
  }

  @Post()
  @ApiOperation({ summary: 'Onboard a new business to the agent portfolio' })
  async onboardBusiness(@Body() dto: OnboardBusinessDto) {
    return this.onboardService.onboardBusiness(dto);
  }
}

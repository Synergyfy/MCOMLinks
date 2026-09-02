import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentCommService } from './comm.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@Controller('agent/comm')
export class AgentCommController {
  constructor(private readonly commService: AgentCommService) {}

  @Get(':businessId')
  @UseGuards(JwtAuthGuard)
  async listCommLogs(@Param('businessId') businessId: string) {
    return this.commService.listCommLogs(businessId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCommLog(@Body() body: any) {
    return this.commService.createCommLog(body);
  }
}

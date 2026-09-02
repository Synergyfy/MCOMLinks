import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateSupportMessageDto, SupportMessageDto } from './dto/support.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@ApiTags('Support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUSINESS')
@Controller('dashboard/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('messages')
  @ApiOperation({ summary: 'Get all support messages for the current user' })
  @ApiResponse({ status: 200, type: [SupportMessageDto] })
  async getMessages(
    @GetUser('id') userId: string,
  ): Promise<SupportMessageDto[]> {
    return this.supportService.getMessages(userId);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a new support message' })
  @ApiResponse({ status: 201, type: SupportMessageDto })
  async createMessage(
    @GetUser('id') userId: string,
    @Body() createMessageDto: CreateSupportMessageDto,
  ): Promise<SupportMessageDto> {
    return this.supportService.createMessage(createMessageDto, userId);
  }
}

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateSupportMessageDto, SupportMessageDto } from './dto/support.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../auth/get-user.decorator';

@ApiTags('Support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard/support')
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Get('messages')
    @ApiOperation({ summary: 'Get all support messages for the current user' })
    @ApiResponse({ status: 200, type: [SupportMessageDto] })
    async getMessages(@GetUser('id') userId: string): Promise<SupportMessageDto[]> {
        return this.supportService.getMessages(userId);
    }

    @Post('messages')
    @ApiOperation({ summary: 'Send a new support message' })
    @ApiResponse({ status: 201, type: SupportMessageDto })
    async createMessage(
        @GetUser('id') userId: string,
        @Body() createMessageDto: CreateSupportMessageDto
    ): Promise<SupportMessageDto> {
        return this.supportService.createMessage(createMessageDto, userId);
    }
}

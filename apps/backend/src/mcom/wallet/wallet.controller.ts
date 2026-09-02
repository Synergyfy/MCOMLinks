import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { McomWalletService, WalletBalanceResponse } from './wallet.service';

@ApiTags('MCOM Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/mcom/wallet')
export class WalletController {
  constructor(private readonly walletService: McomWalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current user MCOM Wallet balance from Central Hub' })
  async getBalance(@Request() req: any): Promise<WalletBalanceResponse> {
    return this.walletService.getBalance(req.user.id);
  }
}

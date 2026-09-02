import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import {
  ConfirmPurchaseDto,
  InitiatePurchaseDto,
  PurchaseWalletDto,
} from './purchase.dto';
import { PurchaseService } from './purchase.service';

@ApiTags('MCOM In-App Purchase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUSINESS', 'ADMIN')
@Controller('api/v1/mcom/packages/purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Initiate a plan purchase via MCOM Central (returns clientSecret)',
  })
  initiate(@Request() req: any, @Body() dto: InitiatePurchaseDto) {
    return this.purchaseService.initiate(req.user.id, dto);
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm a completed payment and activate entitlements locally',
  })
  confirm(@Request() req: any, @Body() dto: ConfirmPurchaseDto) {
    return this.purchaseService.confirm(req.user.id, dto);
  }

  @Post('wallet')
  @ApiOperation({
    summary: 'Purchase a plan directly with MCOM Centralized Wallet credits',
  })
  purchaseWithWallet(@Request() req: any, @Body() dto: PurchaseWalletDto) {
    return this.purchaseService.purchaseWithWallet(req.user.id, dto);
  }
}


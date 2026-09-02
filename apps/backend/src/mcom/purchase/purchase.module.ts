import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { McomCentralModule } from '../central/central.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, McomCentralModule, WalletModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}


import { Module } from '@nestjs/common';
import { PlanModule } from './plan/plan.module';
import { PurchaseModule } from './purchase/purchase.module';
import { WebhookModule } from './webhook/webhook.module';
import { McomCentralModule } from './central/central.module';
import { WalletModule } from './wallet/wallet.module';

// MCOM Ecosystem integration (partner service side):
//  - /auth/mcom/login + /auth/mcom/callback (Central Hub SSO)
//  - /api/v1/system/plans CRUD (consumed by the MCOM Solutions Console)
//  - /api/v1/plans (active plans for the in-app pricing/upgrade UI)
//  - /api/v1/mcom/packages/purchase/initiate|confirm (centralized in-app payments)
//  - /api/v1/mcom/packages/purchase/wallet (Centralized Wallet debit)
//  - /api/v1/mcom/wallet/balance (Centralized Wallet balance check)
//  - /api/v1/mcom/webhook (lifecycle: created/renewed/cancelled/expired)
@Module({
  imports: [
    PlanModule,
    PurchaseModule,
    WebhookModule,
    McomCentralModule,
    WalletModule,
  ],
})
export class McomModule {}


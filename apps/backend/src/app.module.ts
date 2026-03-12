import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AnalyticsModule } from './dashboard/analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { OffersModule } from './dashboard/offers/offers.module';
import { SupportModule } from './dashboard/support/support.module';
import { SettingsModule } from './dashboard/settings/settings.module';
import { StorefrontModule } from './storefront/storefront.module';
import { AdminModule } from './admin/admin.module';

import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DashboardModule,
    AnalyticsModule,
    OffersModule,
    SupportModule,
    SettingsModule,
    StorefrontModule,
    AdminModule,
    AgentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

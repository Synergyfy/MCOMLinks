import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationsModule } from './locations/locations.module';
import { AdminOffersModule } from './offers/admin-offers.module';
import { MerchantsModule } from './merchants/merchants.module';
import { SeasonsModule } from './seasons/seasons.module';
import { IdentityModule } from './identity/identity.module';
import { HealthModule } from './health/health.module';
import { AdminPlansModule } from './plans/admin-plans.module';
import { CmsModule } from './cms/cms.module';
import { PromoModule } from './promo/promo.module';
import { AdsModule } from './ads/ads.module';

@Module({
  imports: [
    PrismaModule,
    LocationsModule,
    AdminOffersModule,
    MerchantsModule,
    SeasonsModule,
    IdentityModule,
    HealthModule,
    AdminPlansModule,
    CmsModule,
    PromoModule,
    AdsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}


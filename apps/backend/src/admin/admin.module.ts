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

@Module({
    imports: [PrismaModule, LocationsModule, AdminOffersModule, MerchantsModule, SeasonsModule, IdentityModule, HealthModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }

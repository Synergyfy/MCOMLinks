import { Module } from '@nestjs/common';
import { AdminOffersService } from './admin-offers.service';
import { AdminOffersController } from './admin-offers.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AdminOffersService],
    controllers: [AdminOffersController],
    exports: [AdminOffersService],
})
export class AdminOffersModule { }

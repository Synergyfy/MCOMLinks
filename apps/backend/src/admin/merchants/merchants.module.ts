import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [MerchantsService],
    controllers: [MerchantsController],
    exports: [MerchantsService],
})
export class MerchantsModule { }

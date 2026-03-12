import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [SeasonsService],
    controllers: [SeasonsController],
    exports: [SeasonsService],
})
export class SeasonsModule { }

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { McomCentralService } from './central.service';
import { McomSsoController } from './central.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [McomSsoController],
  providers: [McomCentralService],
  exports: [McomCentralService],
})
export class McomCentralModule {}

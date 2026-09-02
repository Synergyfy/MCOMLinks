import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}

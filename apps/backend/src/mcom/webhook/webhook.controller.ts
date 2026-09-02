import { Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { verifyWebhookSignature } from './webhook.signature';
import { WebhookService } from './webhook.service';

// Raw body handling: the global body-parser routing in main.ts sends this route
// an express.raw() buffer so the HMAC signature can be verified byte-for-byte.
@ApiExcludeController()
@Controller('api/v1/mcom/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiOperation({ summary: 'Receive lifecycle webhooks from MCOM Central' })
  async handle(@Req() req: Request) {
    const rawBody = req.body as Buffer;
    const signature = req.headers['x-mcom-webhook-signature'] as
      | string
      | undefined;
    const secret = process.env.MCOM_WEBHOOK_SECRET || '';

    if (
      !Buffer.isBuffer(rawBody) ||
      !verifyWebhookSignature(rawBody, signature || '', secret)
    ) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    await this.webhookService.handleEvent(payload);
    return { received: true };
  }
}

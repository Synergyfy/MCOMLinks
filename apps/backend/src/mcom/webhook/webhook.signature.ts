import { createHmac, timingSafeEqual } from 'crypto';

// Verifies the `X-Mcom-Webhook-Signature` HMAC-SHA256 header sent by MCOM
// Central on lifecycle webhooks (package.created/renewed/cancelled/expired).
export function verifyWebhookSignature(
  rawBody: Buffer | string,
  signatureHeader: string,
  secret: string,
): boolean {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false;
  const expectedSignature = signatureHeader.replace('sha256=', '');
  const calculatedSignature = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature.length !== calculatedSignature.length) return false;
  return timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(calculatedSignature),
  );
}

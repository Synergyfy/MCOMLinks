import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { decryptToken } from '../crypto.util';
import { ConfirmPurchaseDto, InitiatePurchaseDto } from './purchase.dto';

const DEFAULT_CENTRAL_URL = 'https://auth.mcomsolutions.com';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  private centralUrl(): string {
    return (process.env.MCOM_SOLUTIONS_URL || DEFAULT_CENTRAL_URL).replace(
      /\/+$/,
      '',
    );
  }

  private platformSlug(): string {
    return process.env.MCOM_PLATFORM_SLUG || 'mcom-links';
  }

  private async getUserWithCentralToken(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mcomAccessToken) {
      throw new UnauthorizedException('User is not linked to MCOM SSO');
    }
    let centralToken: string;
    try {
      centralToken = decryptToken(user.mcomAccessToken);
    } catch {
      throw new UnauthorizedException(
        'Stored MCOM token could not be decrypted',
      );
    }
    return { user, centralToken };
  }

  // 1. Forward the payment initiation to MCOM Central (Merchant of Record).
  async initiate(userId: string, dto: InitiatePurchaseDto) {
    const { centralToken } = await this.getUserWithCentralToken(userId);

    const webPublicUrl = process.env.WEB_PUBLIC_URL || '';
    const res = await axios.post(
      `${this.centralUrl()}/api/v1/payment/platform/${dto.provider}/initiate`,
      {
        platform: this.platformSlug(),
        externalPlanId: dto.externalPlanId,
        billingCycle: dto.billingCycle,
        returnUrl: dto.returnUrl || `${webPublicUrl}/payment/success`,
        cancelUrl: dto.cancelUrl || `${webPublicUrl}/payment/cancel`,
      },
      {
        headers: {
          Authorization: `Bearer ${centralToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    );

    // Stripe: { clientSecret, type: 'payment', plan } | Trials: { clientSecret, type: 'setup', plan }
    return res.data;
  }

  // 2. Confirm with Central, then unlock local entitlements immediately.
  async confirm(userId: string, dto: ConfirmPurchaseDto) {
    const { user, centralToken } = await this.getUserWithCentralToken(userId);

    const res = await axios.post(
      `${this.centralUrl()}/api/v1/payment/platform/${dto.provider}/confirm`,
      {
        platform: this.platformSlug(),
        externalPlanId: dto.externalPlanId,
        billingCycle: dto.billingCycle,
        paymentIntentId: dto.paymentIntentId,
      },
      {
        headers: {
          Authorization: `Bearer ${centralToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    );

    // Update local user quotas & tier immediately ("instant unlock").
    const localPlan = await this.prisma.plan.findUnique({
      where: { id: dto.externalPlanId },
    });
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days (monthly)

    const profile = await this.prisma.businessProfile.findUnique({
      where: { userId: user.id },
    });
    if (profile) {
      await this.prisma.businessProfile.update({
        where: { id: profile.id },
        data: {
          activePlanId: localPlan?.id || profile.activePlanId,
          plan: localPlan?.name || profile.plan,
          subscriptionStatus: 'active',
          planExpiresAt: expiresAt,
        },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { autoRenew: true },
    });

    return { success: true, package: res.data };
  }
}

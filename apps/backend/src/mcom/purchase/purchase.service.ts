import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { McomCentralService } from '../central/central.service';
import { McomWalletService } from '../wallet/wallet.service';
import {
  BillingCycle,
  ConfirmPurchaseDto,
  InitiatePurchaseDto,
  PurchaseWalletDto,
} from './purchase.dto';

const DEFAULT_CENTRAL_URL = 'http://localhost:3010';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly central: McomCentralService,
    private readonly walletService: McomWalletService,
  ) {}

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
    const centralToken = await this.central.getValidCentralToken(userId);
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

    // Central (Merchant of Record) returns the created PlatformPackage —
    // the authoritative record. Use its real expiry/billing cycle for the local
    // unlock rather than assuming a flat 30 days.
    const centralPackage = res.data || {};

    // Update local user quotas & tier immediately ("instant unlock").
    const localPlan = await this.prisma.plan.findUnique({
      where: { id: dto.externalPlanId },
    });
    const expiresAt = this.resolveExpiry(centralPackage.expiresAt, dto.billingCycle);
    const planName =
      localPlan?.name ||
      centralPackage.packageName ||
      centralPackage.planName ||
      'National Network';

    await this.prisma.businessProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: user.name || 'My Business',
        description: 'Business Profile',
        contactEmail: user.email,
        activePlanId: localPlan?.id || dto.externalPlanId,
        plan: planName,
        subscriptionStatus: 'active',
        planExpiresAt: expiresAt,
      },
      update: {
        activePlanId: localPlan?.id || dto.externalPlanId,
        plan: planName,
        subscriptionStatus: 'active',
        planExpiresAt: expiresAt,
      },
    });

    let currentPerms: Record<string, any> = {};
    try {
      currentPerms = JSON.parse(user.mcomPermissions || '{}');
    } catch {}
    currentPerms.canAccess_links = true;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        autoRenew: true,
        mcomPermissions: JSON.stringify(currentPerms),
      },
    });

    return { success: true, package: centralPackage };
  }

  // 3. Purchase a plan directly using MCOM Centralized Wallet credits.
  async purchaseWithWallet(userId: string, dto: PurchaseWalletDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.externalPlanId },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    let amount = 0;
    if (dto.billingCycle === BillingCycle.ANNUAL) {
      amount = Number(plan.annualPrice || 0);
    } else if (dto.billingCycle === BillingCycle.QUARTERLY) {
      amount = Number(plan.quarterlyPrice || 0);
    } else {
      amount = Number(plan.monthlyPrice || 0);
    }

    let receipt: any = null;
    if (amount > 0 && !plan.isDefault) {
      receipt = await this.walletService.debitWallet(userId, amount, {
        category: 'SUBSCRIPTION',
        description: `MCOM Links — ${plan.name} (${dto.billingCycle})`,
        reference: `sub_links_${plan.id}_${Date.now()}`,
        metadata: {
          platform: this.platformSlug(),
          planId: plan.id,
          planName: plan.name,
          billingCycle: dto.billingCycle,
        },
      });
    }

    const expiresAt = this.resolveExpiry(null, dto.billingCycle);

    await this.prisma.businessProfile.upsert({
      where: { userId },
      create: {
        userId,
        name: user?.name || 'My Business',
        description: 'Business Profile',
        contactEmail: user?.email || 'contact@example.com',
        activePlanId: plan.id,
        plan: plan.name,
        subscriptionStatus: 'active',
        planExpiresAt: expiresAt,
      },
      update: {
        activePlanId: plan.id,
        plan: plan.name,
        subscriptionStatus: 'active',
        planExpiresAt: expiresAt,
      },
    });

    let currentPerms: Record<string, any> = {};
    try {
      currentPerms = JSON.parse(user?.mcomPermissions || '{}');
    } catch {}
    currentPerms.canAccess_links = true;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        autoRenew: true,
        mcomPermissions: JSON.stringify(currentPerms),
      },
    });


    return {
      success: true,
      package: {
        packageName: plan.name,
        planId: plan.id,
        billingCycle: dto.billingCycle,
        expiresAt,
        status: 'active',
      },
      receipt,
    };
  }

  // Resolves the authoritative expiry from Central's package (if provided),
  // otherwise falls back to the requested billing cycle duration.
  private resolveExpiry(
    centralExpiry: unknown,
    billingCycle: string,
  ): Date {
    if (centralExpiry) {
      const parsed = new Date(centralExpiry as string);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const days =
      billingCycle === 'annual' ? 365 : billingCycle === 'quarterly' ? 90 : 30;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}


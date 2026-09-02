import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  // Handles lifecycle events from MCOM Central and reconciles local entitlements.
  async handleEvent(payload: { event?: string; data?: any }): Promise<void> {
    const event = payload?.event;
    const data = payload?.data || {};

    if (event === 'package.created' || event === 'package.renewed') {
      await this.activatePackage(data);
    } else if (event === 'package.cancelled') {
      await this.cancelPackage(data);
    } else if (event === 'package.expired') {
      await this.expirePackage(data);
    }
  }

  private async activatePackage(data: any) {
    if (!data.mcomUserId) return;
    const user = await this.prisma.user.findUnique({
      where: { mcomUserId: data.mcomUserId },
    });
    if (!user) return;

    const localPlan = await this.prisma.plan
      .findUnique({ where: { id: data.externalPlanId } })
      .catch(() => null);

    const planName = localPlan?.name || data.packageName || data.planName || 'Active';
    await this.prisma.businessProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: user.name || 'My Business',
        description: 'Business Profile',
        contactEmail: user.email,
        activePlanId: localPlan?.id || data.externalPlanId || null,
        plan: planName,
        planExpiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        subscriptionStatus: 'active',
      },
      update: {
        activePlanId: localPlan?.id || data.externalPlanId || null,
        plan: planName,
        planExpiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        subscriptionStatus: 'active',
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
  }

  private async cancelPackage(data: any) {
    if (!data.mcomUserId) return;
    const user = await this.prisma.user.findUnique({
      where: { mcomUserId: data.mcomUserId },
    });
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { autoRenew: false },
      });
    }
  }

  private async expirePackage(data: any) {
    if (!data.mcomUserId) return;
    const user = await this.prisma.user.findUnique({
      where: { mcomUserId: data.mcomUserId },
    });
    if (!user) return;

    // Downgrade to the default (free) plan -> "No Payment = No Visibility".
    const defaultPlan = await this.prisma.plan.findFirst({
      where: { isDefault: true },
    });
    await this.prisma.businessProfile.update({
      where: { userId: user.id },
      data: {
        activePlanId: defaultPlan?.id || null,
        plan: defaultPlan?.name || 'None',
        subscriptionStatus: 'expired',
      },
    });
  }
}

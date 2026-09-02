import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BusinessSettingsDto,
  UpdateBusinessSettingsDto,
} from './dto/business-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string): Promise<BusinessSettingsDto> {
    let profile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      let currentPerms: Record<string, any> = {};
      try {
        currentPerms = JSON.parse(user?.mcomPermissions || '{}');
      } catch {}

      const hasLinksAccess = currentPerms.canAccess_links === true;
      const defaultPlan = await this.prisma.plan.findFirst({
        where: hasLinksAccess ? { isDefault: false } : { isDefault: true },
      });

      profile = await this.prisma.businessProfile.create({
        data: {
          userId,
          name: user?.name || 'My Business',
          description: 'Business description',
          logoUrl: null,
          contactEmail: user?.email || 'contact@example.com',
          contactPhone: null,
          address: null,
          primaryColor: '#2563eb',
          secondaryColor: '#f8fafc',
          plan: hasLinksAccess ? (defaultPlan?.name || 'Active') : 'None',
          subscriptionStatus: hasLinksAccess ? 'active' : 'pending',
          activePlanId: defaultPlan?.id || null,
        },
      });
    }

    return profile;
  }

  async updateSettings(
    userId: string,
    dto: UpdateBusinessSettingsDto,
  ): Promise<BusinessSettingsDto> {
    const profile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    // Billing fields are controlled by admin/governance and the MCOM webhook
    // lifecycle, never by the business owner directly.
    const {
      plan: _plan,
      subscriptionStatus: _subscriptionStatus,
      ...safeDto
    } = dto;

    if (!profile) {
      // Create new profile if it doesn't exist (Upsert)
      return this.prisma.businessProfile.create({
        data: {
          ...(safeDto as any),
          userId,
          name: safeDto.name || 'My Business',
          description: safeDto.description || 'Business description',
          contactEmail: safeDto.contactEmail || 'contact@example.com',
        }, // Cast to any because Prisma expects specific types
      });
    }

    return this.prisma.businessProfile.update({
      where: { id: profile.id },
      data: safeDto as any,
    });
  }
}

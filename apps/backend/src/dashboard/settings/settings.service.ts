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
    const profile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Return defaults instead of 404 for a better UX
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      return {
        id: 'temp',
        name: user?.name || 'My Business',
        description: 'Business description',
        logoUrl: null,
        contactEmail: user?.email || 'contact@example.com',
        contactPhone: null,
        address: null,
        primaryColor: '#2563eb',
        secondaryColor: '#f8fafc',
        plan: 'None',
        subscriptionStatus: 'pending',
      } as BusinessSettingsDto;
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

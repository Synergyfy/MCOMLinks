import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PromoService {
  constructor(private readonly prisma: PrismaService) {}

  async getPromoSettings() {
    let promo = await this.prisma.promoBanner.findUnique({
      where: { id: 'promo-settings' },
    });

    if (!promo) {
      promo = await this.prisma.promoBanner.create({
        data: {
          id: 'promo-settings',
          bannerText: '🎉 Special Offer: Get 20% off Premium Rotator spots this month!',
          ctaText: 'Upgrade Now',
          ctaLink: '/pricing',
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
          isActive: true,
        },
      });
    }

    return promo;
  }

  async updatePromoSettings(data: {
    bannerText?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundColor?: string;
    textColor?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }) {
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return this.prisma.promoBanner.upsert({
      where: { id: 'promo-settings' },
      create: {
        id: 'promo-settings',
        ...updateData,
      },
      update: updateData,
    });
  }
}

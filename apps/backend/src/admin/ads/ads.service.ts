import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAds(status?: string) {
    const ads = await this.prisma.adUnit.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });

    // If empty, seed standard ad unit drafts for initial launch so admin UI is functional out of the box
    if (ads.length === 0 && !status) {
      const defaultAds = [
        {
          businessName: "Marco's Artisan Pizza",
          headline: '50% Off Gourmet Pizzas This Weekend',
          description: 'Authentic stone-baked sourdough pizzas delivered fresh to your door.',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
          targetUrl: 'https://marcos-pizza.example.com',
          placement: 'homepage',
          status: 'pending',
          budget: 150.0,
        },
        {
          businessName: 'Apex Fitness Hub',
          headline: 'Free 7-Day Gym & Class Pass',
          description: 'State of the art gym equipment, sauna, and premium group classes.',
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
          targetUrl: 'https://apex-fitness.example.com',
          placement: 'sidebar',
          status: 'approved',
          budget: 300.0,
        },
      ];

      for (const item of defaultAds) {
        await this.prisma.adUnit.create({ data: item });
      }

      return this.prisma.adUnit.findMany({ orderBy: { createdAt: 'desc' } });
    }

    return ads;
  }

  async getAd(id: string) {
    const ad = await this.prisma.adUnit.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Ad unit not found');
    return ad;
  }

  async createAd(data: {
    businessName: string;
    headline: string;
    description?: string;
    mediaType?: string;
    imageUrl: string;
    targetUrl: string;
    placement?: string;
    budget?: number;
  }) {
    return this.prisma.adUnit.create({
      data: {
        businessName: data.businessName,
        headline: data.headline,
        description: data.description || '',
        mediaType: data.mediaType || 'image',
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
        placement: data.placement || 'homepage',
        budget: data.budget || 0.0,
        status: 'pending',
      },
    });
  }

  async updateAdStatus(id: string, status: string, rejectionReason?: string) {
    const ad = await this.prisma.adUnit.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Ad unit not found');

    return this.prisma.adUnit.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
      },
    });
  }

  async updateAd(id: string, data: any) {
    const ad = await this.prisma.adUnit.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Ad unit not found');

    return this.prisma.adUnit.update({
      where: { id },
      data,
    });
  }

  async deleteAd(id: string) {
    const ad = await this.prisma.adUnit.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Ad unit not found');

    return this.prisma.adUnit.delete({ where: { id } });
  }
}

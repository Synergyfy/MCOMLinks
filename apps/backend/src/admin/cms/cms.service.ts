import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_CMS_CONTENT = {
  heroTitle: 'Transforming High Streets into Digital Billboards',
  heroSubtitle:
    'Turn physical foot traffic into customer acquisition through automated, sequential offer rotation and seasonal intelligence.',
  primaryCtaLabel: 'Get Started Free',
  primaryCtaLink: '/register',
  secondaryCtaLabel: 'Explore Storefronts',
  secondaryCtaLink: '/locations',
  features: [
    {
      title: 'Sequential Rotator Logic',
      description:
        'Fairly distribute exposure across local merchants. Each scan delivers the next available offer.',
    },
    {
      title: 'Seasonal Automation',
      description:
        'Schedule rules that automatically activate themed offers during key seasonal periods.',
    },
    {
      title: 'High-Street Commerce',
      description:
        'Turn physical storefronts into interactive digital panels with real-time conversion tracking.',
    },
  ],
};

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCmsSettings() {
    let setting = await this.prisma.cmsSetting.findUnique({
      where: { id: 'homepage-settings' },
    });

    if (!setting) {
      setting = await this.prisma.cmsSetting.create({
        data: {
          id: 'homepage-settings',
          content: JSON.stringify(DEFAULT_CMS_CONTENT),
        },
      });
    }

    try {
      return JSON.parse(setting.content);
    } catch {
      return DEFAULT_CMS_CONTENT;
    }
  }

  async updateCmsSettings(data: any) {
    const contentStr = typeof data === 'string' ? data : JSON.stringify(data);
    const setting = await this.prisma.cmsSetting.upsert({
      where: { id: 'homepage-settings' },
      create: { id: 'homepage-settings', content: contentStr },
      update: { content: contentStr },
    });

    try {
      return JSON.parse(setting.content);
    } catch {
      return data;
    }
  }
}

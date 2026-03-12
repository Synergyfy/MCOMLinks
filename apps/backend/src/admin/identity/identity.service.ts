import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateGlobalIdentityDto } from './dto/identity.dto';

@Injectable()
export class IdentityService {
    constructor(private readonly prisma: PrismaService) { }

    async getGlobalIdentity() {
        let config = await this.prisma.globalConfig.findUnique({
            where: { id: 'global-settings' }
        });

        if (!config) {
            config = await this.prisma.globalConfig.create({
                data: { id: 'global-settings' }
            });
        }

        return {
            brandColor: config.brandColor,
            headerText: config.headerText,
            footerText: config.footerText,
            showSocials: config.showSocials
        };
    }

    async updateGlobalIdentity(dto: UpdateGlobalIdentityDto) {
        const config = await this.prisma.globalConfig.upsert({
            where: { id: 'global-settings' },
            create: { id: 'global-settings', ...dto },
            update: { ...dto }
        });

        return {
            brandColor: config.brandColor,
            headerText: config.headerText,
            footerText: config.footerText,
            showSocials: config.showSocials
        };
    }
}

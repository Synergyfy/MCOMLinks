import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessSettingsDto, UpdateBusinessSettingsDto } from './dto/business-settings.dto';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSettings(): Promise<BusinessSettingsDto> {
        // For now, we fetch the first business profile found as a demo.
        // In a real scenario, this would be tied to the authenticated user.
        const profile = await this.prisma.businessProfile.findFirst();

        if (!profile) {
            throw new NotFoundException('Business profile not found');
        }

        return profile;
    }

    async updateSettings(dto: UpdateBusinessSettingsDto): Promise<BusinessSettingsDto> {
        const profile = await this.prisma.businessProfile.findFirst();

        if (!profile) {
            throw new NotFoundException('Business profile not found');
        }

        return this.prisma.businessProfile.update({
            where: { id: profile.id },
            data: dto,
        });
    }
}

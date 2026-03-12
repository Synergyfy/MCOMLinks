import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/season.dto';

@Injectable()
export class SeasonsService {
    constructor(private readonly prisma: PrismaService) { }

    async listSeasons() {
        return this.prisma.seasonalRule.findMany({
            orderBy: { startDate: 'asc' },
        });
    }

    async getSeason(id: string) {
        const season = await this.prisma.seasonalRule.findUnique({ where: { id } });
        if (!season) throw new NotFoundException('Season not found');
        return season;
    }

    async createSeason(data: CreateSeasonDto) {
        return this.prisma.seasonalRule.create({
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            }
        });
    }

    async updateSeason(id: string, data: UpdateSeasonDto) {
        const season = await this.prisma.seasonalRule.findUnique({ where: { id } });
        if (!season) throw new NotFoundException('Season not found');

        return this.prisma.seasonalRule.update({
            where: { id },
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            }
        });
    }

    async deleteSeason(id: string) {
        const season = await this.prisma.seasonalRule.findUnique({ where: { id } });
        if (!season) throw new NotFoundException('Season not found');

        return this.prisma.seasonalRule.delete({ where: { id } });
    }
}

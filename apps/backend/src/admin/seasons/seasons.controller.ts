import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/season.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('admin/seasons')
@Controller('admin/seasons')
@UseGuards(JwtAuthGuard)
export class SeasonsController {
    constructor(private readonly seasonsService: SeasonsService) { }

    @Get()
    @ApiOperation({ summary: 'List all seasonal automation rules' })
    async listSeasons() {
        return this.seasonsService.listSeasons();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of a specific season' })
    async getSeason(@Param('id') id: string) {
        return this.seasonsService.getSeason(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new seasonal rule' })
    async createSeason(@Body() body: CreateSeasonDto) {
        return this.seasonsService.createSeason(body);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update seasonal rule dates and name' })
    async updateSeason(@Param('id') id: string, @Body() body: UpdateSeasonDto) {
        return this.seasonsService.updateSeason(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a seasonal rule' })
    async deleteSeason(@Param('id') id: string) {
        return this.seasonsService.deleteSeason(id);
    }
}

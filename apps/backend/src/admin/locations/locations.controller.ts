import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Admin Platform: Locations')
@Controller('admin/locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @Get()
    @ApiOperation({ summary: 'List all physical scan points' })
    async listLocations() {
        return this.locationsService.listLocations();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details for a single location' })
    async getLocation(@Param('id') id: string) {
        return this.locationsService.getLocation(id);
    }

    @Post()
    @ApiOperation({ summary: 'Quick Deployment: Create New Location' })
    async createLocation(@Body() data: any) {
        return this.locationsService.createLocation(data);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update basic location information' })
    async updateLocation(@Param('id') id: string, @Body() data: any) {
        return this.locationsService.updateLocation(id, data);
    }

    @Patch(':id/rotator')
    @ApiOperation({ summary: 'Update rotator configuration for a location' })
    async updateLocationRotator(
        @Param('id') id: string,
        @Body() configData: any,
    ) {
        return this.locationsService.updateLocationRotator(id, configData);
    }

    @Post(':id/reset-pointer')
    @ApiOperation({ summary: 'Reset rotator pointer to 0' })
    async resetPointer(@Param('id') id: string) {
        return this.locationsService.resetPointer(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Decommission a location' })
    async deleteLocation(@Param('id') id: string) {
        return this.locationsService.deleteLocation(id);
    }
}

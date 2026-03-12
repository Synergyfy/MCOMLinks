import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, OfferStatus } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferEngagementDto } from './dto/engagement-stats.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Dashboard Offers')
@Controller('dashboard/offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Get(':id/engagement')
    @ApiOperation({ summary: 'Get detailed engagement stats for an offer' })
    @ApiResponse({ status: 200, type: OfferEngagementDto })
    getEngagement(@Param('id') id: string) {
        return this.offersService.getEngagement(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new offer' })
    @ApiResponse({ status: 201, description: 'The offer has been successfully created.' })
    create(@Body() createOfferDto: CreateOfferDto) {
        return this.offersService.create(createOfferDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all offers, optionally filtered by status' })
    @ApiResponse({ status: 200, description: 'List of offers.' })
    findAll(@Query('status') status?: string) {
        return this.offersService.findAll(status);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update offer status (approve / reject)' })
    @ApiResponse({ status: 200, description: 'Status updated.' })
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: OfferStatus; rejectionReason?: string },
    ) {
        return this.offersService.update(id, {
            status: body.status,
            ...(body.rejectionReason !== undefined && { leadDestination: body.rejectionReason }),
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific offer by ID' })
    @ApiResponse({ status: 200, description: 'The offer.' })
    @ApiResponse({ status: 404, description: 'Offer not found.' })
    findOne(@Param('id') id: string) {
        return this.offersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing offer' })
    @ApiResponse({ status: 200, description: 'The updated offer.' })
    update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
        return this.offersService.update(id, updateOfferDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an offer' })
    @ApiResponse({ status: 200, description: 'The deleted offer.' })
    remove(@Param('id') id: string) {
        return this.offersService.remove(id);
    }
}

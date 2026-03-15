import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, OfferStatus } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferEngagementDto } from './dto/engagement-stats.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Dashboard Offers')
@Controller('dashboard/offers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Get(':id/engagement')
    @ApiOperation({ summary: 'Get detailed engagement stats for an offer' })
    @ApiResponse({ status: 200, type: OfferEngagementDto })
    getEngagement(@Request() req: any, @Param('id') id: string) {
        return this.offersService.getEngagement(req.user.id, id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new offer' })
    @ApiResponse({ status: 201, description: 'The offer has been successfully created.' })
    create(@Request() req: any, @Body() createOfferDto: CreateOfferDto) {
        return this.offersService.create(req.user.id, createOfferDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all offers, optionally filtered by status' })
    @ApiResponse({ status: 200, description: 'List of offers.' })
    findAll(@Request() req: any, @Query('status') status?: string) {
        return this.offersService.findAll(req.user.id, status);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update offer status (approve / reject)' })
    @ApiResponse({ status: 200, description: 'Status updated.' })
    updateStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: { status: OfferStatus; rejectionReason?: string },
    ) {
        return this.offersService.update(req.user.id, id, {
            status: body.status,
            ...(body.rejectionReason !== undefined && { leadDestination: body.rejectionReason }),
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific offer by ID' })
    @ApiResponse({ status: 200, description: 'The offer.' })
    @ApiResponse({ status: 404, description: 'Offer not found.' })
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.offersService.findOne(req.user.id, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing offer' })
    @ApiResponse({ status: 200, description: 'The updated offer.' })
    update(@Request() req: any, @Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
        return this.offersService.update(req.user.id, id, updateOfferDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an offer' })
    @ApiResponse({ status: 200, description: 'The deleted offer.' })
    remove(@Request() req: any, @Param('id') id: string) {
        return this.offersService.remove(req.user.id, id);
    }
}

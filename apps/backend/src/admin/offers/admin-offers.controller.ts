import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminOffersService } from './admin-offers.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  CreateGlobalOfferDto,
  UpdateGlobalOfferDto,
  UpdateBillingStatusDto,
} from './dto/create-global-offer.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@ApiTags('admin/offers')
@Controller('admin/offers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOffersController {
  constructor(private readonly adminOffersService: AdminOffersService) {}

  @Get()
  @ApiOperation({ summary: 'List all system offers with filters' })
  async listOffers(@Query('status') status?: string) {
    return this.adminOffersService.listOffers(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer details for admin' })
  async getOffer(@Param('id') id: string) {
    return this.adminOffersService.getOffer(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a global campaign offer' })
  async createOffer(@Body() data: CreateGlobalOfferDto) {
    return this.adminOffersService.createGlobalOffer(data);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Approve or Reject an offer' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; rejectionReason?: string },
  ) {
    return this.adminOffersService.updateOfferStatus(
      id,
      body.status,
      body.rejectionReason,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an offer' })
  async updateOffer(
    @Param('id') id: string,
    @Body() body: UpdateGlobalOfferDto,
  ) {
    return this.adminOffersService.updateOffer(id, body);
  }

  @Patch(':id/billing')
  @ApiOperation({
    summary:
      'Toggle billing suspension for the offer business (No Payment = No Visibility)',
  })
  async updateBillingStatus(
    @Param('id') id: string,
    @Body() body: UpdateBillingStatusDto,
  ) {
    return this.adminOffersService.updateBillingStatus(id, body.status);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing offer' })
  async duplicateOffer(@Param('id') id: string) {
    return this.adminOffersService.duplicateOffer(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive/Expire an offer' })
  async archiveOffer(@Param('id') id: string) {
    return this.adminOffersService.deleteOffer(id);
  }
}

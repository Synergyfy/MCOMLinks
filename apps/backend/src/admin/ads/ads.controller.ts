import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';


@Controller('admin/ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  async listAds(@Query('status') status?: string) {
    return this.adsService.listAds(status);
  }

  @Get(':id')
  async getAd(@Param('id') id: string) {
    return this.adsService.getAd(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  async createAd(@Body() body: any) {
    return this.adsService.createAd(body);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateAdStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.adsService.updateAdStatus(id, status, rejectionReason);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateAd(@Param('id') id: string, @Body() body: any) {
    return this.adsService.updateAd(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteAd(@Param('id') id: string) {
    return this.adsService.deleteAd(id);
  }
}

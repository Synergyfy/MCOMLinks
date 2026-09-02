import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { PromoService } from './promo.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';


@Controller('admin/promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Get()
  async getPromoSettings() {
    return this.promoService.getPromoSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updatePromoSettings(@Body() body: any) {
    return this.promoService.updatePromoSettings(body);
  }
}

import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';



@Controller('admin/cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async getCmsSettings() {
    return this.cmsService.getCmsSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCmsSettings(@Body() body: any) {
    return this.cmsService.updateCmsSettings(body);
  }
}

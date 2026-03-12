import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OnboardMerchantDto, UpdateMerchantStatusDto, UpdateMerchantPlanDto } from './dto/merchant.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('admin/merchants')
@Controller('admin/merchants')
@UseGuards(JwtAuthGuard)
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) { }

    @Get()
    @ApiOperation({ summary: 'List all registered business profiles/merchants' })
    async listMerchants(@Query('status') status?: string) {
        return this.merchantsService.listMerchants(status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get specific merchant details' })
    async getMerchant(@Param('id') id: string) {
        return this.merchantsService.getMerchant(id);
    }

    @Post('onboard')
    @ApiOperation({ summary: 'Onboard a new business into the platform' })
    async onboardBusiness(@Body() body: OnboardMerchantDto) {
        return this.merchantsService.onboardMerchant(body);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Suspend or Reactivate a merchant account' })
    async updateStatus(@Param('id') id: string, @Body() body: UpdateMerchantStatusDto) {
        return this.merchantsService.updateMerchantStatus(id, body.status);
    }

    @Patch(':id/plan')
    @ApiOperation({ summary: 'Update merchant subscription plan' })
    async updatePlan(@Param('id') id: string, @Body() body: UpdateMerchantPlanDto) {
        return this.merchantsService.updateMerchantPlan(id, body.plan);
    }
}

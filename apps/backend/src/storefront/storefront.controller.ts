import { Controller, Get, Param } from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Consumer Storefront')
@Controller('r')
export class StorefrontController {
    constructor(private readonly storefrontService: StorefrontService) { }

    @Get(':locationId')
    @ApiOperation({ summary: 'Get the next offer for a physical location (Rotator)' })
    @ApiResponse({ status: 200, description: 'The next offer in sequence.' })
    async rotate(@Param('locationId') locationId: string) {
        return this.storefrontService.getNextOffer(locationId);
    }

    @Get(':locationId/track/:offerId/:type')
    @ApiOperation({ summary: 'Track an engagement event (CLICK, CLAIM, etc.)' })
    async track(
        @Param('locationId') locationId: string,
        @Param('offerId') offerId: string,
        @Param('type') type: string,
    ) {
        return this.storefrontService.trackAction(locationId, offerId, type.toUpperCase());
    }

    @Get('offer/:offerId')
    @ApiOperation({ summary: 'Get details for a specific offer' })
    async getOffer(@Param('offerId') offerId: string) {
        return this.storefrontService.getOfferById(offerId);
    }
}

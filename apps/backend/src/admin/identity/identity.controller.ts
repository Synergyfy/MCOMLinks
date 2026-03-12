import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { UpdateGlobalIdentityDto } from './dto/identity.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Admin Identity')
@Controller('admin/identity')
@UseGuards(JwtAuthGuard)
export class IdentityController {
    constructor(private readonly identityService: IdentityService) { }

    @Get()
    @ApiOperation({ summary: 'Get global storefront identity configuration (colors, text, socials)' })
    async getGlobalIdentity() {
        return this.identityService.getGlobalIdentity();
    }

    @Patch()
    @ApiOperation({ summary: 'Update global storefront identity configuration' })
    async updateGlobalIdentity(@Body() dto: UpdateGlobalIdentityDto) {
        return this.identityService.updateGlobalIdentity(dto);
    }
}

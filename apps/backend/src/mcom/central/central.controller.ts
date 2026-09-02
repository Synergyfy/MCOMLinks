import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { McomCentralService } from './central.service';
import { McomCallbackDto } from './dto/mcom-callback.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// CSRF state store — short-lived, in-memory (single-instance dev).
// Each entry expires after 10 minutes and is removed once consumed.
const STATE_TTL_MS = 10 * 60 * 1000;
const stateStore = new Map<string, number>();

@ApiTags('Central Hub SSO')
@Controller('auth/mcom')
export class McomSsoController {
  constructor(private readonly central: McomCentralService) {}

  @Get('login')
  @ApiOperation({
    summary: 'Begin Central Hub OAuth flow. Returns the authorize URL.',
  })
  login() {
    const state = crypto.randomBytes(32).toString('hex');
    stateStore.set(state, Date.now() + STATE_TTL_MS);
    const authorizeUrl = this.central.buildAuthorizeUrl(state);
    return { authorizeUrl, state };
  }

  @Post('callback')
  @ApiOperation({ summary: 'Exchange authorization code and log the user in' })
  async callback(@Body() dto: McomCallbackDto) {
    const expiresAt = stateStore.get(dto.state);
    if (!expiresAt || expiresAt < Date.now()) {
      throw new BadRequestException('Invalid or expired state token');
    }
    stateStore.delete(dto.state);

    const tokenSet = await this.central.exchangeCode(dto.code);
    const userInfo = await this.central.fetchUserInfo(tokenSet.accessToken);
    return this.central.linkUserFromCentral(userInfo, tokenSet);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Return a fresh permission snapshot from Central Hub',
  })
  async me(@Req() req: any) {
    const accessToken = await this.central.getValidCentralToken(req.user.id);
    const userInfo = await this.central.fetchUserInfo(accessToken);

    await this.central.syncPermissions(req.user.id, userInfo.permissions);

    return {
      mcomUserId: userInfo.sub,
      email: userInfo.email,
      role: userInfo.role,
      membershipLevel: userInfo.membershipLevel,
      membershipStatus: userInfo.membershipStatus,
      permissions: userInfo.permissions,
      packages: userInfo.packages,
    };
  }
}

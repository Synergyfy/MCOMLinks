import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { hashPassword } from '../../auth/password.util';
import { encryptToken, decryptToken } from '../crypto.util';

const DEFAULT_CENTRAL_URL = 'https://auth.mcomsolutions.com';

export interface McomUserInfo {
  sub: string;
  email: string;
  role: string;
  name: string;
  membershipLevel: string;
  membershipStatus: string;
  permissions: Record<string, boolean>;
  packages: any[];
  [key: string]: any;
}

export interface McomTokenSet {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user?: any;
}

@Injectable()
export class McomCentralService {
  private readonly logger = new Logger(McomCentralService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  centralUrl(): string {
    return (process.env.MCOM_SOLUTIONS_URL || DEFAULT_CENTRAL_URL).replace(
      /\/+$/,
      '',
    );
  }

  clientId(): string {
    return process.env.MCOM_CLIENT_ID || 'mcom-links';
  }

  clientSecret(): string {
    return process.env.MCOM_CLIENT_SECRET || '';
  }

  redirectUri(): string {
    return (
      process.env.MCOM_REDIRECT_URI ||
      'http://localhost:6004/auth/mcom/callback'
    );
  }

  scopes(): string {
    return (
      process.env.MCOM_SCOPES || 'profile email business packages membership'
    );
  }

  platformSlug(): string {
    return process.env.MCOM_PLATFORM_SLUG || 'links';
  }

  hmacSecret(): string {
    return process.env.MCOM_HMAC_SECRET || '';
  }

  // ─── OAuth 2.0 Authorization Code Grant ────────────────────────────────

  buildAuthorizeUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId(),
      redirect_uri: this.redirectUri(),
      scope: this.scopes(),
      state,
    });
    return `${this.centralUrl()}/api/v1/auth/sso/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<McomTokenSet> {
    const credentials = Buffer.from(
      `${this.clientId()}:${this.clientSecret()}`,
    ).toString('base64');

    const res = await axios.post(
      `${this.centralUrl()}/api/v1/auth/sso/token`,
      {
        code,
        client_id: this.clientId(),
        redirect_uri: this.redirectUri(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        timeout: 15000,
      },
    );

    const data = res.data;
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn || 3600,
      user: data.user,
    };
  }

  async fetchUserInfo(accessToken: string): Promise<McomUserInfo> {
    const res = await axios.get(
      `${this.centralUrl()}/api/v1/auth/sso/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 15000,
      },
    );
    return res.data;
  }

  async refreshCentralToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const res = await axios.post(
      `${this.centralUrl()}/api/v1/auth/sso/token/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' }, timeout: 15000 },
    );
    return {
      accessToken: res.data.accessToken,
      expiresIn: res.data.expiresIn || 3600,
    };
  }

  // ─── Server-to-Server HMAC signed data-sharing calls (Task 6) ──────────

  async callMcomSignedApi(endpoint: string, data: object): Promise<any> {
    const rawBody = JSON.stringify(data);
    const signature = crypto
      .createHmac('sha256', this.hmacSecret())
      .update(rawBody)
      .digest('hex');

    return axios.post(`${this.centralUrl()}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Mcom-Signature': `sha256=${signature}`,
        'X-Mcom-Client-ID': this.clientId(),
      },
      timeout: 15000,
    });
  }

  // ─── Local session helpers ─────────────────────────────────────────────

  /**
   * Returns a valid (non-expired) central access token for a local user,
   * transparently refreshing it when near expiry and persisting the new token.
   */
  async getValidCentralToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mcomAccessToken) {
      throw new UnauthorizedException('User is not linked to MCOM SSO');
    }

    let accessToken: string;
    try {
      accessToken = decryptToken(user.mcomAccessToken);
    } catch {
      throw new UnauthorizedException(
        'Stored MCOM token could not be decrypted',
      );
    }

    // Decode the JWT exp to decide whether a refresh is needed.
    const decoded = this.decodeJwtPayload(accessToken);
    const exp = decoded?.exp ? Number(decoded.exp) * 1000 : 0;
    const refreshed = !exp || exp - Date.now() < 60_000;

    if (refreshed) {
      if (!user.mcomRefreshToken) {
        throw new UnauthorizedException('Stored MCOM refresh token missing');
      }
      let refreshToken: string;
      try {
        refreshToken = decryptToken(user.mcomRefreshToken);
      } catch {
        throw new UnauthorizedException(
          'Stored MCOM refresh token could not be decrypted',
        );
      }
      const { accessToken: newAccessToken } =
        await this.refreshCentralToken(refreshToken);
      await this.prisma.user.update({
        where: { id: userId },
        data: { mcomAccessToken: encryptToken(newAccessToken) },
      });
      return newAccessToken;
    }

    return accessToken;
  }

  /**
   * Upserts a local user from Central Hub identity and returns a local JWT
   * session payload (matching the /auth/login response shape).
   */
  async linkUserFromCentral(userInfo: McomUserInfo, tokenSet: McomTokenSet) {
    const role = this.mapCentralRole(userInfo.role, userInfo.permissions);
    const email = userInfo.email?.toLowerCase() || '';

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ mcomUserId: userInfo.sub }, ...(email ? [{ email }] : [])],
      },
    });

    // SSO-only users get a random password so they can never email/password
    // login (only ADMIN accounts may do that).
    const randomPassword = await hashPassword(
      crypto.randomBytes(32).toString('hex'),
    );

    let localUser = existing;
    if (existing) {
      localUser = await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          mcomUserId: userInfo.sub,
          email: email || existing.email,
          name: userInfo.name || existing.name,
          mcomAccessToken: encryptToken(tokenSet.accessToken),
          mcomRefreshToken: tokenSet.refreshToken
            ? encryptToken(tokenSet.refreshToken)
            : existing.mcomRefreshToken,
          mcomPermissions: JSON.stringify(userInfo.permissions || {}),
        },
      });
    } else {
      localUser = await this.prisma.user.create({
        data: {
          email: email || `${userInfo.sub}@central.mcomsolutions.com`,
          password: randomPassword,
          name: userInfo.name || email,
          role,
          mcomUserId: userInfo.sub,
          mcomAccessToken: encryptToken(tokenSet.accessToken),
          mcomRefreshToken: tokenSet.refreshToken
            ? encryptToken(tokenSet.refreshToken)
            : null,
          mcomPermissions: JSON.stringify(userInfo.permissions || {}),
        },
      });
    }

    // Ensure BusinessProfile exists and reflects any active packages from Central
    const linksPackage = (userInfo.packages || []).find(
      (p: any) => p.platform === 'links' && p.status === 'active',
    );
    if (linksPackage || userInfo.permissions?.canAccess_links) {
      await this.prisma.businessProfile.upsert({
        where: { userId: localUser.id },
        create: {
          userId: localUser.id,
          name: localUser.name || 'My Business',
          description: 'Business Profile',
          contactEmail: localUser.email,
          plan: linksPackage?.packageName || 'Active',
          subscriptionStatus: 'active',
          planExpiresAt: linksPackage?.expiresAt
            ? new Date(linksPackage.expiresAt)
            : undefined,
        },
        update: {
          plan: linksPackage?.packageName || undefined,
          subscriptionStatus: 'active',
          planExpiresAt: linksPackage?.expiresAt
            ? new Date(linksPackage.expiresAt)
            : undefined,
        },
      });
    }

    const access_token = this.jwtService.sign({
      email: localUser.email,
      sub: localUser.id,
      role: localUser.role,
    });

    return {
      access_token,
      user: {
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        role: localUser.role,
        mcomUserId: localUser.mcomUserId,
        mcomRole: userInfo.role,
        permissions: userInfo.permissions || {},
        membershipLevel: userInfo.membershipLevel,
        membershipStatus: userInfo.membershipStatus,
      },
    };
  }

  private mapCentralRole(
    centralRole: string,
    _permissions: Record<string, boolean>,
  ): 'ADMIN' | 'AGENT' | 'BUSINESS' {
    if (centralRole === 'ADMIN') return 'ADMIN';
    if (centralRole === 'AGENT') return 'AGENT';
    if (centralRole === 'CONSULTANT') return 'AGENT';
    return 'BUSINESS';
  }

  async syncPermissions(userId: string, permissions: Record<string, boolean>) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { mcomPermissions: JSON.stringify(permissions || {}) },
    });
  }

  private decodeJwtPayload(token: string): Record<string, any> | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch {
      return null;
    }
  }
}

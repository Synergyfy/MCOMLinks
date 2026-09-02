import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from './password.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private async getPostalData(
    postcode: string,
  ): Promise<{ city: string; region: string } | null> {
    if (!postcode) return null;
    try {
      // Using postcodes.io (free, no API key needed for UK postcodes)
      const response = await axios.get(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
        {
          timeout: 5000,
        },
      );
      if (response.data?.status === 200 && response.data?.result) {
        const res = response.data.result;
        return {
          city: res.admin_district || res.parish || '',
          region: res.region || res.european_electoral_region || res.nuts || '',
        };
      }
    } catch (error) {
      this.logger.warn(
        `Failed to fetch postal data for ${postcode}: ${error.message}`,
      );
    }
    return null;
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await verifyPassword(password, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    // Email/password login is reserved for ADMIN accounts. All other roles
    // (BUSINESS, AGENT) must authenticate through the Central Hub Solution SSO.
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Non-admin accounts must sign in with Central Hub Solution',
      );
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        postalCode: user.postalCode,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const {
      name,
      email,
      password,
      role,
      postalCode,
      businessName,
      phoneNumber,
    } = registerDto;

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('User already exists with this email');
    }

    // Resolve postcode metadata OUTSIDE the transaction so a slow/hanging
    // external request never holds the DB transaction open.
    let derivedAddress = postalCode || '';
    if ((role ?? 'BUSINESS') === 'BUSINESS') {
      const postalInfo = await this.getPostalData(postalCode || '');
      derivedAddress = postalInfo
        ? `${postalInfo.city}${postalInfo.region ? ', ' + postalInfo.region : ''}, ${postalCode}`
        : postalCode || '';
    }

    const hashedPassword = await hashPassword(password);

    await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'BUSINESS',
          postalCode,
        },
      });

      // If user is a business owner, create a default profile
      if (newUser.role === 'BUSINESS') {
        await tx.businessProfile.create({
          data: {
            userId: newUser.id,
            name: businessName || newUser.name || 'My Business',
            description: 'Business description',
            contactEmail: newUser.email,
            contactPhone: phoneNumber || null,
            address: derivedAddress,
          },
        });
      }

      return newUser;
    });

    return this.login({ email, password });
  }
}

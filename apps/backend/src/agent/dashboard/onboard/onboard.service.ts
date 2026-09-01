import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OnboardBusinessDto } from './dto/onboard-business.dto';
import { randomBytes } from 'crypto';
import { hashPassword } from '../../../auth/password.util';

@Injectable()
export class AgentOnboardService {
  constructor(private readonly prisma: PrismaService) {}

  getOnboardChecklist() {
    return {
      steps: [
        {
          step: 1,
          label: 'Business Details',
          description: 'Collect business name, address, and contact info',
        },
        {
          step: 2,
          label: 'Owner Account',
          description: 'Create login credentials for the business owner',
        },
        {
          step: 3,
          label: 'Plan Selection',
          description: 'Choose Basic or Premium subscription plan',
        },
        {
          step: 4,
          label: 'First Offer',
          description: 'Draft the first offer for admin approval',
        },
        {
          step: 5,
          label: 'Go Live',
          description: 'Offer approved and business enters the rotator',
        },
      ],
    };
  }

  async onboardBusiness(dto: OnboardBusinessDto) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(
        `A user with email ${dto.email} already exists`,
      );
    }

    // Generate a unique temporary password per business (returned once).
    const temporaryPassword = randomBytes(8).toString('base64url');
    const hashedPassword = await hashPassword(temporaryPassword);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.ownerName ?? dto.name,
        role: 'BUSINESS',
        businessProfile: {
          create: {
            name: dto.name,
            description: dto.description ?? '',
            contactEmail: dto.email,
            contactPhone: dto.contactPhone ?? '',
            address: dto.address ?? '',
            ownerName: dto.ownerName ?? '',
            plan: dto.plan ?? 'Basic',
            subscriptionStatus: 'active',
          },
        },
      },
      include: { businessProfile: true },
    });

    return {
      message: 'Business successfully onboarded',
      business: {
        id: user.businessProfile?.id,
        name: user.businessProfile?.name,
        email: user.email,
        plan: user.businessProfile?.plan,
        temporaryPassword,
      },
    };
  }
}

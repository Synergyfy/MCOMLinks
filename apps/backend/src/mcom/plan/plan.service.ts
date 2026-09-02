import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto, PlanType } from './plan.dto';

// Static schema descriptor so the MCOM Console and the in-app admin studio can
// generate dynamic input fields for MCOM Links-specific quotas and feature
// toggles. Both surfaces render fields from this contract, so adding a new
// capability here automatically appears everywhere.
const PLAN_SCHEMA = {
  quotas: [
    {
      key: 'maxActiveCampaigns',
      label: 'Max Active Campaigns',
      type: 'number',
      unlimited: true,
    },
    {
      key: 'maxOffers',
      label: 'Max Offers in Rotation',
      type: 'number',
      unlimited: true,
    },
    {
      key: 'maxLocations',
      label: 'Max Network Locations',
      type: 'number',
      unlimited: true,
    },
    {
      key: 'allowNearbyExpansion',
      label: 'Enable Nearby Expansion Layer',
      type: 'boolean',
    },
    {
      key: 'allowNationalNetwork',
      label: 'Enable National Network Layer',
      type: 'boolean',
    },
  ],
  featureFlags: [
    {
      key: 'priorityBoost',
      label: 'Priority Boost (Star Placement)',
      type: 'boolean',
    },
    {
      key: 'advancedAnalytics',
      label: 'Advanced Analytics Dashboard',
      type: 'boolean',
    },
    { key: 'customBranding', label: 'Custom Brand Colors', type: 'boolean' },
    {
      key: 'allowThirdPartyPromotion',
      label: 'Third-Party Promotion',
      type: 'boolean',
    },
    {
      key: 'allowAutoRollover',
      label: 'Auto Rollover Into Next Season',
      type: 'boolean',
    },
    { key: 'allowExpoAccess', label: 'Expo Access', type: 'boolean' },
  ],
};

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize(plan: any) {
    return {
      ...plan,
      features: this.parseJson(plan.features, []),
      limitations: this.parseJson(plan.limitations, []),
      configuration: this.parseJson(plan.configuration, {
        quotas: {},
        featureFlags: {},
      }),
    };
  }

  private parseJson<T>(value: string | null | undefined, fallback: T): T {
    if (!value) return fallback;
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  private toStorage(dto: CreatePlanDto | UpdatePlanDto) {
    const { features, limitations, configuration, ...rest } = dto as any;
    const storage: any = {
      ...rest,
      ...(features !== undefined && { features: JSON.stringify(features) }),
      ...(limitations !== undefined && {
        limitations: JSON.stringify(limitations),
      }),
      ...(configuration !== undefined && {
        configuration: JSON.stringify(configuration),
      }),
    };

    // Free plans cannot carry a price — force all prices to 0.
    if (rest.isFree === true) {
      storage.monthlyPrice = 0;
      storage.quarterlyPrice = 0;
      storage.annualPrice = 0;
    }

    return storage;
  }

  async listPlans() {
    const plans = await this.prisma.plan.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    return plans.map((p) => this.serialize(p));
  }

  async listActivePlans() {
    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { monthlyPrice: 'asc' }],
    });
    return plans.map((p) => this.serialize(p));
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return this.serialize(plan);
  }

  async create(dto: CreatePlanDto) {
    await this.validatePlanRules(dto);
    const plan = await this.prisma.plan.create({
      data: this.toStorage(dto),
    });
    if (dto.isDefault) {
      await this.clearOtherDefaults(plan.id);
    }
    return this.serialize(plan);
  }

  async update(id: string, dto: UpdatePlanDto) {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Plan not found');

    await this.validatePlanRules(dto, id);
    const plan = await this.prisma.plan.update({
      where: { id },
      data: this.toStorage(dto),
    });
    if (dto.isDefault) {
      await this.clearOtherDefaults(id);
    }
    return this.serialize(plan);
  }

  async remove(id: string) {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Plan not found');

    // Soft-delete/archive: keep the plan for historical billing records.
    await this.prisma.plan.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }

  getSchema() {
    return PLAN_SCHEMA;
  }

  // Mall-style business rules:
  //  - only one TRIAL plan may exist
  //  - TRIAL plans require a positive trialDuration
  //  - SEASONAL plans require an existing seasonId
  private async validatePlanRules(
    dto: CreatePlanDto | UpdatePlanDto,
    exceptId?: string,
  ) {
    if (dto.type === PlanType.TRIAL) {
      const trialDuration = dto.trialDuration ?? 0;
      if (!trialDuration || trialDuration <= 0) {
        throw new BadRequestException(
          'TRIAL plans must specify a positive trialDuration (in days)',
        );
      }
      const otherTrial = await this.prisma.plan.findFirst({
        where: {
          type: 'TRIAL',
          isActive: true,
          ...(exceptId ? { id: { not: exceptId } } : {}),
        },
        select: { id: true, name: true },
      });
      if (otherTrial) {
        throw new ConflictException(
          `Only one active TRIAL plan is allowed ("${otherTrial.name}" already exists). Edit or deactivate it first.`,
        );
      }
    }

    if (dto.type === PlanType.SEASONAL) {
      if (!dto.seasonId) {
        throw new BadRequestException('SEASONAL plans must specify a seasonId');
      }
      const season = await this.prisma.seasonalRule.findUnique({
        where: { id: dto.seasonId },
        select: { id: true },
      });
      if (!season) {
        throw new BadRequestException(
          `Season "${dto.seasonId}" does not exist. Create it under Seasonal Campaigns first.`,
        );
      }
    }
  }

  private async clearOtherDefaults(exceptId: string) {
    await this.prisma.plan.updateMany({
      where: { isDefault: true, id: { not: exceptId } },
      data: { isDefault: false },
    });
  }
}

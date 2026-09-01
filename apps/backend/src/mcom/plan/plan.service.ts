import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';

// Static schema descriptor so the MCOM Console can generate dynamic input
// fields for MCOM Links-specific quotas and feature toggles.
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
  ],
};

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize(plan: any) {
    return {
      ...plan,
      features: this.parseJson(plan.features, []),
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
    const { features, configuration, ...rest } = dto as any;
    return {
      ...rest,
      ...(features !== undefined && { features: JSON.stringify(features) }),
      ...(configuration !== undefined && {
        configuration: JSON.stringify(configuration),
      }),
    };
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
    const plan = await this.prisma.plan.create({
      data: this.toStorage(dto),
    });
    return this.serialize(plan);
  }

  async update(id: string, dto: UpdatePlanDto) {
    const existing = await this.prisma.plan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Plan not found');

    const plan = await this.prisma.plan.update({
      where: { id },
      data: this.toStorage(dto),
    });
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
}

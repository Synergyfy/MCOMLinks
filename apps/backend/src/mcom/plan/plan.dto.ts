import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum PlanType {
  STANDARD = 'STANDARD',
  TRIAL = 'TRIAL',
  SEASONAL = 'SEASONAL',
}

export class PlanConfigurationDto {
  @ApiPropertyOptional({ example: { maxListings: 100 } })
  @IsObject()
  @IsOptional()
  quotas?: Record<string, number | boolean>;

  @ApiPropertyOptional({ example: { advancedAnalytics: true } })
  @IsObject()
  @IsOptional()
  featureFlags?: Record<string, boolean>;
}

export class CreatePlanDto {
  @ApiProperty({ example: 'Gold Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'For high-volume retail businesses' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @IsOptional()
  monthlyPrice?: number;

  @ApiProperty({ example: 129.99 })
  @IsNumber()
  @IsOptional()
  quarterlyPrice?: number;

  @ApiProperty({ example: 499.99 })
  @IsNumber()
  @IsOptional()
  annualPrice?: number;

  @ApiPropertyOptional({
    example: ['Up to 100 listings', 'Custom domain support'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    example: ['No custom domain support', 'Standard visibility only'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  limitations?: string[];

  @ApiPropertyOptional({
    example: 'Grow beyond your storefront',
    description: 'Short card tagline shown on pricing',
  })
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiPropertyOptional({ example: 'Businesses ready to scale' })
  @IsString()
  @IsOptional()
  bestFor?: string;

  @ApiPropertyOptional({
    default: false,
    description: 'Free plans force all prices to 0',
  })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional({ type: PlanConfigurationDto })
  @IsObject()
  @IsOptional()
  configuration?: PlanConfigurationDto;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ enum: PlanType, default: PlanType.STANDARD })
  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;

  @ApiPropertyOptional({ description: 'In days (required if type === TRIAL)' })
  @IsInt()
  @Min(1)
  @IsOptional()
  trialDuration?: number;

  @ApiPropertyOptional({
    description: 'UUID of the season (required if type === SEASONAL)',
  })
  @IsString()
  @IsOptional()
  seasonId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stripeMonthlyPriceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stripeQuarterlyPriceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stripeAnnualPriceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paypalMonthlyPlanId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paypalQuarterlyPlanId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paypalAnnualPlanId?: string;
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  WALLET = 'wallet',
}

export class InitiatePurchaseDto {
  @ApiProperty({ example: '7b093f1d-192a-4ce4-8e12-32a89345091a' })
  @IsString()
  @IsNotEmpty()
  externalPlanId: string;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.STRIPE })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  returnUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cancelUrl?: string;
}

export class ConfirmPurchaseDto {
  @ApiProperty({ example: '7b093f1d-192a-4ce4-8e12-32a89345091a' })
  @IsString()
  @IsNotEmpty()
  externalPlanId: string;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.STRIPE })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ example: 'pi_xxx_secret_yyy' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;
}

export class PurchaseWalletDto {
  @ApiProperty({ example: '7b093f1d-192a-4ce4-8e12-32a89345091a' })
  @IsString()
  @IsNotEmpty()
  externalPlanId: string;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}


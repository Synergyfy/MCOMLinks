import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PublicRegisterRole {
  BUSINESS = 'BUSINESS',
}

export class RegisterDto {
  @ApiProperty({
    example: 'The Coffee Shop',
    description: 'Business Name or Full Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'hello@business.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  // Public self-registration is BUSINESS only. ADMIN/AGENT accounts must be provisioned
  // by the system (admin onboarding / agent onboarding) to prevent privilege escalation.
  @ApiPropertyOptional({
    example: 'BUSINESS',
    enum: ['BUSINESS'],
    default: 'BUSINESS',
  })
  @IsOptional()
  @IsEnum(PublicRegisterRole)
  role?: string;

  @ApiPropertyOptional({
    example: 'SW1A 1AA',
    description: 'Postal code for location targeting',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'The Coffee Shop',
    description: 'Business display name (used for the business profile)',
  })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({
    example: '+44 7700 900000',
    description: 'Business contact phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

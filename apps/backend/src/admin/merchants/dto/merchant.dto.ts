import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OnboardMerchantDto {
    @ApiProperty({ example: "Piccadilly Pigeons Café" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "John Smith" })
    @IsString()
    @IsNotEmpty()
    ownerName: string;

    @ApiProperty({ example: "john@piccadillycafe.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({ enum: ['Basic', 'Premium'], default: 'Basic' })
    @IsEnum(['Basic', 'Premium'])
    @IsOptional()
    plan?: string;
}

export class UpdateMerchantStatusDto {
    @ApiProperty({ enum: ['active', 'suspended'] })
    @IsEnum(['active', 'suspended'])
    @IsNotEmpty()
    status: string;
}

export class UpdateMerchantPlanDto {
    @ApiProperty({ enum: ['Basic', 'Premium'] })
    @IsEnum(['Basic', 'Premium'])
    @IsNotEmpty()
    plan: string;
}

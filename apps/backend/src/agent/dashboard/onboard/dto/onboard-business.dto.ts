import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OnboardBusinessDto {
    @ApiProperty({ description: 'Business name', example: 'The Coffee House' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Owner email (used to create login)', example: 'owner@coffeehouse.com' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ description: 'Short description of the business', example: 'Specialty coffee & pastries' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Owner full name', example: 'Jane Smith' })
    @IsOptional()
    @IsString()
    ownerName?: string;

    @ApiPropertyOptional({ description: 'Contact phone number', example: '+44 7911 123456' })
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiPropertyOptional({ description: 'Business address', example: '12 High Street, Manchester' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ description: 'Subscription plan', enum: ['Basic', 'Premium'], example: 'Basic' })
    @IsOptional()
    @IsString()
    plan?: string;
}

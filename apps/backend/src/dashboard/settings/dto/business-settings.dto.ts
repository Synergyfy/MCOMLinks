import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsHexColor } from 'class-validator';

export class UpdateBusinessSettingsDto {
    @ApiProperty({ example: "Bella's Boutique", description: 'Full business name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Curated fashion and accessories.', description: 'Business description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'https://example.com/logo.png', description: 'URL to business logo' })
    @IsString()
    @IsOptional()
    logoUrl?: string;

    @ApiProperty({ example: 'hello@bellas.com', description: 'Public contact email' })
    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @ApiProperty({ example: '+44 123 456 789', description: 'Public contact phone' })
    @IsString()
    @IsOptional()
    contactPhone?: string;

    @ApiProperty({ example: '123 High St, London', description: 'Physical address' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '#2563eb', description: 'Primary branding color' })
    @IsHexColor()
    @IsOptional()
    primaryColor?: string;

    @ApiProperty({ example: '#f8fafc', description: 'Secondary branding color' })
    @IsHexColor()
    @IsOptional()
    secondaryColor?: string;
}

export class BusinessSettingsDto {
    @ApiProperty({ example: 'uuid-123' })
    id: string;

    @ApiProperty({ example: "Bella's Boutique" })
    name: string;

    @ApiProperty({ example: 'Curated fashion and accessories.' })
    description: string;

    @ApiProperty({ example: 'https://example.com/logo.png', nullable: true })
    logoUrl: string | null;

    @ApiProperty({ example: 'hello@bellas.com' })
    contactEmail: string;

    @ApiProperty({ example: '+44 123 456 789', nullable: true })
    contactPhone: string | null;

    @ApiProperty({ example: '123 High St, London', nullable: true })
    address: string | null;

    @ApiProperty({ example: '#2563eb' })
    primaryColor: string;

    @ApiProperty({ example: '#f8fafc' })
    secondaryColor: string;
}

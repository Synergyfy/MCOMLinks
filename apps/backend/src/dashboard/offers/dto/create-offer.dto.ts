import { IsString, IsNotEmpty, IsUrl, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OfferStatus {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
}

export class CreateOfferDto {
    @ApiPropertyOptional({ example: "Bella's Boutique", description: 'Name of the business' })
    @IsString()
    @IsOptional()
    businessName?: string;

    @ApiProperty({ example: '10% Off All Accessories', description: 'Headline of the offer' })
    @IsString()
    @IsNotEmpty()
    headline: string;

    @ApiProperty({ example: 'Get 10% off on all items in the store today!', description: 'Detailed description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the offer image' })
    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;

    @ApiPropertyOptional({ example: '2026-03-09T00:00:00Z', description: 'Start date of the offer' })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ example: '2030-12-31T23:59:59Z', description: 'Expiration date of the offer' })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @ApiPropertyOptional({ example: 'Save to Phone', description: 'Call to action button label' })
    @IsString()
    @IsOptional()
    ctaLabel?: string;

    @ApiPropertyOptional({ example: 'https://example.com/claim', description: 'Destination for the lead/CTA action' })
    @IsString()
    @IsOptional()
    leadDestination?: string;

    @ApiPropertyOptional({ example: 'claim', description: 'Type of CTA action' })
    @IsString()
    @IsOptional()
    ctaType?: string;

    @ApiPropertyOptional({ example: 'image', description: 'Type of media' })
    @IsString()
    @IsOptional()
    mediaType?: string;

    @ApiPropertyOptional({ example: 'SAVE10', description: 'Redemption code' })
    @IsString()
    @IsOptional()
    redemptionCode?: string;

    @ApiPropertyOptional({ enum: OfferStatus, example: OfferStatus.DRAFT, description: 'Current status of the offer' })
    @IsEnum(OfferStatus)
    @IsOptional()
    status?: OfferStatus;

    @ApiPropertyOptional({ example: 'national', description: 'Visibility scope' })
    @IsString()
    @IsOptional()
    visibility?: string;

    @ApiPropertyOptional({ example: 'E1 6AN', description: 'Target postcode for hyperlocal visibility' })
    @IsString()
    @IsOptional()
    targetPostcode?: string;

    @ApiPropertyOptional({ example: false, description: 'Is a premium offer' })
    @IsOptional()
    isPremium?: boolean;

    @ApiPropertyOptional({ example: 'all', description: 'Season identifier' })
    @IsString()
    @IsOptional()
    season?: string;
}

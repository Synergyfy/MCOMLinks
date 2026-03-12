import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDateString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGlobalOfferDto {
    @ApiProperty({ example: "Marco's Pizza" })
    @IsString()
    @IsNotEmpty()
    businessName: string;

    @ApiProperty({ example: "50% Off Large Pizzas" })
    @IsString()
    @IsNotEmpty()
    headline: string;

    @ApiProperty({ example: "Delicious sourdough pizzas at half price!" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ enum: ['image', 'video'], default: 'image' })
    @IsEnum(['image', 'video'])
    mediaType: 'image' | 'video';

    @ApiProperty({ example: "https://images.unsplash.com/..." })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ example: "https://..." })
    @IsOptional()
    @IsString()
    videoUrl?: string;

    @ApiProperty({ enum: ['claim', 'redeem', 'redirect'], default: 'claim' })
    @IsEnum(['claim', 'redeem', 'redirect'])
    ctaType: 'claim' | 'redeem' | 'redirect';

    @ApiProperty({ example: "Claim This Offer" })
    @IsString()
    @IsNotEmpty()
    ctaLabel: string;

    @ApiPropertyOptional({ example: "offers@marco.com" })
    @IsString()
    @IsOptional()
    ctaValue?: string;

    @ApiProperty({ example: "2026-03-10" })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: "2026-04-10" })
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: "High Street Central" })
    @IsString()
    @IsOptional()
    assignedLocation?: string;

    @ApiPropertyOptional({ description: 'ID of the target Seasonal Rule for auto-activation' })
    @IsString()
    @IsOptional()
    seasonId?: string;

    @ApiProperty({ enum: ['national', 'hyperlocal'], default: 'national' })
    @IsEnum(['national', 'hyperlocal'])
    visibility: 'national' | 'hyperlocal';

    @ApiProperty({ example: "W1F 0AA" })
    @IsOptional()
    @IsString()
    targetPostcode?: string;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    isPremium?: boolean;
}

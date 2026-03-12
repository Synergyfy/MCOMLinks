import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGlobalIdentityDto {
    @ApiPropertyOptional({ example: "#e11d48", description: "Primary brand hex color" })
    @IsString()
    @IsOptional()
    brandColor?: string;

    @ApiPropertyOptional({ example: "Welcome to Our Community", description: "Main tagline/greeting" })
    @IsString()
    @IsOptional()
    headerText?: string;

    @ApiPropertyOptional({ example: "Powered by Local Heroes", description: "Global footer credits" })
    @IsString()
    @IsOptional()
    footerText?: string;

    @ApiPropertyOptional({ example: true, description: "Show social icons on storefront" })
    @IsBoolean()
    @IsOptional()
    showSocials?: boolean;
}

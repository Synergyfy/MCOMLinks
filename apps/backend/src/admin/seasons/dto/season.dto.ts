import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeasonDto {
    @ApiProperty({ example: "Winter 2026" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "2026-11-01" })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: "2027-02-28" })
    @IsDateString()
    endDate: string;
}

export class UpdateSeasonDto {
    @ApiProperty({ example: "Winter 2026 Update" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "2026-11-01" })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: "2027-02-28" })
    @IsDateString()
    endDate: string;
}

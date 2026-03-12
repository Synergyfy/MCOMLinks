import { ApiProperty } from '@nestjs/swagger';

export class EngagementActivityDto {
    @ApiProperty({ example: 'act-123' })
    id: string;

    @ApiProperty({ example: 'Verified Lead' })
    visitorId: string;

    @ApiProperty({ example: 'view' })
    type: string;

    @ApiProperty({ example: '2026-03-09T10:00:00Z' })
    timestamp: string;

    @ApiProperty({ example: 'iPhone 15, Safari' })
    device: string;

    @ApiProperty({ example: 'high' })
    interestScore: string;
}

export class OfferEngagementDto {
    @ApiProperty({ example: '8.4/10' })
    interestScoreLabel: string;

    @ApiProperty({ example: '42s' })
    avgViewTime: string;

    @ApiProperty({ example: '24%' })
    repeatScannerRate: string;

    @ApiProperty({ type: [EngagementActivityDto] })
    activities: EngagementActivityDto[];
}

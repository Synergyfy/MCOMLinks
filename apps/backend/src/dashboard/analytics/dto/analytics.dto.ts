import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsTimelineDto {
    @ApiProperty({ example: '2026-03-09', description: 'Date in YYYY-MM-DD' })
    date: string;

    @ApiProperty({ example: 120, description: 'Number of scans' })
    scans: number;

    @ApiProperty({ example: 15, description: 'Number of claims' })
    claims: number;
}

export class RecentEngagementDto {
    @ApiProperty({ example: '1', description: 'Activity ID' })
    id: string;

    @ApiProperty({ example: 'Profile #A7B2', description: 'Visitor identifier' })
    visitorId: string;

    @ApiProperty({ example: 'view', description: 'Activity type' })
    type: string;

    @ApiProperty({ example: '2026-03-09T14:00:00Z', description: 'ISO Timestamp' })
    timestamp: string;

    @ApiProperty({ example: 'high', description: 'Interest score' })
    interestScore: string;

    @ApiProperty({ example: 'iPhone 15', description: 'Device information' })
    device: string;
}

export class TopOfferDto {
    @ApiProperty({ example: 'uuid-123', description: 'Offer ID' })
    id: string;

    @ApiProperty({ example: '10% Off Pizzas', description: 'Offer headline' })
    headline: string;

    @ApiProperty({ example: 450, description: 'Total scans for this offer' })
    scans: number;

    @ApiProperty({ example: 45, description: 'Total claims for this offer' })
    claims: number;
}

export class AnalyticsDataDto {
    @ApiProperty({ example: 1500, description: 'Total scans across all offers' })
    totalScans: number;

    @ApiProperty({ example: 150, description: 'Total claims across all offers' })
    totalClaims: number;

    @ApiProperty({ example: 10.0, description: 'Conversion rate percentage' })
    conversionRate: number;

    @ApiProperty({ type: [AnalyticsTimelineDto], description: 'Daily performance timeline' })
    timeline: AnalyticsTimelineDto[];

    @ApiProperty({ type: [TopOfferDto], description: 'Top performing offers' })
    topOffers: TopOfferDto[];

    @ApiProperty({ type: [RecentEngagementDto], description: 'Recent engagement feed' })
    recentEngagement: RecentEngagementDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class LiveOfferDto {
    @ApiProperty({ example: 'offer-123' })
    id: string;

    @ApiProperty({ example: "Bella's Boutique" })
    businessName: string;

    @ApiProperty({ example: '20% Off Coffee' })
    headline: string;

    @ApiProperty({ example: 'Get 20% off your next coffee scan' })
    description: string;

    @ApiProperty({ example: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' })
    imageUrl: string;

    @ApiProperty({ example: { scans: 120, claims: 45 } })
    performance: {
        scans: number;
        claims: number;
    };

    @ApiProperty({ example: 5 })
    activeViewers: number;

    @ApiProperty({ example: '2026-03-09T00:00:00Z' })
    startDate: string;

    @ApiProperty({ example: '2026-12-31T23:59:59Z' })
    endDate: string;

    @ApiProperty({ example: 'Save to Phone' })
    ctaLabel: string;

    @ApiProperty({ example: 'claim' })
    ctaType: string;

    @ApiProperty({ example: 'https://example.com/click' })
    leadDestination: string;

    @ApiProperty({ example: 'SAVE10', nullable: true })
    redemptionCode?: string | null;

    @ApiProperty({ example: 'image' })
    mediaType: string;

    @ApiProperty({ example: 'approved' })
    status: string;
}

export class QuickActionDto {
    @ApiProperty({ example: 'Create Offer' })
    label: string;

    @ApiProperty({ example: '/dashboard/offers' })
    link: string;

    @ApiProperty({ example: 'primary' })
    type: 'primary' | 'ghost';

    @ApiProperty({ example: 'plus' })
    icon?: string;
}

export class DashboardStatsDto {
    @ApiProperty({ example: 1250, description: 'Total number of scans' })
    totalScans: number;

    @ApiProperty({ example: 450, description: 'Total number of claims' })
    totalClaims: number;

    @ApiProperty({ example: 320, description: 'Total number of redemptions' })
    totalRedemptions: number;

    @ApiProperty({ example: 36, description: 'Percentage increase in engagement' })
    engagementGrowth: number;

    @ApiProperty({ example: 12.5, description: 'Conversion rate from scans to claims' })
    conversionRate: number;

    @ApiProperty({ example: 3, description: 'Number of currently active offers' })
    activeOffers: number;

    @ApiProperty({ type: LiveOfferDto, nullable: true })
    liveOffer?: LiveOfferDto;

    @ApiProperty({ type: [QuickActionDto] })
    quickActions: QuickActionDto[];
}

export class RecentActivityDto {
    @ApiProperty({ example: '2026-03-09T10:00:00Z' })
    timestamp: string;

    @ApiProperty({ example: 'New Scan', enum: ['New Scan', 'Offer Claimed', 'Voucher Redeemed'] })
    type: string;

    @ApiProperty({ example: 'User scanned "Summer Sale" at Main Street Shop' })
    description: string;
}

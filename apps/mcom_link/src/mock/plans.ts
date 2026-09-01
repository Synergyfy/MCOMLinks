export interface MockPlan {
    id: string
    name: string
    description?: string
    monthlyPrice: number
    quarterlyPrice: number
    annualPrice: number
    features: string[]
    configuration: {
        quotas: Record<string, number | boolean>
        featureFlags: Record<string, boolean>
    }
    isActive: boolean
    isDefault: boolean
    type: 'STANDARD' | 'TRIAL' | 'SEASONAL'
    trialDuration?: number
}

export const mockPlans: MockPlan[] = [
    {
        id: 'plan-free',
        name: 'Hyper-local',
        description: 'The free base tier to get your storefront on the rotator.',
        monthlyPrice: 0,
        quarterlyPrice: 0,
        annualPrice: 0,
        features: ['1 Active Campaign', 'Postcode-Locked Exposure', 'Standard Support'],
        configuration: {
            quotas: { maxActiveCampaigns: 1, maxOffers: 5 },
            featureFlags: { priorityBoost: false, advancedAnalytics: false, customBranding: false },
        },
        isActive: true,
        isDefault: true,
        type: 'STANDARD',
    },
    {
        id: 'plan-nearby',
        name: 'Nearby Expansion',
        description: 'B2B outreach and cross-high-street partnerships.',
        monthlyPrice: 29.99,
        quarterlyPrice: 79.99,
        annualPrice: 299.99,
        features: ['Expansion Radius Add-ons', 'Multiple Nearby Districts', 'B2B Partnerships', 'Growth Support'],
        configuration: {
            quotas: { maxActiveCampaigns: 5, maxOffers: 20, allowNearbyExpansion: true },
            featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true },
        },
        isActive: true,
        isDefault: false,
        type: 'STANDARD',
    },
    {
        id: 'plan-national',
        name: 'National Network',
        description: 'Platform-wide fallback campaigns and corporate branding.',
        monthlyPrice: 99.99,
        quarterlyPrice: 269.99,
        annualPrice: 999.99,
        features: ['CPM or Fixed Slot Access', 'Premium Override Rights', 'Platform-Wide Exposure', 'Platinum Concierge'],
        configuration: {
            quotas: { maxActiveCampaigns: 20, maxOffers: 100, allowNearbyExpansion: true, allowNationalNetwork: true },
            featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true },
        },
        isActive: true,
        isDefault: false,
        type: 'STANDARD',
    },
    {
        id: 'plan-trial',
        name: 'National Trial',
        description: 'A 14-day trial of the National Network.',
        monthlyPrice: 0,
        quarterlyPrice: 0,
        annualPrice: 0,
        features: ['Full National Access', 'Priority Override', '14 Days Free'],
        configuration: {
            quotas: { maxActiveCampaigns: 3, maxOffers: 10, allowNearbyExpansion: true, allowNationalNetwork: true },
            featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true },
        },
        isActive: true,
        isDefault: false,
        type: 'TRIAL',
        trialDuration: 14,
    },
]
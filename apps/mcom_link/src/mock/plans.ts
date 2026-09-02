export interface MockPlan {
    id: string
    name: string
    description?: string
    tagline?: string
    bestFor?: string
    isFree?: boolean
    monthlyPrice: number
    quarterlyPrice: number
    annualPrice: number
    features: string[]
    limitations?: string[]
    configuration: {
        quotas: Record<string, number | boolean>
        featureFlags: Record<string, boolean>
    }
    isActive: boolean
    isDefault: boolean
    type: 'STANDARD' | 'TRIAL' | 'SEASONAL'
    trialDuration?: number
}

export const mockPlanSchema = {
    quotas: [
        { key: 'maxActiveCampaigns', label: 'Max Active Campaigns', type: 'number', unlimited: true },
        { key: 'maxOffers', label: 'Max Offers in Rotation', type: 'number', unlimited: true },
        { key: 'maxLocations', label: 'Max Network Locations', type: 'number', unlimited: true },
        { key: 'allowNearbyExpansion', label: 'Enable Nearby Expansion Layer', type: 'boolean' },
        { key: 'allowNationalNetwork', label: 'Enable National Network Layer', type: 'boolean' },
    ],
    featureFlags: [
        { key: 'priorityBoost', label: 'Priority Boost (Star Placement)', type: 'boolean' },
        { key: 'advancedAnalytics', label: 'Advanced Analytics Dashboard', type: 'boolean' },
        { key: 'customBranding', label: 'Custom Brand Colors', type: 'boolean' },
        { key: 'allowThirdPartyPromotion', label: 'Third-Party Promotion', type: 'boolean' },
        { key: 'allowAutoRollover', label: 'Auto Rollover Into Next Season', type: 'boolean' },
        { key: 'allowExpoAccess', label: 'Expo Access', type: 'boolean' },
    ],
}

export const mockPlans: MockPlan[] = [
    {
        id: 'plan-free',
        name: 'Hyper-local',
        description: 'The free base tier to get your storefront on the rotator.',
        tagline: 'Start showing your business on MCOMQLinks',
        bestFor: 'Businesses just getting started, testing the platform, local storefront presence',
        isFree: true,
        monthlyPrice: 0,
        quarterlyPrice: 0,
        annualPrice: 0,
        features: ['1 Active Campaign', 'Postcode-Locked Exposure', 'Standard Support'],
        limitations: ['No promotion of third-party products/services', 'No automatic renewal (expires after 90 days)', 'No Expo access', 'Standard visibility only'],
        configuration: {
            quotas: { maxActiveCampaigns: 1, maxOffers: 5, maxLocations: 1 },
            featureFlags: { priorityBoost: false, advancedAnalytics: false, customBranding: false, allowThirdPartyPromotion: false, allowAutoRollover: false, allowExpoAccess: false },
        },
        isActive: true,
        isDefault: true,
        type: 'STANDARD',
    },
    {
        id: 'plan-nearby',
        name: 'Nearby Expansion',
        description: 'B2B outreach and cross-high-street partnerships.',
        tagline: 'Grow beyond your storefront and scale your campaigns',
        bestFor: 'Businesses ready to scale, multi-product/service sellers, partner/collaboration businesses',
        isFree: false,
        monthlyPrice: 29.99,
        quarterlyPrice: 79.99,
        annualPrice: 299.99,
        features: ['Expansion Radius Add-ons', 'Multiple Nearby Districts', 'B2B Partnerships', 'Growth Support'],
        limitations: ['No Expo access', 'Standard visibility only'],
        configuration: {
            quotas: { maxActiveCampaigns: 5, maxOffers: 20, maxLocations: 5, allowNearbyExpansion: true },
            featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true, allowThirdPartyPromotion: true, allowAutoRollover: true, allowExpoAccess: false },
        },
        isActive: true,
        isDefault: false,
        type: 'STANDARD',
    },
    {
        id: 'plan-national',
        name: 'National Network',
        description: 'Platform-wide fallback campaigns and corporate branding.',
        tagline: 'Maximum exposure, priority access, and event promotion',
        bestFor: 'Serious businesses, brands launching products/services, businesses that want maximum visibility',
        isFree: false,
        monthlyPrice: 99.99,
        quarterlyPrice: 269.99,
        annualPrice: 999.99,
        features: ['CPM or Fixed Slot Access', 'Premium Override Rights', 'Platform-Wide Exposure', 'Platinum Concierge'],
        limitations: [],
        configuration: {
            quotas: { maxActiveCampaigns: 20, maxOffers: 100, maxLocations: 50, allowNearbyExpansion: true, allowNationalNetwork: true },
            featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true, allowThirdPartyPromotion: true, allowAutoRollover: true, allowExpoAccess: true },
        },
        isActive: true,
        isDefault: false,
        type: 'STANDARD',
    },
    {
        id: 'plan-trial',
        name: 'National Trial',
        description: 'A 14-day trial of the National Network.',
        tagline: 'Full National Network access for 14 days free',
        bestFor: 'New businesses wanting to try the platform risk-free',
        isFree: true,
        monthlyPrice: 0,
        quarterlyPrice: 0,
        annualPrice: 0,
        features: ['Full National Access', 'Priority Override', '14 Days Free'],
        limitations: ['Limited to 14 days', 'No auto rollover'],
        configuration: {
            quotas: { maxActiveCampaigns: 3, maxOffers: 10, maxLocations: 3, allowNearbyExpansion: true, allowNationalNetwork: true },
            featureFlags: { priorityBoost: true, advancedAnalytics: true, customBranding: true, allowThirdPartyPromotion: true, allowAutoRollover: false, allowExpoAccess: true },
        },
        isActive: true,
        isDefault: false,
        type: 'TRIAL',
        trialDuration: 14,
    },
]
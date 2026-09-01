export type CTAType = 'claim' | 'redeem' | 'redirect'
export type Season = 'all' | 'winter' | 'spring' | 'summer' | 'autumn'
export type OfferStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired'

export interface Offer {
    id: string
    businessName: string
    headline: string
    description: string
    mediaType: 'image' | 'video'
    imageUrl: string
    videoUrl?: string
    ctaType: CTAType
    ctaLabel: string
    // Real backend field (backend uses `leadDestination`, not `redirectUrl`)
    leadDestination?: string
    redirectUrl?: string
    redemptionCode?: string
    redemptionInstructions?: string
    isPremium: boolean
    status: OfferStatus
    visibility: 'national' | 'hyperlocal' | 'nearby'
    targetPostcode?: string
    // Backend counters & timestamps. The dashboard endpoint nests these under
    // `performance`, while the storefront returns them at the top level.
    scans?: number
    claims?: number
    activeViewers?: number
    createdAt?: string
    updatedAt?: string
    startDate: string // ISO date string
    endDate: string   // ISO date string
    rejectionReason?: string
    // Frontend-only extras (mock data / admin UI); not sent to the backend
    season?: Season
    exposureType?: 'national' | 'hyperlocal' | 'nearby'
    rotatorWeight?: number // 0-100 percentage
    targetRadius?: number // in km, for nearby
    billingStatus?: 'active' | 'suspended' | 'pending'
    googleMapsLocation?: string
    isActive?: boolean
    performance?: {
        scans: number
        claims: number
    }
    claimFields?: ClaimField[]
    activities?: EngagementActivity[]
}

export interface EngagementActivity {
    id: string
    visitorId: string
    type: 'view' | 'click' | 'directions' | 'claim' | 'save'
    timestamp: string
    duration?: number
    location?: string
    device?: string
    interestScore: 'low' | 'medium' | 'high' | 'verified'
    verifiedData?: {
        email?: string
        phone?: string
    }
}

export interface ClaimField {
    name: string
    label: string
    type: 'text' | 'email' | 'tel'
    required: boolean
    placeholder: string
}

export interface AgentProfile {
    id: string;
    name: string;
    email: string;
    role: 'Field Agent' | 'Senior Account Manager';
    avatarUrl?: string;
}

export interface AgentPortfolio {
    agentId: string;
    businessIds: string[];
    targets: {
        newBusinesses: number;
        newBusinessesGoal: number;
        activeOffers: number;
        activeOffersGoal: number;
    };
}

export interface CommLog {
    id: string;
    businessId: string;
    date: string;
    note: string;
    type: 'call' | 'meeting' | 'email';
}

export interface BusinessProfile {
    id: string;
    name: string;
    description: string;
    logoUrl?: string;
    contactEmail: string;
    contactPhone?: string;
    address?: string;
    primaryColor: string;
    secondaryColor: string;
    ownerName: string;
    plan: 'Basic' | 'Premium';
    subscriptionStatus: 'active' | 'suspended';
    offers: string[];
}

// MCOM Ecosystem: centrally-managed plan (Plan CRUD & centralized payments)
export type BillingCycle = 'monthly' | 'quarterly' | 'annual'
export type PaymentProvider = 'stripe' | 'paypal' | 'wallet'
export type PlanType = 'STANDARD' | 'TRIAL' | 'SEASONAL'

export interface Plan {
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
    type: PlanType
    trialDuration?: number
    seasonId?: string
    stripeMonthlyPriceId?: string
    stripeQuarterlyPriceId?: string
    stripeAnnualPriceId?: string
    paypalMonthlyPlanId?: string
    paypalQuarterlyPlanId?: string
    paypalAnnualPlanId?: string
    createdAt?: string
    updatedAt?: string
}

export interface PurchasedPackage {
    id: string
    planId: string
    planName: string
    billingCycle: BillingCycle
    status: 'active' | 'cancelled' | 'expired'
    expiresAt: string
}

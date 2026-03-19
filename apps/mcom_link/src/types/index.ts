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
    redirectUrl?: string
    googleMapsLocation?: string
    redemptionCode?: string
    redemptionInstructions?: string
    isActive: boolean
    isPremium: boolean
    season: Season
    startDate: string // ISO date string
    endDate: string   // ISO date string
    status: OfferStatus
    visibility: 'national' | 'hyperlocal' | 'nearby'
    exposureType: 'national' | 'hyperlocal' | 'nearby'
    rotatorWeight?: number // 0-100 percentage
    targetRadius?: number // in km, for nearby
    targetPostcode?: string
    billingStatus?: 'active' | 'suspended' | 'pending'
    performance: {
        scans: number
        claims: number
    }
    rejectionReason?: string
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

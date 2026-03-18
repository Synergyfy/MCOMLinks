// Mock Offer Catalog
// Represents all available offers in the rotator system

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
    redemptionCode?: string
    redemptionInstructions?: string
    isActive: boolean
    isPremium: boolean
    season: Season
    startDate: string // ISO date string
    endDate: string   // ISO date string
    status: OfferStatus
    visibility: 'national' | 'hyperlocal'
    targetPostcode?: string
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
    visitorId: string           // e.g. "Profile #A7B2"
    type: 'view' | 'click' | 'directions' | 'claim' | 'save'
    timestamp: string          // ISO string
    duration?: number          // seconds spent viewing
    location?: string          // e.g. "High Street Central Hub"
    device?: string            // e.g. "iPhone 15, Safari"
    interestScore: 'low' | 'medium' | 'high' | 'verified'
    verifiedData?: {           // Only if they opted in
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

// Default claim fields used when an offer requires a claim form
const defaultClaimFields: ClaimField[] = [
    { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your full name' },
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com' },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: '+44 7XXX XXX XXX' },
]

export const mockOffers: Offer[] = [
    {
        id: 'offer-001',
        businessName: 'The Daily Grind Coffee',
        headline: '☕ Buy 1 Get 1 Free on Any Latte',
        description: 'Start your morning right with our premium handcrafted lattes. Valid on all sizes — bring a friend and enjoy together!',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
        ctaType: 'claim',
        ctaLabel: 'Claim This Offer',
        isActive: true,
        isPremium: false,
        season: 'all',
        startDate: '2020-01-01',
        endDate: '2030-12-31',
        status: 'approved',
        visibility: 'national',
        performance: { scans: 450, claims: 32 },
        claimFields: defaultClaimFields,
    },
    {
        id: 'offer-002',
        businessName: 'Bella\'s Boutique',
        headline: '👗 20% Off Spring Collection',
        description: 'Refresh your wardrobe with the latest spring arrivals. Exclusive in-store discount on all new season pieces.',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
        ctaType: 'redeem',
        ctaLabel: 'Redeem Now',
        redemptionCode: 'SPRING20',
        redemptionInstructions: 'Show this code at the till to receive your 20% discount. Valid for one use only.',
        isActive: true,
        isPremium: true,
        season: 'spring',
        startDate: '2026-02-01',
        endDate: '2026-05-31',
        status: 'approved',
        visibility: 'national',
        performance: { scans: 890, claims: 124 },
    },
    {
        id: 'offer-003',
        businessName: 'FitLife Gym',
        headline: '💪 Free 7-Day Trial Pass',
        description: 'Experience our state-of-the-art facility with no commitment. Full access to all equipment, classes, and sauna.',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
        ctaType: 'claim',
        ctaLabel: 'Get Your Free Pass',
        isActive: true,
        isPremium: false,
        season: 'all',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: 'approved',
        visibility: 'national',
        performance: { scans: 210, claims: 15 },
        claimFields: defaultClaimFields,
    },
    {
        id: 'offer-004',
        businessName: 'Marco\'s Pizzeria',
        headline: '🍕 Free Garlic Bread with Any Large Pizza',
        description: 'Authentic Italian stone-baked pizza with our famous homemade garlic bread on the house. Dine-in only.',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
        ctaType: 'redeem',
        ctaLabel: 'Redeem Now',
        redemptionCode: 'GARLICFREE',
        redemptionInstructions: 'Show this code to your server when placing your order. Valid for dine-in only.',
        isActive: true,
        isPremium: false,
        season: 'all',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: 'approved',
        visibility: 'national',
        performance: { scans: 340, claims: 89 },
    },
    {
        id: 'offer-005',
        businessName: 'Bloom & Wild Florist',
        headline: '🌸 15% Off All Bouquets This Week',
        description: 'Brighten someone\'s day with a beautiful hand-tied bouquet. Fresh flowers delivered or collected in-store.',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=400&fit=crop',
        ctaType: 'redirect',
        ctaLabel: 'Visit Website',
        redirectUrl: 'https://example.com/bloom-and-wild',
        isActive: true,
        isPremium: false,
        season: 'spring',
        startDate: '2026-02-01',
        endDate: '2026-05-31',
        status: 'expired',
        visibility: 'national',
        performance: { scans: 1560, claims: 412 },
    },
    {
        id: 'offer-008',
        businessName: 'Bella\'s Boutique',
        headline: '✨ Summer Clearance Draft',
        description: 'Getting ready for summer with massive discounts on winter stock.',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop',
        ctaType: 'claim',
        ctaLabel: 'Claim Discount',
        isActive: false,
        isPremium: false,
        season: 'summer',
        startDate: '2020-06-01',
        endDate: '2030-08-31',
        status: 'submitted',
        visibility: 'national',
        performance: { scans: 0, claims: 0 },
        claimFields: defaultClaimFields,
    },
    {
        id: 'offer-009',
        businessName: 'Bella\'s Boutique',
        headline: '💍 Deluxe Jewelry Night',
        description: 'Evening event with champagne and exclusive jewelry views.',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1515562141521-7a4cb0c5625b?w=600&h=400&fit=crop',
        ctaType: 'claim',
        ctaLabel: 'Request Invite',
        isActive: false,
        isPremium: true,
        season: 'all',
        startDate: '2020-04-01',
        endDate: '2030-04-30',
        status: 'rejected',
        rejectionReason: 'Headline contains excessive emojis. Please follow our branding guidelines.',
        visibility: 'national',
        performance: { scans: 120, claims: 0 },
        claimFields: defaultClaimFields,
    },
]

// The branded fallback offer (STEP 11) — always available, never blank
export const fallbackOffer: Offer = {
    id: 'fallback-001',
    businessName: 'MCOMQLINKS',
    headline: '🎉 Discover Local Deals Near You',
    description: 'Your local high street is full of amazing offers. Scan again soon to see what\'s new and save money at your favourite shops!',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    ctaType: 'redirect',
    ctaLabel: 'Explore More',
    redirectUrl: '/',
    isActive: true,
    isPremium: false,
    season: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31',
    status: 'approved',
    visibility: 'national',
    performance: { scans: 0, claims: 0 },
}

export function toggleOfferPremium(id: string): void {
    const offer = mockOffers.find((o) => o.id === id)
    if (offer) {
        offer.isPremium = !offer.isPremium
    }
}

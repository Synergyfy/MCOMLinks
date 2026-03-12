import type { Offer } from '../types'

export const fallbackOffer: Offer = {
    id: 'fallback-001',
    businessName: 'MCOMLINKS',
    headline: '🎉 Discover Local Deals Near You',
    description: 'Your local high street is full of amazing offers. Scan again soon to see what\'s new and save money at your favourite shops!',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    ctaType: 'redirect',
    ctaLabel: 'Explore More',
    redirectUrl: 'https://mcomlinks.com',
    isActive: true,
    isPremium: false,
    season: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31',
    status: 'approved',
    visibility: 'national',
    performance: { scans: 0, claims: 0 },
}

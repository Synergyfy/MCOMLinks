// Rotator Engine — The Heart of the System
// PRD STEP 5: Sequential rotation with persistent pointer
// PRD STEP 4: Offer display rules (active, valid dates, not expired)
// PRD STEP 9: Premium/Priority overrides
// PRD STEP 10: Seasonal switching

import { mockOffers, fallbackOffer, type Offer } from './offers'

// Persistent rotation tracking is now handled via localStorage in getPointer/updatePointer helper functions

// Session-based scan tracking for anti-farming (STEP 13)
const scanHistory: Map<string, { count: number; lastScan: number }> = new Map()
const MAX_SCANS_PER_MINUTE = 5

/**
 * Get the rotation pointer for a specific location from storage
 */
function getPointer(locationId: string): number {
    const key = `mcom_ptr_${locationId}`
    const stored = localStorage.getItem(key)
    return stored ? parseInt(stored, 10) : 0
}

/**
 * Update the rotation pointer for a specific location in storage
 */
function updatePointer(locationId: string, current: number, total: number): void {
    const key = `mcom_ptr_${locationId}`
    const next = (current + 1) % total
    localStorage.setItem(key, next.toString())
}

/**
 * Get the current season based on the date
 */
function getCurrentSeason(): string {
    const month = new Date().getMonth() + 1 // 1-12
    if (month >= 3 && month <= 5) return 'spring'
    if (month >= 6 && month <= 8) return 'summer'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
}

/**
 * Check if an offer is valid right now
 * Checks: isActive, date validity, seasonal match
 */
function isOfferValid(offer: Offer): boolean {
    if (!offer.isActive) return false

    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)

    // Date validity check
    if (now < start || now > end) return false

    // Seasonal check — 'all' season offers are always valid
    if (offer.season !== 'all') {
        const currentSeason = getCurrentSeason()
        if (offer.season !== currentSeason) return false
    }

    return true
}

/**
 * Anti-farming: Check if a session has scanned too many times
 */
function isRateLimited(sessionId: string): boolean {
    const now = Date.now()
    const history = scanHistory.get(sessionId)

    if (!history) {
        scanHistory.set(sessionId, { count: 1, lastScan: now })
        return false
    }

    // Reset counter if over 1 minute has passed
    if (now - history.lastScan > 60000) {
        scanHistory.set(sessionId, { count: 1, lastScan: now })
        return false
    }

    // Increment counter
    history.count++
    history.lastScan = now

    return history.count > MAX_SCANS_PER_MINUTE
}

/**
 * Get the next valid offer from the rotation
 * This is the core engine (PRD STEP 5)
 * 
 * Logic:
 * 1. First, check for premium/priority offers (STEP 9)
 * 2. Then, get the next valid offer in sequence (STEP 5)
 * 3. Validate each offer (STEP 4)
 * 4. If nothing valid, return fallback (STEP 11)
 */
export function getNextOffer(locationId: string, sessionId: string = 'default'): {
    offer: Offer
    isFallback: boolean
    isRateLimited: boolean
} {
    // Anti-farming check (STEP 13)
    if (isRateLimited(sessionId)) {
        return { offer: fallbackOffer, isFallback: true, isRateLimited: true }
    }

    // Get all valid offers
    const validOffers = mockOffers.filter(isOfferValid)

    // No valid offers → fallback (STEP 11)
    if (validOffers.length === 0) {
        return { offer: fallbackOffer, isFallback: true, isRateLimited: false }
    }

    // Sort offers: Premium offers first (STEP 9), then regular offers
    const sortedOffers = [
        ...validOffers.filter((o) => o.isPremium),
        ...validOffers.filter((o) => !o.isPremium)
    ]

    if (sortedOffers.length === 0) {
        return { offer: fallbackOffer, isFallback: true, isRateLimited: false }
    }

    // Move persistent pointer forward through all offers (wraps around for looping — STEP 5)
    // IMPORTANT: Pointer is per-location to simulate global engine state
    const currentPointer = getPointer(locationId)
    const offer = sortedOffers[currentPointer % sortedOffers.length]

    // Update pointer for next time
    updatePointer(locationId, currentPointer, sortedOffers.length)

    return { offer, isFallback: false, isRateLimited: false }
}

/**
 * Get a specific offer by ID (for claim/redeem pages)
 */
export function getOfferById(offerId: string): Offer | undefined {
    return mockOffers.find((o) => o.id === offerId) || (offerId === fallbackOffer.id ? fallbackOffer : undefined)
}

/**
 * Reset the rotation pointer (for testing)
 */
export function resetRotation(locationId: string): void {
    const key = `mcom_ptr_${locationId}`
    localStorage.removeItem(key)
}

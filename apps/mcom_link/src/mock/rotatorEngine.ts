import type { Offer } from '../types';
import { mockOffers } from './offers';
import { fallbackOffer } from '../constants/fallbackOffer';

// Simple mapping for location data enrichment in the frontend mock
export const mockLocations: Record<string, { name: string, postcode: string, campaignName: string }> = {
    'loc-peckham-01': { name: 'Peckham High Street', postcode: 'SE15', campaignName: 'MCOMQ Spring Special' },
    'loc-brixton-01': { name: 'Brixton Market', postcode: 'SW9', campaignName: 'Summer Vibes Brixton' },
    'loc-stratford-01': { name: 'Stratford Centre', postcode: 'E15', campaignName: 'Corporate Default' },
};

/**
 * Rotator Engine Simulation
 * Implements Three-Layer exposure logic:
 * 1. Hyper-local (Primary - Highest Weight)
 * 2. Nearby (B2B Expansion - Radius/Radius Based)
 * 3. National (Fallback - Lower Weight/Default)
 */
export async function getNextOffer(locationId: string): Promise<{ offer: Offer, location: any }> {
    const location = mockLocations[locationId] || { name: 'Unknown Location', postcode: 'GEN', campaignName: 'Global Rotation' };
    const myPostcode = location.postcode;

    // 0. Filter Active & Paid (Billing Integration Rule: No Payment = No Visibility)
    const activeAndPaid = mockOffers.filter(o => o.isActive && o.status === 'approved' && o.billingStatus !== 'suspended');

    // 1. Filter Hyper-local offers (Direct Postcode match)
    const hyperlocalOffers = activeAndPaid.filter(o => 
        o.exposureType === 'hyperlocal' && 
        o.targetPostcode === myPostcode
    );

    // 2. Filter Nearby offers (Simulated Postcode Proximity)
    const nearbyOffers = activeAndPaid.filter(o => 
        o.exposureType === 'nearby' && 
        isNearby(o.targetPostcode || '', myPostcode, o.targetRadius || 5)
    );

    // 3. Filter National offers (Always available everywhere)
    const nationalOffers = activeAndPaid.filter(o => 
        o.exposureType === 'national'
    );

    // PRIORITY SELECTION WITH WEIGHTING
    let candidates: Offer[] = [];
    
    if (hyperlocalOffers.length > 0) {
        candidates = hyperlocalOffers;
    } else if (nearbyOffers.length > 0) {
        candidates = nearbyOffers;
    } else {
        candidates = nationalOffers.length > 0 ? nationalOffers : [fallbackOffer];
    }

    // REAL-TIME WEIGHTING: Pick based on probability
    const selectedOffer = pickWeightedOffer(candidates);

    return {
        offer: selectedOffer,
        location
    };
}

/**
 * Returns the entire pool of eligible offers for a location
 * Priorities: Hyperlocal > Nearby > National
 */
export async function getOfferPool(locationId: string): Promise<{ offers: Offer[], location: any, exposureType: string }> {
    const location = mockLocations[locationId] || { name: 'Unknown Location', postcode: 'GEN', campaignName: 'Global Rotation' };
    const myPostcode = location.postcode;

    // 0. Filter Active & Paid
    const activeAndPaid = mockOffers.filter(o => o.isActive && o.status === 'approved' && o.billingStatus !== 'suspended');

    // 1. Filter Hyper-local offers
    const hyperlocalOffers = activeAndPaid.filter(o => 
        o.exposureType === 'hyperlocal' && 
        o.targetPostcode === myPostcode
    );

    // 2. Filter Nearby offers
    const nearbyOffers = activeAndPaid.filter(o => 
        o.exposureType === 'nearby' && 
        isNearby(o.targetPostcode || '', myPostcode, o.targetRadius || 5)
    );

    // 3. Filter National offers
    const nationalOffers = activeAndPaid.filter(o => 
        o.exposureType === 'national'
    );

    // Combine in priority order - EXCLUSIVE LAYERS (As requested)
    // We only show ONE layer at a time in a rotator.
    let pool: Offer[] = [];
    let selectedType: string = 'national';
    
    if (hyperlocalOffers.length > 0) {
        pool = hyperlocalOffers;
        selectedType = 'hyperlocal';
    } else if (nearbyOffers.length > 0) {
        pool = nearbyOffers;
        selectedType = 'nearby';
    } else if (nationalOffers.length > 0) {
        pool = nationalOffers;
        selectedType = 'national';
    } else {
        pool = [fallbackOffer];
        selectedType = 'fallback';
    }

    // Sort by weight (highest probability first) to look professional
    const sortedPool = [...pool].sort((a: any, b: any) => (b.rotatorWeight || 100) - (a.rotatorWeight || 100));

    return {
        offers: sortedPool,
        location,
        exposureType: selectedType
    };
}

/**
 * Weighted Probability Selector
 * P(Offer) = Weight / TotalWeight
 */
function pickWeightedOffer(offers: Offer[]): Offer {
    if (offers.length === 0) return fallbackOffer;
    if (offers.length === 1) return offers[0];

    const totalWeight = offers.reduce((sum, offer) => sum + (offer.rotatorWeight || 100), 0);
    let random = Math.random() * totalWeight;

    for (const offer of offers) {
        const weight = offer.rotatorWeight || 100;
        if (random < weight) {
            return offer;
        }
        random -= weight;
    }

    return offers[0];
}

/**
 * Simulated Postcode Proximity API
 * In a real system, this calls a Geo-spatial DB or distance API.
 * For now, we simulate by checking prefix similarity or radius.
 */
function isNearby(targetPostcode: string, currentPostcode: string, radiusKm: number): boolean {
    if (targetPostcode === currentPostcode) return true;
    
    // Heuristic: Same area (e.g. SE15 vs SE5) is "Nearby"
    const targetArea = targetPostcode.replace(/[0-9]/g, '').slice(0, 2);
    const currentArea = currentPostcode.replace(/[0-9]/g, '').slice(0, 2);
    
    // If they share the same area code (e.g. both SE), we check the number
    if (targetArea === currentArea) {
        const targetNum = parseInt(targetPostcode.match(/\d+/)?.[0] || '0');
        const currentNum = parseInt(currentPostcode.match(/\d+/)?.[0] || '0');
        return Math.abs(targetNum - currentNum) <= (radiusKm / 2); // Very rough proxy
    }

    return false;
}

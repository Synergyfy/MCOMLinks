// StorefrontPage — PRD STEP 1 + STEP 3 (Main entry point)
// Dynamic route: /r/{location-id}
// Triggers the rotator engine, displays the next valid offer in the fixed template

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getNextOffer } from '../mock/rotatorEngine'
import { getLocationById, type Location } from '../mock/locations'
import { trackEvent, getSessionId } from '../mock/tracker'
import type { Offer } from '../mock/offers'
import StorefrontHeader from '../components/StorefrontHeader'
import OfferCard from '../components/OfferCard'
import CTAButton from '../components/CTAButton'
import TrustBadge from '../components/TrustBadge'
import StorefrontFooter from '../components/StorefrontFooter'
import LoadingScreen from './LoadingScreen'
import FallbackPage from './FallbackPage'

export default function StorefrontPage() {
    const { locationId } = useParams<{ locationId: string }>()
    const [loading, setLoading] = useState(true)
    const [offer, setOffer] = useState<Offer | null>(null)
    const [location, setLocation] = useState<Location | null>(null)
    const [isFallback, setIsFallback] = useState(false)

    // Use a ref to ensure the rotator only advances ONCE per mount (prevents double-firing in StrictMode)
    const hasRotated = useRef(false)

    useEffect(() => {
        if (!locationId) return

        let isMounted = true

        // Simulate network delay for realistic loading experience (STEP 2)
        const timer = setTimeout(() => {
            if (!isMounted) return

            // Resolve location
            const loc = getLocationById(locationId)
            if (!loc || !loc.isActive) {
                setIsFallback(true)
                setLoading(false)
                return
            }
            setLocation(loc)

            // Trigger rotator engine (STEP 1 + STEP 5)
            // We only want to trigger the increment logic ONCE per actual scan/reload intent
            if (!hasRotated.current) {
                const sessionId = getSessionId()
                const result = getNextOffer(locationId, sessionId)

                setOffer(result.offer)
                setIsFallback(result.isFallback)

                // Mark as rotated so StrictMode second pass doesn't advance pointer again
                hasRotated.current = true

                // Log events (STEP 8)
                trackEvent('scan', locationId, result.offer.id)
                if (!result.isFallback) {
                    trackEvent('offer_view', locationId, result.offer.id)
                }
            }

            setLoading(false)
        }, 1200)

        return () => {
            isMounted = false
            clearTimeout(timer)
        }
    }, [locationId])

    // STEP 2: Show loading screen
    if (loading) {
        return <LoadingScreen />
    }

    // STEP 11: Fallback if anything failed
    if (isFallback || !offer || !location) {
        return <FallbackPage offer={offer} />
    }

    // STEP 3: Fixed storefront template
    return (
        <div className="sf-container">
            <div className="sf-wrapper">
                {/* STEP 3.1: Header */}
                <StorefrontHeader
                    locationName={location.name}
                    campaignName={location.campaignName}
                />

                {/* STEP 3.2: Main Offer Block */}
                <main className="sf-main">
                    <OfferCard offer={offer} />

                    {/* STEP 3.3: CTA Button */}
                    <div className="sf-cta-section">
                        <CTAButton offer={offer} locationId={locationId!} />
                    </div>
                </main>

                {/* STEP 3.4: Trust Section */}
                <TrustBadge />

                {/* STEP 3.5: Footer */}
                <StorefrontFooter />
            </div>
        </div>
    )
}

// StorefrontPage — PRD STEP 1 + STEP 3 (Main entry point)
// Dynamic route: /r/{location-id}
// Triggers the rotator engine, displays the next valid offer in the fixed template

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { Offer } from '../types'
import { fallbackOffer } from '../constants/fallbackOffer'
import StorefrontHeader from '../components/StorefrontHeader'
import OfferCard from '../components/OfferCard'
import CTAButton from '../components/CTAButton'
import TrustBadge from '../components/TrustBadge'
import StorefrontFooter from '../components/StorefrontFooter'
import LoadingScreen from './LoadingScreen'
import FallbackPage from './FallbackPage'
import { getNextOffer } from '../mock/rotatorEngine'

export default function StorefrontPage() {
    const { locationId } = useParams<{ locationId: string }>()
    const [loading, setLoading] = useState(true)
    const [offer, setOffer] = useState<Offer | null>(null)
    const [location, setLocation] = useState<any | null>(null)
    const [isFallback, setIsFallback] = useState(false)

    // Use a ref to ensure the rotator only advances ONCE per mount (prevents double-firing in StrictMode)
    const hasRotated = useRef(false)

    useEffect(() => {
        if (!locationId || hasRotated.current) return

        let isMounted = true

        const fetchOffer = async () => {
            try {
                // SIMULATING THE ROTATOR ENGINE (PRD / TASK.MD REQS)
                // In a real app, this is a backend call to /r/${locationId}
                // But we are mocking the sequential 3-layer logic here.
                const { offer: mockOffer, location: mockLocation } = await getNextOffer(locationId)

                if (!isMounted) return

                setOffer(mockOffer)
                setLocation(mockLocation)
                setIsFallback(mockOffer.id === 'fallback-branded')

                hasRotated.current = true
            } catch (error) {
                console.error('Failed to fetch offer:', error)
                if (isMounted) {
                    setOffer(fallbackOffer)
                    setIsFallback(true)
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchOffer()

        return () => {
            isMounted = false
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

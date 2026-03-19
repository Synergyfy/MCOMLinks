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
import { getOfferPool } from '../mock/rotatorEngine'

export default function StorefrontPage() {
    const { locationId } = useParams<{ locationId: string }>()
    const [loading, setLoading] = useState(true)
    const [offers, setOffers] = useState<Offer[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [location, setLocation] = useState<any | null>(null)
    const [exposureType, setExposureType] = useState<string>('')
    const [animating, setAnimating] = useState<'next' | 'prev' | null>(null)

    // Use a ref to ensure the rotator only advances ONCE per mount (prevents double-firing in StrictMode)
    const hasFetched = useRef(false)

    useEffect(() => {
        if (!locationId || hasFetched.current) return

        let isMounted = true

        const fetchOfferPool = async () => {
            try {
                // Fetch the pool of eligible offers for this location
                const { offers: mockOffers, location: mockLocation, exposureType: type } = await getOfferPool(locationId) as any

                if (!isMounted) return

                setOffers(mockOffers)
                setLocation(mockLocation)
                setExposureType(type)
                hasFetched.current = true
            } catch (error) {
                console.error('Failed to fetch offer pool:', error)
                if (isMounted) {
                    setOffers([fallbackOffer])
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchOfferPool()

        return () => {
            isMounted = false
        }
    }, [locationId])

    const handleNext = () => {
        if (animating || offers.length <= 1) return
        setAnimating('next')
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length)
            setAnimating(null)
        }, 300)
    }

    const handlePrev = () => {
        if (animating || offers.length <= 1) return
        setAnimating('prev')
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)
            setAnimating(null)
        }, 300)
    }

    if (loading) {
        return <LoadingScreen />
    }

    if (!offers.length || !location) {
        return <FallbackPage />
    }

    const currentOffer = offers[currentIndex]
    const isFallback = currentOffer.id === 'fallback-branded'

    // STEP 11: Fallback if anything failed
    if (isFallback) {
        return <FallbackPage offer={currentOffer} />
    }

    // STEP 3: Fixed storefront template
    return (
        <div className="sf-container">
            <div className="sf-wrapper">
                {/* STEP 3.1: Header */}
                <StorefrontHeader
                    locationName={location.name}
                    campaignName={location.campaignName}
                    exposureType={exposureType}
                />

                {/* STEP 3.2: Main Offer Block */}
                <main className="sf-main sf-rotator-main">
                    {/* Navigation Overlays (Only if > 1 offer) */}
                    {offers.length > 1 && (
                        <>
                            <button className="sf-nav-btn sf-nav-prev" onClick={handlePrev} disabled={!!animating}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                            <button className="sf-nav-btn sf-nav-next" onClick={handleNext} disabled={!!animating}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                            
                            {/* Pagination Indicators */}
                            <div className="sf-pagination">
                                {offers.map((_, idx) => (
                                    <span key={idx} className={`sf-dot ${idx === currentIndex ? 'active' : ''}`} />
                                ))}
                            </div>
                        </>
                    )}

                    <div className={`sf-card-container ${animating ? `animating-${animating}` : ''}`}>
                        <OfferCard offer={currentOffer} key={currentOffer.id} />
                    </div>

                    {/* STEP 3.3: CTA Button */}
                    <div className="sf-cta-section">
                        <CTAButton offer={currentOffer} locationId={locationId!} />
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


import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/apiClient'
import type { Offer } from '../types'

interface OfferCardProps {
    offer: Offer
}

export default function OfferCard({ offer }: Readonly<OfferCardProps>) {
    const { locationId } = useParams<{ locationId: string }>()
    const secondsViewed = useRef(0)

    // Track engagement time (STEP 8 - Deep Insights).
    // Log the total duration once on unmount; never re-subscribe per second.
    useEffect(() => {
        const timer = setInterval(() => {
            secondsViewed.current += 1
        }, 1000)

        return () => {
            clearInterval(timer)
            if (secondsViewed.current > 2) {
                api.get(`/r/${locationId || 'unknown'}/track/${offer.id}/engagement?duration=${secondsViewed.current}`).catch(() => { })
            }
        }
    }, [offer.id, locationId])

    // Ghost Lead Profiling: a stable, deterministic count (no Math.random during
// render) so it does not flicker on every re-render.
const lookingNow = 2 + (offer.businessName.length % 4)

    const handleIntent = (type: 'directions' | 'call_click') => {
        api.get(`/r/${locationId || 'unknown'}/track/${offer.id}/${type}`).catch(() => { })

        if (type === 'directions') {
            const query = offer.googleMapsLocation || offer.businessName;
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank')
        }
    }

    return (
        <div className="sf-offer-card">
            <div className="sf-offer-image-wrapper">
                {offer.mediaType === 'video' ? (
                    <video
                        src={offer.videoUrl}
                        className="sf-offer-image"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <img
                        src={offer.imageUrl}
                        alt={offer.headline}
                        className="sf-offer-image"
                        loading="eager"
                    />
                )}
                {offer.isPremium && (
                    <div className="sf-premium-badge">⭐ Featured</div>
                )}
            </div>

            <div className="sf-offer-content">
                <div className="sf-business-meta">
                    <div className="sf-business-name">{offer.businessName}</div>
                    {/* Ghost Lead Profiling: Show how long they've been looking */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div className="sf-live-indicator">
                            <span className="sf-dot"></span> {lookingNow} Looking Now
                        </div>
                    </div>
                </div>

                <h1 className="sf-offer-headline">{offer.headline}</h1>
                <p className="sf-offer-description">{offer.description}</p>

                {/* --- Intent Trigger Grid (STEP 2) --- */}
                <div className="sf-intent-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="sf-intent-btn" onClick={() => handleIntent('directions')} style={{ width: '100%', maxWidth: '280px', justifyContent: 'center', background: '#f8fafc' }}>
                        <span className="sf-intent-icon">📍</span>
                        <span style={{ fontWeight: 800 }}>Getting Here</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

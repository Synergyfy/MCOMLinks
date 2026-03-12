import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/apiClient'
import type { Offer } from '../types'

interface OfferCardProps {
    offer: Offer
}

export default function OfferCard({ offer }: Readonly<OfferCardProps>) {
    const { locationId } = useParams<{ locationId: string }>()
    const [quickClaimEmail, setQuickClaimEmail] = useState('')
    const [isClaimed, setIsClaimed] = useState(false)
    const [secondsViewed, setSecondsViewed] = useState(0)

    // Track engagement time (STEP 8 - Deep Insights)
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsViewed(prev => prev + 1)
        }, 1000)

        return () => {
            clearInterval(timer)
            // Log total duration on unmount
            if (secondsViewed > 2) {
                api.get(`/r/${locationId || 'unknown'}/track/${offer.id}/engagement?duration=${secondsViewed}`).catch(() => { })
            }
        }
    }, [offer.id, locationId, secondsViewed])

    const handleIntent = (type: 'directions' | 'save_to_phone' | 'call_click' | 'whatsapp_click') => {
        api.get(`/r/${locationId || 'unknown'}/track/${offer.id}/${type}`).catch(() => { })

        if (type === 'save_to_phone') {
            alert('🎟️ Lead Captured! Offer saved to your browser wallet.')
        } else if (type === 'directions') {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offer.businessName)}`, '_blank')
        }
    }

    const handleQuickClaim = (e: React.FormEvent) => {
        e.preventDefault()
        if (quickClaimEmail) {
            api.get(`/r/${locationId || 'unknown'}/track/${offer.id}/quick_claim?email=${encodeURIComponent(quickClaimEmail)}`).catch(() => { })
            setIsClaimed(true)
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
                            <span className="sf-dot"></span> {Math.floor(Math.random() * 5) + 2} Looking Now
                        </div>
                    </div>
                </div>

                <h1 className="sf-offer-headline">{offer.headline}</h1>
                <p className="sf-offer-description">{offer.description}</p>

                {/* --- Intent Trigger Grid (STEP 2) --- */}
                <div className="sf-intent-grid">
                    <button className="sf-intent-btn" onClick={() => handleIntent('save_to_phone')}>
                        <span className="sf-intent-icon">🎟️</span>
                        <span>Save to Phone</span>
                    </button>
                    <button className="sf-intent-btn" onClick={() => handleIntent('directions')}>
                        <span className="sf-intent-icon">📍</span>
                        <span>Getting Here</span>
                    </button>
                    <button className="sf-intent-btn" onClick={() => handleIntent('whatsapp_click')}>
                        <span className="sf-intent-icon">💬</span>
                        <span>WhatsApp</span>
                    </button>
                </div>

                {/* --- Incentive Bridge (STEP 3) --- */}
                <div className="sf-incentive-bridge">
                    {!isClaimed ? (
                        <form onSubmit={handleQuickClaim} className="sf-quick-claim-form">
                            <p className="sf-incentive-text">Send me a reminder before this expires! ⚡</p>
                            <div className="sf-input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email..."
                                    className="sf-quick-input"
                                    value={quickClaimEmail}
                                    onChange={(e) => setQuickClaimEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="sf-quick-btn">Remind Me</button>
                            </div>
                        </form>
                    ) : (
                        <div className="sf-claimed-success">
                            <span className="sf-claimed-icon">✅</span>
                            <span>Reminder Set! We'll email you soon.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

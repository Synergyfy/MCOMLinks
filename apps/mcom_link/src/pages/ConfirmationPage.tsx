// ConfirmationPage — PRD STEP 7 (Confirmation Screen)
// Shown after successful form submission
// Includes: Success message, what happens next, optional secondary offer suggestion

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api/apiClient'
import type { Offer } from '../types'
import StorefrontFooter from '../components/StorefrontFooter'
import LoadingScreen from './LoadingScreen'

export default function ConfirmationPage() {
    const { offerId } = useParams<{ offerId: string }>()
    const [searchParams] = useSearchParams()
    const locationId = searchParams.get('location') || ''

    const [offer, setOffer] = useState<Offer | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!offerId) return
        const fetchOffer = async () => {
            try {
                const data = await api.get<any>(`/r/offer/${offerId}`)
                if (data) {
                    setOffer({
                        ...data,
                        performance: {
                            scans: data.scans || 0,
                            claims: data.claims || 0
                        },
                        redirectUrl: data.leadDestination,
                        mediaType: data.mediaType || 'image',
                        isActive: data.status === 'approved',
                    })
                }
            } catch (e) {
                console.error('Failed to fetch offer:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchOffer()
    }, [offerId])

    if (loading) return <LoadingScreen />

    return (
        <div className="sf-container">
            <div className="sf-wrapper">
                <header className="sf-header">
                    <div className="sf-header-inner">
                        <div className="sf-logo">
                            MCOM<span>.LINKS</span>
                        </div>
                    </div>
                </header>

                <main className="sf-main">
                    {/* Success Animation */}
                    <div className="sf-confirmation-card">
                        <div className="sf-success-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>

                        <h1 className="sf-confirmation-title">Offer Claimed Successfully!</h1>

                        {offer && (
                            <div className="sf-confirmation-offer">
                                <div className="sf-business-name">{offer.businessName}</div>
                                <p className="sf-confirmation-headline">{offer.headline}</p>
                            </div>
                        )}

                        <div className="sf-what-next">
                            <h3>What happens next?</h3>
                            <ul className="sf-next-steps">
                                <li>
                                    <span className="sf-step-number">1</span>
                                    <span>You'll receive a confirmation at your email</span>
                                </li>
                                <li>
                                    <span className="sf-step-number">2</span>
                                    <span>Visit the store and mention your claim</span>
                                </li>
                                <li>
                                    <span className="sf-step-number">3</span>
                                    <span>Enjoy your exclusive offer!</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Secondary offer suggestion (PRD STEP 7) */}
                    <div className="sf-secondary-suggestion">
                        <p>Want more deals?</p>
                        {locationId && (
                            <a href={`/r/${locationId}`} className="sf-cta-button sf-secondary-cta" id="scan-again-btn">
                                <span className="sf-cta-label">Scan Again for More Offers</span>
                                <span className="sf-cta-arrow">→</span>
                            </a>
                        )}
                    </div>
                </main>

                <StorefrontFooter />
            </div>
        </div>
    )
}

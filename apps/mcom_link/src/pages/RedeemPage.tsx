// RedeemPage — PRD STEP 6B
// Instant Redeem Screen: Shows redemption code + instructions
// No form needed — just display code and track redemption

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import type { Offer } from '../types'
import StorefrontFooter from '../components/StorefrontFooter'
import FallbackPage from './FallbackPage'
import LoadingScreen from './LoadingScreen'

export default function RedeemPage() {
    const { offerId } = useParams<{ offerId: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
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

                    // Log redemption event (STEP 8)
                    api.get(`/r/${locationId || 'unknown'}/track/${offerId}/redemption`).catch(() => { })
                }
            } catch (e) {
                console.error('Failed to fetch offer:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchOffer()
    }, [offerId, locationId])

    if (loading) return <LoadingScreen />

    if (!offer) {
        return <FallbackPage />
    }

    const handleCopyCode = () => {
        if (offer.redemptionCode) {
            navigator.clipboard.writeText(offer.redemptionCode)
        }
    }

    return (
        <div className="sf-container">
            <div className="sf-wrapper">
                <header className="sf-header">
                    <div className="sf-header-inner">
                        <div className="sf-logo">
                            MCOM<span>.LINKS</span>
                        </div>
                        <button className="sf-back-btn" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                    </div>
                </header>

                <main className="sf-main">
                    {/* Offer Summary */}
                    <div className="sf-claim-offer-summary">
                        <div className="sf-business-name">{offer.businessName}</div>
                        <h2 className="sf-claim-headline">{offer.headline}</h2>
                    </div>

                    {/* Redemption Code Card */}
                    <div className="sf-redeem-card">
                        <div className="sf-redeem-icon">🎁</div>
                        <h3 className="sf-redeem-title">Your Redemption Code</h3>

                        <div className="sf-redeem-code-wrapper">
                            <code className="sf-redeem-code" id="redemption-code">
                                {offer.redemptionCode}
                            </code>
                            <button
                                className="sf-copy-btn"
                                onClick={handleCopyCode}
                                title="Copy to clipboard"
                                id="copy-code-btn"
                            >
                                📋
                            </button>
                        </div>

                        {offer.redemptionInstructions && (
                            <div className="sf-redeem-instructions">
                                <h4>How to redeem:</h4>
                                <p>{offer.redemptionInstructions}</p>
                            </div>
                        )}
                    </div>

                    {/* Secondary suggestion (STEP 7: Optional secondary offer suggestion) */}
                    <div className="sf-secondary-suggestion">
                        <p>Enjoyed this deal? Scan again for more offers from your local high street!</p>
                    </div>
                </main>

                <StorefrontFooter />
            </div>
        </div>
    )
}

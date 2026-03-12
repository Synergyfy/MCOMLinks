// FallbackPage — PRD STEP 11
// Branded fallback: shown when no active offers exist, location is invalid,
// or any error occurs. NEVER shows 404, blank, or technical errors.

import type { Offer } from '../types'
import { fallbackOffer } from '../constants/fallbackOffer'
import StorefrontFooter from '../components/StorefrontFooter'

interface FallbackPageProps {
    offer?: Offer | null
}

export default function FallbackPage({ offer }: FallbackPageProps) {
    const displayOffer = offer || fallbackOffer

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
                    <div className="sf-offer-card sf-fallback-card">
                        <div className="sf-offer-image-wrapper">
                            <img
                                src={displayOffer.imageUrl}
                                alt={displayOffer.headline}
                                className="sf-offer-image"
                                loading="eager"
                            />
                        </div>
                        <div className="sf-offer-content">
                            <div className="sf-business-name">{displayOffer.businessName}</div>
                            <h1 className="sf-offer-headline">{displayOffer.headline}</h1>
                            <p className="sf-offer-description">{displayOffer.description}</p>
                        </div>
                    </div>

                    <div className="sf-cta-section">
                        <a href="/" className="sf-cta-button" id="cta-fallback">
                            <span className="sf-cta-label">{displayOffer.ctaLabel}</span>
                            <span className="sf-cta-arrow">→</span>
                        </a>
                    </div>

                    <div className="sf-trust">
                        <div className="sf-trust-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>Powered by <strong>MCOMLINKS</strong></span>
                        </div>
                        <p className="sf-trust-message">Check back soon for exciting local offers</p>
                    </div>
                </main>

                <StorefrontFooter />
            </div>
        </div>
    )
}

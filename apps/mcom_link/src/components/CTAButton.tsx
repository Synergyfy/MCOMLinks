// CTAButton — PRD STEP 3.3 & STEP 6
// Dynamic CTA based on offer type: Claim / Redeem / Redirect
// Logs click event before navigating

import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../mock/tracker'
import type { Offer } from '../mock/offers'

interface CTAButtonProps {
    offer: Offer
    locationId: string
}

export default function CTAButton({ offer, locationId }: CTAButtonProps) {
    const navigate = useNavigate()

    const handleClick = () => {
        // Log CTA click (STEP 8)
        trackEvent('cta_click', locationId, offer.id, { ctaType: offer.ctaType })

        switch (offer.ctaType) {
            case 'claim':
                navigate(`/claim/${offer.id}?location=${locationId}`)
                break
            case 'redeem':
                navigate(`/redeem/${offer.id}?location=${locationId}`)
                break
            case 'redirect':
                // Log redirect event before opening (STEP 6C)
                trackEvent('redirect', locationId, offer.id, { url: offer.redirectUrl || '' })
                window.open(offer.redirectUrl || '/', '_blank', 'noopener,noreferrer')
                break
        }
    }

    return (
        <button className="sf-cta-button" onClick={handleClick} id={`cta-${offer.id}`}>
            <span className="sf-cta-label">{offer.ctaLabel}</span>
            <span className="sf-cta-arrow">→</span>
        </button>
    )
}

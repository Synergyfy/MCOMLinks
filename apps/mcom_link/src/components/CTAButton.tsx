// CTAButton — PRD STEP 3.3 & STEP 6
// Dynamic CTA based on offer type: Claim / Redeem / Redirect
// Logs click event before navigating

import { useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import type { Offer } from '../mock/offers'

interface CTAButtonProps {
    offer: Offer
    locationId: string
}

export default function CTAButton({ offer, locationId }: CTAButtonProps) {
    const navigate = useNavigate()

    const handleClick = async () => {
        // Log CTA click (STEP 8)
        try {
            await api.get(`/r/${locationId}/track/${offer.id}/click`)
        } catch (e) {
            console.error('Failed to track click:', e)
        }

        switch (offer.ctaType) {
            case 'claim':
                navigate(`/claim/${offer.id}?location=${locationId}`)
                break
            case 'redeem':
                navigate(`/redeem/${offer.id}?location=${locationId}`)
                break
            case 'redirect':
                // Log redirect event before opening (STEP 6C)
                try {
                    await api.get(`/r/${locationId}/track/${offer.id}/redirect`)
                } catch (e) {
                    console.error('Failed to track redirect:', e)
                }
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

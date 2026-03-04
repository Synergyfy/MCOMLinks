// OfferCard — PRD STEP 3.2 (Main Offer Block)
// Displays: Business name, headline, description, offer image

import type { Offer } from '../mock/offers'

interface OfferCardProps {
    offer: Offer
}

export default function OfferCard({ offer }: OfferCardProps) {
    return (
        <div className="sf-offer-card">
            <div className="sf-offer-image-wrapper">
                <img
                    src={offer.imageUrl}
                    alt={offer.headline}
                    className="sf-offer-image"
                    loading="eager"
                />
                {offer.isPremium && (
                    <div className="sf-premium-badge">⭐ Featured</div>
                )}
            </div>
            <div className="sf-offer-content">
                <div className="sf-business-name">{offer.businessName}</div>
                <h1 className="sf-offer-headline">{offer.headline}</h1>
                <p className="sf-offer-description">{offer.description}</p>
            </div>
        </div>
    )
}

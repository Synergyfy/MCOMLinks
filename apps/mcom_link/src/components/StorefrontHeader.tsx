// StorefrontHeader — PRD STEP 3.1
// Brand logo (small) + Location/Campaign name

interface StorefrontHeaderProps {
    locationName: string
    campaignName: string
}

export default function StorefrontHeader({ locationName, campaignName }: StorefrontHeaderProps) {
    return (
        <header className="sf-header">
            <div className="sf-header-inner">
                <div className="sf-logo">
                    MCOM<span>.LINKS</span>
                </div>
                <div className="sf-location">
                    <span className="sf-location-icon">📍</span>
                    <div>
                        <div className="sf-location-name">{locationName}</div>
                        <div className="sf-campaign-name">{campaignName}</div>
                    </div>
                </div>
            </div>
        </header>
    )
}

// StorefrontHeader — PRD STEP 3.1
// Brand logo (small) + Location/Campaign name

interface StorefrontHeaderProps {
    locationName: string
    campaignName: string
    exposureType?: string
}

export default function StorefrontHeader({ locationName, campaignName, exposureType }: StorefrontHeaderProps) {
    return (
        <header className="sf-header">
            <div className="sf-header-inner">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div className="sf-logo" style={{ fontSize: '1.2rem' }}>
                        MCOMQ<span>.LINKS</span>
                    </div>
                    {exposureType && (
                        <div className={`sf-exposure-badge ${exposureType}`} style={{ position: 'relative', top: 0, left: 0, fontSize: '0.55rem', padding: '0.2rem 0.5rem', width: 'fit-content' }}>
                            {exposureType === 'hyperlocal' ? '📍 Local Offer' : 
                             exposureType === 'nearby' ? '🚀 Nearby' : '🌐 National'}
                        </div>
                    )}
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

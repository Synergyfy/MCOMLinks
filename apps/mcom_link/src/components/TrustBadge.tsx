// TrustBadge — PRD STEP 3.4 (Trust Section)
// "Powered by MCOMQLINKS" + credibility message

export default function TrustBadge() {
    return (
        <div className="sf-trust">
            <div className="sf-trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Powered by <strong>MCOMQLINKS</strong></span>
            </div>
            <p className="sf-trust-message">Verified local business offer • Safe & secure</p>
        </div>
    )
}

// LoadingScreen — PRD STEP 2
// Branded loading splash shown while the engine fetches the next offer
// Prevents blank screens, displays: Logo + "Loading your local offer..."

export default function LoadingScreen() {
    return (
        <div className="sf-loading">
            <div className="sf-loading-content">
                <div className="sf-loading-logo">
                    MCOM<span>.LINKS</span>
                </div>
                <div className="sf-loading-spinner">
                    <div className="sf-spinner-ring"></div>
                </div>
                <p className="sf-loading-message">Loading your local offer...</p>
                <p className="sf-loading-sub">Finding the best deal for you</p>
            </div>
        </div>
    )
}

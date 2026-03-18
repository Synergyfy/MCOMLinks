// StorefrontFooter — PRD STEP 3.5
// Terms link + Privacy link

export default function StorefrontFooter() {
    return (
        <footer className="sf-footer">
            <div className="sf-footer-links">
                <a href="/terms" className="sf-footer-link">Terms & Conditions</a>
                <span className="sf-footer-divider">•</span>
                <a href="/privacy" className="sf-footer-link">Privacy Policy</a>
            </div>
            <div className="sf-footer-copyright">
                © 2026 MCOMQLINKS. All rights reserved.
            </div>
        </footer>
    )
}

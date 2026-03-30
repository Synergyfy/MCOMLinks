import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getHomeSettings } from './mock/homeStore'
import './App.css'
import rotatorImg from './assets/rotator.png'
import { mockAdData } from './mock/ads' // Import centralized ad data
import PromoBanner from './components/PromoBanner'

// Refined SVG Icons
const RefreshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
)
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
)
const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
)
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
)
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
)
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
)
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)

function App() {
  const [activeTab, setActiveTab] = useState('Home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentAdPage, setCurrentAdPage] = useState(0)

  const settings = useMemo(() => getHomeSettings(), []);

  const features = useMemo(() => settings.featuresList.map((f, i) => ({
    ...f,
    icon: [
      <RefreshIcon key="0" />, 
      <CalendarIcon key="1" />, 
      <ShieldIcon key="2" />, 
      <BarChartIcon key="3" />
    ][i % 4]
  })), [settings]);

  const approvedAds = mockAdData.filter(ad => ad.status === 'approved');
  const adsPerPage = 3;
  const totalAdPages = Math.ceil(approvedAds.length / adsPerPage);

  useEffect(() => {
    if (totalAdPages > 1) {
      const adInterval = setInterval(() => {
        setCurrentAdPage((prevPage) => (prevPage + 1) % totalAdPages);
      }, 5000); // Rotate every 5 seconds

      return () => clearInterval(adInterval);
    }
  }, [totalAdPages]);


  const partners = settings.marqueeItems;

  const visibleAds = approvedAds.slice(currentAdPage * adsPerPage, (currentAdPage * adsPerPage) + adsPerPage);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Premium Navbar */}
        <nav className={`navbar ${isMenuOpen ? 'menu-active' : ''}`} id="navbar">
          <div className="logo">
            {settings.navLogoMain}<span>{settings.navLogoAccent}</span>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {['Home', 'Platform', 'Solutions', 'Pricing', 'About'].map((tab) => (
              tab === 'Pricing' ? (
                <Link
                  key={tab}
                  to="/pricing"
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMenuOpen(false);
                  }}
                >
                  {tab}
                </Link>
              ) : (
                <a
                  key={tab}
                  href={`#${tab.toLowerCase()}`}
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMenuOpen(false);
                  }}
                >
                  {tab}
                </a>
              )
            ))}
            <div className="mobile-auth">
              <Link to="/login" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>{settings.navSignInText}</Link>
              <Link to={settings.navGetStartedLink} className="btn-premium" onClick={() => setIsMenuOpen(false)}>{settings.navGetStartedText}</Link>
            </div>
          </div>

          <div className="desktop-auth">
            <Link to="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>{settings.navSignInText}</Link>
            <Link to={settings.navGetStartedLink} className="btn-premium" style={{ textDecoration: 'none' }}>
              {settings.navGetStartedText} <ArrowRight />
            </Link>
          </div>

          <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {/* Hero Section */}
        <main className="hero" id="home">
          <section className="hero-left">
            <div className="badge">{settings.heroBadge}</div>
            <h1 className="main-headline">
              {settings.heroTitle.includes(settings.heroTitleGradient) ? (
                <>
                  {settings.heroTitle.split(settings.heroTitleGradient)[0]}
                  <span className="gradient-text">{settings.heroTitleGradient}</span>
                  {settings.heroTitle.split(settings.heroTitleGradient)[1]}
                </>
              ) : settings.heroTitle}
            </h1>
            <p className="hero-description">
              {settings.heroDesc}
            </p>
            <div className="hero-ctas">
              <Link to={settings.heroPrimaryLink} className="btn-premium" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', textDecoration: 'none' }}>
                {settings.heroPrimaryCTA} <ArrowRight />
              </Link>
              <button className="btn-ghost" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                <PlayIcon /> {settings.heroSecondaryCTA}
              </button>
            </div>
          </section>

          <section className="hero-visual">
            <div className="visual-container">
              <img src={rotatorImg} alt="MCOMQLINKS Rotator System" className="main-image" />
            </div>
          </section>
        </main>

        <PromoBanner />

        {/* Partners Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="marquee-item">{p}</div>
            ))}
          </div>
        </div>

        {/* Ad Section */}
        <section className="ad-section">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="main-headline" style={{ fontSize: '3rem' }}>Today's <span className="gradient-text">Highlights</span></h2>
            <p className="hero-description" style={{ margin: '0 auto', maxWidth: '620px' }}>
              Featured promotions from businesses on your high street, approved by our admin team.
            </p>
          </div>
          <div className="ad-grid">
            {visibleAds.map((ad, i) => (
              <div className="ad-card" key={`${currentAdPage}-${i}`}>
                <div className="ad-image-placeholder">
                  <span className="ad-image-emoji">{ad.imgPlaceholder}</span>
                </div>
                <div className="ad-content">
                  <span className="ad-category">{ad.category}</span>
                  <h3 className="ad-title">{ad.title}</h3>
                  <p className="ad-business">{ad.business}</p>
                  <button className="ad-cta">View Offer</button>
                </div>
              </div>
            ))}
          </div>
          {totalAdPages > 1 && (
            <div className="ad-pagination">
              {Array.from({ length: totalAdPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`ad-dot ${currentAdPage === idx ? 'active' : ''}`}
                  onClick={() => setCurrentAdPage(idx)}
                />
              ))}
            </div>
          )}
        </section>


        {/* Features Section */}
        <section className="features-section" id="platform">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge">{settings.featuresBadge}</div>
            <h2 className="main-headline" style={{ fontSize: '3rem' }}>
              {settings.featuresTitle.includes(settings.featuresTitleGradient) ? (
                <>
                  {settings.featuresTitle.split(settings.featuresTitleGradient)[0]}
                  <span className="gradient-text">{settings.featuresTitleGradient}</span>
                  {settings.featuresTitle.split(settings.featuresTitleGradient)[1]}
                </>
              ) : settings.featuresTitle}
            </h2>
            <p className="hero-description" style={{ margin: '0 auto', maxWidth: '620px' }}>
              {settings.featuresDesc}
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="icon-box">{f.icon}</div>
                <h3>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works - Glass Panel */}
        <section className="how-it-works" id="solutions" style={{ marginTop: '10rem', marginBottom: '10rem' }}>
          <div className="glass-panel">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                <div className="badge">{settings.howItWorksBadge}</div>
                <h2 className="main-headline" style={{ fontSize: '2.5rem' }}>
                  {settings.howItWorksTitle.includes(settings.howItWorksTitleGradient) ? (
                    <>
                      {settings.howItWorksTitle.split(settings.howItWorksTitleGradient)[0]}
                      <span className="gradient-text">{settings.howItWorksTitleGradient}</span>
                      {settings.howItWorksTitle.split(settings.howItWorksTitleGradient)[1]}
                    </>
                  ) : settings.howItWorksTitle}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', marginTop: '2.5rem' }}>
                  {settings.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900,
                        fontSize: '1.4rem',
                        lineHeight: '1.6'
                      }}>{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{step.title}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  fontSize: '6rem',
                  opacity: 0.04,
                  fontWeight: 900,
                  position: 'absolute',
                  right: '5%',
                  top: '5%',
                  color: 'var(--primary)',
                  letterSpacing: '-0.05em'
                }}>McomQlinks</div>
                <div className="stat-item" style={{ marginBottom: '2rem' }}>
                  <span className="stat-value">{settings.howItWorksStatValue}</span>
                  <span className="stat-label">{settings.howItWorksStatLabel}</span>
                </div>
                <button className="btn-premium" style={{ padding: '0.85rem 2rem' }}>
                  {settings.howItWorksCTA} <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta" style={{ textAlign: 'center', padding: '6rem 0 8rem' }}>
          <div className="badge" style={{ margin: '0 auto 2rem' }}>{settings.finalBadge}</div>
          <h2 className="main-headline">
            {settings.finalTitle.includes(settings.finalTitleGradient) ? (
              <>
                {settings.finalTitle.split(settings.finalTitleGradient)[0]}
                <span className="gradient-text">{settings.finalTitleGradient}</span>
                {settings.finalTitle.split(settings.finalTitleGradient)[1]}
              </>
            ) : settings.finalTitle}
          </h2>
          <p className="hero-description" style={{ margin: '0 auto 3rem', maxWidth: '560px' }}>
            {settings.finalDesc}
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to={settings.finalLink} className="btn-premium" style={{ padding: '1.1rem 3rem', fontSize: '1.05rem', textDecoration: 'none' }}>
              {settings.finalCTA} <ArrowRight />
            </Link>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="logo">{settings.navLogoMain}<span>{settings.navLogoAccent}</span></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', maxWidth: '300px', lineHeight: '1.7', fontSize: '0.9rem' }}>
                {settings.footerDesc}
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  {settings.footerPlatformDesc}
                </p>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" className="nav-link">About Us</a>
                <a href="#" className="nav-link">Contact</a>
                <a href="#" className="nav-link">Privacy</a>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Social</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" className="nav-link">Twitter</a>
                <a href="#" className="nav-link">LinkedIn</a>
                <a href="#" className="nav-link">GitHub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            {settings.footerCopyright}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

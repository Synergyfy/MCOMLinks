import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import rotatorImg from './assets/rotator.png'

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

  const features = [
    {
      title: "Sequential Rotation",
      desc: "Never show the same offer twice. Our engine ensures every scan delivers the next fresh deal in the sequence.",
      icon: <RefreshIcon />
    },
    {
      title: "Seasonal Automation",
      desc: "Set your date and relax. The system automatically switches between Winter, Spring, and Summer campaigns.",
      icon: <CalendarIcon />
    },
    {
      title: "Centralized Control",
      desc: "Manage an entire high street from one dashboard. Update templates and rules globally in seconds.",
      icon: <ShieldIcon />
    },
    {
      title: "Gold Dust Analytics",
      desc: "Track every scan, click, and claim. Turn engagement data into actionable growth for local commerce.",
      icon: <BarChartIcon />
    }
  ]

  const stats = [
    { value: "2.4M+", label: "Daily Engagements" },
    { value: "48K", label: "Active Nodes" },
    { value: "18.4%", label: "Conversion Rate" },
    { value: "12s", label: "Response Time" }
  ]

  const partners = ["FORBES", "TECHCRUNCH", "WIRED", "BLOOMBERG", "THE VERGE", "WALL STREET JOURNAL"]

  const steps = [
    { n: "01", t: "Customer Scans QR", d: "Instantly triggers the sequential engine via physical NFC or QR scan at the storefront." },
    { n: "02", t: "Engine Rotates Logic", d: "Fetches the next valid offer in the queue based on campaign and seasonal rules." },
    { n: "03", t: "Automated Result", d: "Fresh deal delivered to customer while you collect engagement data in real-time." }
  ]

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Premium Navbar */}
        <nav className={`navbar ${isMenuOpen ? 'menu-active' : ''}`} id="navbar">
          <div className="logo">
            MCOM<span>.LINKS</span>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {['Home', 'Platform', 'Solutions', 'Pricing', 'About'].map((tab) => (
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
            ))}
            <div className="mobile-auth">
              <Link to="/login" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="btn-premium" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
            </div>
          </div>

          <div className="desktop-auth">
            <Link to="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>Sign In</Link>
            <Link to="/signup" className="btn-premium" style={{ textDecoration: 'none' }}>
              Get Started <ArrowRight />
            </Link>
          </div>

          <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {/* Hero Section */}
        <main className="hero" id="home">
          <section className="hero-left">
            <div className="badge">✦ The High Street Reimagined</div>
            <h1 className="main-headline">
              Digital <span className="gradient-text">Billboard</span> <br />Engine
            </h1>
            <p className="hero-description">
              A "set-and-forget" marketing machine that helps local businesses grow through
              automated, sequential offer rotation and real-time engagement analytics.
            </p>
            <div className="hero-ctas">
              <Link to="/signup" className="btn-premium" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', textDecoration: 'none' }}>
                Launch Your Rotator <ArrowRight />
              </Link>
              <button className="btn-ghost" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                <PlayIcon /> Watch Demo
              </button>
            </div>
          </section>

          <section className="hero-visual">
            <div className="visual-container">
              <img src={rotatorImg} alt="MCOMLINKS Rotator System" className="main-image" />
            </div>
          </section>
        </main>

        {/* Partners Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="marquee-item">{p}</div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <section className="stats-bar">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="features-section" id="platform">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge">✦ Core Capabilities</div>
            <h2 className="main-headline" style={{ fontSize: '3rem' }}>Built Like a <span className="gradient-text">Machine</span></h2>
            <p className="hero-description" style={{ margin: '0 auto', maxWidth: '620px' }}>
              MCOMLINKS is a sequential delivery engine designed to maximize engagement and remove manual friction from local commerce.
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
                <div className="badge">✦ The Process</div>
                <h2 className="main-headline" style={{ fontSize: '2.5rem' }}>From Scan to <span className="gradient-text">Growth</span></h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', marginTop: '2.5rem' }}>
                  {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900,
                        fontSize: '1.4rem',
                        lineHeight: '1.6'
                      }}>{step.n}</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{step.t}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>{step.d}</p>
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
                }}>MCOM</div>
                <div className="stat-item" style={{ marginBottom: '2rem' }}>
                  <span className="stat-value">99.9%</span>
                  <span className="stat-label">Uptime Reliability</span>
                </div>
                <button className="btn-premium" style={{ padding: '0.85rem 2rem' }}>
                  Explore Architecture <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta" style={{ textAlign: 'center', padding: '6rem 0 8rem' }}>
          <div className="badge" style={{ margin: '0 auto 2rem' }}>✦ Ready?</div>
          <h2 className="main-headline">Ready to transform your <br /><span className="gradient-text">High Street?</span></h2>
          <p className="hero-description" style={{ margin: '0 auto 3rem', maxWidth: '560px' }}>
            Join the thousands of businesses already using MCOMLINKS to automate their marketing machine.
          </p>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to="/signup" className="btn-premium" style={{ padding: '1.1rem 3rem', fontSize: '1.05rem', textDecoration: 'none' }}>
              Start Your Journey <ArrowRight />
            </Link>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="logo">MCOM<span>.LINKS</span></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', maxWidth: '300px', lineHeight: '1.7', fontSize: '0.9rem' }}>
                Revitalizing local commerce through automated digital billboard technology and sequential delivery.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" className="nav-link">The Rotator</a>
                <a href="#" className="nav-link">For Businesses</a>
                <Link to="/agent" className="nav-link">For Agents</Link>
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
            &copy; 2026 MCOMLINKS. All rights reserved. Built for the future of commerce.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

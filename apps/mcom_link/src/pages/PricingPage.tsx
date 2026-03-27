import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import '../styles/pricing.css';

// Reusable Icons (copied from App.tsx or similar)
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" height="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pricing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const plans = [
    {
      name: "BASIC",
      type: "90-Day Access",
      price: "£90",
      period: "/ 90 days",
      tagline: "Start showing your business on MCOMQLinks",
      color: "#22c55e", // Green
      included: [
        "Claim and activate your Storefront listing",
        "Get your QR Brand ID",
        "Run MCOMQLinks campaigns",
        "Appear on external storefront campaigns",
        "Appear on internal campaigns",
        "Participate in National campaigns",
        "Participate in Hyper local campaigns",
        "Use QR on VCards, posters, and campaign materials"
      ],
      limitations: [
        "No promotion of third-party products/services",
        "No automatic renewal (expires after 90 days)",
        "No Expo access",
        "Standard visibility only"
      ],
      bestFor: "Businesses just getting started, testing the platform, local storefront presence"
    },
    {
      name: "PRO",
      type: "Growth Mode",
      price: "£450",
      period: "/ 90 days",
      tagline: "Grow beyond your storefront and scale your campaigns",
      color: "#2563eb", // Blue
      included: [
        "Everything in BASIC",
        "Promote third-party products & services",
        "Run Nearby campaigns",
        "Auto 90-day rollover into next season",
        "Access to future seasonal campaigns",
        "Access to evergreen campaign cycles",
        "Greater campaign flexibility",
        "Increased exposure across network"
      ],
      advantage: "Your campaigns continue automatically beyond 90 days",
      bestFor: "Businesses ready to scale, multi-product/service sellers, partner/collaboration businesses"
    },
    {
      name: "PRO+",
      type: "Full Visibility & Expo Access",
      price: "£1100",
      period: "/ 90 days",
      tagline: "Maximum exposure, priority access, and event promotion",
      color: "#8b5cf6", // Purple
      popular: true,
      included: [
        "Everything in PRO",
        "Full access to End-of-Season Marketing Expo",
        "Participate as seller or promoter",
        "Priority visibility in campaigns",
        "Higher placement in National campaigns",
        "Higher placement in Hyper local campaigns",
        "Premium positioning across MCOMQLinks",
        "Stronger brand exposure"
      ],
      advantage: "You are actively promoted and highlighted across the network",
      bestFor: "Serious businesses, brands launching products/services, businesses that want maximum visibility"
    }
  ];

  return (
    <div className="app-container pricing-page">
      <div className="content-wrapper">
        {/* Navbar */}
        <nav className={`navbar ${isMenuOpen ? 'menu-active' : ''}`} id="navbar">
          <div className="logo" onClick={() => window.location.href = '/'}>
            MCOMQ<span>.LINKS</span>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {['Home', 'Platform', 'Solutions', 'Pricing', 'About'].map((tab) => (
              tab === 'Home' ? (
                <Link key={tab} to="/" className="nav-link">Home</Link>
              ) : (
                <a
                    key={tab}
                    href={tab === 'Pricing' ? '#pricing' : `/#${tab.toLowerCase()}`}
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

        {/* Header */}
        <header className="pricing-header">
            <div className="badge">✦ MCOMQLinks Pricing</div>
            <h1 className="main-headline">Flexible Plans for <br /><span className="gradient-text">High Street Growth</span></h1>
            <p className="hero-description" style={{ margin: '0 auto 4rem' }}>
                Simple, transparent pricing to help your business thrive in the digital age. All plans run on a 90-day seasonal cycle.
            </p>
        </header>

        {/* Plans Grid */}
        <section id="pricing" className="plans-grid">
            {plans.map((plan, idx) => (
                <div key={idx} className={`pricing-card ${plan.popular ? 'popular' : ''}`} style={{ '--plan-color': plan.color } as any}>
                    {plan.popular && <div className="popular-badge">Highly Recommended</div>}
                    <div className="card-header">
                        <span className="plan-name">{plan.name}</span>
                        <span className="plan-type">{plan.type}</span>
                        <div className="plan-price">
                            <span className="amount">{plan.price}</span>
                            <span className="period">{plan.period}</span>
                        </div>
                        <p className="plan-tagline">{plan.tagline}</p>
                    </div>

                    <div className="card-features">
                        <h4>What’s Included</h4>
                        <ul>
                            {plan.included.map((item, i) => (
                                <li key={i}><CheckIcon /> {item}</li>
                            ))}
                        </ul>
                    </div>

                    {plan.limitations && (
                        <div className="card-limitations">
                            <h4>Limitations</h4>
                            <ul>
                                {plan.limitations.map((item, i) => (
                                    <li key={i} className="limited"><XIcon /> {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {plan.advantage && (
                        <div className="card-advantage">
                            <strong>Key Advantage:</strong> {plan.advantage}
                        </div>
                    )}

                    <div className="card-bestfor">
                        <strong>Best For:</strong> {plan.bestFor}
                    </div>

                    <div className="card-footer">
                        <Link to="/signup" className="btn-premium full-width">
                            Start {plan.name} Plan <ArrowRight />
                        </Link>
                    </div>
                </div>
            ))}
        </section>

        {/* Seasonal System Section */}
        <section className="info-section">
            <div className="glass-panel">
                <div className="info-grid">
                    <div>
                        <h2 className="section-title"><span className="gradient-text">🔁 90-Day Seasonal</span> Campaign System</h2>
                        <ul className="info-list">
                            <li>All plans run on a 90-day cycle</li>
                            <li>Your business stays active only during this period</li>
                            <li><strong>BASIC:</strong> Expires after 90 days</li>
                            <li><strong>PRO & PRO+:</strong> Continues automatically with rollover benefits</li>
                        </ul>
                    </div>
                    <div className="campaign-access">
                        <h2 className="section-title">📍 Campaign Access</h2>
                        <div className="access-item">
                            <h4>National Campaigns</h4>
                            <p>Managed by 247 GBS. Appear on high street storefronts, posters, windows, and billboards.</p>
                        </div>
                        <div className="access-item">
                            <h4>Hyper Local Campaigns</h4>
                            <p>Target customers near your business. Run outside on the street and inside your store.</p>
                        </div>
                        <div className="access-item">
                            <h4>Nearby Campaigns <span className="pro-only">(Pro & Pro+ Only)</span></h4>
                            <p>Expand beyond your location and reach new customers in other areas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Recognisable Section */}
        <section className="brand-trust">
            <h2 className="main-headline" style={{ fontSize: '2.5rem', textAlign: 'center' }}>
                Recognisable. Trusted. <span className="gradient-text">Everywhere.</span>
            </h2>
            <div className="trust-grid">
                <div className="trust-card">
                    <p>Customers can instantly recognise MCOMQLinks for a safe and consistent experience.</p>
                </div>
                <div className="trust-card">
                    <p>Works day or night, connecting physical and digital experiences seamlessly.</p>
                </div>
            </div>
            <div className="quote-box">
                “You can Q anything with an MCOMQLink”
            </div>
        </section>

        {/* Membership Section */}
        <section className="membership-section">
            <div className="glass-panel orange-tint">
                <h2 className="section-title">🔗 Membership (External)</h2>
                <h3>Already an MCOM Business Member?</h3>
                <p>Platinum Pro and Platinum Pro+ members may already have access included.</p>
                <div className="important-note">
                    <strong>Important:</strong> Bronze, Silver, and Gold members must still purchase a plan above. Membership is separate from MCOMQLinks access.
                </div>
                <button className="btn-ghost" style={{ marginTop: '1.5rem' }}>View Membership Options</button>
            </div>
        </section>

        {/* Comparison Table */}
        <section className="comparison-section">
            <h2 className="main-headline" style={{ fontSize: '3rem', textAlign: 'center' }}>Feature <span className="gradient-text">Comparison</span></h2>
            <div className="table-responsive">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>BASIC (£90)</th>
                            <th>PRO (£450)</th>
                            <th>PRO+ (£1100)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>90-Day Access</td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>QR Brand ID</td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Storefront Campaigns</td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>National Campaigns</td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Hyper Local Campaigns</td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Nearby Campaigns</td>
                            <td className="x-cell"><XIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Third-Party Promotion</td>
                            <td className="x-cell"><XIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Auto Rollover</td>
                            <td className="x-cell"><XIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Expo Access</td>
                            <td className="x-cell"><XIcon /></td>
                            <td><span className="limit-tag">Limited</span></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                        <tr>
                            <td>Priority Visibility</td>
                            <td className="x-cell"><XIcon /></td>
                            <td className="x-cell"><XIcon /></td>
                            <td className="check-cell"><CheckIcon /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta" style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h2 className="main-headline">Ready to Start Your <br /><span className="gradient-text">90-Day Campaign?</span></h2>
            <p className="hero-description" style={{ margin: '0 auto 3rem' }}>
                Get your storefront live and start attracting customers today.
            </p>
            <div className="hero-ctas" style={{ justifyContent: 'center' }}>
                <Link to="/signup" className="btn-premium" style={{ padding: '1.1rem 3rem', fontSize: '1.05rem', textDecoration: 'none' }}>
                    Start Now <ArrowRight />
                </Link>
            </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="logo">MCOMQ<span>.LINKS</span></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', maxWidth: '300px', lineHeight: '1.7', fontSize: '0.9rem' }}>
                Revitalizing local commerce with automated, sequential digital billboard technology for National, Nearby, and Hyperlocal Mcom Promo Expos.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  Active members benefit from our 'done for you' hyperlocal and sequential promo campaigns, managed by our virtual team of agents, account managers, and consultants.
                </p>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/" className="nav-link">About Us</Link>
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
            &copy; 2026 McomQlinks. All rights reserved. Built for the future of commerce.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PricingPage;

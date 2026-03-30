import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPromoSettings } from '../mock/promoStore';
import type { PromoSettings } from '../mock/promoStore';
import '../App.css';

// Reusable Icons 
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

const PromoPricingPage: React.FC = () => {
  const [promo, setPromo] = useState<PromoSettings | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const config = getPromoSettings();
    if (!config.promoActive) {
      navigate('/pricing', { replace: true });
    } else {
      setPromo(config);
    }
  }, [navigate]);

  if (!promo) return null;

  return (
    <div className="app-container pricing-page">
      <div className="content-wrapper">
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
                  href={tab === 'Pricing' ? '#promo' : `/#${tab.toLowerCase()}`}
                  className={`nav-link ${tab === 'Pricing' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
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

        <header className="pricing-header" id="promo" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '8em' }}>
            <div className="badge" style={{ animation: promo.animationStyle !== 'none' ? `${promo.animationStyle} 2s infinite` : '' }}>
                ✦ EXCLUSIVE OFFER ACTIVE
            </div>
            
            <h1 className="main-headline">
                {promo.homepagePromoTitle}
            </h1>
            <p className="hero-description" style={{ margin: '0 auto 4rem' }}>
                {promo.homepagePromoDesc}
            </p>

            <div 
              className="embed-container" 
              style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}
              dangerouslySetInnerHTML={{ __html: promo.adminHtmlEmbed }} 
            />
            
            <div className="hero-ctas" style={{ justifyContent: 'center', marginTop: '4rem' }}>
              <Link to="/signup" className="btn-premium" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', textDecoration: 'none' }}>
                {promo.homepagePromoCTAText} <ArrowRight />
              </Link>
            </div>
        </header>

        <footer className="footer">
          <div className="footer-bottom">
            &copy; 2026 McomQlinks. All rights reserved. Promotional Campaign.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PromoPricingPage;

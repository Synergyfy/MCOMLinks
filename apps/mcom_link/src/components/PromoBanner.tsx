import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPromoSettings } from '../mock/promoStore';
import type { PromoSettings } from '../mock/promoStore';

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

export default function PromoBanner() {
  const [promo, setPromo] = useState<PromoSettings | null>(null);

  useEffect(() => {
    const config = getPromoSettings();
    if (config.promoActive) {
      setPromo(config);
    }
  }, []);

  if (!promo) return null;

  return (
    <section className="promo-banner" style={{ background: '#0f172a', padding: '4rem 2rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
                display: 'inline-block', 
                padding: '0.25rem 1rem', 
                borderRadius: '50px', 
                background: 'rgba(255,255,255,0.1)',
                marginBottom: '1rem',
                animation: promo.animationStyle !== 'none' ? `${promo.animationStyle} 2s infinite` : 'none'
            }}>
                ✦ FLASH PROMO ACTIVE
            </div>
            
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {promo.homepagePromoTitle}
            </h2>
            
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                {promo.homepagePromoDesc}
            </p>

            <Link to={promo.promoCTALink} style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                color: 'white', 
                padding: '1rem 2.5rem', 
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none',
            }}>
                {promo.homepagePromoCTAText} <ArrowRight />
            </Link>
        </div>
        
        {/* Subtle background glow */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(15,23,42,0) 70%)',
            zIndex: 1,
            pointerEvents: 'none'
        }} />
    </section>
  );
}

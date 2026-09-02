import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import '../styles/pricing.css';
import { getPublicPlans, getPublicPlanSchema } from '../api/plans';
import type { Plan as PlanType, SessionUser } from '../types';
import type { PlanSchema } from '../api/plans';
import StripeCheckoutModal from '../components/StripeCheckoutModal';

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

const PLAN_COLORS = ['#22c55e', '#2563eb', '#8b5cf6', '#f59e0b'];

type BillingCycle = 'monthly' | 'quarterly' | 'annual';
const CYCLE_LABELS: Record<BillingCycle, string> = { monthly: '/month', quarterly: '/quarter', annual: '/year' };

function formatPrice(value: number): string {
    return value === 0 ? '£0' : `£${value}`;
}

const toPricingCard = (plan: PlanType, index: number) => ({
    id: plan.id,
    name: plan.name,
    type: plan.type === 'TRIAL' ? 'Trial Access' : plan.type === 'SEASONAL' ? 'Seasonal Access' : 'Standard Access',
    tagline: plan.tagline || plan.description || 'Start showing your business on MCOMQLinks',
    isFree: !!plan.isFree,
    monthlyPrice: plan.monthlyPrice,
    quarterlyPrice: plan.quarterlyPrice,
    annualPrice: plan.annualPrice,
    color: PLAN_COLORS[index % PLAN_COLORS.length],
    included: plan.features || [],
    limitations: plan.limitations || [],
    flags: plan.configuration?.featureFlags || {},
    quotas: plan.configuration?.quotas || {},
    popular: !!plan.isDefault,
    bestFor: plan.bestFor || (plan.type === 'TRIAL' ? 'New businesses wanting to try the platform risk-free' : 'Businesses looking for MCOMQLinks storefront exposure'),
});

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pricing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [schema, setSchema] = useState<PlanSchema | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);
  const [checkoutCycle, setCheckoutCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    let active = true;
    Promise.all([getPublicPlans(), getPublicPlanSchema()])
      .then(([plansData, schemaData]) => {
        if (!active) return;
        setPlans((plansData || []).map(toPricingCard));
        setSchema(schemaData || null);
        setLoadError(null);
      })
      .catch((e: any) => {
        if (!active) return;
        setLoadError(e?.message || 'Failed to load plans');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored) as SessionUser;
        if (localStorage.getItem('access_token')) {
          setSessionUser(user);
        }
      }
    } catch {}
  }, []);

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
              {sessionUser ? (
                <>
                  <Link to="/dashboard" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  <Link to="/login" className="btn-premium" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>

          <div className="desktop-auth">
            {sessionUser ? (
              <Link to="/dashboard" className="btn-premium" style={{ textDecoration: 'none' }}>
                Dashboard <ArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>Sign In</Link>
                <Link to="/login" className="btn-premium" style={{ textDecoration: 'none' }}>
                  Get Started <ArrowRight />
                </Link>
              </>
            )}
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
            {loading ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading plans…</div>
            ) : loadError ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#b91c1c', fontWeight: 700 }}>
                    Unable to load plans: {loadError}
                </div>
            ) : plans.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No plans available yet. Check back soon.
                </div>
            ) : (
                <>
                {/* Billing cycle toggle */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                    {(['monthly', 'quarterly', 'annual'] as BillingCycle[]).map(c => (
                        <button
                            key={c}
                            onClick={() => setCycle(c)}
                            style={{
                                padding: '0.5rem 1.25rem', borderRadius: '100px', border: 'none', cursor: 'pointer',
                                fontWeight: 800, fontSize: '0.8rem',
                                background: cycle === c ? '#2563eb' : '#f1f5f9',
                                color: cycle === c ? '#fff' : '#64748b',
                            }}
                        >
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>
                {plans.map(plan => {
                    const price = plan.isFree ? 'Free' : `${formatPrice(plan[cycle === 'monthly' ? 'monthlyPrice' : cycle === 'quarterly' ? 'quarterlyPrice' : 'annualPrice'])}`;
                    return (
                <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`} style={{ '--plan-color': plan.color } as any}>
                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                    {plan.isFree && <div className="popular-badge" style={{ background: '#10b981' }}>Free</div>}
                    <div className="card-header">
                        <span className="plan-name">{plan.name}</span>
                        <span className="plan-type">{plan.type}</span>
                        <div className="plan-price">
                            <span className="amount">{price}</span>
                            <span className="period">{plan.isFree ? '' : CYCLE_LABELS[cycle]}</span>
                        </div>
                        <p className="plan-tagline">{plan.tagline}</p>
                    </div>

                    <div className="card-features">
                        <h4>What’s Included</h4>
                        <ul>
                            {plan.included.length > 0 ? plan.included.map((item: string, i: number) => (
                                <li key={i}><CheckIcon /> {item}</li>
                            )) : <li><CheckIcon /> Storefront listing on MCOMQLinks</li>}
                        </ul>
                    </div>

                    {plan.limitations && plan.limitations.length > 0 && (
                        <div className="card-limitations">
                            <h4>Limitations</h4>
                            <ul>
                                {plan.limitations.map((item: string, i: number) => (
                                    <li key={i} className="limited"><XIcon /> {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="card-bestfor">
                        <strong>Best For:</strong> {plan.bestFor}
                    </div>

                    <div className="card-footer">
                        {sessionUser && !sessionUser.permissions?.canAccess_links ? (
                            <button
                                className="btn-premium full-width"
                                onClick={() => { setCheckoutPlan(plan); setCheckoutCycle(cycle); }}
                            >
                                Start {plan.name} Plan <ArrowRight />
                            </button>
                        ) : (
                            <Link to="/login" className="btn-premium full-width">
                                Start {plan.name} Plan <ArrowRight />
                            </Link>
                        )}
                    </div>
                </div>
                    );
                })}
                </>
            )}
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
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading plans…</div>
            ) : plans.length === 0 ? null : (
            <div className="table-responsive">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            {plans.map(plan => (
                                <th key={plan.id}>{plan.name.toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(schema?.featureFlags || []).map(f => (
                            <tr key={f.key}>
                                <td>{f.label}</td>
                                {plans.map(plan => (
                                    <td key={plan.id} className={plan.flags?.[f.key] ? 'check-cell' : 'x-cell'}>
                                        {plan.flags?.[f.key] ? <CheckIcon /> : <XIcon />}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {(schema?.quotas || []).filter(q => q.type === 'number').map(q => (
                            <tr key={q.key}>
                                <td>{q.label}</td>
                                {plans.map(plan => {
                                    const val = plan.quotas?.[q.key];
                                    const display = typeof val === 'number' ? (val === -1 ? 'Unlimited' : String(val)) : '—';
                                    return <td key={plan.id} style={{ textAlign: 'center', fontWeight: 700 }}>{display}</td>;
                                })}
                            </tr>
                        ))}
                        {(!schema || (schema.featureFlags.length === 0 && schema.quotas.filter(q => q.type === 'number').length === 0)) && (
                            <tr>
                                <td colSpan={plans.length + 1} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>No comparison features configured.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            )}
        </section>

        {/* Final CTA */}
        <section className="final-cta" style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h2 className="main-headline">Ready to Start Your <br /><span className="gradient-text">90-Day Campaign?</span></h2>
            <p className="hero-description" style={{ margin: '0 auto 3rem' }}>
                Get your storefront live and start attracting customers today.
            </p>
            <div className="hero-ctas" style={{ justifyContent: 'center' }}>
                {sessionUser && !sessionUser.permissions?.canAccess_links ? (
                    <button
                        className="btn-premium"
                        style={{ padding: '1.1rem 3rem', fontSize: '1.05rem' }}
                        onClick={() => {
                            const popular = plans.find(p => p.popular) || plans[0];
                            if (popular) { setCheckoutPlan(popular); setCheckoutCycle(cycle); }
                        }}
                    >
                        Start Now <ArrowRight />
                    </button>
                ) : (
                    <Link to="/login" className="btn-premium" style={{ padding: '1.1rem 3rem', fontSize: '1.05rem', textDecoration: 'none' }}>
                        Start Now <ArrowRight />
                    </Link>
                )}
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

      {checkoutPlan && (
        <StripeCheckoutModal
          plan={checkoutPlan}
          billingCycle={checkoutCycle}
          price={checkoutPlan.isFree ? 0 : checkoutPlan[checkoutCycle === 'monthly' ? 'monthlyPrice' : checkoutCycle === 'quarterly' ? 'quarterlyPrice' : 'annualPrice']}
          cycleLabel={CYCLE_LABELS[checkoutCycle]}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => {
            try {
              const stored = localStorage.getItem('user');
              if (stored) {
                const user = JSON.parse(stored);
                user.permissions = { ...user.permissions, canAccess_links: true };
                localStorage.setItem('user', JSON.stringify(user));
              }
            } catch {}
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default PricingPage;

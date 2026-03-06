import AgentLayout from '../../components/AgentLayout'
import { mockPortfolio } from '../../mock/agents'
import { Link } from 'react-router-dom'

export default function AgentDashboard() {
    const { targets } = mockPortfolio

    const progressPercent = (targets.newBusinesses / targets.newBusinessesGoal) * 100
    const activePercent = (targets.activeOffers / targets.activeOffersGoal) * 100

    return (
        <AgentLayout title="Portfolio Overview">
            {/* 1. Monthly Performance Tracking - Step 11 */}
            <div className="db-stats-grid">
                <div className="db-stat-card">
                    <div className="db-stat-label">New Businesses (Month)</div>
                    <div className="db-stat-value">{targets.newBusinesses} / {targets.newBusinessesGoal}</div>
                    <div style={{ marginTop: '0.75rem', height: '6px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: '#2563eb' }} />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{targets.newBusinessesGoal - targets.newBusinesses} more to reach target</p>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-label">Active Offers (Month)</div>
                    <div className="db-stat-value">{targets.activeOffers} / {targets.activeOffersGoal}</div>
                    <div style={{ marginTop: '0.75rem', height: '6px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${activePercent}%`, height: '100%', background: '#2563eb' }} />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Goal: 15 Active Promotions</p>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-label">Portfolio Scans (Monthly)</div>
                    <div className="db-stat-value">4.2k</div>
                    <div className="db-stat-trend db-trend-up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        +18% from last week
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-label">Portfolio Conversion</div>
                    <div className="db-stat-value">12.4%</div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Standard Avg: 10%</p>
                </div>
            </div>

            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* 2. Urgent Portfolio Actions - Step 7 */}
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: '#ef4444' }}>⚠️</span> Urgent Actions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { biz: 'FitLife Gym', issue: 'Offer Expiring in 2 days', type: 'expiring' },
                            { biz: 'Bloom & Wild', issue: 'No Active Offer', type: 'inactive' },
                            { biz: 'Marco\'s Pizzeria', issue: 'Boost Campaign Ending Soon', type: 'warning' }
                        ].map((action, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: '0.75rem', background: '#f8fafc' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{action.biz}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 600 }}>{action.issue}</div>
                                </div>
                                <button className="db-btn db-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Resolve</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Quick Links & Ranking - Step 10 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Portfolio Leaderboard</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '24px', height: '24px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 800, fontSize: '0.7rem' }}>1</div>
                                <div style={{ flex: 1, fontWeight: 700, fontSize: '0.85rem' }}>Bella's Boutique</div>
                                <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.85rem' }}>15% CR</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '24px', height: '24px', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 800, fontSize: '0.7rem' }}>2</div>
                                <div style={{ flex: 1, fontWeight: 700, fontSize: '0.85rem' }}>The Daily Grind</div>
                                <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.85rem' }}>12.1% CR</div>
                            </div>
                        </div>
                        <Link to="/agent/portfolio" className="db-btn db-btn-ghost" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', fontSize: '0.85rem' }}>View Ranking</Link>
                    </div>

                    <Link to="/agent/onboard" style={{ textDecoration: 'none' }}>
                        <button className="db-btn db-btn-primary" style={{ width: '100%', height: '56px', borderRadius: '1rem', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Onboard New Business
                        </button>
                    </Link>
                </div>
            </div>
        </AgentLayout>
    )
}

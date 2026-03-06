import AgentLayout from '../../components/AgentLayout'

export default function AgentPerformancePage() {
    const topCategories = [
        { name: 'Fashion & Retail', growth: '+24%', color: '#2563eb' },
        { name: 'Food & Drink', growth: '+18%', color: '#10b981' },
        { name: 'Health & Beauty', growth: '+12%', color: '#f59e0b' }
    ]

    return (
        <AgentLayout title="Portfolio Analytics">
            {/* 1. Portfolio Health - Step 6 */}
            <div className="db-stats-grid">
                <div className="db-stat-card">
                    <div className="db-stat-label">Avg. Retention Rate</div>
                    <div className="db-stat-value">94.2%</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Excellent Health</p>
                </div>
                <div className="db-stat-card">
                    <div className="db-stat-label">Portfolio Revenue (MTD)</div>
                    <div className="db-stat-value">£2,840</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Includes 4 Premium Upgrades</p>
                </div>
                <div className="db-stat-card">
                    <div className="db-stat-label">Active Promotion Rate</div>
                    <div className="db-stat-value">88%</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>Goal: Reach 95%</p>
                </div>
            </div>

            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* 2. Growth by Category - Step 10/11 */}
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Conversion Trends by Sector</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {topCategories.map((cat, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <span>{cat.name}</span>
                                    <span style={{ color: cat.color }}>{cat.growth}</span>
                                </div>
                                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ width: `${85 - (i * 15)}%`, height: '100%', background: cat.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                        💡 <b>Insight:</b> Fashion stores are seeing the highest conversion this month. You should prioritize onboarding more boutiques in the West End location.
                    </p>
                </div>

                {/* 3. Export & Reporting - Step 14 */}
                <div className="db-card" style={{ background: '#0a0a0a', color: '#fff' }}>
                    <h2 className="db-card-title" style={{ color: '#fff', marginBottom: '1rem' }}>Executive Reporting</h2>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Generate a comprehensive PDF or CSV report of your entire portfolio's performance to share with the System Admin.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className="db-btn db-btn-primary" style={{ justifyContent: 'center', background: '#fff', color: '#0a0a0a' }}>
                            Download Monthly Report (PDF)
                        </button>
                        <button className="db-btn db-btn-ghost" style={{ justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                            Export Raw Data (CSV)
                        </button>
                    </div>
                </div>
            </div>
        </AgentLayout>
    )
}

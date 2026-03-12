import { useEffect, useState } from 'react'
import AgentLayout from '../../components/AgentLayout'
import { api } from '../../api/apiClient'

export default function AgentPerformancePage() {
    const [performance, setPerformance] = useState<any>(null)
    const [period, setPeriod] = useState('30d')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPerformance = async () => {
            setLoading(true)
            try {
                const data = await api.get<any>(`/agent/performance?period=${period}`)
                setPerformance(data)
            } catch (error) {
                console.error('Failed to fetch performance data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPerformance()
    }, [period])

    return (
        <AgentLayout title="Portfolio Analytics">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontWeight: 600 }}
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last 1 Year</option>
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading performance data...</div>
            ) : (
                <>
                    {/* 1. Portfolio Health - Step 6 */}
                    <div className="db-stats-grid">
                        <div className="db-stat-card">
                            <div className="db-stat-label">Total Portfolio Scans</div>
                            <div className="db-stat-value">{performance?.summary?.totalScans?.toLocaleString() || 0}</div>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>During this period</p>
                        </div>
                        <div className="db-stat-card">
                            <div className="db-stat-label">Total Claims</div>
                            <div className="db-stat-value">{performance?.summary?.totalClaims?.toLocaleString() || 0}</div>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Active Engagement</p>
                        </div>
                        <div className="db-stat-card">
                            <div className="db-stat-label">Avg. Conversion Rate</div>
                            <div className="db-stat-value">{performance?.summary?.avgConversion || '0%'}</div>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#2563eb', fontWeight: 700 }}>Scan-to-Claim</p>
                        </div>
                    </div>

                    <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                        {/* 2. Top Offers - Adapted from Sector Mock */}
                        <div className="db-card">
                            <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Top Performing Offers (by Scans)</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {performance?.topOffers?.map((offer: any, i: number) => {
                                    const maxScans = performance.topOffers[0]?.scans || 1;
                                    const percent = (offer.scans / maxScans) * 100;
                                    return (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                                                <span>{offer.business} — {offer.headline}</span>
                                                <span style={{ color: '#2563eb' }}>{offer.scans.toLocaleString()} scans</span>
                                            </div>
                                            <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                                <div style={{ width: `${percent}%`, height: '100%', background: '#2563eb', opacity: 1 - (i * 0.15) }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!performance?.topOffers || performance.topOffers.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No data available for this period.</div>
                                )}
                            </div>
                            <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                                💡 <b>Insight:</b> This list shows the most scanned offers in your portfolio. High scan volume indicates effective high-street placement and headline appeal.
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
                </>
            )}
        </AgentLayout>
    )
}

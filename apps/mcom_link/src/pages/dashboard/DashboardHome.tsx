import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/apiClient'
import DashboardLayout from '../../components/DashboardLayout'

export default function DashboardHome() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get<any>('/dashboard/stats')
                setStats(data)
            } catch (e) {
                console.error('Failed to fetch dashboard stats:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return <DashboardLayout title="Loading Dashboard...">
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your performance data...</div>
        </DashboardLayout>
    }

    if (!stats) {
        return (
            <DashboardLayout title="Dashboard Unavailable">
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔌</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Unable to Connect to Engine</h2>
                    <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 2rem' }}>
                        We're having trouble reaching the MCOMLINKS core engine. This might be due to a temporary service outage.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="db-btn db-btn-primary"
                        style={{ margin: '0 auto' }}
                    >
                        Retry Connection
                    </button>
                </div>
            </DashboardLayout>
        )
    }

    const { liveOffer } = stats

    return (
        <DashboardLayout title="Dashboard Overview">
            {/* 1. Metrics Grid — PRD STEP 3 */}
            <div className="db-stats-grid">
                <div className="db-stat-card">
                    <div className="db-stat-label">Total Scans (All Time)</div>
                    <div className="db-stat-value">{stats.totalScans.toLocaleString()}</div>
                    <div className="db-stat-trend db-trend-up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        {stats.engagementGrowth}% vs last month
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-label">Total Claims (All Time)</div>
                    <div className="db-stat-value">{stats.totalClaims.toLocaleString()}</div>
                    <div className="db-stat-trend db-trend-up">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        Engaged Locally
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-label">Avg. Conversion Rate</div>
                    <div className="db-stat-value">{stats.conversionRate}%</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Scan-to-claim frequency</p>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-label">Active Offers</div>
                    <div className="db-stat-value">{stats.activeOffers}</div>
                    <div className="db-stat-trend" style={{ color: '#64748b' }}>
                        Active in Network
                    </div>
                </div>
            </div>

            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* 2. Live Offer Preview — PRD STEP 5 */}
                <div className="db-card">
                    <div className="db-card-header">
                        <h2 className="db-card-title">Latest Approved Offer</h2>
                        <Link to="/dashboard/offers" className="db-btn db-btn-ghost">View All</Link>
                    </div>

                    {liveOffer ? (
                        <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <img
                                src={liveOffer.imageUrl}
                                alt={liveOffer.headline}
                                style={{ width: '100%', maxWidth: '240px', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '0.75rem' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div className="db-badge db-badge-approved" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{liveOffer.status}</div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800 }}>{liveOffer.headline}</h3>
                                <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{liveOffer.description}</p>
                                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Scans</div>
                                        <div style={{ fontWeight: 800 }}>{liveOffer.performance.scans}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Claims</div>
                                        <div style={{ fontWeight: 800 }}>{liveOffer.performance.claims}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Expires</div>
                                        <div style={{ fontWeight: 800 }}>{new Date(liveOffer.endDate).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '0.75rem' }}>
                            <p style={{ color: '#64748b', fontWeight: 600 }}>No live offers currently. Submit a new one to get started!</p>
                        </div>
                    )}
                </div>

                {/* 3. Quick Actions — PRD STEP 3 */}
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.quickActions.map((action: any, i: number) => (
                            <Link key={i} to={action.link} className={`db-btn db-btn-${action.type}`} style={{ justifyContent: 'center' }}>
                                {action.icon === 'plus' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
                                {action.label}
                            </Link>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(37, 99, 235, 0.04)', borderRadius: '0.75rem', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700 }}>Membership Status</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                            Your account is active. Upgrading to Premium gives you 3x more visibility in the display network.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

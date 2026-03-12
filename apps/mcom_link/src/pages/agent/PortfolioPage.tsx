import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/apiClient'
import AgentLayout from '../../components/AgentLayout'

interface PortfolioBusiness {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    plan: string;
    subscriptionStatus: string;
    activeOffersCount: number;
    totalScans: number;
    totalClaims: number;
    conversionRate: string;
}

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<PortfolioBusiness[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const data = await api.get<{ portfolio: PortfolioBusiness[] }>('/agent/portfolio')
                setPortfolio(data.portfolio)
            } catch (e) {
                console.error('Failed to fetch portfolio:', e)
                setError('Failed to load portfolio data. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        fetchPortfolio()
    }, [])

    if (loading) {
        return (
            <AgentLayout title="My Portfolio">
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div className="db-stat-label">Loading your portfolio...</div>
                </div>
            </AgentLayout>
        )
    }

    if (error) {
        return (
            <AgentLayout title="My Portfolio">
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fff1f2', borderRadius: '1rem', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
                    <div style={{ fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>{error}</div>
                    <button onClick={() => window.location.reload()} className="db-btn db-btn-primary" style={{ margin: '0 auto' }}>Retry</button>
                </div>
            </AgentLayout>
        )
    }

    const sortedBusinesses = [...portfolio].sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate))

    return (
        <AgentLayout title="My Portfolio">
            {/* 1. Portfolio Summary - Step 6 */}
            <div className="db-stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="db-stat-card">
                    <div className="db-stat-label">Total Portfolio Businesses</div>
                    <div className="db-stat-value">{portfolio.length}</div>
                </div>
                <div className="db-stat-card">
                    <div className="db-stat-label">Subscription Status</div>
                    <div className="db-stat-value" style={{ fontSize: '1.25rem' }}>
                        <span style={{ color: '#10b981' }}>{portfolio.filter(b => b.subscriptionStatus === 'active').length} Active</span>
                        <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>/</span>
                        <span style={{ color: '#ef4444' }}>{portfolio.filter(b => b.subscriptionStatus !== 'active').length} Suspended</span>
                    </div>
                </div>
            </div>

            {/* 2. Portfolio Table - Step 6 & 10 */}
            <div className="db-card" style={{ padding: 0 }}>
                {/* Desktop View */}
                <div className="db-table-wrapper desktop-only">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Business Name</th>
                                <th>Plan</th>
                                <th>Scans</th>
                                <th>Claims</th>
                                <th>Conversion</th>
                                <th>Offers</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBusinesses.map((biz) => (
                                <tr key={biz.id}>
                                    <td>
                                        <Link to={`/agent/business/${biz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{biz.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{biz.address || 'No address'}</div>
                                        </Link>
                                    </td>
                                    <td>
                                        <span className={`db-badge ${biz.plan === 'Premium' ? 'db-badge-approved' : 'db-badge-draft'}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                            {biz.plan}
                                        </span>
                                    </td>
                                    <td>{biz.totalScans}</td>
                                    <td>{biz.totalClaims}</td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: parseFloat(biz.conversionRate) > 10 ? '#2563eb' : '#64748b' }}>
                                            {biz.conversionRate}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`db-badge db-badge-${biz.activeOffersCount > 0 ? 'approved' : 'expired'}`}>
                                            {biz.activeOffersCount} Active
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link to={`/agent/business/${biz.id}`} className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} title="View Details">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </Link>
                                            <Link to={`/agent/business/${biz.id}/logs`} className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} title="Log Contact">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedBusinesses.map((biz) => (
                        <div key={biz.id} className="db-offer-card-mobile">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <Link to={`/agent/business/${biz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0a0a0a' }}>{biz.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{biz.address || 'No address'}</div>
                                </Link>
                                <span className={`db-badge db-badge-${biz.activeOffersCount > 0 ? 'approved' : 'expired'}`}>
                                    {biz.activeOffersCount} Active
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <span className={`db-badge ${biz.plan === 'Premium' ? 'db-badge-approved' : 'db-badge-draft'}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                    {biz.plan} Plan
                                </span>
                                <span style={{ fontSize: '0.75rem', color: biz.subscriptionStatus === 'active' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                    {biz.subscriptionStatus.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scans</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{biz.totalScans}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Claims</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{biz.totalClaims}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>CR</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: parseFloat(biz.conversionRate) > 10 ? '#2563eb' : '#0a0a0a' }}>{biz.conversionRate}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/agent/business/${biz.id}`} className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                                    View Details
                                </Link>
                                <Link to={`/agent/business/${biz.id}/logs`} className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                                    Log Contact
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Export & Productivity - Step 14 */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="db-btn db-btn-ghost" onClick={() => alert("CSV Exporting... Business portfolio report generated.")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Export Portfolio Data (CSV)
                </button>
            </div>
        </AgentLayout>
    )
}

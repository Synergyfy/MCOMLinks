import DashboardLayout from '../../components/DashboardLayout'
import { mockMetrics } from '../../mock/business'
import { mockOffers } from '../../mock/offers'
import { mockBusiness } from '../../mock/business'

export default function AnalyticsPage() {
    const myOffers = mockOffers.filter(o => o.businessName === mockBusiness.name && o.status === 'approved')

    return (
        <DashboardLayout title="Performance Analytics">
            {/* 1. Global Metrics Summary */}
            <div className="db-stats-grid">
                <div className="db-stat-card">
                    <div className="db-stat-label">Total Monthly Scans</div>
                    <div className="db-stat-value">{mockMetrics.totalScans}</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Across all active locations</p>
                </div>
                <div className="db-stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
                    <div className="db-stat-label">Total Claims (Redemptions)</div>
                    <div className="db-stat-value">{mockMetrics.totalClaims}</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Customers who took action</p>
                </div>
                <div className="db-stat-card">
                    <div className="db-stat-label">Average Conversion</div>
                    <div className="db-stat-value">{mockMetrics.conversionRate}%</div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Scan-to-Claim efficiency</p>
                </div>
            </div>

            {/* 2. Visual Bar Chart — PRD STEP 6 (Non-technical) */}
            <div className="db-card" style={{ marginBottom: '2.5rem' }}>
                <h2 className="db-card-title">Scan History (Last 7 Days)</h2>
                <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    {[
                        { day: 'Mon', val: 45 }, { day: 'Tue', val: 52 }, { day: 'Wed', val: 38 },
                        { day: 'Thu', val: 65 }, { day: 'Fri', val: 89 }, { day: 'Sat', val: 120 }, { day: 'Sun', val: 95 }
                    ].map((d, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div
                                style={{
                                    width: '100%',
                                    height: `${(d.val / 120) * 100}%`,
                                    background: d.day === 'Sat' ? '#2563eb' : '#e2e8f0',
                                    borderRadius: '0.5rem 0.5rem 0 0',
                                    transition: 'height 1s ease'
                                }}
                            />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{d.day}</span>
                        </div>
                    ))}
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    💡 <b>Tip:</b> Your traffic peaks on <b>Saturdays</b>. Try running special weekend-only offers!
                </p>
            </div>

            {/* 3. Per-Offer Breakdown — PRD STEP 6 */}
            <div className="db-card">
                <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Performance per Offer</h2>
                <div className="db-table-wrapper">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Offer</th>
                                <th>Scans</th>
                                <th>Claims</th>
                                <th>Engagement Rate</th>
                                <th>Performance Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOffers.map(offer => {
                                const rate = offer.performance.scans > 0
                                    ? ((offer.performance.claims / offer.performance.scans) * 100).toFixed(1)
                                    : "0.0";

                                return (
                                    <tr key={offer.id}>
                                        <td><div style={{ fontWeight: 700 }}>{offer.headline}</div></td>
                                        <td>{offer.performance.scans}</td>
                                        <td>{offer.performance.claims}</td>
                                        <td><b>{rate}%</b></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '60px', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${Math.min(parseFloat(rate) * 5, 100)}%`, height: '100%', background: '#2563eb' }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>High</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    )
}

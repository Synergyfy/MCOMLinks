import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { mockSeasons } from '../../mock/admin'

export default function SeasonalCampaigns() {
    const [seasons] = useState(mockSeasons)

    return (
        <AdminLayout title="Seasonal Automation">
            {/* 1. Global Timeline - Step 187-210 */}
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Annual Campaign Roadmap</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                    {seasons.map(season => (
                        <div key={season.id} className="db-card" style={{
                            padding: '1.5rem',
                            background: season.isActive ? 'rgba(37, 99, 235, 0.05)' : '#fff',
                            border: `2px solid ${season.isActive ? '#2563eb' : '#f1f5f9'}`,
                            position: 'relative'
                        }}>
                            {season.isActive && (
                                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', width: '10px', height: '10px', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }} />
                            )}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.5rem' }}>{season.name}</h3>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {new Date(season.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(season.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                            <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748b', margin: '1rem 0 0' }}>
                                {season.isActive ? 'Offers are currently live in rotator' : 'Scheduled automation pending'}
                            </p>
                            <button className="db-btn db-btn-ghost" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem', justifyContent: 'center' }}>
                                Edit Dates
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Priority Rule Engine</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '2rem' }}>
                        Define how priority "Boost" campaigns behave compared to sequential rotation.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Priority Type 1: Full Override</div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>The offer occupies the first slot of every rotation cycle.</p>
                        </div>
                        <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #2563eb' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#2563eb' }}>Priority Type 2: Intermittent (Active)</div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>The offer is injected every 3 scans during the active period.</p>
                        </div>
                    </div>

                    <button className="db-btn db-btn-primary" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
                        Update Global Rules
                    </button>
                </div>

                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Seasonal Content Distribution</h2>
                    <div className="db-table-wrapper">
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>Offer Category</th>
                                    <th>Target Season</th>
                                    <th>Auto-Activate</th>
                                    <th style={{ textAlign: 'right' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Retail / Fashion</td>
                                    <td><b>Winter Sale</b></td>
                                    <td>Enabled</td>
                                    <td style={{ textAlign: 'right' }}><span className="db-badge db-badge-draft">QUEUED</span></td>
                                </tr>
                                <tr>
                                    <td>Summer Refresh</td>
                                    <td><b>Summer</b></td>
                                    <td>Enabled</td>
                                    <td style={{ textAlign: 'right' }}><span className="db-badge db-badge-draft">QUEUED</span></td>
                                </tr>
                                <tr>
                                    <td>Spring Equinox</td>
                                    <td><b>Spring</b></td>
                                    <td>Enabled</td>
                                    <td style={{ textAlign: 'right' }}><span className="db-badge db-badge-approved">LIVE</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                        Offers with seasonal tags are automatically bypassed if the current system date is outside the defined range.
                    </p>
                </div>
            </div>
        </AdminLayout>
    )
}

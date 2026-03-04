import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function LocationManager() {
    const [locations, setLocations] = useState([
        { id: 'loc-001', name: 'High Street Central', city: 'London', businesses: 24, status: 'active', pointer: 3 },
        { id: 'loc-002', name: 'Mall North Wing', city: 'London', businesses: 18, status: 'active', pointer: 12 },
        { id: 'loc-003', name: 'East Plaza Square', city: 'Manchester', businesses: 12, status: 'paused', pointer: 0 },
        { id: 'loc-004', name: 'West End Hub', city: 'Birmingham', businesses: 32, status: 'active', pointer: 7 }
    ])

    const toggleStatus = (id: string) => {
        setLocations(locations.map(loc =>
            loc.id === id ? { ...loc, status: loc.status === 'active' ? 'paused' : 'active' } : loc
        ))
    }

    const resetPointer = (id: string) => {
        setLocations(locations.map(loc =>
            loc.id === id ? { ...loc, pointer: 0 } : loc
        ))
        alert(`Rotator pointer reset for ${id}`)
    }

    return (
        <AdminLayout title="Network Management">
            {/* 1. Global Scale - Step 90-105 */}
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="db-card-title">Active Locations</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Management of high street clusters and shopping mall zones.</p>
                    </div>
                    <button className="db-btn db-btn-primary">+ Add New Location</button>
                </div>

                <div className="db-table-wrapper">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Location Name</th>
                                <th>Coverage</th>
                                <th>Rotator Status</th>
                                <th>Current Position</th>
                                <th style={{ textAlign: 'right' }}>Core Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map(loc => (
                                <tr key={loc.id}>
                                    <td>
                                        <div style={{ fontWeight: 800 }}>{loc.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{loc.city}, UK</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{loc.businesses} Businesses</div>
                                    </td>
                                    <td>
                                        <span className={`db-badge db-badge-${loc.status === 'active' ? 'approved' : 'rejected'}`}>
                                            {loc.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: 800, color: '#2563eb' }}>P-{loc.pointer}</span>
                                            <div style={{ width: '60px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ width: `${(loc.pointer / 20) * 100}%`, height: '100%', background: '#2563eb' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="db-btn db-btn-ghost"
                                                style={{ fontSize: '0.75rem', fontWeight: 800 }}
                                                onClick={() => toggleStatus(loc.id)}
                                            >
                                                {loc.status === 'active' ? 'Pause' : 'Activate'}
                                            </button>
                                            <button
                                                className="db-btn db-btn-ghost"
                                                style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}
                                                onClick={() => resetPointer(loc.id)}
                                            >
                                                Reset Pointer
                                            </button>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 2. Rotator Logic Visualization - Step 107-130 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Global Rotation Engine Health</h2>
                    <div style={{ padding: '2rem', background: '#0a0a0a', borderRadius: '1.25rem', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>Total Concurrency</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>4,120 Scans/Min</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>Engine Load</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>OPTIMAL</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                            {[40, 60, 45, 90, 100, 80, 50, 40, 60, 70, 85, 95, 40, 30, 60].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#2563eb', borderRadius: '2px' }} />
                            ))}
                        </div>
                        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                            Pointer distribution across atomic persistence layer (Last 60s)
                        </p>
                    </div>
                </div>

                <div className="db-card" style={{ border: '2px dashed #e2e8f0', background: 'transparent' }}>
                    <h2 className="db-card-title">Rotator Quick Override</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        Manually pause all high-street rotations for emergency system maintenance.
                    </p>
                    <button className="db-btn db-btn-primary" style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
                        EMERGENCY SYSTEM PAUSE
                    </button>
                    <div style={{ marginTop: '1.5rem', background: '#fef2f2', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <p style={{ fontSize: '0.7rem', color: '#b91c1c', fontWeight: 700, margin: 0, textAlign: 'center' }}>
                            PAUSING SYSTEM WILL FALLBACK ALL STOREFRONTS TO BRANDED DEFAULT
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

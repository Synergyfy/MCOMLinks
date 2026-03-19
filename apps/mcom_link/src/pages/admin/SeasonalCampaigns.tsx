import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api/apiClient'

const isSeasonActive = (startDate: string, endDate: string) => {
    const now = new Date()
    return now >= new Date(startDate) && now <= new Date(endDate)
}

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export default function SeasonalCampaigns() {
    const [seasons, setSeasons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedSeason, setSelectedSeason] = useState<any>(null)
    const [newSeason, setNewSeason] = useState({ name: '', startDate: '', endDate: '' })

    const fetchSeasons = async () => {
        try {
            setLoading(true)
            const data = await api.get<any[]>('/admin/seasons')
            setSeasons(data)
        } catch (error) {
            console.error('Failed to fetch seasons:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSeasons()
    }, [])

    const openEditModal = (season: any) => {
        setSelectedSeason({ ...season })
        setIsEditModalOpen(true)
    }

    const handleUpdateSeason = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.patch(`/admin/seasons/${selectedSeason.id}`, {
                name: selectedSeason.name,
                startDate: selectedSeason.startDate.split('T')[0],
                endDate: selectedSeason.endDate.split('T')[0],
            })
            setIsEditModalOpen(false)
            fetchSeasons()
        } catch (error) {
            console.error('Failed to update season:', error)
            alert('Failed to update season.')
        }
    }

    const handleCreateSeason = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/admin/seasons', newSeason)
            setIsCreateModalOpen(false)
            setNewSeason({ name: '', startDate: '', endDate: '' })
            fetchSeasons()
        } catch (error) {
            console.error('Failed to create season:', error)
            alert('Failed to create season.')
        }
    }

    const handleDeleteSeason = async (id: string, name: string) => {
        if (!confirm(`Delete the "${name}" season? This cannot be undone.`)) return
        try {
            await api.delete(`/admin/seasons/${id}`)
            fetchSeasons()
        } catch (error) {
            console.error('Failed to delete season:', error)
            alert('Failed to delete season.')
        }
    }

    return (
        <AdminLayout title="Seasonal Automation">
            {/* 1. Global Timeline */}
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="db-card-title">Annual Campaign Roadmap</h2>
                    <button className="db-btn db-btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => setIsCreateModalOpen(true)}>
                        + New Season
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading seasons...</div>
                ) : seasons.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No seasons configured yet.</div>
                ) : (
                    <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        {seasons.map(season => {
                            const active = isSeasonActive(season.startDate, season.endDate)
                            return (
                                <div key={season.id} className="db-card" style={{
                                    padding: '1.5rem',
                                    background: active ? 'rgba(37, 99, 235, 0.05)' : '#fff',
                                    border: `2px solid ${active ? '#2563eb' : '#f1f5f9'}`,
                                    position: 'relative'
                                }}>
                                    {active && (
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', width: '10px', height: '10px', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }} />
                                    )}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.5rem' }}>{season.name}</h3>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {formatDate(season.startDate)} – {formatDate(season.endDate)}
                                    </div>
                                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                                        {active ? 'Offers are currently live in network' : 'Scheduled automation pending'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                        <button
                                            className="db-btn db-btn-ghost"
                                            style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
                                            onClick={() => openEditModal(season)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="db-btn db-btn-ghost"
                                            style={{ fontSize: '0.8rem', color: '#ef4444', padding: '0.4rem 0.6rem' }}
                                            onClick={() => handleDeleteSeason(season.id, season.name)}
                                            title="Delete season"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <div className="db-card">
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Priority Rule Engine</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '2rem' }}>
                        Define how priority "Boost" campaigns behave compared to primary sequence.
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
                    <div className="db-table-wrapper desktop-only">
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>Season</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th style={{ textAlign: 'right' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seasons.map(s => {
                                    const active = isSeasonActive(s.startDate, s.endDate)
                                    return (
                                        <tr key={s.id}>
                                            <td><b>{s.name}</b></td>
                                            <td>{formatDate(s.startDate)}</td>
                                            <td>{formatDate(s.endDate)}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <span className={`db-badge ${active ? 'db-badge-approved' : 'db-badge-draft'}`}>
                                                    {active ? 'LIVE' : 'QUEUED'}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {seasons.length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No seasons configured.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {seasons.map(s => {
                            const active = isSeasonActive(s.startDate, s.endDate)
                            return (
                                <div key={s.id} className="db-offer-card-mobile">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0a0a0a' }}>{s.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatDate(s.startDate)} – {formatDate(s.endDate)}</div>
                                        </div>
                                        <span className={`db-badge ${active ? 'db-badge-approved' : 'db-badge-draft'}`}>
                                            {active ? 'LIVE' : 'QUEUED'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Auto-activate enabled</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                        Offers with seasonal tags are automatically bypassed if the current system date is outside the defined range.
                    </p>
                </div>
            </div>

            {/* Edit Season Modal */}
            {isEditModalOpen && selectedSeason && (
                <div className="db-modal-overlay">
                    <div className="db-modal" style={{ maxWidth: '400px' }}>
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Adjust {selectedSeason.name} Dates</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSeason}>
                            <div className="db-modal-content">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Season Name</label>
                                        <input
                                            type="text"
                                            className="db-input"
                                            required
                                            value={selectedSeason.name}
                                            onChange={e => setSelectedSeason({ ...selectedSeason, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Campaign Start Date</label>
                                        <input
                                            type="date"
                                            className="db-input"
                                            required
                                            value={selectedSeason.startDate.split('T')[0]}
                                            onChange={e => setSelectedSeason({ ...selectedSeason, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Campaign End Date</label>
                                        <input
                                            type="date"
                                            className="db-input"
                                            required
                                            value={selectedSeason.endDate.split('T')[0]}
                                            onChange={e => setSelectedSeason({ ...selectedSeason, endDate: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                                        <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Automation will auto-apply to all tagged offers.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" className="db-btn db-btn-ghost" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                                <button type="submit" className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Update Cycle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Season Modal */}
            {isCreateModalOpen && (
                <div className="db-modal-overlay">
                    <div className="db-modal" style={{ maxWidth: '400px' }}>
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Create New Season</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <form onSubmit={handleCreateSeason}>
                            <div className="db-modal-content">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Season Name</label>
                                        <input
                                            type="text"
                                            className="db-input"
                                            required
                                            placeholder="e.g. Winter 2026"
                                            value={newSeason.name}
                                            onChange={e => setNewSeason({ ...newSeason, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="db-input"
                                            required
                                            value={newSeason.startDate}
                                            onChange={e => setNewSeason({ ...newSeason, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">End Date</label>
                                        <input
                                            type="date"
                                            className="db-input"
                                            required
                                            value={newSeason.endDate}
                                            onChange={e => setNewSeason({ ...newSeason, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" className="db-btn db-btn-ghost" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create Season</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

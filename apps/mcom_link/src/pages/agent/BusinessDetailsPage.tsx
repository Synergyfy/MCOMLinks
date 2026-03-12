import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AgentLayout from '../../components/AgentLayout'
import { api } from '../../api/apiClient'
import { type CommLog } from '../../mock/agents'

export default function BusinessDetailsPage() {
    const { id } = useParams()
    const [businessData, setBusinessData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newNote, setNewNote] = useState('')

    useEffect(() => {
        const fetchBusinessDetail = async () => {
            try {
                const data = await api.get<any>(`/agent/business/${id}`)
                setBusinessData(data)
            } catch (err) {
                console.error('Failed to fetch business details:', err)
                setError('Failed to load business details.')
            } finally {
                setLoading(false)
            }
        }
        fetchBusinessDetail()
    }, [id])

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newOffer, setNewOffer] = useState({
        headline: '',
        description: '',
        ctaType: 'claim' as any,
        ctaValue: '',
        startDate: '',
        endDate: '',
        isPremium: false,
        season: 'all' as any
    })

    if (loading) return (
        <AgentLayout title="Loading...">
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading business details...</div>
        </AgentLayout>
    )

    if (error || !businessData) return (
        <AgentLayout title="Error">
            <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>{error || 'Business not found'}</div>
        </AgentLayout>
    )

    const { business, performance, offers } = businessData
    const [logs, setLogs] = useState<CommLog[]>([]) // Backend doesn't return logs yet, keeping it as state for now

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newNote.trim()) return

        const newLog: CommLog = {
            id: `log-${Date.now()}`,
            businessId: id || '',
            date: new Date().toISOString(),
            note: newNote,
            type: 'meeting'
        }

        setLogs([newLog, ...logs])
        setNewNote('')
    }

    const handleAddOffer = (e: React.FormEvent) => {
        e.preventDefault()
        alert('Offer draft created and sent to merchant for review!')
        setIsAddModalOpen(false)
        setNewOffer({
            headline: '',
            description: '',
            ctaType: 'claim',
            ctaValue: '',
            startDate: '',
            endDate: '',
            isPremium: false,
            season: 'all'
        })
    }

    return (
        <AgentLayout title={`Manage: ${business.name}`}>
            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>

                {/* Left Column: Business Info & Logs - Step 8 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 800 }}>Account Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#94a3b8' }}>Owner:</span>
                                <span style={{ fontWeight: 700 }}>{business.owner}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#94a3b8' }}>Contact:</span>
                                <span style={{ fontWeight: 700 }}>{business.phone}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#94a3b8' }}>Plan:</span>
                                <span className="db-badge db-badge-approved" style={{ fontSize: '0.7rem' }}>{business.plan}</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <div className="db-stat-card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Scans</div>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{performance.totalScans}</div>
                            </div>
                            <div className="db-stat-card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Claims</div>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{performance.totalClaims}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>Edit Account</button>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', color: '#ef4444' }}>Suspend</button>
                        </div>
                    </div>

                    <div className="db-card">
                        <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Relationship Log</h2>

                        <form onSubmit={handleAddLog} style={{ marginBottom: '2rem' }}>
                            <textarea
                                className="db-input"
                                placeholder="Log a call summary or meeting note..."
                                style={{ width: '100%', height: '80px', resize: 'none', marginBottom: '0.75rem' }}
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                            />
                            <button type="submit" className="db-btn db-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Add Note
                            </button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {logs.map(log => (
                                <div key={log.id} style={{ paddingLeft: '1rem', borderLeft: '3px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 700 }}>
                                        {new Date(log.date).toLocaleDateString()} — {log.type.toUpperCase()}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: '#334155' }}>
                                        {log.note}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Content & Performance - Step 6 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="db-card-title">Live & Scheduled Offers</h2>
                            <button className="db-btn db-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setIsAddModalOpen(true)}>
                                + Add Offer
                            </button>
                        </div>

                        <div className="db-table-wrapper">
                            <table className="db-table">
                                <thead>
                                    <tr>
                                        <th>Offer Name</th>
                                        <th>Status</th>
                                        <th>Engagement</th>
                                        <th style={{ textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer: any) => (
                                        <tr key={offer.id}>
                                            <td><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{offer.headline}</div></td>
                                            <td><span className={`db-badge db-badge-${offer.status}`}>{offer.status}</span></td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem' }}>
                                                    <b>{offer.scans || 0}</b> scans
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="db-card" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Agent Recommendation</h3>
                        <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                            This business is performing <b>20% above</b> the zone average. Consider suggesting a <b>Premium Boost</b> for their next campaign to capitalize on the momentum.
                        </p>
                        <button className="db-btn db-btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                            Propose Boost Package
                        </button>
                    </div>
                </div>

            </div>

            {/* Add Offer Modal */}
            {isAddModalOpen && (
                <div className="db-modal-overlay">
                    <div className="db-modal">
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Draft New Offer for {business.name}</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <form onSubmit={handleAddOffer}>
                            <div className="db-modal-content">
                                <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div className="db-form-group">
                                            <label className="db-label">Offer Headline</label>
                                            <input type="text" className="db-input" required placeholder="e.g. 20% Off Footwear" value={newOffer.headline} onChange={e => setNewOffer({ ...newOffer, headline: e.target.value })} />
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">Campaign Description</label>
                                            <textarea className="db-input" required style={{ height: '80px', resize: 'none' }} placeholder="Max 150 characters..." value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} />
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">CTA Strategy</label>
                                            <select className="db-input" value={newOffer.ctaType} onChange={e => setNewOffer({ ...newOffer, ctaType: e.target.value as any })}>
                                                <option value="claim">Lead Generation (Claim)</option>
                                                <option value="redeem">Direct Sale (Promo Code)</option>
                                                <option value="redirect">Web Traffic (Redirect)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {newOffer.ctaType === 'redirect' && (
                                            <div className="db-form-group">
                                                <label className="db-label">Destination Link</label>
                                                <input type="url" className="db-input" required placeholder="https://..." value={newOffer.ctaValue} onChange={e => setNewOffer({ ...newOffer, ctaValue: e.target.value })} />
                                            </div>
                                        )}
                                        {newOffer.ctaType === 'redeem' && (
                                            <div className="db-form-group">
                                                <label className="db-label">Promo Code</label>
                                                <input type="text" className="db-input" required placeholder="e.g. AGENT20" value={newOffer.ctaValue} onChange={e => setNewOffer({ ...newOffer, ctaValue: e.target.value })} />
                                            </div>
                                        )}
                                        {newOffer.ctaType === 'claim' && (
                                            <div className="db-form-group">
                                                <label className="db-label">Claim Target (Email/Phone)</label>
                                                <input type="text" className="db-input" required placeholder="e.g. shop@email.com" value={newOffer.ctaValue} onChange={e => setNewOffer({ ...newOffer, ctaValue: e.target.value })} />
                                            </div>
                                        )}
                                        <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="db-form-group">
                                                <label className="db-label">Start Date</label>
                                                <input type="date" className="db-input" required value={newOffer.startDate} onChange={e => setNewOffer({ ...newOffer, startDate: e.target.value })} />
                                            </div>
                                            <div className="db-form-group">
                                                <label className="db-label">End Date</label>
                                                <input type="date" className="db-input" required value={newOffer.endDate} onChange={e => setNewOffer({ ...newOffer, endDate: e.target.value })} />
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <input type="checkbox" id="premium-toggle" checked={newOffer.isPremium} onChange={e => setNewOffer({ ...newOffer, isPremium: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                            <div>
                                                <label htmlFor="premium-toggle" style={{ fontWeight: 800, fontSize: '0.85rem', display: 'block' }}>Suggest Premium Boost</label>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Merchant must authorize upgrade.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" className="db-btn db-btn-ghost" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit Draft to Merchant</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AgentLayout>
    )
}

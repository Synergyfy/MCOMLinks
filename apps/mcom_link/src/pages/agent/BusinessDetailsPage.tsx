import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AgentLayout from '../../components/AgentLayout'
import { mockCommLogs, type CommLog } from '../../mock/agents'
import { mockOffers } from '../../mock/offers'

export default function BusinessDetailsPage() {
    const { id } = useParams()
    const [logs, setLogs] = useState<CommLog[]>(mockCommLogs.filter(l => l.businessId === id))
    const [newNote, setNewNote] = useState('')

    // Simulate business data fetching
    const business = {
        id: id,
        name: "Bella's Boutique",
        owner: "Isabella Rossi",
        email: "isabella@bellas.com",
        phone: "+44 7700 900011",
        plan: "Premium",
        joined: "Oct 2025"
    }

    const businessOffers = mockOffers.filter(o => o.businessName === business.name)

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

    return (
        <AgentLayout title={`Manage: ${business.name}`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>

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
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
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
                            <button className="db-btn db-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
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
                                    {businessOffers.map(offer => (
                                        <tr key={offer.id}>
                                            <td><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{offer.headline}</div></td>
                                            <td><span className={`db-badge db-badge-${offer.status}`}>{offer.status}</span></td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem' }}>
                                                    <b>{offer.performance.scans}</b> scans
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
        </AgentLayout>
    )
}

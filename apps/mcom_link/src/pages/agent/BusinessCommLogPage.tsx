import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AgentLayout from '../../components/AgentLayout'
import { mockCommLogs, type CommLog } from '../../mock/agents'

export default function BusinessCommLogPage() {
    const { id } = useParams()
    const [logs, setLogs] = useState<CommLog[]>(mockCommLogs.filter(l => l.businessId === id))
    const [newNote, setNewNote] = useState('')
    const [noteType, setNoteType] = useState<'call' | 'meeting' | 'email'>('call')

    // Simulate business data fetching
    const businessName = id === 'biz-001' ? "Bella's Boutique" :
        id === 'biz-002' ? "The Daily Grind" :
            id === 'biz-003' ? "FitLife Gym" : "Business Portfolio"

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newNote.trim()) return

        const newLog: CommLog = {
            id: `log-${Date.now()}`,
            businessId: id || '',
            date: new Date().toISOString(),
            note: newNote,
            type: noteType
        }

        setLogs([newLog, ...logs])
        setNewNote('')
    }

    return (
        <AgentLayout title={`Communication History: ${businessName}`}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Back Link */}
                <Link to="/agent/portfolio" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    Back to Portfolio
                </Link>

                {/* 1. Log New Contact Form */}
                <div className="db-card animate-fade-in" style={{ marginBottom: '2.5rem' }}>
                    <h2 className="db-card-title" style={{ marginBottom: '1.5rem' }}>Log New Interaction</h2>
                    <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
                            <div className="db-form-group">
                                <label className="db-label">Contact Method</label>
                                <select
                                    className="db-input"
                                    value={noteType}
                                    onChange={e => setNoteType(e.target.value as any)}
                                >
                                    <option value="call">📞 Phone Call</option>
                                    <option value="meeting">🤝 In-Person Meeting</option>
                                    <option value="email">📧 Email / Message</option>
                                </select>
                            </div>
                            <div className="db-form-group">
                                <label className="db-label">Interaction Details</label>
                                <textarea
                                    className="db-input"
                                    placeholder="What was discussed? Any follow-up actions?"
                                    style={{ height: '100px', resize: 'none' }}
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="db-btn db-btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                Save Log Entry
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. Timeline of interactions */}
                <div className="db-card animate-fade-in" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                    <h2 className="db-card-title" style={{ marginBottom: '2rem' }}>Historical Timeline</h2>

                    <div style={{ position: 'relative' }}>
                        {/* Timeline vertical bar */}
                        <div style={{ position: 'absolute', top: 0, left: '20px', bottom: 0, width: '2px', background: '#e2e8f0', zIndex: 0 }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>
                            {logs.map((log) => (
                                <div key={log.id} style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        background: log.type === 'call' ? '#ebf5ff' : log.type === 'meeting' ? '#f0fdf4' : '#f8fafc',
                                        color: log.type === 'call' ? '#2563eb' : log.type === 'meeting' ? '#10b981' : '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 0 4px #fff',
                                        flexShrink: 0
                                    }}>
                                        {log.type === 'call' ? '📞' : log.type === 'meeting' ? '🤝' : '📧'}
                                    </div>
                                    <div className="db-card" style={{ flex: 1, padding: '1.5rem', marginBottom: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', color: '#64748b' }}>
                                                {log.type} entry
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                                                {new Date(log.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#0a0a0a', lineHeight: '1.6' }}>
                                            {log.note}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {logs.length === 0 && (
                                <div style={{ paddingLeft: '4rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                    No previous communication recorded for this business.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AgentLayout>
    )
}

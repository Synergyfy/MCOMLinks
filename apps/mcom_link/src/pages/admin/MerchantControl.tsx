import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function MerchantControl() {
    const [merchants, setMerchants] = useState([
        { id: 'm-001', name: 'Bella\'s Boutique', owner: 'Isabella Rossi', email: 'isabella@bellas.com', plan: 'Premium', status: 'active', joined: '2025-10-12' },
        { id: 'm-002', name: 'The Daily Grind', owner: 'Marcus Aurelius', email: 'marcus@grind.com', plan: 'Basic', status: 'active', joined: '2025-11-05' },
        { id: 'm-003', name: 'FitLife Gym', owner: 'Sarah Fit', email: 'sarah@fitlife.co.uk', plan: 'Basic', status: 'suspended', joined: '2026-01-20' },
        { id: 'm-004', name: 'Bloom & Wild', owner: 'Daisy Petal', email: 'daisy@bloom.com', plan: 'Premium', status: 'active', joined: '2026-02-14' }
    ])

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('action') === 'add') {
            setIsAddModalOpen(true)
            // Remove the query param without refreshing to avoid re-opening on back/nav
            window.history.replaceState({}, document.title, window.location.pathname)
        }
    }, [])

    const [searchTerm, setSearchTerm] = useState('')
    const [newMerchant, setNewMerchant] = useState({
        name: '',
        owner: '',
        email: '',
        plan: 'Basic'
    })

    const filteredMerchants = merchants.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.owner.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddMerchant = (e: React.FormEvent) => {
        e.preventDefault()
        const id = `m-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        const merchant = {
            ...newMerchant,
            id,
            status: 'active',
            joined: new Date().toISOString().split('T')[0]
        }
        setMerchants([...merchants, merchant])
        setIsAddModalOpen(false)
        setNewMerchant({ name: '', owner: '', email: '', plan: 'Basic' })
    }

    return (
        <AdminLayout title="Business Governance">
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h2 className="db-card-title">Merchant Directory</h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Management of individual business accounts and their billing status.</p>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="db-input"
                                placeholder="Filter merchants..."
                                style={{ paddingLeft: '2.5rem', width: '200px', fontSize: '0.85rem' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>
                    <button className="db-btn db-btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Onboard Merchant</button>
                </div>

                {/* Desktop View */}
                <div className="db-table-wrapper desktop-only">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Merchant & ID</th>
                                <th>Account Owner</th>
                                <th>Account Tier</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Governance Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMerchants.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ fontWeight: 800 }}>{m.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {m.id}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{m.owner}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{m.email}</div>
                                    </td>
                                    <td>
                                        <span className={`db-badge ${m.plan === 'Premium' ? 'db-badge-approved' : 'db-badge-draft'}`}>
                                            {m.plan}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`db-badge db-badge-${m.status === 'active' ? 'approved' : 'rejected'}`}>
                                            {m.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="db-btn db-btn-ghost" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Invoices</button>
                                            <button
                                                className="db-btn db-btn-ghost"
                                                style={{ fontSize: '0.75rem', fontWeight: 800, color: m.status === 'active' ? '#ef4444' : '#10b981' }}
                                                onClick={() => setMerchants(merchants.map(m2 => m2.id === m.id ? { ...m2, status: m2.status === 'active' ? 'suspended' : 'active' } : m2))}
                                            >
                                                {m.status === 'active' ? 'Suspend' : 'Reactivate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredMerchants.map(m => (
                        <div key={m.id} className="db-offer-card-mobile">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0a0a0a' }}>{m.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {m.id}</div>
                                </div>
                                <span className={`db-badge db-badge-${m.status === 'active' ? 'approved' : 'rejected'}`}>
                                    {m.status.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Owner</div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{m.owner}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.email}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Account Tier</div>
                                    <span style={{ display: 'inline-block', marginTop: '0.25rem' }} className={`db-badge ${m.plan === 'Premium' ? 'db-badge-approved' : 'db-badge-draft'}`}>
                                        {m.plan}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                                    Invoices
                                </button>
                                <button
                                    className="db-btn db-btn-ghost"
                                    style={{ flex: 1, justifyContent: 'center', color: m.status === 'active' ? '#ef4444' : '#10b981' }}
                                    onClick={() => setMerchants(merchants.map(m2 => m2.id === m.id ? { ...m2, status: m2.status === 'active' ? 'suspended' : 'active' } : m2))}
                                >
                                    {m.status === 'active' ? 'Suspend' : 'Reactivate'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Onboard Merchant Modal */}
            {isAddModalOpen && (
                <div className="db-modal-overlay">
                    <div className="db-modal" style={{ maxWidth: '500px' }}>
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Onboard New Business</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="db-btn-close">&times;</button>
                        </div>
                        <form onSubmit={handleAddMerchant}>
                            <div className="db-modal-content">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Business Name</label>
                                        <input type="text" className="db-input" required placeholder="e.g. Piccadilly Pigeons Café" value={newMerchant.name} onChange={e => setNewMerchant({ ...newMerchant, name: e.target.value })} />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Owner Name</label>
                                        <input type="text" className="db-input" required placeholder="Full name of primary contact" value={newMerchant.owner} onChange={e => setNewMerchant({ ...newMerchant, owner: e.target.value })} />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Contact Email</label>
                                        <input type="email" className="db-input" required placeholder="owner@business.com" value={newMerchant.email} onChange={e => setNewMerchant({ ...newMerchant, email: e.target.value })} />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Subscription Tier</label>
                                        <select className="db-input" value={newMerchant.plan} onChange={e => setNewMerchant({ ...newMerchant, plan: e.target.value })}>
                                            <option value="Basic">Basic (£29/mo)</option>
                                            <option value="Premium">Premium (£79/mo)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" className="db-btn db-btn-ghost" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Provision Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

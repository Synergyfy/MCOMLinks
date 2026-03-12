import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api/apiClient'

export default function MerchantControl() {
    const [merchants, setMerchants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('action') === 'add') {
            setIsAddModalOpen(true)
            window.history.replaceState({}, document.title, window.location.pathname)
        }
        fetchMerchants()
    }, [])

    const [searchTerm, setSearchTerm] = useState('')
    const [newMerchant, setNewMerchant] = useState({
        name: '',
        ownerName: '',
        email: '',
        plan: 'Basic'
    })

    const fetchMerchants = async () => {
        try {
            setLoading(true)
            const data = await api.get<any[]>('/admin/merchants')
            setMerchants(data)
        } catch (error) {
            console.error('Failed to fetch merchants:', error)
        } finally {
            setLoading(false)
        }
    }

    // Normalise merchant data from multiple shapes
    const normaliseMerchant = (m: any) => ({
        id: m.id,
        name: m.name,
        owner: m.ownerName || m.user?.name || '',
        email: m.contactEmail || m.user?.email || '',
        plan: m.plan || 'Basic',
        status: m.subscriptionStatus || m.status || 'active',
        joined: m.createdAt ? m.createdAt.split('T')[0] : ''
    })

    const filteredMerchants = merchants.map(normaliseMerchant).filter(m =>
        (m.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.owner?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const handleAddMerchant = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/admin/merchants/onboard', newMerchant)
            setIsAddModalOpen(false)
            setNewMerchant({ name: '', ownerName: '', email: '', plan: 'Basic' })
            fetchMerchants()
        } catch (error) {
            console.error('Failed to onboard merchant:', error)
            alert('Failed to onboard merchant. Please try again.')
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
        try {
            await api.patch(`/admin/merchants/${id}/status`, { status: newStatus })
            fetchMerchants()
        } catch (error) {
            console.error('Failed to update merchant status:', error)
            alert('Failed to update merchant status.')
        }
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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading merchants...</div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="db-table-wrapper desktop-only">
                            <table className="db-table">
                                <thead>
                                    <tr>
                                        <th>Merchant &amp; ID</th>
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
                                                        onClick={() => handleToggleStatus(m.id, m.status)}
                                                    >
                                                        {m.status === 'active' ? 'Suspend' : 'Reactivate'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMerchants.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No merchants found.</td>
                                        </tr>
                                    )}
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
                                            onClick={() => handleToggleStatus(m.id, m.status)}
                                        >
                                            {m.status === 'active' ? 'Suspend' : 'Reactivate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredMerchants.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No merchants found.</div>
                            )}
                        </div>
                    </>
                )}
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
                                        <input type="text" className="db-input" required placeholder="Full name of primary contact" value={newMerchant.ownerName} onChange={e => setNewMerchant({ ...newMerchant, ownerName: e.target.value })} />
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

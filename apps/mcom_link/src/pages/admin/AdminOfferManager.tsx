import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api/apiClient'
import { mockSeasons } from '../../mock/admin'

const STATUS_TABS = ['all', 'approved', 'submitted', 'draft', 'rejected', 'expired'] as const
type StatusTab = typeof STATUS_TABS[number]

export default function AdminOfferManager() {
    const [offers, setOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<StatusTab>('all')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')

    // Rejection modal state
    const [rejectTarget, setRejectTarget] = useState<string | null>(null)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            if (newOffer.mediaType === 'image') {
                setNewOffer({ ...newOffer, imageUrl: url })
            } else {
                setNewOffer({ ...newOffer, videoUrl: url })
            }
        }
    }

    const [newOffer, setNewOffer] = useState({
        businessName: '',
        headline: '',
        description: '',
        ctaType: 'claim' as any,
        ctaLabel: 'Claim This Offer',
        ctaValue: '',
        mediaType: 'image' as 'image' | 'video',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        videoUrl: '',
        startDate: '',
        endDate: '',
        location: 'High Street Central',
        isPremium: false,
        season: 'all' as any,
        visibility: 'national' as 'national' | 'hyperlocal',
        targetPostcode: ''
    })

    const fetchOffers = async () => {
        try {
            setLoading(true)
            const data = await api.get<any[]>('/admin/offers')
            setOffers(data)
        } catch (error) {
            console.error('Failed to fetch offers:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOffers()
    }, [])

    const pendingOffers = offers.filter(o => o.status === 'submitted')

    const filteredOffers = filter === 'all' ? offers : offers.filter(o => o.status === filter)

    const handleApprove = async (id: string) => {
        try {
            await api.patch(`/admin/offers/${id}/status`, { status: 'approved' })
            fetchOffers() // Refresh list
        } catch (error) {
            console.error('Failed to approve offer:', error)
            alert('Failed to approve offer')
        }
    }

    const openRejectModal = (id: string) => {
        setRejectTarget(id)
        setRejectionReason('')
    }

    const handleConfirmReject = async () => {
        if (!rejectTarget || !rejectionReason.trim()) return
        try {
            await api.patch(`/admin/offers/${rejectTarget}/status`, { status: 'rejected', rejectionReason })
            setRejectTarget(null)
            setRejectionReason('')
            fetchOffers() // Refresh list
        } catch (error) {
            console.error('Failed to reject offer:', error)
            alert('Failed to reject offer')
        }
    }

    const handleArchive = async (id: string) => {
        if (confirm('Archive this offer? It will be removed from rotation but kept in analytics history.')) {
            try {
                await api.delete(`/admin/offers/${id}`)
                fetchOffers() // Refresh list
            } catch (error) {
                console.error('Failed to archive offer:', error)
                alert('Failed to archive offer')
            }
        }
    }

    const handleDuplicate = async (id: string) => {
        try {
            await api.post(`/admin/offers/${id}/duplicate`, {})
            fetchOffers() // Refresh list
        } catch (error) {
            console.error('Failed to duplicate offer:', error)
            alert('Failed to duplicate offer')
        }
    }

    const handleAddOffer = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                businessName: newOffer.businessName,
                headline: newOffer.headline,
                description: newOffer.description,
                ctaType: newOffer.ctaType,
                ctaLabel: newOffer.ctaLabel,
                ctaValue: newOffer.ctaValue,
                mediaType: newOffer.mediaType,
                imageUrl: newOffer.imageUrl,
                videoUrl: newOffer.videoUrl,
                startDate: newOffer.startDate,
                endDate: newOffer.endDate,
                visibility: newOffer.visibility,
                targetPostcode: newOffer.targetPostcode,
                isPremium: newOffer.isPremium,
                assignedLocation: newOffer.location,
                seasonId: newOffer.season !== 'all' ? newOffer.season : undefined,
            }

            await api.post('/admin/offers', payload)
            setIsAddModalOpen(false)
            fetchOffers() // Refresh list
            setNewOffer({
                businessName: '',
                headline: '',
                description: '',
                ctaType: 'claim',
                ctaLabel: 'Claim This Offer',
                ctaValue: '',
                mediaType: 'image',
                imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
                videoUrl: '',
                startDate: '',
                endDate: '',
                location: 'High Street Central',
                isPremium: false,
                season: 'all',
                visibility: 'national',
                targetPostcode: ''
            })
        } catch (error) {
            console.error('Failed to create global offer:', error)
            alert('Failed to create global offer')
        }
    }


    return (
        <AdminLayout title="Global Offer Inventory">

            {/* Pending Approval Banner */}
            {!loading && pendingOffers.length > 0 && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.25rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px', height: '40px', background: '#f59e0b',
                            borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0a0a0a' }}>
                                {pendingOffers.length} Offer{pendingOffers.length > 1 ? 's' : ''} Awaiting Approval
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.1rem' }}>
                                Business owners are waiting for your review
                            </div>
                        </div>
                    </div>
                    <button
                        className="db-btn db-btn-ghost"
                        style={{ fontSize: '0.8rem', fontWeight: 800, borderColor: 'rgba(245,158,11,0.4)', color: '#92400e' }}
                        onClick={() => setFilter('submitted')}
                    >
                        Review Pending →
                    </button>
                </div>
            )}

            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h2 className="db-card-title">All System Offers</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            Full visibility and override control across all merchant campaigns.
                        </p>
                    </div>
                    <button className="db-btn db-btn-primary" onClick={() => setIsAddModalOpen(true)}>
                        + Create Global Offer
                    </button>
                </div>

                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem', flexWrap: 'wrap' }}>
                    {STATUS_TABS.map(tab => {
                        const count = tab === 'all' ? offers.length : offers.filter(o => o.status === tab).length
                        const isActive = filter === tab
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`db-btn ${isActive ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', textTransform: 'capitalize', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                {tab === 'submitted' ? 'Pending' : tab}
                                {tab === 'submitted' && count > 0 ? (
                                    <span style={{
                                        background: isActive ? 'rgba(255,255,255,0.3)' : '#f59e0b',
                                        color: isActive ? '#fff' : '#fff',
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        padding: '1px 6px',
                                        borderRadius: '10px',
                                        lineHeight: 1.4
                                    }}>{count}</span>
                                ) : (
                                    <span style={{
                                        background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                                        color: isActive ? '#fff' : '#94a3b8',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        padding: '1px 6px',
                                        borderRadius: '10px',
                                        lineHeight: 1.4
                                    }}>{count}</span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Desktop Table */}
                {!loading ? (
                    <div className="db-table-wrapper desktop-only">
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>Offer Details</th>
                                    <th>Status</th>
                                    <th>Type</th>
                                    <th>Performance</th>
                                    <th>Schedule</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOffers.map(offer => (
                                    <tr key={offer.id}>
                                        {/* Offer Details */}
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                {offer.mediaType === 'video' ? (
                                                    <div style={{ width: '44px', height: '44px', borderRadius: '0.5rem', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={offer.imageUrl}
                                                        alt={offer.headline}
                                                        style={{ width: '44px', height: '44px', borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }}
                                                    />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{offer.businessName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{offer.headline}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>ID: {offer.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td>
                                            <span className={`db-badge db-badge-${offer.status}`}>
                                                {offer.status === 'submitted' ? 'PENDING' : offer.status.toUpperCase()}
                                            </span>
                                            {offer.status === 'rejected' && (offer as any).rejectionReason && (
                                                <div style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: '0.35rem', maxWidth: '160px' }} title={(offer as any).rejectionReason}>
                                                    {(offer as any).rejectionReason.slice(0, 40)}{(offer as any).rejectionReason.length > 40 ? '…' : ''}
                                                </div>
                                            )}
                                        </td>

                                        {/* Type */}
                                        <td>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                                {offer.ctaType}
                                            </div>
                                            {offer.isPremium && (
                                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>★ Premium</div>
                                            )}
                                        </td>

                                        {/* Performance */}
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{offer.scans} Scans</div>
                                            <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                                                {offer.scans > 0
                                                    ? ((offer.claims / offer.scans) * 100).toFixed(1)
                                                    : 0}% Conv.
                                            </div>
                                        </td>

                                        {/* Schedule */}
                                        <td>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{offer.startDate}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>to {offer.endDate}</div>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'nowrap' }}>
                                                {offer.status === 'submitted' && (
                                                    <>
                                                        <button
                                                            className="db-btn"
                                                            title="Approve"
                                                            onClick={() => handleApprove(offer.id)}
                                                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '0.5rem' }}
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            className="db-btn"
                                                            title="Reject"
                                                            onClick={() => openRejectModal(offer.id)}
                                                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '0.5rem' }}
                                                        >
                                                            ✕ Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} title="Duplicate" onClick={() => handleDuplicate(offer.id)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                                </button>
                                                <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} title="Archive" onClick={() => handleArchive(offer.id)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOffers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                            No offers found in this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        Loading offers...
                    </div>
                )}

                {/* Mobile Cards */}
                {!loading && (
                    <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredOffers.map(offer => (
                            <div key={offer.id} className="db-offer-card-mobile">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
                                        {offer.mediaType === 'video' ? (
                                            <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                            </div>
                                        ) : (
                                            <img src={offer.imageUrl} alt={offer.headline} style={{ width: '48px', height: '48px', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }} />
                                        )}
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0a0a0a' }}>{offer.businessName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{offer.headline}</div>
                                        </div>
                                    </div>
                                    <span className={`db-badge db-badge-${offer.status}`} style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                                        {offer.status === 'submitted' ? 'PENDING' : offer.status.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Type</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>{offer.ctaType}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scans</div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{offer.scans}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Conv.</div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>
                                            {offer.scans > 0 ? ((offer.claims / offer.scans) * 100).toFixed(1) : 0}%
                                        </div>
                                    </div>
                                </div>

                                {offer.status === 'submitted' && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <button
                                            className="db-btn"
                                            style={{ flex: 1, justifyContent: 'center', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontWeight: 800, fontSize: '0.8rem' }}
                                            onClick={() => handleApprove(offer.id)}
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            className="db-btn"
                                            style={{ flex: 1, justifyContent: 'center', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 800, fontSize: '0.8rem' }}
                                            onClick={() => openRejectModal(offer.id)}
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDuplicate(offer.id)}>Duplicate</button>
                                    <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center', color: '#ef4444' }} onClick={() => handleArchive(offer.id)}>Archive</button>
                                </div>
                            </div>
                        ))}
                        {filteredOffers.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No offers found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Rejection Reason Modal */}
            {rejectTarget && (
                <div className="db-modal-overlay" onClick={() => setRejectTarget(null)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Reject Offer</h3>
                            <button onClick={() => setRejectTarget(null)} className="db-btn-close">&times;</button>
                        </div>
                        <div className="db-modal-content">
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                                Provide a clear reason so the business owner can correct and resubmit their offer.
                            </p>
                            <div className="db-form-group">
                                <label className="db-label">Rejection Reason</label>
                                <textarea
                                    className="db-input"
                                    style={{ height: '100px', resize: 'none' }}
                                    placeholder="e.g. Headline contains excessive emojis. Please follow our branding guidelines."
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRejectTarget(null)}>Cancel</button>
                            <button
                                className="db-btn"
                                style={{ flex: 1, justifyContent: 'center', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800 }}
                                onClick={handleConfirmReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Global Offer Modal */}
            {isAddModalOpen && (
                <div className="db-modal-overlay">
                    <div className="db-modal">
                        <div className="db-modal-header">
                            <h3 className="db-card-title">Create Global Campaign Offer</h3>
                            <button onClick={() => { setIsAddModalOpen(false); setUploadMode('url'); }} className="db-btn-close">&times;</button>
                        </div>
                        <form onSubmit={handleAddOffer}>
                            <div className="db-modal-content">
                                <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div className="db-form-group">
                                            <label className="db-label">Business Name</label>
                                            <input type="text" className="db-input" required placeholder="e.g. Marco's Pizza" value={newOffer.businessName} onChange={e => setNewOffer({ ...newOffer, businessName: e.target.value })} />
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">Offer Headline</label>
                                            <input type="text" className="db-input" required placeholder="e.g. 50% Off Large Pizzas" value={newOffer.headline} onChange={e => setNewOffer({ ...newOffer, headline: e.target.value })} />
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">Short Description</label>
                                            <textarea className="db-input" required style={{ height: '60px', resize: 'none' }} placeholder="Max 150 characters..." value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} />
                                        </div>

                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <label className="db-label" style={{ margin: 0 }}>Offer Visual</label>
                                                <div style={{ display: 'flex', gap: '0.25rem', padding: '0.15rem', background: '#e2e8f0', borderRadius: '0.4rem' }}>
                                                    <button type="button" onClick={() => setUploadMode('url')} style={{ padding: '0.15rem 0.4rem', border: 'none', background: uploadMode === 'url' ? '#fff' : 'transparent', borderRadius: '0.3rem', fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer' }}>🔗 Link</button>
                                                    <button type="button" onClick={() => setUploadMode('file')} style={{ padding: '0.15rem 0.4rem', border: 'none', background: uploadMode === 'file' ? '#fff' : 'transparent', borderRadius: '0.3rem', fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer' }}>📁 File</button>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <button type="button" onClick={() => setNewOffer({ ...newOffer, mediaType: 'image' })} className={`db-btn ${newOffer.mediaType === 'image' ? 'db-btn-primary' : 'db-btn-ghost'}`} style={{ flex: 1, padding: '0.25rem' }}>📷 Image</button>
                                                <button type="button" onClick={() => setNewOffer({ ...newOffer, mediaType: 'video' })} className={`db-btn ${newOffer.mediaType === 'video' ? 'db-btn-primary' : 'db-btn-ghost'}`} style={{ flex: 1, padding: '0.25rem' }}>🎥 Video</button>
                                            </div>
                                            {uploadMode === 'url' ? (
                                                <input type="url" className="db-input" required
                                                    placeholder={newOffer.mediaType === 'image' ? 'Image URL...' : 'Video URL...'}
                                                    value={newOffer.mediaType === 'image' ? newOffer.imageUrl : newOffer.videoUrl}
                                                    onChange={e => setNewOffer(prev => newOffer.mediaType === 'image' ? { ...prev, imageUrl: e.target.value } : { ...prev, videoUrl: e.target.value })}
                                                />
                                            ) : (
                                                <label className="db-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: '#fff', border: '1px dashed #cbd5e1', padding: '0.5rem' }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{newOffer.mediaType === 'image' ? 'Upload Image' : 'Upload Video'}</span>
                                                    <input type="file" accept={newOffer.mediaType === 'image' ? 'image/*' : 'video/*'} style={{ display: 'none' }} onChange={handleFileUpload} />
                                                </label>
                                            )}
                                        </div>

                                        <div className="db-form-group">
                                            <label className="db-label">CTA Type</label>
                                            <select className="db-input" value={newOffer.ctaType} onChange={e => setNewOffer({ ...newOffer, ctaType: e.target.value as any })}>
                                                <option value="claim">Lead Claim (Email/Phone)</option>
                                                <option value="redeem">Direct Promo Code</option>
                                                <option value="redirect">External Website Visit</option>
                                            </select>
                                        </div>
                                        {newOffer.ctaType === 'redirect' && (
                                            <div className="db-form-group">
                                                <label className="db-label">Destination Link</label>
                                                <input type="url" className="db-input" required placeholder="https://..." value={newOffer.ctaValue} onChange={e => setNewOffer({ ...newOffer, ctaValue: e.target.value })} />
                                            </div>
                                        )}
                                        {newOffer.ctaType === 'redeem' && (
                                            <div className="db-form-group">
                                                <label className="db-label">Promo Code</label>
                                                <input type="text" className="db-input" required placeholder="e.g. SAVE20" value={newOffer.ctaValue} onChange={e => setNewOffer({ ...newOffer, ctaValue: e.target.value })} />
                                            </div>
                                        )}
                                        {newOffer.ctaType === 'claim' && (
                                            <div className="db-form-group">
                                                <label className="db-label">Claim Contact (Email/Phone)</label>
                                                <input type="text" className="db-input" required placeholder="e.g. offers@marco.com" value={newOffer.ctaValue} onChange={e => setNewOffer({ ...newOffer, ctaValue: e.target.value })} />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                                        <div className="db-form-group">
                                            <label className="db-label">Assigned Location</label>
                                            <select className="db-input" value={newOffer.location} onChange={e => setNewOffer({ ...newOffer, location: e.target.value })}>
                                                <option>High Street Central</option>
                                                <option>Mall North Wing</option>
                                                <option>East Plaza Square</option>
                                                <option>West End Hub</option>
                                            </select>
                                        </div>

                                        <div className="db-form-group">
                                            <label className="db-label">Seasonal Automation</label>
                                            <select className="db-input" value={newOffer.season} onChange={e => {
                                                const selectedValue = e.target.value
                                                const seasonData = mockSeasons.find(s => s.id === `s-${selectedValue}`)
                                                if (seasonData) {
                                                    setNewOffer({ ...newOffer, season: selectedValue as any, startDate: seasonData.startDate, endDate: seasonData.endDate })
                                                } else {
                                                    setNewOffer({ ...newOffer, season: selectedValue as any })
                                                }
                                            }}>
                                                <option value="all">Evergreen (Default)</option>
                                                <option value="winter">Winter Campaign</option>
                                                <option value="spring">Spring Campaign</option>
                                                <option value="summer">Summer Campaign</option>
                                                <option value="autumn">Autumn Campaign</option>
                                            </select>
                                        </div>

                                        <div style={{ padding: '1.25rem', background: '#f0f9ff', borderRadius: '1rem', border: '1px solid #bae6fd' }}>
                                            <label className="db-label">Campaign Visibility</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <button type="button" onClick={() => setNewOffer({ ...newOffer, visibility: 'national' })} className={`db-btn ${newOffer.visibility === 'national' ? 'db-btn-primary' : 'db-btn-ghost'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}>🌐 National</button>
                                                <button type="button" onClick={() => setNewOffer({ ...newOffer, visibility: 'hyperlocal' })} className={`db-btn ${newOffer.visibility === 'hyperlocal' ? 'db-btn-primary' : 'db-btn-ghost'}`} style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}>📍 Hyperlocal</button>
                                            </div>
                                            {newOffer.visibility === 'hyperlocal' ? (
                                                <div>
                                                    <label className="db-label">Target Area (Postcode)</label>
                                                    <input type="text" className="db-input" placeholder="e.g. W1F 0AA" value={newOffer.targetPostcode} onChange={e => setNewOffer({ ...newOffer, targetPostcode: e.target.value.toUpperCase() })} required />
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>National offers appear across all standard rotator hubs in the country.</p>
                                            )}
                                        </div>

                                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <input type="checkbox" id="premium-toggle" checked={newOffer.isPremium} onChange={e => setNewOffer({ ...newOffer, isPremium: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                            <div>
                                                <label htmlFor="premium-toggle" style={{ fontWeight: 800, fontSize: '0.85rem', display: 'block' }}>Priority Placement (Boost)</label>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Always shows at the top of the rotation.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" className="db-btn db-btn-ghost" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Provision Global Offer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

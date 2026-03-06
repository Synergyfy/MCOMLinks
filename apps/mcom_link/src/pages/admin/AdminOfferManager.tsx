import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { mockOffers } from '../../mock/offers'

export default function AdminOfferManager() {
    const [offers, setOffers] = useState(mockOffers)
    const [filter, setFilter] = useState('all')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')

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

    // Form state for new offer
    const [newOffer, setNewOffer] = useState({
        businessName: '',
        headline: '',
        description: '',
        ctaType: 'claim' as any,
        ctaValue: '', // Added dynamic value field
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

    const filteredOffers = filter === 'all' ? offers : offers.filter(o => o.status === filter)

    const handleArchive = (id: string) => {
        if (confirm('Archive this offer? It will be removed from rotation but kept in analytics history.')) {
            setOffers(offers.map(o => o.id === id ? { ...o, status: 'expired' as any, isActive: false } : o))
        }
    }

    const handleDuplicate = (id: string) => {
        const original = offers.find(o => o.id === id)
        if (original) {
            const copy = { ...original, id: `offer-${Date.now()}`, headline: `Copy of ${original.headline}`, status: 'draft' as any }
            setOffers([copy, ...offers])
        }
    }

    const handleAddOffer = (e: React.FormEvent) => {
        e.preventDefault()
        const id = `offer-${Date.now()}`
        const offer: any = {
            ...newOffer,
            id,
            imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
            status: 'approved',
            isActive: true,
            performance: { scans: 0, claims: 0 }
        }
        setOffers([offer, ...offers])
        setIsAddModalOpen(false)
        setNewOffer({
            businessName: '',
            headline: '',
            description: '',
            ctaType: 'claim',
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
    }

    return (
        <AdminLayout title="Global Offer Inventory">
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div className="db-grid-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem' }}>
                    <div>
                        <h2 className="db-card-title">All System Offers</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Full visibility and override control across all merchant campaigns.</p>
                    </div>
                    <div className="db-grid-stack" style={{ display: 'flex', gap: '0.75rem' }}>
                        <select className="db-input" style={{ width: '160px' }} value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button className="db-btn db-btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Create Global Offer</button>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="db-table-wrapper desktop-only">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Merchant & Headline</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Timeline</th>
                                <th>Engagement</th>
                                <th style={{ textAlign: 'right' }}>Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOffers.map(offer => (
                                <tr key={offer.id}>
                                    <td>
                                        <div style={{ fontWeight: 800 }}>{offer.businessName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{offer.headline}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>{(offer as any).location || 'High Street Central'}</div>
                                    </td>
                                    <td>
                                        <span className={`db-badge db-badge-${offer.status}`}>
                                            {offer.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{offer.startDate}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>to {offer.endDate}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{offer.performance.scans} Scans</div>
                                        <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                                            {offer.performance.scans > 0 ? ((offer.performance.claims / offer.performance.scans) * 100).toFixed(1) : 0}% Conv.
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} title="Duplicate" onClick={() => handleDuplicate(offer.id)}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                            </button>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} title="Archive" onClick={() => handleArchive(offer.id)}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
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
                    {filteredOffers.map(offer => (
                        <div key={offer.id} className="db-offer-card-mobile">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0a0a0a' }}>{offer.businessName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{offer.headline}</div>
                                </div>
                                <span className={`db-badge db-badge-${offer.status}`}>
                                    {offer.status.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '0.85rem' }}>{(offer as any).location || 'High Street Central'}</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scans</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{offer.performance.scans}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Conversion</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>{offer.performance.scans > 0 ? ((offer.performance.claims / offer.performance.scans) * 100).toFixed(1) : 0}%</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDuplicate(offer.id)}>
                                    Duplicate
                                </button>
                                <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center', color: '#ef4444' }} onClick={() => handleArchive(offer.id)}>
                                    Archive
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Offer Modal */}
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
                                                <input
                                                    type="url"
                                                    className="db-input"
                                                    required
                                                    placeholder={newOffer.mediaType === 'image' ? "Image URL..." : "Video URL..."}
                                                    value={newOffer.mediaType === 'image' ? newOffer.imageUrl : newOffer.videoUrl}
                                                    onChange={e => setNewOffer(prev => newOffer.mediaType === 'image' ? { ...prev, imageUrl: e.target.value } : { ...prev, videoUrl: e.target.value })}
                                                />
                                            ) : (
                                                <label className="db-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: '#fff', border: '1px dashed #cbd5e1', padding: '0.5rem' }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{newOffer.mediaType === 'image' ? 'Upload Image' : 'Upload Video'}</span>
                                                    <input
                                                        type="file"
                                                        accept={newOffer.mediaType === 'image' ? "image/*" : "video/*"}
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileUpload}
                                                    />
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
                                            <select className="db-input" value={newOffer.season} onChange={e => setNewOffer({ ...newOffer, season: e.target.value as any })}>
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
                                                <button
                                                    type="button"
                                                    onClick={() => setNewOffer({ ...newOffer, visibility: 'national' })}
                                                    className={`db-btn ${newOffer.visibility === 'national' ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                                                >
                                                    🌐 National
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewOffer({ ...newOffer, visibility: 'hyperlocal' })}
                                                    className={`db-btn ${newOffer.visibility === 'hyperlocal' ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                                                >
                                                    📍 Hyperlocal
                                                </button>
                                            </div>

                                            {newOffer.visibility === 'hyperlocal' ? (
                                                <div className="animate-fade-in">
                                                    <label className="db-label">Target Area (Postcode)</label>
                                                    <input
                                                        type="text"
                                                        className="db-input"
                                                        placeholder="e.g. W1F 0AA"
                                                        value={newOffer.targetPostcode}
                                                        onChange={e => setNewOffer({ ...newOffer, targetPostcode: e.target.value.toUpperCase() })}
                                                        required
                                                    />
                                                    <p style={{ fontSize: '0.65rem', color: '#0369a1', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                                        <strong>Radius Rule:</strong> This offer will only appear on digital billboards within a 5-mile radius of this postcode.
                                                    </p>
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>
                                                    National offers appear across all standard rotator hubs in the country.
                                                </p>
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
                    </div >
                </div >
            )
            }
        </AdminLayout >
    )
}

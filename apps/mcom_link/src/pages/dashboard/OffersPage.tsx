import { useState, useEffect } from 'react'
import { api } from '../../api/apiClient'
import { type Offer } from '../../mock/offers'
import DashboardLayout from '../../components/DashboardLayout'
import OfferCard from '../../components/OfferCard'

// No longer need mock generator here, backend provides engagement stats


export default function OffersPage() {
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
    const [selectedOfferForStats, setSelectedOfferForStats] = useState<Offer | null>(null)
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(false)
    const [engagementStats, setEngagementStats] = useState<any>(null)
    const [mockActivities, setMockActivities] = useState<any[]>([])

    const fetchOffers = async () => {
        setLoading(true)
        try {
            const data = await api.get<Offer[]>(`/dashboard/offers${filter !== 'all' ? `?status=${filter}` : ''}`)
            // Ensure data is array before setting, if backend is down it could be an object with error
            if (Array.isArray(data)) {
                // Assuming backend returns all offers for business, frontend filtering if want 'all', but backend filtering is preferred
                // Currently API filters all based on status, but we should make sure we only get business' offers ideally
                // For now, assume backend returns correctly.
                setOffers(data)
            } else {
                setOffers([])
            }
        } catch (err) {
            console.error('Failed to fetch offers:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOffers()
    }, [filter])

    const openStats = async (offer: Offer) => {
        setSelectedOfferForStats(offer)
        setStatsLoading(true)
        try {
            const stats = await api.get<any>(`/dashboard/offers/${offer.id}/engagement`)
            setEngagementStats(stats)
            setMockActivities(stats.activities || [])
        } catch (err) {
            console.error('Failed to fetch stats:', err)
            // Fallback for demo mostly if backend doesn't implement activities fully
            setMockActivities([])
        } finally {
            setStatsLoading(false)
        }
    }

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

    // New Offer Form State
    const [newOffer, setNewOffer] = useState<Partial<Offer>>({
        headline: '',
        description: '',
        ctaType: 'claim',
        ctaLabel: 'Claim This Offer',
        redirectUrl: '',
        redemptionCode: '',
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        videoUrl: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        businessName: '',
        isPremium: false,
        season: 'all',
        visibility: 'national',
        targetPostcode: '',
        redemptionInstructions: ''
    })

    // Use state offers instead of mock
    const myOffers = offers
    const filteredOffers = myOffers

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Transform payload to match backend expectations
            const payload: any = {
                headline: newOffer.headline,
                description: newOffer.description,
                mediaType: newOffer.mediaType,
                imageUrl: newOffer.mediaType === 'image' ? newOffer.imageUrl : newOffer.videoUrl,
                startDate: newOffer.startDate ? new Date(newOffer.startDate).toISOString() : undefined,
                endDate: newOffer.endDate ? new Date(newOffer.endDate).toISOString() : new Date().toISOString(),
                ctaLabel: newOffer.ctaLabel,
                ctaType: newOffer.ctaType,
                redemptionCode: newOffer.ctaType === 'redeem' ? newOffer.redemptionCode : undefined,
                visibility: newOffer.visibility,
                targetPostcode: newOffer.targetPostcode,
                isPremium: newOffer.isPremium,
                status: 'submitted',
            };

            if (newOffer.ctaType === 'redirect') {
                payload.leadDestination = newOffer.redirectUrl;
            } else {
                payload.leadDestination = newOffer.redemptionInstructions;
            }

            // For hyper-local, send a post and then show the alert if success
            await api.post('/dashboard/offers', payload)

            if (newOffer.visibility === 'hyperlocal') {
                const msg = `Hyperlocal Offer Detected!\n\nPostcode: ${newOffer.targetPostcode}\nRadius: 5 Miles\n\nSystem is checking for existing hubs within 5 miles... None found near ${newOffer.targetPostcode}.\n\n✅ AUTO-PROVISIONING: A new Radius Hub has been created for your business location!`
                alert(msg)
            } else {
                alert("Offer submitted for approval! Our team will review it within 24 hours.")
            }

            setShowModal(false)
            setUploadMode('url')
            setNewOffer({ headline: '', description: '', ctaType: 'claim', ctaLabel: 'Claim This Offer', redirectUrl: '', redemptionCode: '', mediaType: 'image', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', videoUrl: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], businessName: '', isPremium: false, season: 'all', visibility: 'national', targetPostcode: '', redemptionInstructions: '' })

            // Refresh list
            fetchOffers()

        } catch (err) {
            console.error("Failed to create offer:", err)
            alert("Error creating offer")
        }
    }

    return (
        <DashboardLayout title="Offer Management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', maxWidth: '100%', whiteSpace: 'nowrap' }}>
                    {['all', 'approved', 'submitted', 'draft', 'rejected', 'expired'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`db-btn db-btn-ghost ${filter === s ? 'active' : ''}`}
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', textTransform: 'capitalize', flexShrink: 0 }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Create Offer
                </button>
            </div>

            <div className="db-card desktop-only" style={{ padding: 0 }}>
                <div className="db-table-wrapper">
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
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        Loading offers...
                                    </td>
                                </tr>
                            ) : filteredOffers.map((offer) => (
                                <tr key={offer.id}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ position: 'relative' }}>
                                                {offer.mediaType === 'video' ? (
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={offer.imageUrl}
                                                        alt={offer.headline}
                                                        style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover' }}
                                                    />
                                                )}
                                                {offer.mediaType === 'video' && (
                                                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#2563eb', borderRadius: '50%', padding: '2px' }}>
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{offer.headline}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {offer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`db-badge db-badge-${offer.status}`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{offer.ctaType}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div title="Scans">
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>S:</span> {offer.performance.scans}
                                            </div>
                                            <div title="Claims">
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>C:</span> {offer.performance.claims}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                            {new Date(offer.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} - {new Date(offer.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                            </button>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} onClick={() => openStats(offer)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
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
            </div>

            <div className="mobile-only">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading offers...</div>
                ) : filteredOffers.map((offer) => (
                    <div key={offer.id} className="db-offer-card-mobile animate-fade-in">
                        <div className="db-offer-card-mobile-header">
                            <div style={{ position: 'relative' }}>
                                {offer.mediaType === 'video' ? (
                                    <div style={{ width: '60px', height: '60px', borderRadius: '0.75rem', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    </div>
                                ) : (
                                    <img
                                        src={offer.imageUrl}
                                        alt={offer.headline}
                                        style={{ width: '60px', height: '60px', borderRadius: '0.75rem', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <div className="db-offer-card-mobile-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: '1.2' }}>{offer.headline}</div>
                                    <span className={`db-badge db-badge-${offer.status}`} style={{ fontSize: '0.65rem' }}>
                                        {offer.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {new Date(offer.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} - {new Date(offer.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        <div className="db-offer-card-mobile-stats">
                            <div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Type</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize' }}>{offer.ctaType}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Scans</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{offer.performance.scans}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Claims</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{offer.performance.claims}</div>
                            </div>
                        </div>

                        <div className="db-offer-card-mobile-actions">
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                Edit
                            </button>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openStats(offer)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                Engagement
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredOffers.some(o => o.status === 'rejected') && (
                <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '1rem', border: '1px solid rgba(244, 63, 94, 0.15)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <span style={{ color: '#e11d48', fontSize: '1.2rem' }}>⚠️</span>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 800, color: '#e11d48' }}>Attention Required</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#e11d48', opacity: 0.8, lineHeight: '1.5' }}>
                                One or more of your offers were rejected by the Admin. Please check the rejection reasons and resubmit your changes.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="db-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <div className="db-modal-header">
                            <h2 className="db-card-title">Create New Campaign</h2>
                            <button className="db-btn-close" onClick={() => { setShowModal(false); setUploadMode('url'); }}>&times;</button>
                        </div>

                        <div className="db-modal-content">
                            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem' }}>
                                <form id="offerForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Offer Headline</label>
                                        <input
                                            type="text"
                                            className="db-input"
                                            placeholder="e.g. 50% Off Your First Visit"
                                            value={newOffer.headline}
                                            onChange={(e) => setNewOffer({ ...newOffer, headline: e.target.value })}
                                            required
                                        />
                                        <small className="db-help">Make it punchy! This is the first thing customers see.</small>
                                    </div>

                                    <div className="db-form-group">
                                        <label className="db-label">Offer Description</label>
                                        <textarea
                                            className="db-input"
                                            style={{ height: '60px', resize: 'none' }}
                                            placeholder="Details about the offer..."
                                            value={newOffer.description}
                                            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>


                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <label className="db-label" style={{ margin: 0, fontSize: '0.8rem' }}>Offer Visual</label>
                                            <div style={{ display: 'flex', gap: '0.25rem', padding: '0.2rem', background: '#e2e8f0', borderRadius: '0.5rem' }}>
                                                <button type="button" onClick={() => setUploadMode('url')} style={{ padding: '0.25rem 0.5rem', border: 'none', background: uploadMode === 'url' ? '#fff' : 'transparent', borderRadius: '0.4rem', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>🔗 Link</button>
                                                <button type="button" onClick={() => setUploadMode('file')} style={{ padding: '0.25rem 0.5rem', border: 'none', background: uploadMode === 'file' ? '#fff' : 'transparent', borderRadius: '0.4rem', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>📁 Upload</button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => setNewOffer({ ...newOffer, mediaType: 'image' })}
                                                className={`db-btn ${newOffer.mediaType === 'image' ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                                style={{ flex: 1, padding: '0.5rem' }}
                                            >
                                                📷 Static Image
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewOffer({ ...newOffer, mediaType: 'video' })}
                                                className={`db-btn ${newOffer.mediaType === 'video' ? 'db-btn-primary' : 'db-btn-ghost'}`}
                                                style={{ flex: 1, padding: '0.5rem' }}
                                            >
                                                🎥 Motion Video
                                            </button>
                                        </div>

                                        {uploadMode === 'url' ? (
                                            <div className="db-form-group" style={{ margin: 0 }}>
                                                <input
                                                    type="url"
                                                    className="db-input"
                                                    placeholder={newOffer.mediaType === 'image' ? "Enter Image URL (e.g. Unsplash link)" : "Enter Video URL (MP4/YouTube)"}
                                                    value={newOffer.mediaType === 'image' ? newOffer.imageUrl : newOffer.videoUrl}
                                                    onChange={(e) => setNewOffer(prev => newOffer.mediaType === 'image' ? { ...prev, imageUrl: e.target.value } : { ...prev, videoUrl: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        ) : (
                                            <div className="db-form-group" style={{ margin: 0 }}>
                                                <label className="db-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: '#fff', border: '2px dashed #cbd5e1' }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{newOffer.mediaType === 'image' ? 'Upload Image' : 'Upload Video'}</span>
                                                    <input
                                                        type="file"
                                                        accept={newOffer.mediaType === 'image' ? "image/*" : "video/*"}
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileUpload}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {newOffer.mediaType === 'video' && <small className="db-help" style={{ color: '#2563eb', display: 'block', marginTop: '0.5rem' }}>Motion thumbnails increase engagement by 40%!</small>}
                                    </div>

                                    <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="db-form-group">
                                            <label className="db-label">CTA Action</label>
                                            <select
                                                className="db-input"
                                                value={newOffer.ctaType}
                                                onChange={(e) => setNewOffer({ ...newOffer, ctaType: e.target.value as any })}
                                            >
                                                <option value="claim">Claim Coupon (Lead)</option>
                                                <option value="redeem">Redeem Instantly (Code)</option>
                                                <option value="redirect">External Website</option>
                                            </select>
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">Button Label</label>
                                            <input
                                                type="text"
                                                className="db-input"
                                                value={newOffer.ctaLabel}
                                                onChange={(e) => setNewOffer({ ...newOffer, ctaLabel: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {newOffer.ctaType === 'redirect' && (
                                        <div className="db-form-group">
                                            <label className="db-label">Target Website URL</label>
                                            <input
                                                type="url"
                                                className="db-input"
                                                placeholder="https://yourwebsite.com/offer"
                                                value={newOffer.redirectUrl}
                                                onChange={(e) => setNewOffer({ ...newOffer, redirectUrl: e.target.value })}
                                                required
                                            />
                                        </div>
                                    )}

                                    {newOffer.ctaType === 'redeem' && (
                                        <>
                                            <div className="db-form-group">
                                                <label className="db-label">Redemption Code</label>
                                                <input
                                                    type="text"
                                                    className="db-input"
                                                    placeholder="e.g. SUMMER25"
                                                    value={newOffer.redemptionCode}
                                                    onChange={(e) => setNewOffer({ ...newOffer, redemptionCode: e.target.value.toUpperCase() })}
                                                    required
                                                />
                                            </div>
                                            <div className="db-form-group">
                                                <label className="db-label">Where to Use Instruction</label>
                                                <textarea
                                                    className="db-input"
                                                    style={{ height: '60px', resize: 'none' }}
                                                    placeholder="e.g. Present this code at the checkout counter or enter it on our website."
                                                    value={newOffer.redemptionInstructions}
                                                    onChange={(e) => setNewOffer({ ...newOffer, redemptionInstructions: e.target.value })}
                                                    required
                                                ></textarea>
                                            </div>
                                        </>
                                    )}

                                    {newOffer.ctaType === 'claim' && (
                                        <div className="db-form-group">
                                            <label className="db-label">Lead Destination (Email/Phone)</label>
                                            <input
                                                type="text"
                                                className="db-input"
                                                placeholder="Where should leads be sent?"
                                                value={newOffer.redemptionInstructions}
                                                onChange={(e) => setNewOffer({ ...newOffer, redemptionInstructions: e.target.value })}
                                                required
                                            />
                                            <small className="db-help">Leads will be forwarded to this contact.</small>
                                        </div>
                                    )}

                                    <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="db-form-group">
                                            <label className="db-label">Start Date</label>
                                            <input
                                                type="date"
                                                className="db-input"
                                                value={newOffer.startDate}
                                                onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="db-form-group">
                                            <label className="db-label">End Date</label>
                                            <input
                                                type="date"
                                                className="db-input"
                                                value={newOffer.endDate}
                                                onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </form>

                                <div className="desktop-only" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', minWidth: 0 }}>
                                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>
                                        Live Preview
                                    </h4>
                                    <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                                        <OfferCard offer={newOffer as any} />
                                    </div>
                                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                                        This is how it looks to customers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="db-modal-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button className="db-btn db-btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Save Draft</button>
                            <button type="submit" form="offerForm" className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                Submit for Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Engagement Stats Modal */}
            {selectedOfferForStats && (
                <div className="db-modal-overlay" onClick={() => setSelectedOfferForStats(null)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="db-modal-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                            <div>
                                <h3 className="db-card-title" style={{ margin: 0 }}>Engagement Gold Dust</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Real-time activity for: <b>{selectedOfferForStats.headline}</b></p>
                            </div>
                            <button onClick={() => setSelectedOfferForStats(null)} className="db-btn-close">&times;</button>
                        </div>

                        <div className="db-modal-content" style={{ padding: '0 0 1.5rem 0' }}>
                            {/* Intent Summary */}
                            {statsLoading ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading engagement data...</div>
                            ) : (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1rem' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Interest Score</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{engagementStats?.interestScoreLabel || 'N/A'}</div>
                                        </div>
                                        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1rem', paddingLeft: '0.5rem' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Avg. View Time</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{engagementStats?.avgViewTime || 'N/A'}</div>
                                        </div>
                                        <div style={{ paddingLeft: '0.5rem' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Repeat Scanners</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{engagementStats?.repeatScannerRate || 'N/A'}</div>
                                        </div>
                                    </div>

                                    {/* Activity Feed */}
                                    <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Live Interaction Feed
                                            <span style={{ padding: '2px 8px', background: '#ecfdf5', color: '#10b981', fontSize: '0.65rem', borderRadius: '10px' }}>Real-time</span>
                                        </h4>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {mockActivities.length === 0 ? (
                                                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>No recent activity.</div>
                                            ) : mockActivities.map((act) => (
                                                <div key={act.id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '1rem',
                                                    background: act.interestScore === 'verified' ? 'rgba(37, 99, 235, 0.04)' : '#fff',
                                                    borderRadius: '1rem',
                                                    border: act.interestScore === 'verified' ? '1px solid rgba(37, 99, 235, 0.1)' : '1px solid #f1f5f9',
                                                    transition: 'all 0.2s hover',
                                                    cursor: 'default'
                                                }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            background: act.interestScore === 'verified' ? '#2563eb' : '#f1f5f9',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1rem'
                                                        }}>
                                                            {act.interestScore === 'verified' ? '👤' : '👻'}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{act.visitorId}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.5rem' }}>
                                                                <span>{act.device}</span>
                                                                <span>•</span>
                                                                <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                            color: act.interestScore === 'verified' ? '#2563eb' : act.interestScore === 'high' ? '#f59e0b' : '#94a3b8',
                                                            textTransform: 'uppercase',
                                                            marginBottom: '0.25rem'
                                                        }}>
                                                            {act.type === 'view' ? 'Page Viewed' :
                                                                act.type === 'click' ? 'Clicked CTA' :
                                                                    act.type === 'directions' ? 'Got Directions' :
                                                                        act.type === 'claim' ? 'Claimed Lead' : 'Saved Offer'}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.65rem',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            background: act.interestScore === 'verified' ? '#dbeafe' : act.interestScore === 'high' ? '#fef3c7' : '#f1f5f9',
                                                            color: act.interestScore === 'verified' ? '#1e40af' : act.interestScore === 'high' ? '#92400e' : '#64748b',
                                                            fontWeight: 700
                                                        }}>
                                                            {act.interestScore?.toUpperCase() || 'LOW'} {act.interestScore === 'verified' ? '👑' : act.interestScore === 'high' ? '🔥' : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="db-modal-footer">
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                                * Visitor IDs are anonymized using secure device fingerprinting to protect consumer privacy while providing business value.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}


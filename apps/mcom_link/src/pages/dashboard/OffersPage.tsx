import { useState } from 'react'
import { mockOffers, type Offer } from '../../mock/offers'
import { mockBusiness } from '../../mock/business'
import DashboardLayout from '../../components/DashboardLayout'
import OfferCard from '../../components/OfferCard'

export default function OffersPage() {
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)

    // New Offer Form State
    const [newOffer, setNewOffer] = useState<Partial<Offer>>({
        headline: '',
        description: '',
        ctaType: 'claim',
        ctaLabel: 'Claim This Offer',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        businessName: mockBusiness.name,
        isPremium: false,
        season: 'all'
    })

    const myOffers = mockOffers.filter(o => o.businessName === mockBusiness.name)
    const filteredOffers = filter === 'all' ? myOffers : myOffers.filter(o => o.status === filter)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Offer submitted for approval! Our team will review it within 24 hours.")
        setShowModal(false)
    }

    return (
        <DashboardLayout title="Offer Management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'approved', 'submitted', 'draft', 'rejected', 'expired'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`db-btn db-btn-ghost ${filter === s ? 'active' : ''}`}
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', textTransform: 'capitalize' }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button className="db-btn db-btn-primary" onClick={() => setShowModal(true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Create New Offer
                </button>
            </div>

            <div className="db-card" style={{ padding: 0 }}>
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
                            {filteredOffers.map((offer) => (
                                <tr key={offer.id}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <img
                                                src={offer.imageUrl}
                                                alt={offer.headline}
                                                style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover' }}
                                            />
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
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }}>
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
                            <button className="db-btn-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        <div className="db-modal-content">
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem' }}>
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
                                            style={{ height: '80px', resize: 'none' }}
                                            placeholder="Details about the offer..."
                                            value={newOffer.description}
                                            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="db-form-group">
                                            <label className="db-label">CTA Action</label>
                                            <select
                                                className="db-input"
                                                value={newOffer.ctaType}
                                                onChange={(e) => setNewOffer({ ...newOffer, ctaType: e.target.value as any })}
                                            >
                                                <option value="claim">Claim Coupon (Email)</option>
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

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', minWidth: 0 }}>
                                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>
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

                        <div className="db-modal-footer">
                            <button className="db-btn db-btn-ghost" onClick={() => setShowModal(false)}>Save Draft</button>
                            <button type="submit" form="offerForm" className="db-btn db-btn-primary">
                                Submit for Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

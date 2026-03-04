import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { mockOffers } from '../../mock/offers'

export default function AdminOfferManager() {
    const [offers] = useState(mockOffers)
    const [filter, setFilter] = useState('all')

    const filteredOffers = filter === 'all' ? offers : offers.filter(o => o.status === filter)

    return (
        <AdminLayout title="Global Offer Inventory">
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="db-card-title">All System Offers</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Full visibility and override control across all merchant campaigns.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <select className="db-input" style={{ width: '160px' }} value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button className="db-btn db-btn-primary">+ Create Global Offer</button>
                    </div>
                </div>

                <div className="db-table-wrapper">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Merchant & Headline</th>
                                <th>Location</th>
                                <th>Status</th>
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
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{offer.performance.scans} Scans</div>
                                        <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{((offer.performance.claims / offer.performance.scans) * 100).toFixed(1)}% Conversion</div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem' }} title="Edit">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                            </button>
                                            <button className="db-btn db-btn-ghost" style={{ padding: '0.4rem', color: '#ef4444' }} title="Override/Pause">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

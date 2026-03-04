import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function MerchantControl() {
    const [merchants, setMerchants] = useState([
        { id: 'm-001', name: 'Bella\'s Boutique', owner: 'Isabella Rossi', plan: 'Premium', status: 'active', revenue: 1240 },
        { id: 'm-002', name: 'The Daily Grind', owner: 'Marcus Aurelius', plan: 'Basic', status: 'active', revenue: 450 },
        { id: 'm-003', name: 'FitLife Gym', owner: 'Sarah Fit', plan: 'Basic', status: 'suspended', revenue: 880 },
        { id: 'm-004', name: 'Bloom & Wild', owner: 'Daisy Petal', plan: 'Premium', status: 'active', revenue: 2150 }
    ])

    return (
        <AdminLayout title="Business Governance">
            <div className="db-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="db-card-title">Merchant Directory</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Management of individual business accounts and their billing status.</p>
                    </div>
                    <button className="db-btn db-btn-primary">+ Onboard Merchant</button>
                </div>

                <div className="db-table-wrapper">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Business Name</th>
                                <th>Owner / Contact</th>
                                <th>Account Tier</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Governance Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {merchants.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ fontWeight: 800 }}>{m.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {m.id}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{m.owner}</div>
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
            </div>
        </AdminLayout>
    )
}

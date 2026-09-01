import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { api } from '../../api/apiClient'
import type { BillingCycle, Plan, PurchasedPackage } from '../../types'

export default function BillingPage() {
    const [searchParams] = useSearchParams()
    const [plan, setPlan] = useState<string | null>(null)
    const [billingStatus, setBillingStatus] = useState<'active' | 'suspended' | 'pending'>('pending')
    const [plans, setPlans] = useState<Plan[]>([])
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [packageInfo, setPackageInfo] = useState<PurchasedPackage | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsData, plansData] = await Promise.all([
                    api.get<any>('/dashboard/settings'),
                    api.get<Plan[]>('/api/v1/plans'),
                ])
                if (settingsData?.plan) setPlan(settingsData.plan)
                if (settingsData?.subscriptionStatus) setBillingStatus(settingsData.subscriptionStatus)
                if (Array.isArray(plansData)) setPlans(plansData)
            } catch (err) {
                console.error('Failed to load billing data:', err)
            }
        }
        fetchData()

        if (searchParams.get('first_time') === 'true') {
            setShowUpgradeModal(true)
        }
    }, [searchParams])

    const priceFor = (p: Plan) =>
        billingCycle === 'monthly' ? p.monthlyPrice : billingCycle === 'quarterly' ? p.quarterlyPrice : p.annualPrice

    const cycleLabel = billingCycle === 'monthly' ? '/mo' : billingCycle === 'quarterly' ? '/quarter' : '/year'

    const handleUpgrade = (p: Plan) => {
        setSelectedPlan(p)
        setShowUpgradeModal(false)
        setShowPaymentModal(true)
    }

    const handleConfirmPayment = async () => {
        if (!selectedPlan) return
        setProcessing(true)
        setError(null)
        try {
            // 1. Initiate the purchase through MCOM Central (Merchant of Record)
            const initiated = await api.post<any>('/api/v1/mcom/packages/purchase/initiate', {
                externalPlanId: selectedPlan.id,
                billingCycle,
                provider: 'stripe',
            })

            // 2. Confirm. In this pass we use a simple in-app modal (no Stripe
            // Elements); the returned clientSecret identifies the payment intent.
            const confirmed = await api.post<any>('/api/v1/mcom/packages/purchase/confirm', {
                externalPlanId: selectedPlan.id,
                billingCycle,
                provider: 'stripe',
                paymentIntentId: initiated?.clientSecret || 'mock_payment_' + Date.now(),
            })

            setPackageInfo(confirmed.package)
            setPlan(selectedPlan.name)
            setBillingStatus('active')
            setShowPaymentModal(false)
            window.dispatchEvent(new CustomEvent('profile-updated'))
        } catch (err: any) {
            setError(err.message || 'Payment failed. Please try again.')
        } finally {
            setProcessing(false)
        }
    }

    const invoices = [
        { id: 'inv-101', date: '2026-03-01', amount: '£29.00', status: 'paid', plan: 'Hyper-local' },
        { id: 'inv-100', date: '2026-02-01', amount: '£29.00', status: 'paid', plan: 'Hyper-local' },
        { id: 'inv-099', date: '2026-01-01', amount: '£29.00', status: 'paid', plan: 'Hyper-local' },
    ]

    return (
        <DashboardLayout title="Billing & Plans">
            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>

                {/* Current Plan Status */}
                <div style={{
                    background: billingStatus === 'suspended' ? 'linear-gradient(135deg, #fef2f2 0%, #fff 100%)' : 'linear-gradient(135deg, #f0f9ff 0%, #fff 100%)',
                    borderRadius: '2rem',
                    padding: '2.5rem',
                    marginBottom: '3rem',
                    border: `2px solid ${billingStatus === 'suspended' ? '#fee2e2' : '#e0f2fe'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Membership</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{plan ? `${plan} Membership` : 'No Active Plan'}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                                padding: '0.4rem 0.8rem',
                                background: billingStatus === 'active' ? '#ecfdf5' : (billingStatus === 'suspended' ? '#fef2f2' : '#f8fafc'),
                                color: billingStatus === 'active' ? '#059669' : (billingStatus === 'suspended' ? '#dc2626' : '#64748b'),
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                border: `1px solid ${billingStatus === 'active' ? '#a7f3d0' : (billingStatus === 'suspended' ? '#fecaca' : '#e2e8f0')}`
                            }}>
                                {billingStatus === 'active' ? '✓ BILLING ACTIVE' : (billingStatus === 'suspended' ? '⚠ BILLING SUSPENDED' : '○ INACTIVE')}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                {packageInfo?.expiresAt ? `Renews on ${new Date(packageInfo.expiresAt).toLocaleDateString()}` : (plan ? 'Subscription active' : 'Select a plan to start')}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {billingStatus === 'suspended' && (
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                style={{
                                    padding: '1rem 2rem', background: '#dc2626', color: '#fff', border: 'none',
                                    borderRadius: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(220,38,38,0.2)'
                                }}
                            >
                                Pay Outstanding Balance
                            </button>
                        )}
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            style={{
                                padding: '1rem 2rem', background: '#2563eb', color: '#fff', border: 'none',
                                borderRadius: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(37,99,235,0.2)'
                            }}
                        >
                            {plan ? 'Upgrade Membership' : 'Choose Your Plan'}
                        </button>
                    </div>
                </div>

                {billingStatus === 'suspended' && (
                    <div style={{ marginBottom: '3rem', padding: '1.5rem', background: '#fff5f5', borderRadius: '1rem', border: '1px solid #fed7d7', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>⚠️</span>
                        <div style={{ fontSize: '0.9rem', color: '#c53030', fontWeight: 600 }}>
                            <b>Your campaigns are hidden!</b> Because your billing is suspended, your campaign offers will not appear on any storefronts till payment is received.
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', flexWrap: 'wrap' }}>

                    {/* Invoice History */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Billing History</h3>
                        <div className="db-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="db-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Invoice ID</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plan ? invoices.map(inv => (
                                        <tr key={inv.id}>
                                            <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{inv.date}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{inv.id}</td>
                                            <td style={{ fontSize: '0.85rem', fontWeight: 800 }}>{inv.amount}</td>
                                            <td>
                                                <span style={{ padding: '0.25rem 0.5rem', background: '#ecfdf5', color: '#059669', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 800 }}>
                                                    {inv.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>No billing history available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Payment Method</h3>
                        <div className="db-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ width: '50px', height: '32px', background: '#0a0a0a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 800 }}>VISA</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Visa ending in 4242</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Expires 12/26</div>
                                </div>
                            </div>
                            <button className="db-btn db-btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Change Payment Method</button>
                        </div>

                        {error && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upgrade Plan Modal (MCOM centrally-managed plans) */}
            {showUpgradeModal && (
                <div className="db-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '860px' }}>
                        <div className="db-modal-header">
                            <h2 className="db-card-title">Choose Your Plan</h2>
                            <button className="db-modal-close" onClick={() => setShowUpgradeModal(false)}>✕</button>
                        </div>
                        <div className="db-modal-content" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                                {(['monthly', 'quarterly', 'annual'] as BillingCycle[]).map(cycle => (
                                    <button
                                        key={cycle}
                                        onClick={() => setBillingCycle(cycle)}
                                        style={{
                                            padding: '0.5rem 1.25rem', borderRadius: '0.75rem', border: 'none',
                                            fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                                            background: billingCycle === cycle ? '#2563eb' : '#f1f5f9',
                                            color: billingCycle === cycle ? '#fff' : '#64748b'
                                        }}
                                    >
                                        {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {plans.map(p => (
                                    <div key={p.id} style={{
                                        padding: '1.5rem',
                                        borderRadius: '1.5rem',
                                        border: `2px solid ${plan === p.name ? '#2563eb' : '#f1f5f9'}`,
                                        background: plan === p.name ? 'rgba(37,99,235,0.04)' : '#fff',
                                        display: 'flex', flexDirection: 'column', gap: '1rem'
                                    }}>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2563eb' }}>{p.name}</div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>
                                            {priceFor(p) === 0 ? 'Included' : `£${priceFor(p).toFixed(2)}${cycleLabel}`}
                                        </div>
                                        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {p.features.map(f => (
                                                <li key={f} style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ color: '#2563eb' }}>✓</span> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            disabled={plan === p.name}
                                            onClick={() => handleUpgrade(p)}
                                            style={{
                                                marginTop: 'auto', padding: '0.75rem', borderRadius: '0.75rem',
                                                border: 'none', background: plan === p.name ? '#cbd5e1' : '#2563eb',
                                                color: '#fff', fontWeight: 800, cursor: plan === p.name ? 'default' : 'pointer'
                                            }}
                                        >
                                            {plan === p.name ? 'Current Plan' : 'Select Plan'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal (simple in-app flow) */}
            {showPaymentModal && (
                <div className="db-modal-overlay" onClick={() => !processing && setShowPaymentModal(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', textAlign: 'center' }}>
                        <div className="db-modal-header" style={{ justifyContent: 'center' }}>
                            <h2 className="db-card-title">Complete Your Subscription</h2>
                        </div>
                        <div className="db-modal-content" style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                            {selectedPlan && (
                                <p style={{ fontWeight: 600, marginBottom: '1.5rem' }}>
                                    You are subscribing to <b>{selectedPlan.name}</b> ({billingCycle}) for <b>£{priceFor(selectedPlan).toFixed(2)}</b>{cycleLabel}.
                                </p>
                            )}
                            {error && (
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.8rem' }}>
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handleConfirmPayment}
                                disabled={processing}
                                className="db-btn db-btn-primary" style={{ width: '100%', padding: '1.25rem', justifyContent: 'center', fontSize: '1.1rem' }}>
                                {processing ? 'Processing...' : 'Pay & Activate'}
                            </button>
                            <button className="db-btn db-btn-ghost" onClick={() => setShowPaymentModal(false)} disabled={processing} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
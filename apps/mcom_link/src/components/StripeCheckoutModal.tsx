import { useEffect, useState } from 'react'
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe, type StripePaymentElementOptions } from '@stripe/stripe-js'
import { api } from '../api/apiClient'
import { MCOM_SOLUTIONS_URL, STRIPE_PUBLISHABLE_KEY, USE_MOCK } from '../api/constants'
import type { BillingCycle, Plan } from '../types'

export interface InitiatedCheckout {
    clientSecret: string
    type: 'payment' | 'setup'
    plan?: Plan
}

interface WalletBalanceData {
    success: boolean
    balance: number
    availableBalance: number
    currency: string
    status: string
}

interface StripeCheckoutModalProps {
    plan: Plan
    billingCycle: BillingCycle
    price: number
    cycleLabel: string
    onClose: () => void
    onSuccess: (pkg: any) => void
}

const stripePromise: ReturnType<typeof loadStripe> | null = STRIPE_PUBLISHABLE_KEY
    ? loadStripe(STRIPE_PUBLISHABLE_KEY)
    : null

// ─── STRIPE CARD CHECKOUT FORM ──────────────────────────────────────────────
function StripeCheckoutForm({
    plan,
    billingCycle,
    price,
    cycleLabel: _cycleLabel,

    clientSecret,
    intentType,
    onClose,
    onSuccess,
}: {
    plan: Plan
    billingCycle: BillingCycle
    price: number
    cycleLabel: string
    clientSecret: string
    intentType: 'payment' | 'setup'
    onClose: () => void
    onSuccess: (pkg: any) => void
}) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setLoading(true)
        setError(null)

        // 1. Submit elements first to trigger validation and collect payment details
        const { error: submitError } = await elements.submit()
        if (submitError) {
            setError(submitError.message || 'Please check your payment details.')
            setLoading(false)
            return
        }

        let paymentIntentId = ''
        let intentError: { message?: string } | undefined
        const returnUrl = window.location.href
        try {
            if (intentType === 'setup') {
                const result = await stripe.confirmSetup({
                    elements,
                    clientSecret,
                    confirmParams: {
                        return_url: returnUrl,
                    },
                    redirect: 'if_required',
                })
                intentError = result.error as { message?: string } | undefined
                paymentIntentId = result.setupIntent?.id || ''
            } else {
                const result = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: {
                        return_url: returnUrl,
                    },
                    redirect: 'if_required',
                })
                intentError = result.error as { message?: string } | undefined
                paymentIntentId = result.paymentIntent?.id || ''
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to process card payment. Please try again.')
            setLoading(false)
            return
        }

        if (intentError?.message) {
            setError(intentError.message)
            setLoading(false)
            return
        }

        try {
            const confirmed = await api.post<any>(
                '/api/v1/mcom/packages/purchase/confirm',
                {
                    externalPlanId: plan.id,
                    billingCycle,
                    provider: 'stripe',
                    paymentIntentId,
                },
            )
            try {
                const stored = localStorage.getItem('user')
                if (stored) {
                    const u = JSON.parse(stored)
                    u.permissions = { ...(u.permissions || {}), canAccess_links: true }
                    localStorage.setItem('user', JSON.stringify(u))
                }
            } catch {}
            window.dispatchEvent(new CustomEvent('profile-updated'))
            onSuccess(confirmed.package)
        } catch (err: any) {
            setError(err?.message || 'Payment succeeded but activation failed. Please try again.')
            setLoading(false)
        }
    }

    const elementOptions: StripePaymentElementOptions = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
        },
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <PaymentElement options={elementOptions} />

            {error && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    color: '#dc2626',
                    fontSize: '0.85rem',
                }}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="db-btn db-btn-primary"
                style={{
                    width: '100%',
                    padding: '1rem',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '1.25rem',
                }}
            >
                {loading ? 'Processing Card…' : `Pay £${price.toFixed(2)} & Activate`}
            </button>
            <button
                type="button"
                className="db-btn db-btn-ghost"
                onClick={onClose}
                disabled={loading}
                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            >
                Cancel
            </button>
        </form>
    )
}

// ─── UNIFIED CHECKOUT MODAL (WALLET + STRIPE) ──────────────────────────────
export function StripeCheckoutModal({
    plan,
    billingCycle,
    price,
    cycleLabel,
    onClose,
    onSuccess,
}: StripeCheckoutModalProps) {
    const [selectedTab, setSelectedTab] = useState<'wallet' | 'card'>('wallet')

    // Wallet State
    const [walletBalance, setWalletBalance] = useState<WalletBalanceData | null>(null)
    const [walletLoading, setWalletLoading] = useState<boolean>(true)
    const [walletPurchasing, setWalletPurchasing] = useState<boolean>(false)
    const [walletError, setWalletError] = useState<string | null>(null)
    const [refreshingBalance, setRefreshingBalance] = useState<boolean>(false)

    // Stripe State
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [intentType, setIntentType] = useState<'payment' | 'setup'>('payment')
    const [stripeInitError, setStripeInitError] = useState<string | null>(null)
    const [stripeInitiating, setStripeInitiating] = useState<boolean>(false)

    const canUseElements = !!stripePromise && !USE_MOCK

    // Fetch live user wallet balance from MCOM Central Hub
    const fetchWalletBalance = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshingBalance(true)
        else setWalletLoading(true)
        setWalletError(null)

        try {
            const data = await api.get<WalletBalanceData>('/api/v1/mcom/wallet/balance')
            setWalletBalance(data)
        } catch (err: any) {
            setWalletError(err?.message || 'Could not load MCOM Wallet balance.')
        } finally {
            setWalletLoading(false)
            setRefreshingBalance(false)
        }
    }

    useEffect(() => {
        fetchWalletBalance()
    }, [])

    // Handle wallet purchase
    const handleWalletPurchase = async () => {
        setWalletPurchasing(true)
        setWalletError(null)

        try {
            const res = await api.post<any>('/api/v1/mcom/packages/purchase/wallet', {
                externalPlanId: plan.id,
                billingCycle,
            })
            try {
                const stored = localStorage.getItem('user')
                if (stored) {
                    const u = JSON.parse(stored)
                    u.permissions = { ...(u.permissions || {}), canAccess_links: true }
                    localStorage.setItem('user', JSON.stringify(u))
                }
            } catch {}
            window.dispatchEvent(new CustomEvent('profile-updated'))
            onSuccess(res.package)
        } catch (err: any) {
            setWalletError(err?.message || 'Wallet payment failed. Please check your balance.')
            setWalletPurchasing(false)
        }
    }

    // Handle Stripe initiation when card tab is selected
    const initiateStripeCheckout = async () => {
        setStripeInitError(null)
        setStripeInitiating(true)
        try {
            const initiated = await api.post<InitiatedCheckout>(
                '/api/v1/mcom/packages/purchase/initiate',
                {
                    externalPlanId: plan.id,
                    billingCycle,
                    provider: 'stripe',
                },
            )
            if (!initiated.clientSecret) {
                throw new Error('No client secret returned from initiation.')
            }
            setClientSecret(initiated.clientSecret)
            setIntentType(initiated.type === 'setup' ? 'setup' : 'payment')
        } catch (err: any) {
            setStripeInitError(err?.message || 'Failed to start card checkout.')
        } finally {
            setStripeInitiating(false)
        }
    }

    // Mock fallback confirm for offline dev testing
    const handleFallbackConfirm = async () => {
        try {
            const confirmed = await api.post<any>(
                '/api/v1/mcom/packages/purchase/confirm',
                {
                    externalPlanId: plan.id,
                    billingCycle,
                    provider: 'stripe',
                    paymentIntentId: 'mock_payment_' + Date.now(),
                },
            )
            onSuccess(confirmed.package)
        } catch (err: any) {
            setWalletError(err?.message || 'Payment failed.')
        }
    }

    const availableBalance = walletBalance?.availableBalance ?? 0
    const hasSufficientWalletBalance = availableBalance >= price

    return (
        <div className="db-modal-overlay" onClick={onClose}>
            <div
                className="db-modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '520px',
                    width: '95vw',
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid #e2e8f0',
                }}
            >
                {/* Header */}
                <div
                    className="db-modal-header"
                    style={{
                        padding: '1.5rem 1.75rem',
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700 }}>
                            MCOM Ecosystem Checkout
                        </div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0 0 0', color: '#fff' }}>
                            Subscribe to {plan.name}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#fff',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Plan Summary Strip */}
                <div style={{
                    padding: '1rem 1.75rem',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                            Billing Cycle: <span style={{ textTransform: 'capitalize', color: '#0f172a' }}>{billingCycle}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {plan.tagline || 'Full high street rotation & dynamic visibility'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>
                            {price === 0 ? 'Free' : `£${price.toFixed(2)}`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                            {price === 0 ? 'No charge' : `${price.toFixed(2)} MCOM Credits`}
                        </div>
                    </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    padding: '1rem 1.75rem 0',
                }}>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('wallet')}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            border: '1px solid',
                            borderColor: selectedTab === 'wallet' ? '#2563eb' : '#e2e8f0',
                            background: selectedTab === 'wallet' ? '#eff6ff' : '#ffffff',
                            color: selectedTab === 'wallet' ? '#1d4ed8' : '#64748b',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span>⚡</span>
                        <span>MCOM Wallet</span>
                        <span style={{
                            background: selectedTab === 'wallet' ? '#2563eb' : '#e2e8f0',
                            color: selectedTab === 'wallet' ? '#fff' : '#64748b',
                            fontSize: '0.65rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '100px',
                            fontWeight: 800,
                        }}>
                            RECOMMENDED
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedTab('card')
                            if (canUseElements && !clientSecret && !stripeInitiating) {
                                initiateStripeCheckout()
                            }
                        }}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            border: '1px solid',
                            borderColor: selectedTab === 'card' ? '#2563eb' : '#e2e8f0',
                            background: selectedTab === 'card' ? '#eff6ff' : '#ffffff',
                            color: selectedTab === 'card' ? '#1d4ed8' : '#64748b',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span>💳</span>
                        <span>Card (Stripe)</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
                    {/* ─── TAB 1: MCOM CENTRALIZED WALLET ──────────────────────────── */}
                    {selectedTab === 'wallet' && (
                        <div>
                            {/* Wallet Info Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                border: '1px solid #bbf7d0',
                                borderRadius: '1rem',
                                padding: '1.25rem',
                                marginBottom: '1.25rem',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#166534', fontWeight: 800 }}>
                                            Centralized Mcom Wallet
                                        </div>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#14532d', marginTop: '0.1rem' }}>
                                            {walletLoading ? (
                                                <span style={{ fontSize: '1rem', color: '#166534' }}>Checking balance…</span>
                                            ) : (
                                                `${availableBalance.toFixed(2)} MCOM`
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fetchWalletBalance(true)}
                                        disabled={refreshingBalance || walletLoading}
                                        style={{
                                            background: '#ffffff',
                                            border: '1px solid #bbf7d0',
                                            borderRadius: '0.5rem',
                                            padding: '0.35rem 0.65rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: '#166534',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            cursor: 'pointer',
                                        }}
                                        title="Refresh Wallet Balance from Central Hub"
                                    >
                                        <span style={{ display: 'inline-block', transform: refreshingBalance ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s ease' }}>
                                            🔄
                                        </span>
                                        {refreshingBalance ? 'Refreshing…' : 'Refresh'}
                                    </button>
                                </div>

                                <div style={{ fontSize: '0.8rem', color: '#15803d', display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed #bbf7d0' }}>
                                    <span>Plan Price: <b>{price.toFixed(2)} MCOM</b></span>
                                    {hasSufficientWalletBalance && (
                                        <span>Remaining after: <b>{(availableBalance - price).toFixed(2)} MCOM</b></span>
                                    )}
                                </div>
                            </div>

                            {walletError && (
                                <div style={{
                                    marginBottom: '1rem',
                                    padding: '0.75rem 1rem',
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '0.5rem',
                                    color: '#b91c1c',
                                    fontSize: '0.85rem',
                                }}>
                                    {walletError}
                                </div>
                            )}

                            {/* Sufficient Balance -> One-Click Purchase */}
                            {hasSufficientWalletBalance ? (
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                        Funds will be debited instantly from your Central MCOM Solutions Wallet. Your business subscription will activate immediately across the high-street network.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleWalletPurchase}
                                        disabled={walletPurchasing || walletLoading}
                                        className="db-btn db-btn-primary"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            justifyContent: 'center',
                                            fontSize: '1.05rem',
                                            fontWeight: 800,
                                            background: '#16a34a',
                                            borderColor: '#15803d',
                                            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                                        }}
                                    >
                                        {walletPurchasing ? 'Debiting Wallet & Activating…' : `Pay ${price.toFixed(2)} MCOM & Activate`}
                                    </button>
                                </div>
                            ) : (
                                /* Insufficient Balance -> Top-Up Action */
                                <div style={{
                                    background: '#fffbeb',
                                    border: '1px solid #fde68a',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem' }}>
                                                Insufficient Wallet Balance
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: '#b45309', margin: '0.25rem 0 0.75rem', lineHeight: 1.4 }}>
                                                You need <b>{price.toFixed(2)} MCOM</b>, but currently have <b>{availableBalance.toFixed(2)} MCOM</b>.
                                                Top up your wallet on the MCOM Solutions Central Hub, then click <b>Refresh Balance</b> below.
                                            </p>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <a
                                                    href={`${MCOM_SOLUTIONS_URL}/dashboard`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="db-btn db-btn-primary"
                                                    style={{
                                                        padding: '0.65rem 1rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 700,
                                                        background: '#d97706',
                                                        borderColor: '#b45309',
                                                        textDecoration: 'none',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                    }}
                                                >
                                                    <span>Top Up Wallet in Central Hub</span>
                                                    <span>↗</span>
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => fetchWalletBalance(true)}
                                                    disabled={refreshingBalance}
                                                    className="db-btn db-btn-ghost"
                                                    style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 700 }}
                                                >
                                                    {refreshingBalance ? 'Checking…' : 'I have topped up, Refresh'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                className="db-btn db-btn-ghost"
                                onClick={onClose}
                                disabled={walletPurchasing}
                                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* ─── TAB 2: CREDIT / DEBIT CARD (STRIPE) ───────────────────────── */}
                    {selectedTab === 'card' && (
                        <div>
                            {/* In mock mode or when Stripe is unavailable */}
                            {USE_MOCK ? (
                                <div>
                                    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe', marginBottom: '1rem' }}>
                                        <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.85rem' }}>🧪 Mock Mode Active</div>
                                        <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '0.2rem' }}>
                                            Simulate an instant card transaction without connecting to Stripe.
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFallbackConfirm}
                                        className="db-btn db-btn-primary"
                                        style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}
                                    >
                                        Simulate Card Payment (£{price.toFixed(2)})
                                    </button>
                                </div>
                            ) : canUseElements ? (
                                <div>
                                    {clientSecret ? (
                                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                                            <StripeCheckoutForm
                                                plan={plan}
                                                billingCycle={billingCycle}
                                                price={price}
                                                cycleLabel={cycleLabel}
                                                clientSecret={clientSecret}
                                                intentType={intentType}
                                                onClose={onClose}
                                                onSuccess={onSuccess}
                                            />
                                        </Elements>
                                    ) : (
                                        <div>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                                Pay securely with credit or debit card processed centrally through MCOM Solutions.
                                            </p>
                                            {stripeInitError && (
                                                <div style={{
                                                    marginBottom: '1rem',
                                                    padding: '0.75rem',
                                                    background: '#fef2f2',
                                                    border: '1px solid #fecaca',
                                                    borderRadius: '0.5rem',
                                                    color: '#dc2626',
                                                    fontSize: '0.85rem',
                                                }}>
                                                    {stripeInitError}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={initiateStripeCheckout}
                                                disabled={stripeInitiating}
                                                className="db-btn db-btn-primary"
                                                style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}
                                            >
                                                {stripeInitiating ? 'Preparing Card Form…' : `Enter Card Details (£${price.toFixed(2)})`}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Stripe Key Not Available on Server */
                                <div style={{
                                    padding: '1.25rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
                                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>
                                        Card Payments Under Maintenance
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.5rem 0 1.25rem' }}>
                                        Card processing is currently undergoing setup. Please use your <b>MCOM Centralized Wallet</b> to complete this transaction seamlessly.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTab('wallet')}
                                        className="db-btn db-btn-primary"
                                        style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontWeight: 700 }}
                                    >
                                        ⚡ Switch to MCOM Wallet
                                    </button>
                                </div>
                            )}

                            <button
                                type="button"
                                className="db-btn db-btn-ghost"
                                onClick={onClose}
                                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StripeCheckoutModal

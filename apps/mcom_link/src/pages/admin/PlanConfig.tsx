import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getPlans, getPlanSchema, createPlan, updatePlan, deletePlan, type PlanSchema, type PlanInput } from '../../api/plans'
import type { Plan } from '../../types'

interface PlanFormState {
    name: string
    description: string
    tagline: string
    bestFor: string
    isFree: boolean
    monthlyPrice: number
    quarterlyPrice: number
    annualPrice: number
    features: string[]
    limitations: string[]
    quotas: Record<string, number | boolean>
    featureFlags: Record<string, boolean>
    isActive: boolean
    isDefault: boolean
    type: 'STANDARD' | 'TRIAL' | 'SEASONAL'
    trialDuration: number | undefined
    seasonId: string | undefined
    stripeMonthlyPriceId: string
    stripeQuarterlyPriceId: string
    stripeAnnualPriceId: string
    paypalMonthlyPlanId: string
    paypalQuarterlyPlanId: string
    paypalAnnualPlanId: string
}

const emptyForm = (schema: PlanSchema | null): PlanFormState => {
    const quotas: Record<string, number | boolean> = {}
    const featureFlags: Record<string, boolean> = {}
    schema?.quotas.forEach(q => { quotas[q.key] = q.type === 'boolean' ? false : 0 })
    schema?.featureFlags.forEach(f => { featureFlags[f.key] = false })
    return {
        name: '',
        description: '',
        tagline: '',
        bestFor: '',
        isFree: false,
        monthlyPrice: 0,
        quarterlyPrice: 0,
        annualPrice: 0,
        features: [],
        limitations: [],
        quotas,
        featureFlags,
        isActive: true,
        isDefault: false,
        type: 'STANDARD',
        trialDuration: undefined,
        seasonId: undefined,
        stripeMonthlyPriceId: '',
        stripeQuarterlyPriceId: '',
        stripeAnnualPriceId: '',
        paypalMonthlyPlanId: '',
        paypalQuarterlyPlanId: '',
        paypalAnnualPlanId: '',
    }
}

const toForm = (plan: Plan, schema: PlanSchema | null): PlanFormState => {
    const base = emptyForm(schema)
    const quotas = { ...base.quotas }
    const featureFlags = { ...base.featureFlags }
    schema?.quotas.forEach(q => {
        if (plan.configuration?.quotas?.[q.key] !== undefined) quotas[q.key] = plan.configuration.quotas[q.key]
    })
    schema?.featureFlags.forEach(f => {
        if (plan.configuration?.featureFlags?.[f.key] !== undefined) featureFlags[f.key] = plan.configuration.featureFlags[f.key]
    })
    return {
        name: plan.name,
        description: plan.description || '',
        tagline: plan.tagline || '',
        bestFor: plan.bestFor || '',
        isFree: !!plan.isFree,
        monthlyPrice: plan.monthlyPrice,
        quarterlyPrice: plan.quarterlyPrice,
        annualPrice: plan.annualPrice,
        features: plan.features || [],
        limitations: plan.limitations || [],
        quotas,
        featureFlags,
        isActive: plan.isActive,
        isDefault: plan.isDefault,
        type: plan.type,
        trialDuration: plan.trialDuration,
        seasonId: plan.seasonId,
        stripeMonthlyPriceId: plan.stripeMonthlyPriceId || '',
        stripeQuarterlyPriceId: plan.stripeQuarterlyPriceId || '',
        stripeAnnualPriceId: plan.stripeAnnualPriceId || '',
        paypalMonthlyPlanId: plan.paypalMonthlyPlanId || '',
        paypalQuarterlyPlanId: plan.paypalQuarterlyPlanId || '',
        paypalAnnualPlanId: plan.paypalAnnualPlanId || '',
    }
}

const toInput = (form: PlanFormState): PlanInput => ({
    name: form.name,
    description: form.description || undefined,
    tagline: form.tagline || undefined,
    bestFor: form.bestFor || undefined,
    isFree: form.isFree,
    monthlyPrice: form.isFree ? 0 : form.monthlyPrice,
    quarterlyPrice: form.isFree ? 0 : form.quarterlyPrice,
    annualPrice: form.isFree ? 0 : form.annualPrice,
    features: form.features,
    limitations: form.limitations,
    configuration: { quotas: form.quotas, featureFlags: form.featureFlags },
    isActive: form.isActive,
    isDefault: form.isDefault,
    type: form.type,
    trialDuration: form.type === 'TRIAL' ? form.trialDuration : undefined,
    seasonId: form.type === 'SEASONAL' ? form.seasonId : undefined,
    stripeMonthlyPriceId: form.stripeMonthlyPriceId || undefined,
    stripeQuarterlyPriceId: form.stripeQuarterlyPriceId || undefined,
    stripeAnnualPriceId: form.stripeAnnualPriceId || undefined,
    paypalMonthlyPlanId: form.paypalMonthlyPlanId || undefined,
    paypalQuarterlyPlanId: form.paypalQuarterlyPlanId || undefined,
    paypalAnnualPlanId: form.paypalAnnualPlanId || undefined,
})

const inputCls: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    background: '#fff',
    color: '#0f172a',
}
const labelCls: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 800,
    color: '#64748b',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
}
const cardCls: React.CSSProperties = {
    background: '#fff',
    padding: '2rem',
    borderRadius: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
}

function formatMoney(value: number): string {
    return value === 0 ? 'Free' : `£${value.toFixed(2)}`
}

export default function PlanConfig() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [schema, setSchema] = useState<PlanSchema | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState<string | null>(null)

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<PlanFormState>(() => emptyForm(null))
    const [formError, setFormError] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState<'general' | 'pricing' | 'quotas' | 'features' | 'featureflags'>('general')

    const [confirmDelete, setConfirmDelete] = useState<Plan | null>(null)
    const [deleting, setDeleting] = useState(false)

    const sections = useMemo(() => [
        { id: 'general', label: 'General' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'quotas', label: 'Quotas & Access' },
        { id: 'features', label: 'Features' },
        { id: 'featureflags', label: 'Feature Flags' },
    ] as const, [])

    const load = async () => {
        setLoading(true)
        setError(null)
        try {
            const [plansData, schemaData] = await Promise.all([getPlans(), getPlanSchema()])
            setPlans(plansData || [])
            setSchema(schemaData)
        } catch (e: any) {
            setError(e?.message || 'Failed to load plans')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm(schema))
        setFormError(null)
        setActiveSection('general')
        setShowModal(true)
    }

    const openEdit = (plan: Plan) => {
        setEditingId(plan.id)
        setForm(toForm(plan, schema))
        setFormError(null)
        setActiveSection('general')
        setShowModal(true)
    }

    const updateForm = (patch: Partial<PlanFormState>) => {
        setForm(prev => ({ ...prev, ...patch }))
    }

    const handleSave = async () => {
        setFormError(null)
        if (!form.name.trim()) {
            setFormError('Plan name is required.')
            setActiveSection('general')
            return
        }
        if (form.type === 'TRIAL' && (!form.trialDuration || form.trialDuration <= 0)) {
            setFormError('TRIAL plans must have a positive trial duration (days).')
            setActiveSection('general')
            return
        }
        if (form.type === 'SEASONAL' && !form.seasonId) {
            setFormError('SEASONAL plans require a season. Create a season under Seasonal Campaigns first.')
            setActiveSection('general')
            return
        }
        setSaving(true)
        try {
            const input = toInput(form)
            if (editingId) {
                await updatePlan(editingId, input)
            } else {
                await createPlan(input)
            }
            setShowModal(false)
            setSaved('Plan saved successfully.')
            setTimeout(() => setSaved(null), 3000)
            await load()
        } catch (e: any) {
            setFormError(e?.message || 'Failed to save plan.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirmDelete) return
        setDeleting(true)
        try {
            await deletePlan(confirmDelete.id)
            setSaved(`Plan "${confirmDelete.name}" archived.`)
            setTimeout(() => setSaved(null), 3000)
            setConfirmDelete(null)
            await load()
        } catch (e: any) {
            setError(e?.message || 'Failed to archive plan.')
            setConfirmDelete(null)
        } finally {
            setDeleting(false)
        }
    }

    const addFeature = () => updateForm({ features: [...form.features, ''] })
    const updateFeature = (idx: number, value: string) => {
        const features = [...form.features]
        features[idx] = value
        updateForm({ features })
    }
    const removeFeature = (idx: number) => {
        updateForm({ features: form.features.filter((_, i) => i !== idx) })
    }

    const addLimitation = () => updateForm({ limitations: [...form.limitations, ''] })
    const updateLimitation = (idx: number, value: string) => {
        const limitations = [...form.limitations]
        limitations[idx] = value
        updateForm({ limitations })
    }
    const removeLimitation = (idx: number) => {
        updateForm({ limitations: form.limitations.filter((_, i) => i !== idx) })
    }

    const quotaSummary = (plan: Plan): string[] => {
        const q = plan.configuration?.quotas || {}
        return Object.entries(q)
            .filter(([, v]) => typeof v === 'number')
            .slice(0, 3)
            .map(([k, v]) => `${k}: ${v === -1 ? '∞' : v}`)
    }

    return (
        <AdminLayout title="Plan Management Studio">
            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Subscription Plans</h2>
                        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                            Configure what each plan allows. These plans sync with the MCOM Solutions console via <code>/api/v1/system/plans</code>.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        + Create Plan
                    </button>
                </div>

                {saved && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '1rem 1.25rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        ✓ {saved}
                    </div>
                )}
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem 1.25rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading plans…</div>
                ) : plans.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', border: '2px dashed #e2e8f0', borderRadius: '1.5rem' }}>
                        No plans yet. Click <b>+ Create Plan</b> to add your first plan.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {plans.map(plan => (
                            <div key={plan.id} style={{ ...cardCls, display: 'flex', flexDirection: 'column', gap: '0.75rem', border: plan.isDefault ? '2px solid #2563eb' : '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{plan.name}</h3>
                                            {plan.isDefault && <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px', border: '1px solid #bfdbfe' }}>DEFAULT</span>}
                                            {plan.isFree && <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px', border: '1px solid #a7f3d0' }}>FREE</span>}
                                            {plan.type === 'TRIAL' && <span style={{ background: '#fefce8', color: '#a16207', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px', border: '1px solid #fde68a' }}>TRIAL</span>}
                                            {plan.type === 'SEASONAL' && <span style={{ background: '#fdf2f8', color: '#be185d', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '100px', border: '1px solid #fbcfe8' }}>SEASONAL</span>}
                                        </div>
                                        <div style={{ color: plan.isActive ? '#10b981' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
                                            {plan.isActive ? '● Active' : '○ Archived'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {plan.isFree ? (
                                            <div style={{ fontWeight: 900, color: '#059669' }}>Free</div>
                                        ) : (
                                            <>
                                                <div style={{ fontWeight: 900, color: '#0f172a' }}>{formatMoney(plan.monthlyPrice)}<span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>/mo</span></div>
                                                {plan.annualPrice > 0 && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{formatMoney(plan.annualPrice)}/yr</div>}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {plan.description && <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>{plan.description}</p>}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {quotaSummary(plan).map((q, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{q.split(':')[0].replace(/([A-Z])/g, ' $1')}</span>
                                            <span style={{ fontWeight: 800 }}>{q.split(':')[1]}</span>
                                        </div>
                                    ))}
                                </div>

                                {plan.features && plan.features.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {plan.features.slice(0, 4).map((f, i) => (
                                            <span key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem', color: '#475569' }}>{f}</span>
                                        ))}
                                        {plan.features.length > 4 && <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>+{plan.features.length - 4} more</span>}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <button onClick={() => openEdit(plan)} style={{ flex: 1, padding: '0.6rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.6rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>
                                        Configure
                                    </button>
                                    <button onClick={() => setConfirmDelete(plan)} style={{ padding: '0.6rem 1rem', background: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '0.6rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>
                                        Archive
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Create / Edit Modal ── */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}>
                    <div style={{ background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: '760px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}>
                        {/* Modal header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{editingId ? `Configure ${form.name || 'Plan'}` : 'Create New Plan'}</h3>
                                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>Define pricing, quotas, and what this plan can do.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
                        </div>

                        {/* Section tabs */}
                        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc' }}>
                            {sections.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '100px',
                                        border: activeSection === s.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                                        background: activeSection === s.id ? '#eff6ff' : '#fff',
                                        color: activeSection === s.id ? '#1d4ed8' : '#64748b',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Body */}
                        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                            {formError && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                                    {formError}
                                </div>
                            )}

                            {activeSection === 'general' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelCls}>Plan Name *</label>
                                        <input style={inputCls} value={form.name} onChange={e => updateForm({ name: e.target.value })} placeholder="e.g. National Network" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelCls}>Description</label>
                                        <textarea style={{ ...inputCls, minHeight: '70px', resize: 'vertical' }} value={form.description} onChange={e => updateForm({ description: e.target.value })} placeholder="Short summary shown on pricing pages" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelCls}>Tagline (shown on the pricing card)</label>
                                        <input style={inputCls} value={form.tagline} onChange={e => updateForm({ tagline: e.target.value })} placeholder="e.g. Grow beyond your storefront" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelCls}>Best For</label>
                                        <input style={inputCls} value={form.bestFor} onChange={e => updateForm({ bestFor: e.target.value })} placeholder="e.g. Businesses ready to scale" />
                                    </div>
                                    <div>
                                        <label style={labelCls}>Plan Type</label>
                                        <select style={inputCls} value={form.type} onChange={e => updateForm({ type: e.target.value as PlanFormState['type'] })}>
                                            <option value="STANDARD">Standard</option>
                                            <option value="TRIAL">Trial</option>
                                            <option value="SEASONAL">Seasonal</option>
                                        </select>
                                    </div>
                                    {form.type === 'TRIAL' && (
                                        <div>
                                            <label style={labelCls}>Trial Duration (days)</label>
                                            <input style={inputCls} type="number" min={1} value={form.trialDuration ?? ''} onChange={e => updateForm({ trialDuration: e.target.value ? Number(e.target.value) : undefined })} />
                                        </div>
                                    )}
                                    {form.type === 'SEASONAL' && (
                                        <div>
                                            <label style={labelCls}>Season</label>
                                            <input style={inputCls} value={form.seasonId || ''} onChange={e => updateForm({ seasonId: e.target.value })} placeholder="Season UUID from Seasonal Campaigns" />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem', flexWrap: 'wrap' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.isActive} onChange={e => updateForm({ isActive: e.target.checked })} />
                                            Active
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.isDefault} onChange={e => updateForm({ isDefault: e.target.checked })} />
                                            Default (fallback plan)
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.isFree} onChange={e => updateForm({ isFree: e.target.checked })} />
                                            Free plan (prices forced to £0)
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'pricing' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: form.isFree ? '#fefce8' : '#f8fafc', border: `1px solid ${form.isFree ? '#fde68a' : '#e2e8f0'}`, padding: '1rem 1.25rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 700, color: form.isFree ? '#a16207' : '#64748b' }}>
                                        {form.isFree
                                            ? 'This plan is marked as FREE — all prices are locked to £0.'
                                            : 'Set the monthly, quarterly and annual prices for this plan.'}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                    <div>
                                        <label style={labelCls}>Monthly (£)</label>
                                        <input style={inputCls} type="number" min={0} step="0.01" disabled={form.isFree} value={form.monthlyPrice} onChange={e => updateForm({ monthlyPrice: Number(e.target.value) || 0 })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>Quarterly (£)</label>
                                        <input style={inputCls} type="number" min={0} step="0.01" disabled={form.isFree} value={form.quarterlyPrice} onChange={e => updateForm({ quarterlyPrice: Number(e.target.value) || 0 })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>Annual (£)</label>
                                        <input style={inputCls} type="number" min={0} step="0.01" disabled={form.isFree} value={form.annualPrice} onChange={e => updateForm({ annualPrice: Number(e.target.value) || 0 })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>Stripe Monthly Price ID</label>
                                        <input style={inputCls} value={form.stripeMonthlyPriceId} onChange={e => updateForm({ stripeMonthlyPriceId: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>Stripe Quarterly Price ID</label>
                                        <input style={inputCls} value={form.stripeQuarterlyPriceId} onChange={e => updateForm({ stripeQuarterlyPriceId: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>Stripe Annual Price ID</label>
                                        <input style={inputCls} value={form.stripeAnnualPriceId} onChange={e => updateForm({ stripeAnnualPriceId: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>PayPal Monthly Plan ID</label>
                                        <input style={inputCls} value={form.paypalMonthlyPlanId} onChange={e => updateForm({ paypalMonthlyPlanId: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>PayPal Quarterly Plan ID</label>
                                        <input style={inputCls} value={form.paypalQuarterlyPlanId} onChange={e => updateForm({ paypalQuarterlyPlanId: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelCls}>PayPal Annual Plan ID</label>
                                        <input style={inputCls} value={form.paypalAnnualPlanId} onChange={e => updateForm({ paypalAnnualPlanId: e.target.value })} />
                                    </div>
                                </div>
                                </div>
                            )}

                            {activeSection === 'quotas' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(schema?.quotas || []).map(q => (
                                        <div key={q.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{q.label}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{q.key}</div>
                                            </div>
                                            {q.type === 'number' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input
                                                        type="number"
                                                        min={-1}
                                                        value={Number(form.quotas[q.key] ?? 0)}
                                                        onChange={e => updateForm({ quotas: { ...form.quotas, [q.key]: Number(e.target.value) || 0 } })}
                                                        style={{ width: '90px', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 800 }}
                                                    />
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{q.unlimited ? '(-1 = unlimited)' : ''}</span>
                                                </div>
                                            ) : (
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={!!form.quotas[q.key]} onChange={e => updateForm({ quotas: { ...form.quotas, [q.key]: e.target.checked } })} />
                                                    Enabled
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                    {(!schema || schema.quotas.length === 0) && <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No quota fields configured in the plan schema.</p>}
                                </div>
                            )}

                            {activeSection === 'features' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={labelCls}>Included Feature Bullets</label>
                                            <button onClick={addFeature} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>+ Add</button>
                                        </div>
                                        {form.features.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <input style={inputCls} value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`e.g. Up to ${20 * (i + 1)} active campaigns`} />
                                                <button onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                            </div>
                                        ))}
                                        {form.features.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No features listed yet.</p>}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={labelCls}>Limitations (shown on the pricing card)</label>
                                            <button onClick={addLimitation} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>+ Add</button>
                                        </div>
                                        {form.limitations.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <input style={inputCls} value={f} onChange={e => updateLimitation(i, e.target.value)} placeholder="e.g. No automatic renewal (expires after 90 days)" />
                                                <button onClick={() => removeLimitation(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                            </div>
                                        ))}
                                        {form.limitations.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No limitations configured.</p>}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'featureflags' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(schema?.featureFlags || []).map(f => (
                                        <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{f.label}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>{f.key}</div>
                                            </div>
                                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!form.featureFlags[f.key]}
                                                    onChange={e => updateForm({ featureFlags: { ...form.featureFlags, [f.key]: e.target.checked } })}
                                                    style={{ opacity: 0, width: 0, height: 0 }}
                                                />
                                                <span style={{
                                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '34px',
                                                    backgroundColor: form.featureFlags[f.key] ? '#2563eb' : '#cbd5e1', transition: '.4s',
                                                }}>
                                                    <span style={{
                                                        position: 'absolute', height: '16px', width: '16px', left: form.featureFlags[f.key] ? '24px' : '4px', bottom: '3px',
                                                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                                    }} />
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                    {(!schema || schema.featureFlags.length === 0) && <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No feature flags configured in the plan schema.</p>}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: '#f8fafc' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', color: '#475569' }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
                            >
                                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {confirmDelete && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)' }}>
                    <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Archive "{confirmDelete.name}"?</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginTop: '0.75rem' }}>
                            The plan will be deactivated and hidden from purchase. Historical records are preserved.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ padding: '0.6rem 1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', color: '#475569' }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleting} style={{ padding: '0.6rem 1.25rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', opacity: deleting ? 0.6 : 1 }}>
                                {deleting ? 'Archiving…' : 'Archive Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
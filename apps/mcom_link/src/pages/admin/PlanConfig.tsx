import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

interface ComparisonFeature {
    id: string;
    label: string;
}

interface PlanSettings {
    id: string;
    name: string;
    type: string;
    price: string;
    period: string;
    tagline: string;
    color: string;
    popular: boolean;
    included: string[];
    limitations: string[];
    advantage: string;
    bestFor: string;
    features: Record<string, boolean | string>; // For comparison table
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
    { id: '90-day-access', label: '90-Day Access' },
    { id: 'qr-brand-id', label: 'QR Brand ID' },
    { id: 'storefront-campaigns', label: 'Storefront Campaigns' },
    { id: 'national-campaigns', label: 'National Campaigns' },
    { id: 'hyperlocal-campaigns', label: 'Hyper Local Campaigns' },
    { id: 'nearby-campaigns', label: 'Nearby Campaigns' },
    { id: 'third-party-promotion', label: 'Third-Party Promotion' },
    { id: 'auto-rollover', label: 'Auto Rollover' },
    { id: 'expo-access', label: 'Expo Access' },
    { id: 'priority-visibility', label: 'Priority Visibility' },
];

const initialPlans: PlanSettings[] = [
    {
        id: 'basic',
        name: 'BASIC',
        type: '90-Day Access',
        popular: false,
        price: '90',
        period: '90 days',
        tagline: 'Start showing your business on MCOMQLinks',
        color: '#22c55e',
        included: [
            'Claim and activate your Storefront listing',
            'Get your QR Brand ID',
            'Run MCOMQLinks campaigns',
            'Appear on external storefront campaigns',
            'Appear on internal campaigns',
            'Participate in National campaigns',
            'Participate in Hyper local campaigns',
            'Use QR on VCards, posters, and campaign materials'
        ],
        limitations: [
            'No promotion of third-party products/services',
            'No automatic renewal (expires after 90 days)',
            'No Expo access',
            'Standard visibility only'
        ],
        advantage: '',
        bestFor: 'Businesses just getting started, testing the platform, local storefront presence',
        features: {
            '90-day-access': true,
            'qr-brand-id': true,
            'storefront-campaigns': true,
            'national-campaigns': true,
            'hyperlocal-campaigns': true,
            'nearby-campaigns': false,
            'third-party-promotion': false,
            'auto-rollover': false,
            'expo-access': false,
            'priority-visibility': false,
        }
    },
    {
        id: 'pro',
        name: 'PRO',
        type: 'Growth Mode',
        popular: false,
        price: '450',
        period: '90 days',
        tagline: 'Grow beyond your storefront and scale your campaigns',
        color: '#2563eb',
        included: [
            'Everything in BASIC',
            'Promote third-party products & services',
            'Run Nearby campaigns',
            'Auto 90-day rollover into next season',
            'Access to future seasonal campaigns',
            'Access to evergreen campaign cycles',
            'Greater campaign flexibility',
            'Increased exposure across network'
        ],
        limitations: [],
        advantage: 'Your campaigns continue automatically beyond 90 days',
        bestFor: 'Businesses ready to scale, multi-product/service sellers, partner/collaboration businesses',
        features: {
            '90-day-access': true,
            'qr-brand-id': true,
            'storefront-campaigns': true,
            'national-campaigns': true,
            'hyperlocal-campaigns': true,
            'nearby-campaigns': true,
            'third-party-promotion': true,
            'auto-rollover': true,
            'expo-access': 'Limited',
            'priority-visibility': false,
        }
    },
    {
        id: 'pro-plus',
        name: 'PRO+',
        type: 'Full Visibility & Expo Access',
        popular: true,
        price: '1100',
        period: '90 days',
        tagline: 'Maximum exposure, priority access, and event promotion',
        color: '#8b5cf6',
        included: [
            'Everything in PRO',
            'Full access to End-of-Season Marketing Expo',
            'Participate as seller or promoter',
            'Priority visibility in campaigns',
            'Higher placement in National campaigns',
            'Higher placement in Hyper local campaigns',
            'Premium positioning across MCOMQLinks',
            'Stronger brand exposure'
        ],
        limitations: [],
        advantage: 'You are actively promoted and highlighted across the network',
        bestFor: 'Serious businesses, brands launching products/services, businesses that want maximum visibility',
        features: {
            '90-day-access': true,
            'qr-brand-id': true,
            'storefront-campaigns': true,
            'national-campaigns': true,
            'hyperlocal-campaigns': true,
            'nearby-campaigns': true,
            'third-party-promotion': true,
            'auto-rollover': true,
            'expo-access': true,
            'priority-visibility': true,
        }
    }
];

export default function PlanConfig() {
    const [plans, setPlans] = useState<PlanSettings[]>(initialPlans);
    const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlans[0].id);
    const [isSaving, setIsSaving] = useState(false);

    const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

    const updatePlan = (updates: Partial<PlanSettings>) => {
        setPlans(plans.map(p => p.id === selectedPlanId ? { ...p, ...updates } : p));
    };

    const toggleFeature = (featureId: string) => {
        const currentVal = selectedPlan.features[featureId];
        let newVal: boolean | string;
        
        if (typeof currentVal === 'boolean') {
            newVal = !currentVal;
        } else {
            newVal = true; // Default to true if it was a string and we toggle
        }
        
        updatePlan({
            features: {
                ...selectedPlan.features,
                [featureId]: newVal
            }
        });
    };

    const setFeatureValue = (featureId: string, value: string) => {
        updatePlan({
            features: {
                ...selectedPlan.features,
                [featureId]: value
            }
        });
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Plan configuration saved successfully! Public pricing page updated.');
        }, 1000);
    };

    const addListItem = (type: 'included' | 'limitations') => {
        const newItem = prompt(`Add new item to ${type}:`);
        if (newItem) {
            updatePlan({ [type]: [...selectedPlan[type], newItem] });
        }
    };

    const removeListItem = (type: 'included' | 'limitations', index: number) => {
        const newList = [...selectedPlan[type]];
        newList.splice(index, 1);
        updatePlan({ [type]: newList });
    };

    return (
        <AdminLayout title="Plan Management Studio">
            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                
                {/* Sidebar - Plan Selection & Preview */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.05em' }}>Select Plan to Edit</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {plans.map(plan => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        border: selectedPlanId === plan.id ? `2px solid ${plan.color}` : '1px solid #e2e8f0',
                                        background: selectedPlanId === plan.id ? `${plan.color}08` : '#fff',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: plan.color }}></div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: selectedPlanId === plan.id ? plan.color : '#0f172a' }}>{plan.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>£{plan.price} / 90d</span>
                                    </div>
                                    {plan.popular && <div style={{ position: 'absolute', top: '-8px', right: '12px', background: plan.color, color: '#fff', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 900 }}>POPULAR</div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LIVE PREVIEW CARD */}
                    <div style={{ padding: '0.5rem' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.05em' }}>Live Studio Preview</h3>
                        <div style={{ 
                            transform: 'scale(0.85)', 
                            transformOrigin: 'top center',
                            background: '#fff',
                            border: `2px solid ${selectedPlan.popular ? selectedPlan.color : '#e2e8f0'}`,
                            borderRadius: '1.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            pointerEvents: 'none',
                            maxHeight: '600px',
                            overflow: 'hidden',
                            opacity: 0.9
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ color: selectedPlan.color, fontWeight: 900, fontSize: '0.9rem', display: 'block' }}>{selectedPlan.name}</span>
                                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{selectedPlan.type}</span>
                                <div style={{ margin: '0.75rem 0' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 900 }}>£{selectedPlan.price}</span>
                                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}> / {selectedPlan.period}</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', margin: 0 }}>{selectedPlan.tagline}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedPlan.included.slice(0, 4).map((inc, i) => (
                                    <div key={i} style={{ fontSize: '0.7rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: selectedPlan.color }}>✓</span> {inc}</div>
                                ))}
                                {selectedPlan.included.length > 4 && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>+ {selectedPlan.included.length - 4} more</div>}
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '1.25rem', color: '#fff', marginTop: '-40px' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.75rem' }}>Studio Shortcuts</h3>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.6' }}>Use the matrix below to instantly toggle features across the entire MCOMQLinks network.</p>
                        <button onClick={handleSave} disabled={isSaving} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer', marginTop: '1rem' }}>
                            {isSaving ? 'Synchronizing...' : 'Save All Changes'}
                        </button>
                    </div>
                </aside>

                {/* Main Studio Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Plan Header Info */}
                    <section style={{ background: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Configure {selectedPlan.name}</h2>
                                <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Modify visual elements and strategic positioning for this tier.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, padding: '0.5rem 1rem', background: '#f8fafc', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
                                    Popular?
                                    <input type="checkbox" checked={selectedPlan.popular} onChange={e => updatePlan({ popular: e.target.checked })} />
                                </label>

                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Plan Tagline</label>
                                <input 
                                    type="text" 
                                    value={selectedPlan.tagline} 
                                    onChange={e => updatePlan({ tagline: e.target.value })}
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Price (£)</label>
                                    <input 
                                        type="text" 
                                        value={selectedPlan.price} 
                                        onChange={e => updatePlan({ price: e.target.value })}
                                        style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: 800 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Period</label>
                                    <input 
                                        type="text" 
                                        value={selectedPlan.period} 
                                        onChange={e => updatePlan({ period: e.target.value })}
                                        style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                                    />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Best For</label>
                                <input 
                                    type="text" 
                                    value={selectedPlan.bestFor} 
                                    onChange={e => updatePlan({ bestFor: e.target.value })}
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Features & Limitations Lists */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <section style={{ background: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Included Features</h3>
                                <button onClick={() => addListItem('included')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Add</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {selectedPlan.included.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#10b981' }}>✓</span>
                                        <span style={{ flexGrow: 1 }}>{item}</span>
                                        <button onClick={() => removeListItem('included', i)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section style={{ background: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Limitations</h3>
                                <button onClick={() => addListItem('limitations')} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Add</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {selectedPlan.limitations.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#fff1f2', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#ef4444' }}>×</span>
                                        <span style={{ flexGrow: 1 }}>{item}</span>
                                        <button onClick={() => removeListItem('limitations', i)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                                    </div>
                                ))}
                                {selectedPlan.limitations.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No limitations configured for this tier.</p>}
                            </div>
                        </section>
                    </div>

                    {/* Comparison matrix editor */}
                    <section style={{ background: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#2563eb', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>MATRIX</span>
                            Comparison Feature Toggles
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            {COMPARISON_FEATURES.map(feature => {
                                const val = selectedPlan.features[feature.id];
                                return (
                                    <div key={feature.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{feature.label}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Toggle visibility in comparison table</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {typeof val === 'string' ? (
                                                <input 
                                                    type="text" 
                                                    value={val} 
                                                    onChange={e => setFeatureValue(feature.id, e.target.value)}
                                                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}
                                                />
                                            ) : null}
                                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!val} 
                                                    onChange={() => toggleFeature(feature.id)}
                                                    style={{ opacity: 0, width: 0, height: 0 }} 
                                                />
                                                <span style={{ 
                                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                                    backgroundColor: !!val ? selectedPlan.color : '#cbd5e1', 
                                                    transition: '.4s', borderRadius: '34px' 
                                                }}>
                                                    <span style={{ 
                                                        position: 'absolute', content: '""', height: '16px', width: '16px', left: !!val ? '24px' : '4px', bottom: '3px', 
                                                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                                                    }}></span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Advantage Box */}
                    <section style={{ background: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Key Advantage (Optional)</label>
                        <textarea 
                            value={selectedPlan.advantage} 
                            onChange={e => updatePlan({ advantage: e.target.value })}
                            placeholder="e.g. Your campaigns continue automatically beyond 90 days"
                            style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical' }}
                        />
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}

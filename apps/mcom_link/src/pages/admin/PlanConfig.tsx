import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

interface PlanSettings {
    id: string;
    name: string;
    color: string;
    price: string;
    maxHyperlocalOffers: number;
    nearbyAllowed: boolean;
    nationalAllowed: boolean;
    rotatorWeightLimit: number; // Max weight they can set
    featuredPlacement: boolean;
}

const initialPlans: PlanSettings[] = [
    {
        id: 'plan-hyperlocal',
        name: '🟢 Hyper-local',
        color: '#10b981',
        price: 'Included',
        maxHyperlocalOffers: 1,
        nearbyAllowed: false,
        nationalAllowed: false,
        rotatorWeightLimit: 50,
        featuredPlacement: false
    },
    {
        id: 'plan-nearby',
        name: '🟡 Nearby Expansion',
        color: '#f59e0b',
        price: '£X/Area',
        maxHyperlocalOffers: 5,
        nearbyAllowed: true,
        nationalAllowed: false,
        rotatorWeightLimit: 80,
        featuredPlacement: true
    },
    {
        id: 'plan-national',
        name: '🔵 National Network',
        color: '#3b82f6',
        price: 'CPM/Fixed',
        maxHyperlocalOffers: 50,
        nearbyAllowed: true,
        nationalAllowed: true,
        rotatorWeightLimit: 100,
        featuredPlacement: true
    }
]

export default function PlanConfig() {
    const [plans, setPlans] = useState<PlanSettings[]>(initialPlans)

    const updatePlan = (id: string, updates: Partial<PlanSettings>) => {
        setPlans(plans.map(p => p.id === id ? { ...p, ...updates } : p))
    }

    return (
        <AdminLayout title="Global Plan Rules">
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(to right, #000, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        The Idiot-Proof Rulebook
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Set what businesses can and cannot do. No jargon, just simple switches.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {plans.map(plan => (
                        <div key={plan.id} style={{ 
                            background: '#fff', 
                            borderRadius: '2rem', 
                            padding: '2.5rem', 
                            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                            border: `2px solid ${plan.color}20`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: `${plan.color}05`, borderRadius: '0 0 0 100%', zIndex: 0 }}></div>

                            <div style={{ zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: plan.color }}>{plan.name}</h2>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>{plan.price}</span>
                                </div>
                                <hr style={{ border: 'none', borderBottom: '1px solid #f1f5f9', margin: '1rem 0' }} />
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Max Offers */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                                                {plan.id === 'plan-hyperlocal' ? 'Local Campaign Limit' : 
                                                 plan.id === 'plan-nearby' ? 'Expansion Capacity' : 
                                                 'Network Slot Limit'}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                {plan.id === 'plan-hyperlocal' ? 'Limit for local postcode ads' : 
                                                 plan.id === 'plan-nearby' ? 'Max active multi-district ads' : 
                                                 'Total concurrent system slots'}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => updatePlan(plan.id, { maxHyperlocalOffers: Math.max(0, plan.maxHyperlocalOffers - 1) })}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>-</button>
                                            <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 900, fontSize: '1.1rem' }}>{plan.maxHyperlocalOffers}</span>
                                            <button 
                                                onClick={() => updatePlan(plan.id, { maxHyperlocalOffers: plan.maxHyperlocalOffers + 1 })}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>+</button>
                                        </div>
                                    </div>

                                    {/* Nearby Access */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Access to "Nearby"?</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Let them target beyond their shop</div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plan.nearbyAllowed} 
                                                onChange={e => updatePlan(plan.id, { nearbyAllowed: e.target.checked })}
                                                style={{ opacity: 0, width: 0, height: 0 }} 
                                            />
                                            <span style={{ 
                                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                                backgroundColor: plan.nearbyAllowed ? plan.color : '#cbd5e1', 
                                                transition: '.4s', borderRadius: '34px' 
                                            }}>
                                                <span style={{ 
                                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: plan.nearbyAllowed ? '28px' : '4px', bottom: '4px', 
                                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                                                }}></span>
                                            </span>
                                        </label>
                                    </div>

                                    {/* National Access */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Access to "National"?</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Platform-wide visibility</div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plan.nationalAllowed} 
                                                onChange={e => updatePlan(plan.id, { nationalAllowed: e.target.checked })}
                                                style={{ opacity: 0, width: 0, height: 0 }} 
                                            />
                                            <span style={{ 
                                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                                backgroundColor: plan.nationalAllowed ? plan.color : '#cbd5e1', 
                                                transition: '.4s', borderRadius: '34px' 
                                            }}>
                                                <span style={{ 
                                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: plan.nationalAllowed ? '28px' : '4px', bottom: '4px', 
                                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                                                }}></span>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Weight Limit */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Display Priority Limit</div>
                                            <div style={{ fontWeight: 800, color: plan.color }}>{plan.rotatorWeightLimit}%</div>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="100" 
                                            step="10" 
                                            value={plan.rotatorWeightLimit} 
                                            onChange={e => updatePlan(plan.id, { rotatorWeightLimit: parseInt(e.target.value) })}
                                            style={{ width: '100%', accentColor: plan.color }}
                                        />
                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>Max individual campaign weight they can request.</p>
                                    </div>

                                    {/* Featured Toggle */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Featured Placement?</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Allows star badges and top spots</div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plan.featuredPlacement} 
                                                onChange={e => updatePlan(plan.id, { featuredPlacement: e.target.checked })}
                                                style={{ opacity: 0, width: 0, height: 0 }} 
                                            />
                                            <span style={{ 
                                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                                backgroundColor: plan.featuredPlacement ? plan.color : '#cbd5e1', 
                                                transition: '.4s', borderRadius: '34px' 
                                            }}>
                                                <span style={{ 
                                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: plan.featuredPlacement ? '28px' : '4px', bottom: '4px', 
                                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                                                }}></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button style={{ 
                                marginTop: 'auto', 
                                padding: '1rem', 
                                borderRadius: '1rem', 
                                border: 'none', 
                                background: plan.color, 
                                color: '#fff', 
                                fontWeight: 800, 
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                Save Rules for {plan.name.split(' ')[0]}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        💡 <b>Tip:</b> Changes made here take effect instantly for all businesses subscribed to these plans.
                    </p>
                </div>
            </div>
        </AdminLayout>
    )
}

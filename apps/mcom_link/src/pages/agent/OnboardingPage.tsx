import { useState } from 'react'
import AgentLayout from '../../components/AgentLayout'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        phone: '',
        email: '',
        location: '',
        assignedZone: 'High Street',
        planType: 'Basic'
    })

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate delay for a more 'premium' feel
        setStep(100) // loading state
        setTimeout(() => {
            setStep(4) // Confirmation step
        }, 1200)
    }

    return (
        <AgentLayout title="Grow the High Street">
            {/* Header Context - "WOW" the agent */}
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.5rem 0' }}>Expand the Portfolio</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>Follow the guided wizard to onboard a new business partner.</p>
            </div>

            {/* 1. Enhanced Progress Indicator */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3.5rem', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', width: '240px', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '16px', left: 'calc(50% - 120px)', width: `${(step - 1) * 120}px`, height: '2px', background: '#2563eb', zIndex: 0, transition: 'width 0.5s ease' }} />

                {[1, 2, 3].map(s => (
                    <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', zIndex: 1, position: 'relative' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: step === s ? '#2563eb' : step > s ? '#10b981' : '#fff',
                            border: `2px solid ${step >= s ? step === s ? '#2563eb' : '#10b981' : '#cbd5e1'}`,
                            color: step === s ? '#fff' : step > s ? '#fff' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            transition: 'all 0.4s ease',
                            boxShadow: step === s ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none'
                        }}>
                            {step > s ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : s}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: step >= s ? '#0a0a0a' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {s === 1 ? 'Profile' : s === 2 ? 'Plan' : 'Review'}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {step === 1 && (
                    <div className="db-card animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '2.5rem', padding: '2.5rem' }}>
                        <div>
                            <h2 className="db-card-title" style={{ marginBottom: '1.75rem', fontSize: '1.25rem' }}>Business Identity</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="db-form-group">
                                    <label className="db-label">Official Business Name</label>
                                    <input type="text" className="db-input" placeholder="e.g. Vintage Threads" value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Contact Person</label>
                                        <input type="text" className="db-input" placeholder="Name" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                                    </div>
                                    <div className="db-form-group">
                                        <label className="db-label">Phone Number</label>
                                        <input type="tel" className="db-input" placeholder="+44..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="db-form-group">
                                    <label className="db-label">Merchant Login Email</label>
                                    <input type="email" className="db-input" placeholder="hello@business.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                                    <div className="db-form-group">
                                        <label className="db-label">Zone / Location</label>
                                        <select className="db-input" value={formData.assignedZone} onChange={e => setFormData({ ...formData, assignedZone: e.target.value })}>
                                            <option value="High Street">High Street Central</option>
                                            <option value="Mall North">Mall North Wing</option>
                                            <option value="East Plaza">East Plaza Square</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="db-btn db-btn-primary" style={{ marginTop: '1rem', height: '52px', justifyContent: 'center' }} onClick={handleNext}>
                                    Select Plan & Visibility
                                </button>
                            </div>
                        </div>

                        {/* Right Preview Card - Step 1 Preview */}
                        <div style={{ background: '#f8fafc', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Identity Preview</div>
                            <div style={{ textAlign: 'center', background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '48px', height: '48px', background: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.2rem', fontWeight: 800 }}>
                                    {formData.businessName ? formData.businessName.charAt(0).toUpperCase() : '?'}
                                </div>
                                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 800 }}>{formData.businessName || 'Business Name'}</h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{formData.assignedZone}</p>
                                <div style={{ marginTop: '1.25rem', height: '32px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#2563eb', fontWeight: 700 }}>
                                    Pending Admin Approval
                                </div>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.25rem', textAlign: 'center', lineHeight: '1.4' }}>
                                Ensure the primary merchant email is accurate for dashboard access.
                            </p>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="db-card animate-fade-in" style={{ padding: '2.5rem' }}>
                        <h2 className="db-card-title" style={{ marginBottom: '1.75rem', fontSize: '1.25rem' }}>Visibility & Placement Plans</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div
                                onClick={() => setFormData({ ...formData, planType: 'Basic' })}
                                className={`db-plan-card ${formData.planType === 'Basic' ? 'active' : ''}`}
                                style={{
                                    padding: '2rem',
                                    border: `2.5px solid ${formData.planType === 'Basic' ? '#2563eb' : '#f1f5f9'}`,
                                    background: '#fff',
                                    borderRadius: '1.25rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Basic Merchant</span>
                                    <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.2rem' }}>£29<span style={{ fontSize: '0.8rem', opacity: 0.6 }}>/mo</span></span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Standard Sequential Placement</li>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> 1 Active Offer Slot</li>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Basic Scan Tracking</li>
                                </ul>
                                <div style={{ height: '32px', background: formData.planType === 'Basic' ? '#2563eb' : '#f1f5f9', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: formData.planType === 'Basic' ? '#fff' : '#64748b', fontWeight: 800 }}>
                                    {formData.planType === 'Basic' ? 'Selected' : 'Select Plan'}
                                </div>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, planType: 'Premium' })}
                                className={`db-plan-card ${formData.planType === 'Premium' ? 'active' : ''}`}
                                style={{
                                    padding: '2rem',
                                    border: `2.5px solid ${formData.planType === 'Premium' ? '#2563eb' : '#f1f5f9'}`,
                                    background: '#fff',
                                    borderRadius: '1.25rem',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Most Popular</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Premium Retailer</span>
                                    <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.2rem' }}>£79<span style={{ fontSize: '0.8rem', opacity: 0.6 }}>/mo</span></span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> <b>Priority Rotation Boost</b></li>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> 3 Active Offer Slots</li>
                                    <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Detailed Conversion Analytics</li>
                                </ul>
                                <div style={{ height: '32px', background: formData.planType === 'Premium' ? '#2563eb' : '#f1f5f9', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: formData.planType === 'Premium' ? '#fff' : '#64748b', fontWeight: 800 }}>
                                    {formData.planType === 'Premium' ? 'Selected' : 'Select Plan'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, padding: '1rem', justifyContent: 'center' }} onClick={handleBack}>Back to Profile</button>
                            <button className="db-btn db-btn-primary" style={{ flex: 2, padding: '1rem', justifyContent: 'center' }} onClick={handleNext}>Confirm Business Details</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="db-card animate-fade-in" style={{ padding: '2.5rem' }}>
                        <h2 className="db-card-title" style={{ marginBottom: '1.75rem', fontSize: '1.25rem' }}>Review & Seal the Partnership</h2>
                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Merchant:</span>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 900, fontSize: '1rem' }}>{formData.businessName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formData.assignedZone}</div>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: '1px', background: '#e2e8f0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Primary Contact:</span>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formData.contactPerson}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formData.email}</div>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: '1px', background: '#e2e8f0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Subscription Selection:</span>
                                <div style={{ background: '#2563eb', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    {formData.planType} RETAILER
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(37, 99, 235, 0.04)', borderRadius: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>🤝</span>
                            <p style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, margin: 0 }}>
                                You confirm that QR placement readiness has been physically verified at the store entrance.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, padding: '1rem', justifyContent: 'center' }} onClick={handleBack}>Edit Details</button>
                            <button className="db-btn db-btn-primary" style={{ flex: 2, padding: '1rem', justifyContent: 'center' }} onClick={handleSubmit}>Onboard Merchant</button>
                        </div>
                    </div>
                )}

                {step === 100 && (
                    <div className="db-card animate-fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <div className="sf-spinner-ring" style={{ margin: '0 auto 1.5rem', width: '48px', height: '48px' }}></div>
                        <h2 className="db-card-title">Processing Onboarding...</h2>
                        <p style={{ color: '#64748b' }}>Syncing data with the MCOMLINKS core engine.</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="db-card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#10b981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                            boxShadow: '0 0 0 10px rgba(16, 185, 129, 0.05)'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <h2 className="db-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome, {formData.businessName}!</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                            The onboard request for <b>{formData.businessName}</b> has been sent to the System Admin. Deployment is pending verification.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>Back to Dashboard</button>
                            <button className="db-btn db-btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                                setFormData({
                                    businessName: '', contactPerson: '', phone: '', email: '', location: '', assignedZone: 'High Street', planType: 'Basic'
                                });
                                setStep(1);
                            }}>
                                Onboard Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AgentLayout>
    )
}

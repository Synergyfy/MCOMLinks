import DashboardLayout from '../../components/DashboardLayout'
import { mockBusiness } from '../../mock/business'

export default function SupportPage() {
    const messages = [
        { sender: 'agent', text: "Hi Isabella! I noticed your Spring Collection offer is performing great. Would you like to try boosting it for next weekend?", time: "Yesterday, 2:30 PM" },
        { sender: 'user', text: "That sounds good James! How much would a 3-day boost cost?", time: "Yesterday, 4:15 PM" },
        { sender: 'agent', text: "For your plan, it's just £49 for a Friday-Sunday peak boost. I can set it up for you if you approve!", time: "Today, 9:05 AM" }
    ]

    return (
        <DashboardLayout title="Agent Support">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* 1. Chat Interface — PRD STEP 10 */}
                <div className="db-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '600px' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>JT</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>James Thompson</div>
                            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span> Online
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.sender === 'agent' ? 'flex-start' : 'flex-end',
                                maxWidth: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                            }}>
                                <div style={{
                                    padding: '0.85rem 1.15rem',
                                    borderRadius: m.sender === 'agent' ? '0 1rem 1rem 1rem' : '1rem 1rem 0 1rem',
                                    background: m.sender === 'agent' ? '#fff' : '#2563eb',
                                    color: m.sender === 'agent' ? '#0a0a0a' : '#fff',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}>
                                    {m.text}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', alignSelf: m.sender === 'agent' ? 'flex-start' : 'flex-end' }}>{m.time}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <input type="text" className="db-input" style={{ flex: 1 }} placeholder="Type a message to James..." />
                            <button className="db-btn db-btn-primary">Send</button>
                        </div>
                    </div>
                </div>

                {/* 2. Agent Info & Help — PRD STEP 10 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 800 }}>Your Account Manager</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                            James is your dedicated agent. He helps you optimize your offers and manage your subscription.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#94a3b8' }}>Email:</span>
                                <span style={{ fontWeight: 700 }}>{mockBusiness.agentEmail}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#94a3b8' }}>Response Time:</span>
                                <span style={{ fontWeight: 700 }}>Under 2 hours</span>
                            </div>
                        </div>
                    </div>

                    <div className="db-card" style={{ border: '2px dashed #e2e8f0', background: 'transparent' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>How can I help you today?</h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <button className="db-btn db-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>🚀 Request a Performance Boost</button>
                            <button className="db-btn db-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>📈 Get Advice on Offer Headlines</button>
                            <button className="db-btn db-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>💎 Upgrade my Subscription</button>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}

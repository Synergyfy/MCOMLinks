import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect, useRef } from 'react'
import { api } from '../../api/apiClient'

interface Message {
    id: string;
    text: string;
    sender: 'agent' | 'user';
    time: string;
}

export default function SupportPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const [agentEmail, setAgentEmail] = useState('support@mcom.links')

    const fetchMessages = async () => {
        try {
            const data = await api.get<Message[]>('/dashboard/support/messages')
            if (Array.isArray(data)) {
                setMessages(data)
            }
        } catch (err) {
            console.error("Failed to fetch support messages:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchSettings = async () => {
        try {
            const data = await api.get<any>('/dashboard/settings')
            if (data?.agentEmail) {
                setAgentEmail(data.agentEmail)
            }
        } catch (err) {
            // Ignore if settings fetch fails
        }
    }

    useEffect(() => {
        fetchMessages()
        fetchSettings()
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const data = await api.post<Message>('/dashboard/support/messages', {
                text: newMessage,
                sender: 'user',
            })
            // Let's add it to state directly to avoid a full fetch delay
            setMessages(prev => [...prev, data])
            setNewMessage('')
        } catch (err) {
            console.error("Failed to send message:", err)
            alert("Failed to send message.")
        } finally {
            setSending(false)
        }
    }

    const handleQuickSupport = (msg: string) => {
        setNewMessage(msg)
    }

    return (
        <DashboardLayout title="Agent Support">
            <div className="db-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* 1. Chat Interface — PRD STEP 10 */}
                <div className="db-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'min(600px, 80vh)' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>M L</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>MCOM.LINKS Support</div>
                            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span> Online
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No messages yet. Send a message to start chatting!</div>
                        ) : messages.map((m: any, i: number) => (
                            <div key={i} style={{
                                alignSelf: m.sender === 'agent' ? 'flex-start' : 'flex-end',
                                maxWidth: '85%',
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
                        <div ref={chatEndRef} />
                    </div>

                    <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
                            <input
                                type="text"
                                className="db-input"
                                style={{ flex: 1 }}
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                                required
                            />
                            <button type="submit" className="db-btn db-btn-primary" style={{ padding: '0.65rem 1rem' }} disabled={sending || !newMessage.trim()}>
                                {sending ? 'Sending...' : 'Send'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. Agent Info & Help — PRD STEP 10 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="db-card">
                        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 800 }}>Support Contacts</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                            We are here to help you optimize your offers and manage your subscription.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#94a3b8' }}>Email:</span>
                                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{agentEmail}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#94a3b8' }}>Response Time:</span>
                                <span style={{ fontWeight: 700 }}>&lt; 2 hours</span>
                            </div>
                        </div>
                    </div>

                    <div className="db-card" style={{ border: '2px dashed #e2e8f0', background: 'transparent' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800 }}>Quick Support</h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <button onClick={() => handleQuickSupport("🚀 Request a Boost")} className="db-btn db-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>🚀 Request a Boost</button>
                            <button onClick={() => handleQuickSupport("📈 Copywriting Advice")} className="db-btn db-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>📈 Copywriting Advice</button>
                            <button onClick={() => handleQuickSupport("💎 Plan Upgrade")} className="db-btn db-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>💎 Plan Upgrade</button>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}

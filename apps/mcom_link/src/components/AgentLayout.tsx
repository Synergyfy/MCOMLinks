import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mockAgents } from '../mock/agents'
import '../styles/dashboard.css'

interface AgentLayoutProps {
    children: ReactNode
    title: string
}

const NavIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'dashboard':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
        case 'portfolio':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        case 'onboard':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="16" x2="22" y1="11" y2="11" /></svg>
        case 'performance':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
        default:
            return null
    }
}

export default function AgentLayout({ children, title }: AgentLayoutProps) {
    const location = useLocation()
    const agent = mockAgents[0]

    const navItems = [
        { label: 'Agent Dashboard', path: '/agent', icon: 'dashboard' },
        { label: 'My Portfolio', path: '/agent/portfolio', icon: 'portfolio' },
        { label: 'Onboard Business', path: '/agent/onboard', icon: 'onboard' },
        { label: 'Global Performance', path: '/agent/performance', icon: 'performance' },
    ]

    return (
        <div className="db-container">
            {/* Sidebar */}
            <aside className="db-sidebar">
                <div className="db-sidebar-header">
                    <Link to="/" className="db-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                        MCOM<span>.LINKS</span>
                    </Link>
                </div>

                <nav className="db-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`db-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="db-nav-icon">
                                <NavIcon type={item.icon} />
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="db-sidebar-footer">
                    <div className="db-user-card">
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>JT</div>
                        <div className="db-user-info">
                            <div className="db-user-name">{agent.name}</div>
                            <div className="db-user-role">{agent.role}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="db-main">
                <header className="db-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 className="db-page-title">{title}</h1>
                        <div className="db-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', fontSize: '0.65rem' }}>Agent Mode</div>
                    </div>

                    <div className="db-header-actions">
                        {/* Action Required Alert Spinner - Step 7 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '100px', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                            <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48' }}>3 Actions Required</span>
                        </div>

                        <button className="db-btn db-btn-ghost">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </button>
                    </div>
                </header>

                <section className="db-content">
                    {children}
                </section>
            </main>
        </div>
    )
}

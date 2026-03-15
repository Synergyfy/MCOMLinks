import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/dashboard.css'

interface AdminLayoutProps {
    children: React.ReactNode
    title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const navItems = [
        { label: 'Global Dashboard', path: '/admin', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg> },
        { label: 'Locations & Rotators', path: '/admin/locations', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> },
        { label: 'Offer Management', path: '/admin/offers', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg> },
        { label: 'Merchant Control', path: '/admin/merchants', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg> },
        { label: 'Seasonal Campaigns', path: '/admin/seasons', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg> },
        { label: 'Global Identity', path: '/admin/identity', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg> },
        { label: 'System Health', path: '/admin/health', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> }
    ]
    const isActive = (path: string) => location.pathname === path

    return (
        <div className="db-container">
            {/* Sidebar Overlay */}
            <div
                className={`db-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar - Step 16 */}
            <aside className={`db-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ backgroundColor: '#2563eb', borderRight: 'none' }}>
                <div className="db-logo-section" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="db-logo-placeholder" style={{ background: '#ffffff', color: '#2563eb', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>M</div>
                    <h1 className="db-logo-text" style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0, fontWeight: 900 }}>ADMIN <span style={{ color: '#bfdbfe', fontWeight: 400 }}>CENTRAL</span></h1>
                    <button
                        className="db-menu-toggle mobile-only"
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ marginLeft: 'auto', marginRight: 0, color: '#ffffff' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <nav className="db-nav" style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`db-nav-link ${active ? 'active' : ''}`}
                                style={{
                                    color: active ? '#2563eb' : '#ffffff',
                                    backgroundColor: active ? '#ffffff' : 'transparent',
                                    opacity: active ? 1 : 0.8,
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem 1rem'
                                }}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span className="db-nav-icon">{item.icon}</span>
                                <span className="db-nav-label" style={{ fontWeight: active ? 800 : 600 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="db-user-mini" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffffff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>SA</div>
                        <div style={{ color: '#ffffff' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Super Admin</div>
                            <div style={{ fontSize: '0.65rem', color: '#bfdbfe' }}>System Brain</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="db-btn db-btn-ghost" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>Log Out</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="db-main">
                <header className="db-header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            className="db-menu-toggle"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                        <h2 className="db-header-title" style={{ color: '#0f172a' }}>{title}</h2>
                        <div className="desktop-only" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                            System Command
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="desktop-only" style={{ textAlign: 'right', marginRight: '1rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>● System Live</div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Uptime: 99.9%</div>
                        </div>

                        <button className="db-btn db-btn-ghost" style={{ padding: '0.5rem' }} title="Alerts">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        </button>
                        <div className="db-user-avatar">
                            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>S</span>
                        </div>
                    </div>
                </header>

                <div className="db-content">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="db-bottom-nav">
                <div className="db-bottom-nav-inner">
                    {navItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`db-bottom-tab ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="db-bottom-tab-icon">
                                {item.icon}
                            </span>
                            <span style={{ fontSize: '0.6rem', textAlign: 'center', lineHeight: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    )
}

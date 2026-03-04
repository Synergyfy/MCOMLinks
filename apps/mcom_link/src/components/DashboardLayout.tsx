import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mockBusiness } from '../mock/business'
import '../styles/dashboard.css'

interface DashboardLayoutProps {
    children: ReactNode
    title: string
}

const NavIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'home':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        case 'offers':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="2" x2="9" y2="6" /><line x1="15" y1="2" x2="15" y2="6" /></svg>
        case 'analytics':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
        case 'support':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>
        case 'settings':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
        default:
            return null
    }
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const location = useLocation()

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: 'home' },
        { label: 'My Offers', path: '/dashboard/offers', icon: 'offers' },
        { label: 'Performance', path: '/dashboard/analytics', icon: 'analytics' },
        { label: 'Agent Support', path: '/dashboard/support', icon: 'support' },
        { label: 'Settings', path: '/dashboard/settings', icon: 'settings' },
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
                    <Link to="/dashboard/settings" className="db-user-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img src={mockBusiness.logoUrl} alt={mockBusiness.name} className="db-user-avatar" />
                        <div className="db-user-info">
                            <div className="db-user-name">{mockBusiness.contactPerson}</div>
                            <div className="db-user-role">{mockBusiness.name}</div>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="db-main">
                <header className="db-header">
                    <h1 className="db-page-title">{title}</h1>

                    <div className="db-header-actions">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
                            <span className="db-badge db-badge-approved">Active</span>
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

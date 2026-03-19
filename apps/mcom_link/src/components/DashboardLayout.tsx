import { useState, useEffect, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import '../styles/dashboard.css'

interface DashboardLayoutProps {
    children: ReactNode
    title: string
}

const NavIcon = ({ type, size = 20 }: { type: string; size?: number }) => {
    switch (type) {
        case 'home':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        case 'offers':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="2" x2="9" y2="6" /><line x1="15" y1="2" x2="15" y2="6" /></svg>
        case 'analytics':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
        case 'support':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>
        case 'settings':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
        case 'billing':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
        case 'logout':
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        default:
            return null
    }
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [profile, setProfile] = useState<{name?: string, logoUrl?: string, ownerName?: string, plan?: string, subscriptionStatus?: string}>({})

    const storedUserStr = localStorage.getItem('user');
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try to get from API first (legacy/other settings)
                const data = await api.get<any>('/dashboard/settings')
                
                // Overlay local storage mocks for plan/status as requested by USER
                const mockPlan = localStorage.getItem('mock_user_plan')
                const mockStatus = localStorage.getItem('mock_user_status')

                if (data) {
                    setProfile({
                        name: data.name,
                        logoUrl: data.logoUrl,
                        ownerName: data.ownerName,
                        plan: mockPlan || data.plan || 'None',
                        subscriptionStatus: mockStatus || data.subscriptionStatus || 'pending'
                    })
                }
            } catch (err) {
                // Fallback to local storage if API fails
                const mockPlan = localStorage.getItem('mock_user_plan')
                const mockStatus = localStorage.getItem('mock_user_status')
                setProfile({
                    plan: mockPlan || 'None',
                    subscriptionStatus: mockStatus || 'pending'
                })
            }
        }
        
        fetchProfile()

        // Listen for profile updates from other components (like BillingPage)
        window.addEventListener('profile-updated', fetchProfile)
        
        return () => {
            window.removeEventListener('profile-updated', fetchProfile)
        }
    }, [])

    const isPlanless = !profile.plan || profile.plan === 'None';

    // ACTIVE PROTECTION: Redirect to billing if trying to access a locked page directly via URL
    useEffect(() => {
        if (isPlanless && profile.plan !== undefined) { // Wait for first load
            const unlockedPaths = ['/dashboard/billing', '/dashboard/support'];
            const isCurrentlyOnLockedPath = !unlockedPaths.includes(location.pathname);
            
            if (isCurrentlyOnLockedPath && location.pathname.startsWith('/dashboard')) {
                navigate('/dashboard/billing?first_time=true');
            }
        }
    }, [isPlanless, location.pathname, profile.plan, navigate])

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('mock_user_plan')
        localStorage.removeItem('mock_user_status')
        navigate('/login')
    }

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: 'home' },
        { label: 'My Offers', path: '/dashboard/offers', icon: 'offers' },
        { label: 'Performance', path: '/dashboard/analytics', icon: 'analytics' },
        { label: 'Plans & Billing', path: '/dashboard/billing', icon: 'billing' },
        { label: 'Agent Support', path: '/dashboard/support', icon: 'support' },
        { label: 'Settings', path: '/dashboard/settings', icon: 'settings' },
    ]

    // Short labels for bottom tab bar
    const tabLabels: Record<string, string> = {
        'Overview': 'Home',
        'My Offers': 'Offers',
        'Performance': 'Stats',
        'Plans & Billing': 'Billing',
        'Agent Support': 'Support',
        'Settings': 'Settings',
    }

    const brandName = profile.name || 'My Business'
    const contactName = profile.ownerName || storedUser?.name || 'Business User'
    const logoSource = profile.logoUrl || 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=100&h=100&fit=crop'

    return (
        <div className="db-container">
            {/* Sidebar Overlay */}
            <div
                className={`db-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Drawer */}
            <aside className={`db-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="db-sidebar-header">
                    <Link to="/" className="db-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                        MCOMQ<span>.LINKS</span>
                    </Link>
                    {/* Close button inside sidebar for mobile */}
                    <button
                        className="db-menu-toggle"
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ marginLeft: 'auto', marginRight: 0 }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <nav className="db-nav">
                    {navItems.map((item) => {
                        const isMandatoryUnlocked = item.label === 'Plans & Billing' || item.label === 'Agent Support';
                        const isLocked = isPlanless && !isMandatoryUnlocked;

                        return (
                            <Link
                                key={item.path}
                                to={isLocked ? '#' : item.path}
                                className={`db-nav-link ${location.pathname === item.path ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                onClick={(e) => {
                                    if (isLocked) {
                                        e.preventDefault();
                                        return;
                                    }
                                    setIsSidebarOpen(false);
                                }}
                                style={isLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                                <span className="db-nav-icon">
                                    <NavIcon type={item.icon} />
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {item.label}
                                    {isLocked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="db-sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="db-nav-link"
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', marginTop: 'auto', marginBottom: '1rem', color: '#ef4444' }}
                    >
                        <span className="db-nav-icon" style={{ color: '#ef4444' }}>
                            <NavIcon type="logout" />
                        </span>
                        <span>Log Out</span>
                    </button>

                    <Link 
                        to={isPlanless ? '#' : "/dashboard/settings"} 
                        className={`db-user-card ${isPlanless ? 'locked' : ''}`} 
                        style={{ textDecoration: 'none', color: 'inherit', opacity: isPlanless ? 0.7 : 1, cursor: isPlanless ? 'not-allowed' : 'pointer' }} 
                        onClick={(e) => isPlanless ? e.preventDefault() : setIsSidebarOpen(false)}
                    >
                        <img src={logoSource} alt={brandName} className="db-user-avatar" />
                        <div className="db-user-info">
                            <div className="db-user-name">{contactName}</div>
                            <div className="db-user-role">{brandName}</div>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="db-main">
                <header className="db-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className="db-menu-toggle"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                        <h1 className="db-page-title">{title}</h1>
                    </div>

                    <div className="db-header-actions">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Status:</span>
                            <span className={`db-badge ${
                                profile.subscriptionStatus === 'active' ? 'db-badge-approved' : 
                                profile.subscriptionStatus === 'suspended' ? 'db-badge-expired' : 'db-badge-pending'
                            }`}>
                                {profile.subscriptionStatus ? profile.subscriptionStatus.charAt(0).toUpperCase() + profile.subscriptionStatus.slice(1) : 'Pending'}
                            </span>
                        </div>

                        <button className="db-btn db-btn-ghost" style={{ padding: '0.5rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </button>
                    </div>
                </header>

                <section className="db-content">
                    {children}
                </section>
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="db-bottom-nav">
                <div className="db-bottom-nav-inner">
                    {navItems.map((item) => {
                        const isMandatoryUnlocked = item.label === 'Plans & Billing' || item.label === 'Agent Support';
                        const isLocked = isPlanless && !isMandatoryUnlocked;

                        return (
                            <Link
                                key={item.path}
                                to={isLocked ? '#' : item.path}
                                className={`db-bottom-tab ${location.pathname === item.path ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                onClick={(e) => {
                                    if (isLocked) {
                                        e.preventDefault();
                                        return;
                                    }
                                }}
                                style={isLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                                <span className="db-bottom-tab-icon">
                                    <NavIcon type={item.icon} size={18} />
                                    {isLocked && <div style={{ position: 'absolute', top: -4, right: -4, background: '#64748b', color: 'white', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>}
                                </span>
                                {tabLabels[item.label] || item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    )
}

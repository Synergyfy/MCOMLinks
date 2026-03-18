import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate login
        setTimeout(() => {
            navigate('/dashboard') // Default to business dashboard
        }, 1500)
    }

    const demoModules = [
        {
            name: 'Consumer Storefront',
            icon: '📱',
            path: '/r/demo-mall',
            desc: 'Scan Simulation'
        },
        {
            name: 'Business Dashboard',
            icon: '💼',
            path: '/dashboard',
            desc: 'Offer Control'
        },
        {
            name: 'Admin Command',
            icon: '👑',
            path: '/admin',
            desc: 'Global Strategy'
        },
        {
            name: 'Agent Platform',
            icon: '🤝',
            path: '/agent',
            desc: 'Portfolio Growth'
        }
    ]

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-sidebar">
                    <div>
                        <div className="logo" style={{ color: 'white', marginBottom: '2rem' }}>
                            MCOMQ<span style={{ opacity: 0.8 }}>.LINKS</span>
                        </div>
                        <h2>Revitalizing <br />Local Commerce.</h2>
                        <p>The "set-and-forget" marketing machine for high-street sequential offer rotation.</p>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        &copy; 2026 MCOMQLINKS International.
                    </div>
                </div>

                <div className="auth-main">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p style={{ color: 'var(--auth-text-muted)', fontSize: '0.95rem' }}>
                            Login to access your specific module.
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="demo@mcomqlinks.com"
                                defaultValue="admin@mcomqlinks.com"
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                defaultValue="password123"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR QUICK ACCESS DEMO</span>
                    </div>

                    <div className="demo-access-grid">
                        {demoModules.map((module) => (
                            <Link key={module.name} to={module.path} className="demo-btn">
                                <span className="demo-icon">{module.icon}</span>
                                <span>{module.name}</span>
                                <small style={{ color: 'var(--auth-text-muted)', fontSize: '0.7rem' }}>
                                    {module.desc}
                                </small>
                            </Link>
                        ))}
                    </div>

                    <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--auth-text-muted)' }}>
                        Don't have an account? <Link to="/login" style={{ color: 'var(--auth-primary)', fontWeight: 700, textDecoration: 'none' }}>Get Started</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import '../styles/auth.css'

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('admin@mcomqlinks.com')
    const [password, setPassword] = useState('password123')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await api.post<any>('/auth/login', { email, password })

            // Store auth data
            localStorage.setItem('access_token', result.access_token)
            localStorage.setItem('user', JSON.stringify(result.user))

            // Role-based navigation
            const role = result.user.role
            if (role === 'ADMIN') navigate('/admin')
            else if (role === 'AGENT') navigate('/agent')
            else navigate('/dashboard') // Default to business dashboard

        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.')
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

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
                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem',
                                fontSize: '0.85rem'
                            }}>
                                {error}
                            </div>
                        )}
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Email Address</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="demo@mcomqlinks.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: '45px' }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '5px', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--auth-text-muted)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--auth-primary)', fontWeight: 700, textDecoration: 'none' }}>Get Started</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage

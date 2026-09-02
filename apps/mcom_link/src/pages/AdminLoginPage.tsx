import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import '../styles/auth.css'

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setEmailError(null)
        setPasswordError(null)

        // Field validation
        let valid = true
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address')
            valid = false
        }
        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            valid = false
        }
        if (!valid) return

        setIsLoading(true)
        setError(null)

        try {
            const result = await api.post<any>('/auth/login', { email, password })

            localStorage.setItem('access_token', result.access_token)
            localStorage.setItem('user', JSON.stringify(result.user))

            navigate('/admin')
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.')
            console.error('Admin login error:', err)
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
                        <h2>Admin <br />Command Center.</h2>
                        <p>Restricted access for MCOM Links administrators only.</p>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        &copy; 2026 MCOMQLINKS International.
                    </div>
                </div>

                <div className="auth-main">
                    <div className="auth-header">
                        <h1>Admin Login</h1>
                        <p style={{ color: 'var(--auth-text-muted)', fontSize: '0.95rem' }}>
                            Sign in with your administrator credentials.
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
                                placeholder="admin@mcomlinks.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {emailError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{emailError}</span>}
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
                            {passwordError && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{passwordError}</span>}
                        </div>


                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? 'Authenticating...' : 'Sign In to Admin'}
                        </button>
                    </form>

                    <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--auth-text-muted)' }}>
                        Not an admin? <Link to="/login" style={{ color: 'var(--auth-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in with Central Hub Solution</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminLoginPage
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/apiClient'
import '../styles/auth.css'

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSsoLogin = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await api.get<any>('/auth/mcom/login')
            if (!result?.authorizeUrl) throw new Error('Failed to start Central Hub login')
            window.location.href = result.authorizeUrl
        } catch (err: any) {
            setError(err.message || 'Unable to reach Central Hub. Please try again.')
            console.error('Central Hub login error:', err)
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
                        <h1>Sign In</h1>
                        <p style={{ color: 'var(--auth-text-muted)', fontSize: '0.95rem' }}>
                            Sign in with your Central Hub Solution account to access MCOM Links.
                        </p>
                    </div>

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

                    <button
                        className="auth-submit"
                        onClick={handleSsoLogin}
                        disabled={isLoading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}
                    >
                        {isLoading ? (
                            'Connecting to Central Hub...'
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                Continue with Central Hub Solution
                            </>
                        )}
                    </button>

                    <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--auth-text-muted)' }}>
                        Admin? Sign in with your credentials on the{' '}
                        <Link to="/admin/login" style={{ color: 'var(--auth-primary)', fontWeight: 700, textDecoration: 'none' }}>Admin Login</Link> page.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
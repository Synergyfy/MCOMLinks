import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import '../styles/auth.css'

const SignupPage: React.FC = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [fullName, setFullName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            setIsLoading(false)
            return
        }

        try {
            // Register with postal code for targeting
            const result = await api.post<any>('/auth/register', { 
                name: fullName, 
                businessName,
                email, 
                phoneNumber,
                password, 
                postalCode,
                role: 'BUSINESS' 
            })

            // Use the real session data returned from the backend
            localStorage.setItem('access_token', result.access_token)
            localStorage.setItem('user', JSON.stringify(result.user))

            setSuccess(true)
            setTimeout(() => {
                navigate('/dashboard/billing?first_time=true')
            }, 1000)

        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.')
            console.error('Signup error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ padding: '3rem' }}>
                        <div style={{ color: 'var(--auth-primary)', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                        <h2>Account Created</h2>
                        <p style={{ color: 'var(--auth-text-muted)' }}>Redirecting to your dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-sidebar">
                    <div>
                        <div className="logo" style={{ color: 'white', marginBottom: '2rem' }}>
                            MCOMQ<span style={{ opacity: 0.8 }}>.LINKS</span>
                        </div>
                        <h2>Join the <br />Revolution.</h2>
                        <p>Turn your physical storefront into a digital billboard and automate your local marketing.</p>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        &copy; 2026 MCOMQLINKS International.
                    </div>
                </div>

                <div className="auth-main">
                    <div className="auth-header">
                        <h1>Get Started</h1>
                        <p style={{ color: 'var(--auth-text-muted)', fontSize: '0.95rem' }}>
                            Create your business account to access the platform.
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSignup}>
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
                            <label className="auth-label auth-label-required">Full Name</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="E.g. John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Business Name</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="E.g. The Coffee Shop"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Email Address</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="hello@business.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Postal Code</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="E.g. SW1A 1AA"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-optional">Phone Number</label>
                            <input
                                type="tel"
                                className="auth-input"
                                placeholder="E.g. +44 7700 900000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="Create a password"
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
                        <div className="auth-input-group">
                            <label className="auth-label auth-label-required">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: '45px' }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '5px', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--auth-text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--auth-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupPage

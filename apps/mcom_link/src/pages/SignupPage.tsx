import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import '../styles/auth.css'

const SignupPage: React.FC = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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
            // Note: Currently pointing to a mock/placeholder registration endpoint
            // This will need to be implemented on the backend
            await api.post<any>('/auth/register', { name, email, password, role: 'BUSINESS' })

            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000)

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
                        <p style={{ color: 'var(--auth-text-muted)' }}>Redirecting to login...</p>
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
                            MCOM<span style={{ opacity: 0.8 }}>.LINKS</span>
                        </div>
                        <h2>Join the <br />Revolution.</h2>
                        <p>Turn your physical storefront into a digital billboard and automate your local marketing.</p>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        &copy; 2026 MCOMLINKS International.
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
                            <label className="auth-label">Business Name / Full Name</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="E.g. The Coffee Shop"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
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
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Confirm Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
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

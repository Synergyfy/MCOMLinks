import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/apiClient'

const McomCallbackPage: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const handled = useRef(false)

    useEffect(() => {
        if (handled.current) return
        handled.current = true

        const code = searchParams.get('code')
        const state = searchParams.get('state')

        const finish = async () => {
            if (!code || !state) {
                navigate('/login', { replace: true })
                return
            }
            try {
                const result = await api.post<any>('/auth/mcom/callback', { code, state })

                localStorage.setItem('access_token', result.access_token)
                localStorage.setItem('user', JSON.stringify(result.user))

                const role = result.user?.mcomRole || result.user?.role
                if (role === 'ADMIN') navigate('/admin', { replace: true })
                else if (role === 'AGENT') navigate('/agent', { replace: true })
                else navigate('/dashboard', { replace: true })
            } catch (err) {
                console.error('Central Hub callback error:', err)
                navigate('/login', { replace: true })
            }
        }

        finish()
    }, [navigate, searchParams])

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-sidebar">
                    <div>
                        <div className="logo" style={{ color: 'white', marginBottom: '2rem' }}>
                            MCOMQ<span style={{ opacity: 0.8 }}>.LINKS</span>
                        </div>
                        <h2>Connecting to<br />Central Hub.</h2>
                    </div>
                </div>
                <div className="auth-main" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
                    <h1>Signing you in...</h1>
                    <p style={{ color: 'var(--auth-text-muted)', fontSize: '0.9rem' }}>
                        Verifying your Central Hub Solution session.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default McomCallbackPage
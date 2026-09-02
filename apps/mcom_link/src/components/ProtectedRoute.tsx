import React, { useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import type { SessionUser } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
    requireLinksAccess?: boolean;
}

const getSessionUser = (): SessionUser | null => {
    try {
        const stored = localStorage.getItem('user');
        return stored ? (JSON.parse(stored) as SessionUser) : null;
    } catch {
        return null;
    }
};

const AccessDenied: React.FC = () => (
    <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '2.5rem', background: '#fff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>Access Not Active</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
            Your Central Hub Solution account doesn't currently have an active MCOM Links package.
            Purchase or renew a plan to activate your campaigns and dashboard.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pricing" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                View Plans
            </Link>
            <button
                onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }}
                style={{ padding: '0.75rem 1.5rem', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
            >
                Sign Out
            </button>
        </div>
    </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles, requireLinksAccess }) => {
    const location = useLocation();

    // Mock-mode auto-auth must happen in an effect (side effects are not allowed
    // during render). It only runs when VITE_USE_MOCK === 'true' (explicit dev mode).
    useEffect(() => {
        if (USE_MOCK && !localStorage.getItem('access_token')) {
            localStorage.setItem('access_token', 'mock-jwt-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify({
                id: 'mock-admin',
                email: 'admin@mcomlinks.com',
                name: 'Super Admin',
                role: 'ADMIN',
                mcomRole: 'ADMIN',
                permissions: { canAccess_links: true },
            }));
        }
    }, []);

    // Reads only — no writes during render.
    const authed = Boolean(localStorage.getItem('access_token')) || USE_MOCK;

    if (!authed) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const user = getSessionUser();

    // Role-based gating for authenticated sessions.
    if (roles && roles.length > 0) {
        const role = user?.role || '';
        if (!roles.includes(role)) {
            return <Navigate to="/" replace />;
        }
    }

    // Dynamic platform access gate (Central Hub). Only applies to SSO-linked
    // users — local ADMIN sessions always pass.
    if (requireLinksAccess && user?.mcomUserId && user?.permissions?.canAccess_links !== true) {
        return <AccessDenied />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
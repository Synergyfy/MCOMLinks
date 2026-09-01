import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
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
            }));
        }
    }, []);

    // Reads only — no writes during render.
    const authed = Boolean(localStorage.getItem('access_token')) || USE_MOCK;

    if (!authed) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based gating for authenticated sessions.
    if (roles && roles.length > 0) {
        let role = '';
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                role = JSON.parse(storedUser).role || '';
            }
        } catch {
            role = '';
        }
        if (!roles.includes(role)) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
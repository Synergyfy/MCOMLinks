import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

function ensureMockAuth(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) return true;

    if (USE_MOCK) {
        localStorage.setItem('access_token', 'mock-jwt-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify({
            id: 'admin-001',
            email: 'admin@mcomqlinks.com',
            name: 'Super Admin',
            role: 'ADMIN',
        }));
        return true;
    }

    return false;
}

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();

    if (!ensureMockAuth()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

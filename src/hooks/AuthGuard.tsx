// AuthGuard.tsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles: string[];
    redirectTo?: string;
}

export const AuthGuard: React.FC<ProtectedRouteProps> = ({ children, requiredRoles, redirectTo = '/unauthorized' }) => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const userRoles = useSelector((state: any) => state.auth.roles || []);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
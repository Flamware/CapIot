import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; // Assumes you have a hook to get auth context

interface ProtectedRouteProps {
    // Defines roles needed for the route. Undefined means any role is okay.
    requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
    // Get authentication state and user data from the context
    const { isAuthenticated, user } = useAuth();

    // 1. If the user is not authenticated, redirect to the login page.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. If the user is authenticated but has no roles, redirect to the no-role page.
    // We check if the user object exists and if the roles array is present and not empty.
    const hasRoles = user?.roles && user.roles.length > 0;
    if (!hasRoles) {
        return <Navigate to="/no-role" replace />;
    }

    // 3. If requiredRoles are specified, check if the user has at least one of them.
    if (requiredRoles && requiredRoles.length > 0) {
        // Check if there is an intersection between the user's roles and the required roles.
        // The 'role' parameter is now explicitly typed as a string to resolve the TS7006 error.
        const hasRequiredRole = user.roles.some((role: string) => requiredRoles.includes(role));

        // If the user doesn't have the required role, redirect to the unauthorized page.
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // If all checks pass, render the child route's content.
    return <Outlet />;
};

export default ProtectedRoute;

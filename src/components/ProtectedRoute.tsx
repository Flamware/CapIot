// components/ProtectedRoute.tsx
import React, { ReactNode, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../AuthContext'; // Importez votre contexte d'authentification

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[]; // Rôle(s) requis pour accéder à cette route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
    const { user } = useContext(AuthContext) as AuthContextType; // Utilisez le contexte et typez-le
    const location = useLocation();

    if (!user) {
        // L'utilisateur n'est pas connecté, redirigez vers la page de connexion
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles && requiredRoles.length > 0 && (!user.roles || !requiredRoles.some(role => user.roles?.includes(role)))) {
        // L'utilisateur est connecté mais n'a pas les rôles requis
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
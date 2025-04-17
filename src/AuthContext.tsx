// contexts/AuthContext.tsx (Exemple de votre contexte d'authentification)
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    roles?: string[];
    // ... other properties
}

export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean; // Ajoutez un indicateur d'authentification
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAuthenticated = !!user; // Déterminez si l'utilisateur est authentifié

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        // Rediriger vers la page de connexion si nécessaire
    };

    useEffect(() => {
        // Optionnellement, vous pouvez faire des appels API ici pour vérifier la session
        // ou mettre à jour l'état de l'utilisateur.
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
// contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {User} from "./components/types/user.ts";


// Corrected: login function expects a User object
export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void; // Changed parameter type to User
    logout: () => void;
    isAuthenticated: boolean;
}

// ... rest of your AuthProvider code remains the same ...

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        // Ensure roles are parsed correctly if stored (might need adjustment if old data exists)
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAuthenticated = !!user;

    // This implementation now matches the corrected AuthContextType
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('customJwt'); // Also remove the JWT
    };

    useEffect(() => {
        // Optional: Verify token validity or refresh user data
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
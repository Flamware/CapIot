import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {User} from "./components/types/user.ts";


export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void; // Changed parameter type to User
    logout: () => void;
    updateUser?: (updatedData: Partial<User>) => void; // Optional updateUser function
    isAuthenticated: boolean;
}


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

    const updateUser = (updatedData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User updated:', updatedUser);
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('customJwt'); // Also remove the JWT
        console.log('User logged out');
    };

    useEffect(() => {
        // Optional: Verify token validity or refresh user data
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
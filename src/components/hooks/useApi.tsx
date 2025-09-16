// src/hooks/useApi.ts
import { useContext, useMemo } from 'react';
import {AuthContext, AuthContextType} from "../../AuthContext.tsx";
import {createApi} from "../../axios/api.tsx";

export const useApi = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useApi must be used within an AuthProvider');
    }

    // Access the logout function from the context
    const { logout } = context as AuthContextType;

    // Use useMemo to create the API instance only once
    const api = useMemo(() => {
        return createApi(logout);
    }, [logout]);

    return api;
};
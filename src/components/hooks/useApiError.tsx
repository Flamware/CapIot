import { createContext, useContext } from 'react';

// API Error Context
interface ApiErrorContextType {
    showError: (error: any) => void;
    clearError: () => void;
}

const ApiErrorContext = createContext<ApiErrorContextType | undefined>(undefined);

// A custom hook to use the ApiErrorContext
export const useApiError = () => {
    const context = useContext(ApiErrorContext);
    if (context === undefined) {
        throw new Error('useApiError must be used within an ApiErrorProvider');
    }
    return context;
};

export { ApiErrorContext };

import { useContext } from 'react';
import {AuthContext, AuthContextType} from "../../AuthContext.tsx";

/**
 * A custom hook to access the authentication context.
 *
 * This hook simplifies accessing the user, login, logout, and isAuthenticated status
 * from anywhere in the component tree, as long as it's wrapped in an AuthProvider.
 * It also throws an error if used outside of the provider to prevent runtime issues.
 *
 * @returns {AuthContextType} The authentication context value.
 * @throws {Error} If the hook is not used within an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
    // useContext returns the value of the context, or undefined if not within a provider.
    const context = useContext(AuthContext);

    // If the context is undefined, it means the hook was called outside of an <AuthProvider>.
    // This is an error in the application structure.
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // Return the context value, which contains our authentication state and functions.
    return context;
};

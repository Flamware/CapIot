import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';
import { User } from "../components/types/user.ts";
import { useApi } from "../components/hooks/useApi.tsx";

// Define API endpoints as constants
const API_ENDPOINTS = {
    LOGIN: '/login',
};

// Define the expected structure of the decoded JWT payload
interface DecodedJwt {
    userId: string;
    email: string;
    username?: string;
    role?: string[];
    iat?: number;
    exp?: number;
}

const Login: React.FC = () => {
    // --- State Variables ---
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);

    // --- Hooks ---
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const api = useApi();

    // --- Effects ---
    // Throw error if context is not available (used outside provider)
    useEffect(() => {
        if (!authContext) {
            throw new Error('AuthContext must be used within an AuthProvider');
        }
    }, [authContext]);

    // Destructure only if context is available
    const { login } = authContext || {};

    // --- Handlers ---
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!login) return;

        setLoginError(null);
        setLoginLoading(true);

        try {
            const response = await api.post(API_ENDPOINTS.LOGIN, { email: loginEmail, password: loginPassword });
            const customJwt = response.data.jwtToken;
            localStorage.setItem('customJwt', customJwt);

            const decodedToken = jwtDecode<DecodedJwt>(customJwt);
            console.log('Decoded JWT:', decodedToken);

            const roles = decodedToken?.role || [];
            const username = decodedToken.username;

            const userData: User = {
                id: decodedToken.userId,
                email: decodedToken.email,
                name: username || decodedToken.email,
                roles: roles,
            };

            login(userData);
            navigate('/dashboard');

        } catch (error: unknown) {
            let errorMessage = 'Login error. Please check your credentials and try again.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setLoginError(errorMessage);
            console.error('Login error:', error);
        } finally {
            setLoginLoading(false);
        }
    };

    // --- Render ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

                {/* --- Login Form --- */}
                <>
                    {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
                    <form onSubmit={handleLoginSubmit} noValidate>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="loginEmail" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                id="loginEmail"
                                placeholder="Enter your email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                aria-required="true"
                            />
                        </div>
                        {/* Password Input */}
                        <div className="mb-6">
                            <label htmlFor="loginPassword" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                id="loginPassword"
                                placeholder="Enter your password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                aria-required="true"
                            />
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loginLoading || !loginEmail || !loginPassword}
                        >
                            {loginLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </>
            </div>
        </div>
    );
};

export default Login;
import React, { useContext, useState, useEffect } from 'react';
import { createApi } from '../axios/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Ensure correct path
import { jwtDecode } from 'jwt-decode';
import {User} from "../components/types/user.ts"; // Import jwt-decode library

// Define API endpoints as constants
const API_ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
};

// Define the expected structure of the decoded JWT payload
interface DecodedJwt {
    userId: string;
    email: string;
    username?: string;
    role?: string[]; // Assuming roles is an array in the token
    iat?: number;
    exp?: number;
}

const Login: React.FC = () => {
    // --- State Variables ---
    const [isRegistering, setIsRegistering] = useState(false);
    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);
    // Register State
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [passwordStrengthErrors, setPasswordStrengthErrors] = useState<string[]>([]);

    // --- Hooks ---
    const authContext = useContext(AuthContext); // Get the context value
    const navigate = useNavigate();

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
        if (!login) return; // Guard clause if login function isn't available

        setLoginError(null);
        setLoginLoading(true);
        const api = createApi();

        try {
            const response = await api.post(API_ENDPOINTS.LOGIN, { email: loginEmail, password: loginPassword });
            const customJwt = response.data.jwtToken;
            localStorage.setItem('customJwt', customJwt);
            // Decode JWT using the library
            const decodedToken = jwtDecode<DecodedJwt>(customJwt);
            console.log('Decoded JWT:', decodedToken);
            // Ensure roles is always an array
            const roles = decodedToken?.role || [];
            // Determine username with fallbacks
            const username = decodedToken.username;

            // Construct the userData object using the imported User type
            const userData: User = {
                id: decodedToken.userId,
                email: decodedToken.email,
                name: username || decodedToken.email, // Fallback to email if username is not available
                roles: roles,
            };

            login(userData); // Update the AuthContext
            navigate('/dashboard'); // Navigate on success

        } catch (error: unknown) { // Use unknown for better type safety
            let errorMessage = 'Login error. Please check your credentials and try again.';
            // Check if it's an Axios error with a response
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message; // Use generic Error message if available
            }
            setLoginError(errorMessage);
            console.error('Login error:', error);
        } finally {
            setLoginLoading(false);
        }
    };

    const checkPasswordStrength = (password: string): boolean => {
        const errors: string[] = [];
        if (password.length < 8) errors.push('Must be at least 8 characters long.');
        if (!/[a-z]/.test(password)) errors.push('Must contain at least one lowercase letter.');
        if (!/[A-Z]/.test(password)) errors.push('Must contain at least one uppercase letter.');
        if (!/[0-9]/.test(password)) errors.push('Must contain at least one number.');
        if (!/[^a-zA-Z0-9]/.test(password)) errors.push('Must contain at least one special character.');

        setPasswordStrengthErrors(errors);
        return errors.length === 0; // Return boolean directly
    };

    const handleRegisterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setRegisterPassword(newPassword);
        checkPasswordStrength(newPassword); // Check strength on change
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError(null);

        // Re-check strength on submit, just in case
        if (!checkPasswordStrength(registerPassword)) {
            return; // Don't proceed if password is weak
        }

        setRegisterLoading(true);
        const api = createApi();

        try {
            const response = await api.post(API_ENDPOINTS.REGISTER, {
                name: registerName,
                email: registerEmail,
                password: registerPassword
            });
            console.log('Registration successful', response.data);
            setIsRegistering(false); // Switch back to login form on success
            // Optionally: Clear registration fields, show success message, auto-fill login form
            setRegisterName('');
            setRegisterEmail('');
            setRegisterPassword('');
            setPasswordStrengthErrors([]);
            // Consider setting a success message state to display

        } catch (error: unknown) { // Use unknown
            let errorMessage = 'Registration error. Please try again.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setRegisterError(errorMessage);
            console.error('Registration error:', error);
        } finally {
            setRegisterLoading(false);
        }
    };

    // Toggle between Login and Register forms
    const toggleRegisterForm = () => {
        setIsRegistering(!isRegistering);
        // Clear errors and potentially inputs when switching
        setLoginError(null);
        setRegisterError(null);
        setPasswordStrengthErrors([]);
        // Optionally clear login fields too
        // setLoginEmail('');
        // setLoginPassword('');
        setRegisterPassword(''); // Clear password specifically
    };

    // --- Render ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">{isRegistering ? 'Sign Up' : 'Login'}</h2>

                {isRegistering ? (
                    /* --- Registration Form --- */
                    <>
                        {registerError && <p className="text-red-500 text-sm mb-4 text-center">{registerError}</p>}
                        <form onSubmit={handleRegisterSubmit} noValidate> {/* Added noValidate to prevent browser validation interfering */}
                            {/* Name Input */}
                            <div className="mb-4">
                                <label htmlFor="registerName" className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    id="registerName"
                                    placeholder="Enter your name"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>
                            {/* Email Input */}
                            <div className="mb-4">
                                <label htmlFor="registerEmail" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="registerEmail"
                                    placeholder="Enter your email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    aria-required="true"
                                />
                            </div>
                            {/* Password Input */}
                            <div className="mb-6">
                                <label htmlFor="registerPassword" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    id="registerPassword"
                                    placeholder="Enter your password"
                                    value={registerPassword}
                                    onChange={handleRegisterPasswordChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${passwordStrengthErrors.length > 0 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                    required
                                    aria-required="true"
                                    aria-describedby={passwordStrengthErrors.length > 0 ? "password-errors" : undefined}
                                />
                                {passwordStrengthErrors.length > 0 && (
                                    <ul id="password-errors" className="text-red-500 text-xs mt-1 list-disc pl-4" aria-live="polite">
                                        {passwordStrengthErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={registerLoading || passwordStrengthErrors.length > 0 || !registerName || !registerEmail || !registerPassword} // More robust disabled check
                            >
                                {registerLoading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>
                        {/* Toggle Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <button type="button" onClick={toggleRegisterForm} className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline">
                                    Log in
                                </button>
                            </p>
                        </div>
                    </>
                ) : (
                    /* --- Login Form --- */
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
                                disabled={loginLoading || !loginEmail || !loginPassword} // Disable if loading or fields empty
                            >
                                {loginLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        {/* Toggle Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button type="button" onClick={toggleRegisterForm} className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline">
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
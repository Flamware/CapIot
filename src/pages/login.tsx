import React, { useState } from 'react';
import createApi from '../axios/api';

const Login: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);

    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [passwordStrengthErrors, setPasswordStrengthErrors] = useState<string[]>([]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setLoginLoading(true);

        const api = createApi();

        try {
            const response = await api.post('/login', { email: loginEmail, password: loginPassword });
            const customJwt = response.data.jwtToken;
            localStorage.setItem('customJwt', customJwt);
            window.location.href = '/dashboard';
        } catch (error: any) {
            setLoginError('Login error. Please check your credentials and try again.');
            console.error('Login error', error);
        } finally {
            setLoginLoading(false);
        }
    };

    const checkPasswordStrength = (password: string) => {
        const errors: string[] = [];
        if (password.length < 8) {
            errors.push('Must be at least 8 characters long.');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Must contain at least one lowercase letter.');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Must contain at least one uppercase letter.');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Must contain at least one number.');
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            errors.push('Must contain at least one special character (e.g., !@#$%^&*).');
        }
        setPasswordStrengthErrors(errors);
        return errors.length === 0;
    };

    const handleRegisterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setRegisterPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError(null);
        setRegisterLoading(true);

        if (!checkPasswordStrength(registerPassword)) {
            setRegisterLoading(false);
            return;
        }

        const api = createApi();

        try {
            const response = await api.post('/register', { name: registerName, email: registerEmail, password: registerPassword });
            console.log('Registration successful', response.data);
            setIsRegistering(false);
            // Optionally, set a success message
        } catch (error: any) {
            setRegisterError(error?.response?.data?.message || 'Registration error. Please try again.');
            console.error('Registration error', error);
        } finally {
            setRegisterLoading(false);
        }
    };

    const toggleRegisterForm = () => {
        setIsRegistering(!isRegistering);
        setLoginError(null);
        setRegisterError(null);
        setPasswordStrengthErrors([]); // Clear password errors when switching forms
        setRegisterPassword(''); // Clear password field when switching forms
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">{isRegistering ? 'Sign Up' : 'Login'}</h2>

                {isRegistering ? (
                    <>
                        {registerError && <p className="text-red-500 text-sm mb-4 text-center">{registerError}</p>}
                        <form onSubmit={handleRegisterSubmit}>
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
                                />
                            </div>
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
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="registerPassword" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    id="registerPassword"
                                    placeholder="Enter your password"
                                    value={registerPassword}
                                    onChange={handleRegisterPasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {passwordStrengthErrors.length > 0 && (
                                    <ul className="text-red-500 text-xs mt-1 list-disc pl-4">
                                        {passwordStrengthErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={registerLoading || passwordStrengthErrors.length > 0}
                            >
                                {registerLoading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">Already have an account? <button type="button" onClick={toggleRegisterForm} className=" text-white bg-blue-500 hover:bg-blue-600">Log in</button></p>
                        </div>
                    </>
                ) : (
                    <>
                        {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
                        <form onSubmit={handleLoginSubmit}>
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
                                />
                            </div>
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
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loginLoading}
                            >
                                {loginLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">Don't have an account? <button type="button" onClick={toggleRegisterForm} className="text-white bg-green-500 hover:bg-green-600">Sign up</button></p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
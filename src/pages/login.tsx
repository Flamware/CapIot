import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // To switch between login and register
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            const customJwt = response.data.jwtToken;
            localStorage.setItem('customJwt', customJwt);
            // Redirect to home or dashboard after login
            window.location.href = '/dashboard'; // Or use React Router
        } catch (error) {
            setError('Login error. Please check your credentials and try again.');
            console.error('Login error', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', { username, email, password });
            const customJwt = response.data.jwtToken;
            localStorage.setItem('customJwt', customJwt);
            // Redirect to home or dashboard after registration
            window.location.href = '/dashboard'; // Or use React Router
        } catch (error) {
            setError('Registration error. Please try again.');
            console.error('Registration error', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2em', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>{isRegistering ? 'Create an Account' : 'Login'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Toggle between login and register forms */}
            {isRegistering ? (
                <form onSubmit={handleRegisterSubmit}>
                    <div style={{ marginBottom: '1em' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5em' }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5em' }}>Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5em' }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5em' }}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75em', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleLoginSubmit}>
                    <div style={{ marginBottom: '1em' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5em' }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5em' }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75em', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
            )}

            <div style={{ marginTop: '1em', textAlign: 'center' }}>
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    style={{ padding: '0.5em', border: 'none', backgroundColor: 'transparent', color: '#007bff', cursor: 'pointer' }}
                >
                    {isRegistering ? 'Already have an account? Log in' : 'Need an account? Register'}
                </button>
            </div>
        </div>
    );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
    const { loginWithRedirect, logout, isAuthenticated, user, getIdTokenClaims } = useAuth0();
    const [isRegister, setIsRegister] = useState(false);
    console.log('User authenticated:', user);

    // Handle login success and send POST request to backend
    const handleLogin = async () => {
        if (isAuthenticated && user) {
            console.log('User authenticated:', user);
            try {
                const token = await getIdTokenClaims(); // Get the JWT token from Auth0
                const response = await fetch('http://localhost:8080/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                    },
                    body: JSON.stringify({ userId: user.sub, email: user.email, name: user.name }), // Optionally send user data
                });

                if (!response.ok) {
                    // Handle failed response, e.g., user creation failure
                    console.error('Failed to log in or create user');
                } else {
                    const responseData = await response.json();
                    console.log('User logged in or created successfully:', responseData);
                }
            } catch (error) {
                console.error('Error during login request:', error);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            handleLogin(); // Automatically send the login request when the user is authenticated
        }
    }, [isAuthenticated]); // Only runs when the user is authenticated

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <div className="flex justify-between mb-4">
                    <button
                        className={`px-4 py-2 ${!isRegister ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setIsRegister(false)}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 ${isRegister ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setIsRegister(true)}
                    >
                        Register
                    </button>
                </div>
                {isAuthenticated ? (
                    <div className="text-center">
                        <p className="mb-4">Welcome, {user?.name}!</p>
                        <button onClick={() => logout({ returnTo: window.location.origin })} className="w-full bg-red-500 text-white p-2 rounded">
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => loginWithRedirect()} className="w-full bg-blue-500 text-white p-2 rounded">
                        {isRegister ? 'Register with Auth0' : 'Login with Auth0'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;

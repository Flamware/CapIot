import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust the path based on your file structure
import { jwtDecode } from 'jwt-decode'; // You'll need to install this: npm install jwt-decode

interface JwtPayload {
    role?: string[]; // Change 'roles' to 'role'
    // ... other claims if you have them
}

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('customJwt') !== null;

    useEffect(() => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('customJwt')!;
                const decodedToken = jwtDecode<JwtPayload>(token);
                console.log("Decoded JWT:", decodedToken);
                setUserRoles(decodedToken?.role || []); // Extract roles from the decoded JWT
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setUserRoles([]);
            }
        } else {
            setUserRoles([]);
        }
    }, [isAuthenticated]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('customJwt');
        navigate('/');
    };

    const isAdmin = userRoles.includes('admin'); // Check if the user has the 'admin' role

    return (
        <header className="bg-mint-500 px-6 py-5 shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img
                        src={logo}
                        alt="Cap.Iot"
                        className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
                    />
                    <span className="text-2xl font-semibold tracking-tight text-white">Cap.Iot Monitor</span>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle mobile menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>

                {/* Navigation Menu */}
                <nav className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'} md:ml-6`}>
                    <ul className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0 items-center">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'} py-2 md:py-0 block`
                                }
                                aria-label="Dashboard"
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/history"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'} py-2 md:py-0 block`
                                }
                                aria-label="History"
                            >
                                History
                            </NavLink>
                        </li>
                        {isAdmin && (
                            <li>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'} py-2 md:py-0 block`
                                    }
                                    aria-label="Settings"
                                >
                                    Admin
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'} py-2 md:py-0 block`
                                }
                                aria-label="Profile"
                            >
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'} py-2 md:py-0 block`
                                }
                                aria-label="About"
                            >
                                About
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Login/Logout Button */}
                <div className="ml-4">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogoutClick}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition-colors duration-200"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Header: React.FC = () => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    return (
        <header className="bg-gradient-to-r from-mint-500 to-mint-600 px-6 py-4 shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img
                        src="/src/assets/logo.png"
                        alt="Cap.Iot"
                        className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                    />
                    <span className="text-2xl font-semibold tracking-tight text-white">Cap.Iot Monitor</span>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle mobile menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>

                {/* Navigation Menu */}
                <nav className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex space-x-6 md:flex-row flex-col md:space-x-6 space-y-4 md:space-y-0">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'}`
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
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'}`
                                }
                                aria-label="History"
                            >
                                History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/settings"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'}`
                                }
                                aria-label="Settings"
                            >
                                Settings
                            </NavLink>
                        </li><li>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'}`
                                }
                                aria-label="Settings"
                            >
                                profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors duration-200 ${isActive ? 'text-mint-200 underline underline-offset-4' : 'text-white hover:text-mint-200'}`
                                }
                                aria-label="About"
                            >
                                About
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Login/Logout Button */}
                {isAuthenticated ? (
                    <button onClick={() => logout({ returnTo: window.location.origin })} className="bg-red-500 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                ) : (
                    <button onClick={() => loginWithRedirect()} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

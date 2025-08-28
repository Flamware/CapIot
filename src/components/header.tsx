import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowLeft, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './hooks/useAuth'; // Import the useAuth hook

interface HeaderProps {
    onToggleSidebar?: () => void;
}

const ContentHeader: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    // We now get user and isAuthenticated from the useAuth hook
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
        logout(); // Use the logout function from the AuthContext
        navigate('/login');
        setIsAccountMenuOpen(false); // Close the menu after logging out
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Helper to render the back button and title
    const renderHeaderSection = (title: string, isAccent: boolean = false) => (
        <div className="hidden md:flex items-center space-x-4">
            <button
                onClick={handleGoBack}
                className="text-gray-500 hover:text-primary focus:outline-none transition duration-200"
                aria-label="Go back"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
            </button>
            <h1 className={`text-xl font-semibold ${isAccent ? 'text-accent' : 'text-gray-800'}`}>{title}</h1>
        </div>
    );

    let headerContent;

    if (location.pathname === '/dashboard') {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="text-gray-500 hover:text-primary focus:outline-none transition duration-200"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                )}
                <span className="text-xl font-semibold text-gray-800">Dashboard</span>
            </div>
        );
    } else if (location.pathname === '/profile') {
        headerContent = renderHeaderSection('Your Profile');
    } else if (location.pathname.startsWith('/admin')) {
        headerContent = renderHeaderSection('Admin Area', true);
    } else if (location.pathname === '/history') {
        headerContent = renderHeaderSection('History');
    } else if (location.pathname === '/about') {
        headerContent = renderHeaderSection('About Us');
    } else {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="text-gray-500 hover:text-primary focus:outline-none transition duration-200"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                )}
                <div className="flex items-center space-x-2">
                    <img className="block h-8 w-auto" src={logo} alt="CapIot Logo" />
                    <FontAwesomeIcon icon={faChartLine} className="text-primary text-2xl" />
                    <span className="text-xl font-semibold text-gray-800">Cap<span className="text-primary">Iot</span></span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background shadow-sm py-4 px-6 flex items-center justify-end md:justify-between sticky top-0 z-50 border-b border-gray-200">
            {headerContent}
            <div className="flex items-center space-x-4">
                {isAuthenticated && (
                    <>
                        <div className="relative" ref={notificationMenuRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="text-gray-600 hover:text-secondary focus:outline-none p-2 rounded-full hover:bg-gray-100 transition duration-200"
                                aria-label="Notifications"
                            >
                                <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                            </button>
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                                    <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={accountMenuRef}>
                            <button
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-secondary focus:outline-none p-2 rounded-full hover:bg-gray-100 transition duration-200"
                                aria-label="Account menu"
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="h-7 w-7 text-primary" />
                                <span className="font-medium text-sm hidden sm:block">{user?.name || 'User'}</span>
                            </button>
                            {isAccountMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsAccountMenuOpen(false); // Close menu after navigation
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition duration-200 text-sm font-medium"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContentHeader;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowLeft, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Added faBell, faUserCircle

interface JwtPayload {
    name?: string;
}

interface HeaderProps {
    onToggleSidebar?: () => void;
}

const ContentHeader: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const [userName, setUserName] = useState<string | undefined>(''); // Changed to use userName directly
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('customJwt') !== null;
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // Managed state directly
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);     // Managed state directly
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('customJwt')!;
                const decodedToken = jwtDecode<JwtPayload>(token);
                setUserName(decodedToken?.name);
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setUserName('');
            }
        } else {
            setUserName('');
        }
    }, [isAuthenticated]);

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page in history
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
    }, []); // Empty dependency array as refs are stable

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
    } else if (location.pathname.startsWith('/admin')) { // Simpler check for all admin routes
        headerContent = renderHeaderSection('Admin Area', true); // Use accent for admin area
    } else if (location.pathname === '/history') {
        headerContent = renderHeaderSection('History');
    } else if (location.pathname === '/about') {
        headerContent = renderHeaderSection('About Us');
    } else {
        // Default header content if no specific route matches
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
                    <FontAwesomeIcon icon={faChartLine} className="text-primary text-2xl" /> {/* Used primary color */}
                    <span className="text-xl font-semibold text-gray-800">Cap<span className="text-primary">Iot</span></span> {/* Used primary color */}
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
                                <FontAwesomeIcon icon={faUserCircle} className="h-7 w-7 text-primary" /> {/* Larger, primary icon */}
                                <span className="font-medium text-sm hidden sm:block">{userName || 'User'}</span>
                            </button>
                            {isAccountMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('customJwt');
                                            navigate('/login');
                                            setIsAccountMenuOpen(false);
                                        }}
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
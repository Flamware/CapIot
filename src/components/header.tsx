import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import more icons

interface JwtPayload {
    name?: string;
}

interface HeaderProps {
    onToggleSidebar?: () => void;
}

const ContentHeader: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const [, setUserName] = useState<string | undefined>('');
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('customJwt') !== null;
    const [, setIsNotificationsOpen] = useState(false);
    const [, setIsAccountMenuOpen] = useState(false);
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
    }, [accountMenuRef, notificationMenuRef]);

    let headerContent;

    if (location.pathname === '/dashboard') {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                {onToggleSidebar && (
                    <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                )}
                <div className="flex items-center space-x-2">
                    <img className="block h-8 w-auto" src={logo} alt="Logo" />
                    <FontAwesomeIcon icon={faChartLine} className="text-mint-500 text-2xl" />
                    <span className="text-xl font-semibold text-gray-800">Dashboard</span>
                </div>
            </div>
        );
    } else if (location.pathname === '/profile') {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                <button onClick={handleGoBack} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Your Profile</h1>
            </div>
        );
    } else if (location.pathname === '/admin/overview' || location.pathname.startsWith('/admin/')) {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                <button onClick={handleGoBack} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-semibold text-red-700">Admin Area</h1>
            </div>
        );
    } else if (location.pathname === '/history') {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">History</h1>
            </div>
        );
    } else if (location.pathname === '/about') {
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">About Us</h1>
            </div>
        );
    } else {
        // Default header content if no specific route matches
        headerContent = (
            <div className="hidden md:flex items-center space-x-4">
                {onToggleSidebar && (
                    <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                )}
                <div className="flex items-center space-x-2">
                    <img className="block h-8 w-auto" src={logo} alt="Logo" />
                    <FontAwesomeIcon icon={faChartLine} className="text-mint-500 text-2xl" />
                    <span className="text-xl font-semibold text-gray-800">Cap<span className="text-mint-500">Iot</span></span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md py-4 px-6 flex items-center justify-end md:justify-between sticky top-0 ">
            {headerContent}
            <div className="flex items-center space-x-4">
                {isAuthenticated && (
                    <div className="relative" ref={notificationMenuRef}>
                        {/* Notification Button and Dropdown */}
                    </div>
                )}
                {isAuthenticated && (
                    <div className="relative" ref={accountMenuRef}>
                        {/* Account Button and Dropdown */}
                    </div>
                )}
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition duration-200 text-sm font-medium"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContentHeader;
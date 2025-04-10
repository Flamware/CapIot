import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBell, faExclamationTriangle, faDroplet, faWind, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added mobile menu icons

interface JwtPayload {
    role?: string[];
    name?: string;
}

interface Notification {
    icon: any;
    iconColor: string;
    message: string;
    time: string;
}

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [userName, setUserName] = useState<string | undefined>('');
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('customJwt') !== null;
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications] = useState<Notification[]>([
        { icon: faExclamationTriangle, iconColor: 'red', message: 'High temperature alert in Kitchen 2', time: '2 min ago' },
        { icon: faDroplet, iconColor: 'blue', message: 'Humidity threshold exceeded in Greenhouse A', time: '15 min ago' },
        { icon: faWind, iconColor: 'gray', message: 'Airflow reduced in Section B - Check filters', time: '1 hour ago' },
    ]);

    useEffect(() => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('customJwt')!;
                const decodedToken = jwtDecode<JwtPayload>(token);
                setUserRoles(decodedToken?.role || []);
                setUserName(decodedToken?.name);
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setUserRoles([]);
                setUserName('');
            }
        } else {
            setUserRoles([]);
            setUserName('');
        }
    }, [isAuthenticated]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('customJwt');
        navigate('/');
    };

    const isAdmin = userRoles.includes('admin');

    return (
        <nav className="bg-mint-500 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 flex items-center space-x-2">
                            <img className="block h-8 w-auto" src={logo} alt="Logo" />
                            <FontAwesomeIcon icon={faChartLine} className="text-white text-2xl" />
                            <span className="text-xl font-semibold text-white">Cap<span className="text-white">Iot</span></span>
                        </NavLink>
                    </div>
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-white hover:text-mint-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="Dashboard"
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                `text-white hover:text-mint-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="History"
                        >
                            History
                        </NavLink>
                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `text-white hover:text-mint-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                                }
                                aria-label="Admin"
                            >
                                Admin
                            </NavLink>
                        )}
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `text-white hover:text-mint-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="Profile"
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `text-white hover:text-mint-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="About"
                        >
                            About
                        </NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    id="notificationBtn"
                                    className="bg-white focus:outline-none transition duration-150 ease-in-out"
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    aria-expanded={isNotificationsOpen}
                                    aria-label="Notifications"
                                >
                                    <FontAwesomeIcon icon={faBell} className="text-xl text-mint-500" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{notifications.length}</span>
                                    )}
                                </button>
                                <div id="notificationDropdown" className={`absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 ${isNotificationsOpen ? 'block animate-slide-in-right' : 'hidden'}`}>
                                    {notifications.length > 0 ? (
                                        notifications.map((note, index) => (
                                            <a key={index} href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-md mr-3 bg-${note.iconColor}-50`}>
                                                        <FontAwesomeIcon icon={note.icon} className={`text-${note.iconColor}-500 text-lg`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{note.message}</p>
                                                        <p className="text-xs text-gray-500">{note.time}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <span className="block px-4 py-2 text-sm text-gray-600">No new notifications</span>
                                    )}
                                </div>
                            </div>
                        )}
                        {isAuthenticated && userName && (
                            <div className="flex items-center">
                                <img className="h-8 w-8 rounded-full object-cover" src="https://randomuser.me/api/portraits/men/42.jpg" alt={userName} />
                                <span className="ml-2 text-sm font-medium text-white">{userName}</span>
                            </div>
                        )}
                        <div>
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogoutClick}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition duration-200 text-sm font-medium"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition duration-200 text-sm font-medium"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                type="button"
                                className="bg-mint-600 inline-flex items-center justify-center p-2 rounded-md text-mint-200 hover:text-white hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `block text-white hover:bg-mint-700 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="Dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                `block text-white hover:bg-mint-700 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="History"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            History
                        </NavLink>
                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `block text-white hover:bg-mint-700 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                                }
                                aria-label="Admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Admin
                            </NavLink>
                        )}
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `block text-white hover:bg-mint-700 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="Profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `block text-white hover:bg-mint-700 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out ${isActive ? 'bg-mint-700' : ''}`
                            }
                            aria-label="About"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </NavLink>
                    </div>
                    <div className="pt-4 pb-3 border-t border-mint-700">
                        {isAuthenticated ? (
                            <div className="px-2 space-y-1">
                                <div className="flex items-center px-3">
                                    <img className="h-8 w-8 rounded-full object-cover" src="https://randomuser.me/api/portraits/men/42.jpg" alt={userName} />
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{userName}</div>
                                        {userRoles.length > 0 && (
                                            <div className="text-sm font-medium text-mint-200">{userRoles.join(', ')}</div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogoutClick}
                                    className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition duration-200 text-base font-medium mt-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="px-2">
                                <button
                                    onClick={handleLoginClick}
                                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition duration-200 text-base font-medium"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
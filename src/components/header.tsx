import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faBell,
    faUserCircle,
    faCheckCircle,
    faTrashAlt,
    faBars,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';

interface HeaderProps {
    onToggleSidebar: () => void;
    onCloseSidebar: () => void;
    isSidebarOpen?: boolean;
    isMobile: boolean;
}

const ContentHeader: React.FC<HeaderProps> = ({ onToggleSidebar, onCloseSidebar, isSidebarOpen,isMobile }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);
    const {
        notifications,
        fetchNotifications,
        loading,
        markAsRead,
        deleteNotification,
        pagination,
    } = useNotifications();

    const handleGoBack = () => {
        navigate(-1);
        onCloseSidebar(); // ✅ Corrected: Close sidebar on back navigation
    };

    const handleLogout = () => {
        logout();
        setIsAccountMenuOpen(false);
        onCloseSidebar();
    };

    const handleBellClick = () => {
        if (!isNotificationsOpen) {
            fetchNotifications(1, 10);
        }
        setIsNotificationsOpen(!isNotificationsOpen);
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user && isAuthenticated) {
            fetchNotifications(1, 1);
        }
    }, [user]);

    const renderSidebarToggle = () =>
        onToggleSidebar && (
            <button
                onClick={onToggleSidebar}
                className="text-gray-500 hover:text-green-500 focus:outline-none transition duration-200"
                aria-label="Toggle sidebar"
            >
                <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="h-6 w-6" />
            </button>
        );

    const renderHeaderTitle = (title: string) => (
        <div className="flex items-center space-x-4">
            {isMobile && renderSidebarToggle()}
            <button
                onClick={handleGoBack}
                className="text-gray-500 hover:text-green-500 focus:outline-none transition duration-200"
                aria-label="Go back"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-green-600">
                {title}
            </h1>
        </div>
    );

    const totalNotifications = pagination?.totalItems || 0;

    const renderHeaderContent = () => {
        const path = location.pathname.toLowerCase(); // Normalisation pour éviter les erreurs de casse
    console.log("Current path:", path);
        switch (path) {
            case '/dashboard':
                return renderHeaderTitle('Tableau de Bord');
            case '/profile':
                return renderHeaderTitle('Votre Profil');
            case '/history':
                return renderHeaderTitle('Historique des Données');
            case '/about':
                return renderHeaderTitle('À propos de Cap.Iot');
            case '/notifications/':
                return renderHeaderTitle('Toutes les Notifications');
            case path.startsWith('/notifications/device/') ? path : '':
                return renderHeaderTitle('Notification par appareil');
            default:
                if (path.startsWith('/admin')) {
                    return renderHeaderTitle('Admin Area');
                }
                return renderHeaderTitle('CapIot'); // Titre par défaut cohérent
        }
    };

    return (
        <div className="bg-white shadow-sm py-2 px-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
            {renderHeaderContent()}
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <div className="relative" ref={notificationMenuRef}>
                            <button
                                onClick={handleBellClick}
                                className="relative text-gray-600 hover:text-green-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition duration-200"
                                aria-label="Notifications"
                                aria-haspopup="true"
                                aria-expanded={isNotificationsOpen}
                            >
                                <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                                {totalNotifications > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {totalNotifications}
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && (
                                <div
                                    className={`absolute right-0 mt-2 ${
                                        isMobile ? 'w-screen max-w-sm' : 'w-80'
                                    } bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20`}
                                    role="menu"
                                >
                                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        <button
                                            onClick={() => {
                                                navigate('/notifications');
                                                onCloseSidebar(); // ✅ Corrected: Close sidebar on navigation
                                            }}
                                            className="text-sm text-green-600 hover:underline"
                                        >
                                            See All
                                        </button>
                                    </div>
                                    {loading ? (
                                        <div className="flex justify-center items-center h-24">
                                            <svg
                                                className="animate-spin h-6 w-6 text-green-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                                            No new notifications.
                                        </div>
                                    ) : (
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.log_id}
                                                    className={`px-4 py-3 border-b last:border-b-0 cursor-pointer ${
                                                        notif.log_read
                                                            ? 'bg-gray-50 hover:bg-gray-100'
                                                            : 'bg-green-50 hover:bg-green-100'
                                                    }`}
                                                    onClick={() => markAsRead(notif.log_id)}
                                                    role="menuitem"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span
                                                            className={`text-sm font-semibold ${
                                                                notif.log_read ? 'text-gray-600' : 'text-gray-900'
                                                            }`}
                                                        >
                                                            {notif.component_name} de {notif.site_name}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(notif.log_timestamp).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`mt-1 text-xs ${
                                                            notif.log_read ? 'text-gray-500' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {notif.log_content}
                                                    </p>
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notif.log_id);
                                                            }}
                                                            className="text-xs text-green-600 hover:underline"
                                                        >
                                                            <FontAwesomeIcon icon={faCheckCircle} /> Lu
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notif.log_id);
                                                            }}
                                                            className="text-xs text-red-600 hover:underline"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={accountMenuRef}>
                            <button
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition duration-200"
                                aria-label="Account menu"
                                aria-haspopup="true"
                                aria-expanded={isAccountMenuOpen}
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="h-7 w-7 text-green-500" />
                                <span className="font-medium text-sm hidden sm:block">
                                    {user?.name || 'User'}
                                </span>
                            </button>
                            {isAccountMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20"
                                    role="menu"
                                >
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsAccountMenuOpen(false);
                                            onCloseSidebar(); // ✅ Corrected: Close sidebar on navigation
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        role="menuitem"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                        role="menuitem"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            navigate('/login');
                            onCloseSidebar(); // ✅ Corrected: Close sidebar on login navigation
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition duration-200 text-sm font-medium"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContentHeader;

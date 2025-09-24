import React, { useState } from 'react';
import { Home, Users, Cpu, MapPin, Settings, ChevronDown, ChevronUp, Bell, X } from 'lucide-react';
import { NavLink } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.tsx";

// Define the shape of a menu item for clarity
interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
}

// Define the props for the SideBar component, ensuring role is an array of strings
interface SideBarProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    isMobile?: boolean;
}

export function SideBar({ isSidebarOpen, onToggleSidebar, isMobile }: SideBarProps) {

    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const { user } = useAuth();

    // Inline SVG for the chart icon
    const ChartLineIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="text-green-300 text-2xl">
            <path d="M64 64h192c17.7 0 32-14.3 32-32s-14.3-32-32-32H64C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v128c0 0 0 0 0 0H64c0 0 0 0 0 0V64zm384-32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H480c-17.7 0-32 14.3-32 32zM320 160c0-17.7 14.3-32 32-32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H352c-17.7 0-32 14.3-32 32s14.3 32 32 32zm64 128c0-17.7 14.3-32 32-32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H416c-17.7 0-32 14.3-32 32s14.3 32 32 32zm64-160c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H480c-17.7 0-32 14.3-32 32zM480 256c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32s32-14.3 32-32V288c0-17.7-14.3-32-32-32zM352 128c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32s32-14.3 32-32V160c0-17.7-14.3-32-32-32zM224 96c-17.7 0-32 14.3-32 32v192c0 17.7 14.3 32 32 32s32-14.3 32-32V128c0-17.7-14.3-32-32-32z"/>
        </svg>
    );

    // Menu items visible to 'gestionnaire' and 'admin'
    const menuItems: MenuItem[] = [
        { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
        { id: "history", label: "History", icon: Users, path: "/history" },
        { id: "profile", label: "Profile", icon: Cpu, path: "/profile" },
        { id: "about", label: "About", icon: MapPin, path: "/about" },
        { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
    ];

    // Menu items specific to 'admin' role
    const adminMenuItems: MenuItem[] = [
        { id: "admin-overview", label: "Overview", icon: Home, path: "/admin/overview" },
        { id: "admin-users", label: "Users", icon: Users, path: "/admin/users" },
        { id: "admin-devices", label: "Devices", icon: Cpu, path: "/admin/devices" },
        { id: "admin-locations", label: "Locations", icon: MapPin, path: "/admin/locations" },
    ];

    // Menu items specific to 'operateur' role
    const operateurMenuItems: MenuItem[] = [
        { id: "devices", label: "Devices", icon: Cpu, path: "/admin/devices" },
        { id: "locations", label: "Locations", icon: MapPin, path: "/admin/locations" },
    ];

    // Helper variables for conditional rendering based on user role
    const isAdmin = user?.roles?.includes("admin");
    const isGestionnaire = user?.roles?.includes('gestionnaire');
    const isOperateur = user?.roles?.includes('operateur');

    const toggleAdminDropdown = () => {
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
    };

    // Determine which set of menu items to display based on the 'operateur' role
    const displayMenuItems = isOperateur ? operateurMenuItems : menuItems;

    return (
        <>
            {/* Mobile overlay, visible when sidebar is open */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black opacity-50 transition-opacity duration-300"
                    onClick={onToggleSidebar}
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar container with responsive classes */}
            <div className={`fixed top-0 left-0 h-full w-64 z-40 shadow-lg bg-white
                transform transition-transform duration-300 ease-in-out
                ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'} lg:relative lg:translate-x-0`}>
                <div className="flex flex-col justify-start pt-6">
                    {/* Logo and close button for mobile */}
                    <div className="flex items-center justify-between px-4 mb-8">
                        <NavLink to="/" className="flex items-center space-x-2" onClick={onToggleSidebar}>
                            <ChartLineIcon />
                            <span className="text-xl font-semibold text-gray-800">
                                Cap<span className="text-green-300">Iot</span>
                            </span>
                        </NavLink>
                        {isMobile && (
                            <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close sidebar">
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* General Navigation based on role */}
                    {(isAdmin || isGestionnaire || isOperateur) && (
                        <div className="w-full">
                            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {isOperateur ? "Services" : "General"}
                            </h3>
                            <nav>
                                {displayMenuItems.map((item) => (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        onClick={onToggleSidebar}
                                        className={({ isActive }) =>
                                            `flex items-center w-full px-4 py-3 text-sm font-medium text-left
                                         hover:bg-green-100 hover:text-green-800 focus:outline-none focus:bg-green-200
                                          focus:text-green-900 transition-colors duration-200 ${isActive ? 'bg-green-300 text-green-900 font-semibold' : ''}`
                                        }
                                    >
                                        <item.icon className="w-5 h-5 mr-2 text-green-600" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Admin Section (Dropdown) - only for 'admin' role */}
                    {isAdmin && (
                        <div className="w-full mt-4">
                            <div
                                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={toggleAdminDropdown}
                            >
                                <div className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2 text-red-600" />
                                    <span className="font-semibold">Admin Section</span>
                                </div>
                                {isAdminDropdownOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                            </div>
                            {isAdminDropdownOpen && (
                                <nav className="mt-1">
                                    {adminMenuItems.map((item) => (
                                        <NavLink
                                            key={item.id}
                                            to={item.path}
                                            onClick={onToggleSidebar}
                                            className={({ isActive }) =>
                                                `flex items-center w-full px-6 py-2 text-sm font-medium text-left hover:bg-red-100 hover:text-red-800 focus:outline-none focus:bg-red-200 focus:text-red-900 transition-colors duration-200 ${isActive ? 'bg-red-200 text-red-900 font-semibold' : ''}`
                                            }
                                        >
                                            <item.icon className="w-4 h-4 mr-2 text-red-600" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}
                                </nav>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}

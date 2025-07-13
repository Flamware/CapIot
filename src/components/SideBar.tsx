import React, { useState, useContext } from 'react';
import { Home, Users, Cpu, MapPin, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../AuthContext.tsx";
interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
}

interface SideBarProps {
    isAdmin?: boolean;
}

export function SideBar({ isAdmin }: SideBarProps) {
    useLocation();
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const { logout } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems: MenuItem[] = [
        { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
        { id: "history", label: "History", icon: Users, path: "/history" },
        { id: "profile", label: "Profile", icon: Cpu, path: "/profile" },
        { id: "about", label: "About", icon: MapPin, path: "/about" },
    ];

    const adminMenuItems: MenuItem[] = [
        { id: "admin-overview", label: "Overview", icon: Home, path: "/admin/overview" },
        { id: "admin-users", label: "Users", icon: Users, path: "/admin/users" },
        { id: "admin-devices", label: "Devices", icon: Cpu, path: "/admin/devices" },
        { id: "admin-locations", label: "Locations", icon: MapPin, path: "/admin/locations" },
    ];

    const toggleAdminDropdown = () => {
        setIsAdminDropdownOpen(!isAdminDropdownOpen);
    };

    return (
        <div className="hidden border-r lg:flex lg:flex-col lg:w-64 lg:shadow-lg bg-white">
            <div className="flex flex-col justify-start pt-6">
                {/* Logo Section */}
                <div className="mb-8 flex items-center justify-center px-4">
                    <NavLink to="/" className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faChartLine} className="text-green-300 text-2xl" />
                        <span className="text-xl font-semibold text-gray-800">Cap<span className="text-green-300">Iot</span></span>
                    </NavLink>
                </div>

                {/* General Navigation */}
                <div className="w-full ">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ">General</h3>
                    <nav>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.id}
                                to={item.path}
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



                {/* Admin Section (Dropdown) */}
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
                {/* Logout Button */}
                <div className="w-full p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

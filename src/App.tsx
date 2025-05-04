import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History.tsx";
import { SideBar } from "./components/SideBar"; // Import the SideBar component
import { jwtDecode } from 'jwt-decode';
import ContentHeader from "./components/header.tsx";
import {DeviceManagement} from "./pages/admin/DeviceManagement.tsx";
import LocationManagement from "./pages/admin/LocationManagement.tsx";
import {UserManagement} from "./pages/admin/UserManagement.tsx";


interface JwtPayload {
    role?: string[];
}

const App: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const isAuthenticated = localStorage.getItem('customJwt') !== null;

    useEffect(() => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('customJwt')!;
                const decodedToken = jwtDecode<JwtPayload>(token);
                setIsAdmin(decodedToken?.role?.includes('admin') || false);
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    }, [isAuthenticated]);

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-gray-50">
                {isAuthenticated && (
                    <SideBar
                        isAdmin={isAdmin}
                    />
                )}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex-1 overflow-y-auto flex flex-col">
                        {isAuthenticated && (
                            <ContentHeader  />
                        )}
                    </div>
                    <main className="container mx-auto p-4">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
                            <Route path="/history" element={<History />} />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute requiredRoles={['admin']}>
                                        <UserManagement />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/devices"
                                element={
                                    <ProtectedRoute requiredRoles={['admin']}>
                                        <DeviceManagement />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/locations"
                                element={
                                    <ProtectedRoute requiredRoles={['admin']}>
                                        <LocationManagement/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/about" element={<About />} />
                            <Route path="/unauthorized" element={<div className="text-center mt-10"><h1 className="text-2xl font-semibold text-red-500">Unauthorized</h1><p className="mt-2">You do not have permission to access this page.</p></div>} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
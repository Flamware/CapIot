import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from "react";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History.tsx";
import { SideBar } from "./components/SideBar";
import ContentHeader from "./components/header.tsx";
import {DeviceManagement} from "./pages/admin/DeviceManagement.tsx";
import LocationManagement from "./pages/admin/LocationManagement.tsx";
import {UserManagement} from "./pages/admin/UserManagement.tsx";
import {useAuth} from "./components/hooks/useAuth.tsx";
import NoRolePage from "./pages/norole.tsx";

const App: React.FC = () => {
    // Get user and authentication state from the context
    const { isAuthenticated, user } = useAuth();

    // The isAdmin state can now be derived directly from the user object
    const role = user?.roles

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-gray-50">
                {isAuthenticated && (
                    <SideBar role={role}/>
                )}
                <div className="flex-1 overflow-y-auto">
                    {isAuthenticated && (
                        <ContentHeader />
                    )}
                    <main className="container mx-auto p-4">
                        <Routes>

                            {/* Define the new route for users with no role */}
                            <Route path="/no-role" element={<NoRolePage />} />
                            <Route path="/"element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

                            {/* General protected route that applies to all logged-in users */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/history" element={<History />} />
                            </Route>

                            {/* Specific protected routes for admin users */}
                            <Route element={<ProtectedRoute requiredRoles={['admin','operateur']} />}>
                                <Route path="/admin/users" element={<UserManagement />} />
                                <Route path="/admin/devices" element={<DeviceManagement />} />
                                <Route path="/admin/locations" element={<LocationManagement />} />
                            </Route>

                            <Route path="/login" element={<Login />} />
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

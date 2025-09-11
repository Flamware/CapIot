import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/history.tsx";
import { SideBar } from "./components/SideBar";
import ContentHeader from "./components/header.tsx";
import {DeviceManagement} from "./pages/admin/DeviceManagement.tsx";
import LocationManagement from "./pages/admin/LocationManagement.tsx";
import {UserManagement} from "./pages/admin/UserManagement.tsx";
import {useAuth} from "./components/hooks/useAuth.tsx";
import NoRolePage from "./pages/norole.tsx";
import Notifications from "./pages/Notifications.tsx";
import {AuthProvider} from "./AuthContext.tsx";
import {useState} from "react";

const App = () => {
    const { isAuthenticated, user } = useAuth();
    const role = user?.roles;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="relative flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
                    {isAuthenticated && (
                        <SideBar role={role} isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
                    )}

                    <div className="flex-1 overflow-y-auto">
                        <ContentHeader isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
                        <main className="container mx-auto p-4">
                            <Routes>
                                <Route path="/no-role" element={<NoRolePage />} />
                                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
                                <Route element={<ProtectedRoute requiredRoles={['user', 'admin', 'operateur', 'guest']} />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/history" element={<History />} />
                                    <Route path="/notifications" element={<Notifications />} />
                                </Route>
                                <Route element={<ProtectedRoute requiredRoles={['admin','operateur']} />}>
                                    <Route path="/admin/users" element={<UserManagement />} />
                                    <Route path="/admin/devices" element={<DeviceManagement />} />
                                    <Route path="/admin/locations" element={<LocationManagement />} />
                                </Route>
                                <Route path="/login" element={<Login />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/unauthorized" element={<NoRolePage />} />
                                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;

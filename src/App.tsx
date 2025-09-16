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
import {AuthProvider} from "./AuthContext.tsx";
import {useState} from "react";
import Notifications from "./pages/notifications.tsx";

const App = () => {
    // This is the problem. useAuth will not work as expected because it's not
    // a child of AuthProvider.
    const { isAuthenticated} = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    // To fix this, we'll create a new component that uses the hooks
    // and is a child of the provider.
    return (
        <div className="relative flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
            {isAuthenticated && (
                <SideBar  isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
            )}

            <div className="flex-1 overflow-y-auto">
                <ContentHeader
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                    onCloseSidebar={closeSidebar}
                />
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
    );
};

// This is the new root component
const AppWithProviders = () => (
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);

export default AppWithProviders;
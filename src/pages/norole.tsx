import { useNavigate } from 'react-router-dom';
import {useAuth} from "../components/hooks/useAuth.tsx";

const NoRolePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-xl max-w-lg mx-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Account Pending
                </h1>
                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    It looks like your account hasn't been assigned a role yet. An administrator is
                    currently reviewing your registration.
                </p>
                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                    Please check back later. You can log out and return when you've been notified.
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto px-6 py-3 text-white font-medium bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default NoRolePage;
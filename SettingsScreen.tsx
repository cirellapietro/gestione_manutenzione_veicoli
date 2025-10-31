
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SettingsScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Impostazioni</h2>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Profilo Utente</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Nominativo</p>
                        <p className="font-medium text-gray-800">{user?.nominativo}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Account</h3>
                <button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;

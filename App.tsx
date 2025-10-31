
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import DashboardScreen from './DashboardScreen';
import VehicleDetailScreen from './VehicleDetailScreen';
import AddVehicleScreen from './AddVehicleScreen';
import SettingsScreen from './SettingsScreen';
import Layout from './Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();
    return (
        <HashRouter>
            {user && <Layout />}
            <main className="pb-20 pt-4 px-4">
                <Routes>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/register" element={<RegistrationScreen />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <DashboardScreen />
                        </ProtectedRoute>
                    } />
                    <Route path="/vehicle/:id" element={
                        <ProtectedRoute>
                            <VehicleDetailScreen />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-vehicle" element={
                        <ProtectedRoute>
                            <AddVehicleScreen />
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <SettingsScreen />
                        </ProtectedRoute>
                    } />
                     <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
                </Routes>
            </main>
        </HashRouter>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
};

export default App;

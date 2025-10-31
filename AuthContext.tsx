
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from './types';
import { api } from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
        try {
            const currentUser = await api.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        } catch (error) {
            console.error("Failed to check user session", error);
        } finally {
            setLoading(false);
        }
    };
    checkUserSession();
  }, []);

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const { user, error } = await api.login(identifier, pass);
    if (user) {
        setUser(user);
        return { success: true };
    }
    return { success: false, error: error || 'Login fallito' };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen bg-slate-100">
              <div className="text-xl font-semibold text-blue-800">Caricamento...</div>
          </div>
      )
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

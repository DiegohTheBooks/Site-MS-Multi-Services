import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAdmin: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ms_admin_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('ms_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const ok = await api.checkAuth();
        if (!ok) {
          logout();
        }
      } catch {
        // keep offline or active token
      } finally {
        setIsLoading(false);
      }
    }
    verify();
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const data = await api.login(email, pass);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ms_admin_token', data.token);
      localStorage.setItem('ms_admin_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Falha na autenticação' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ms_admin_token');
    localStorage.removeItem('ms_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin: !!token,
        user,
        token,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

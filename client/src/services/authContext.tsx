import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api';

export interface User {
  id: string;
  role: 'survivor' | 'counselor' | 'admin';
  alias: string;
  fullName?: string;
  email: string;
  emergencyContact?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  demoLogin: (role: 'survivor' | 'counselor') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('mindguard_token');
    const savedUser = localStorage.getItem('mindguard_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('mindguard_token');
        localStorage.removeItem('mindguard_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('mindguard_token', response.token);
      localStorage.setItem('mindguard_user', JSON.stringify(response.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('mindguard_token', response.token);
      localStorage.setItem('mindguard_user', JSON.stringify(response.user));
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: 'survivor' | 'counselor') => {
    if (role === 'survivor') {
      await login('survivor@mindguard.org', 'demo1234');
    } else {
      await login('counselor@mindguard.org', 'demo1234');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mindguard_token');
    localStorage.removeItem('mindguard_user');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedData };
      setUser(updated);
      localStorage.setItem('mindguard_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        demoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

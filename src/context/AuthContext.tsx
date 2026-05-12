import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, logout as logoutAPI } from '../services/authService';
import type { MyPageData } from '../types/user';
import { getMyPage } from '../services/userService';

interface AuthContextType {
  user: MyPageData | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updatePoints: (amount: number) => void;
  updateProfile: (updatedData: Partial<MyPageData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MyPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (accessToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await loginAPI({ email, password });
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const myPageData = await getMyPage();
      setUser(myPageData);
      localStorage.setItem('user', JSON.stringify(myPageData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch {
      // 실패해도 클라이언트 토큰 제거
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  const updatePoints = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, point: user.point + amount };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (updatedData: Partial<MyPageData>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading, updatePoints, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
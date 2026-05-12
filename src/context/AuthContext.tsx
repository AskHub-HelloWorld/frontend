//유저 정보 저장 페이지 입니다
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, logout as logoutAPI } from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  company: string;
  joinedAt: string;
  points: number;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => Promise<void>;                               
  isLoading: boolean;
  updatePoints: (amount: number) => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰 있으면 유저 정보 복원
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
      // 1. 백엔드 로그인 API 호출
      const { accessToken, refreshToken } = await loginAPI({ email, password });

      // 2. 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 3. 유저 정보 가져오기 (백엔드에 /members/me 같은 API 있으면 교체)
      //    지금은 email만 세팅하고 나머지는 추후 프로필 API 연동 시 채움
      const partialUser: User = {
        id: 0,
        name: '',
        email,
        department: '',
        company: '',
        joinedAt: '',
        points: 0,
        avatar: null,
      };

      setUser(partialUser);
      localStorage.setItem('user', JSON.stringify(partialUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAPI(); // 백엔드에 로그아웃 요청
    } catch {
      // 실패해도 클라이언트 토큰은 제거
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  const updatePoints = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + amount };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
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
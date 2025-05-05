"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { get, post } from '@/lib/api';

// Kullanıcı profil tipi
type UserProfile = {
  id: string;
  bio?: string | null;
  avatar?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  dateOfBirth?: string | null;
};

// Kullanıcı tipi
type User = {
  id: string;
  email: string;
  name?: string | null;
  profile?: UserProfile | null;
};

// AuthContext içeriği
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

// Context oluşturma
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider bileşeni
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Token kontrolü ve kullanıcı bilgilerini alma
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // localStorage'dan token kontrolü
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Kullanıcı bilgilerini al
        const userData = await get<{ user: User }>('/users/profile');
        setUser(userData.user);
      } catch (error) {
        console.error('Kimlik doğrulama hatası:', error);
        // Hata durumunda token'ı temizle
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Giriş işlemi
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', response.token);
      setUser(response.user);

      return true;
    } catch (error) {
      console.error('Giriş hatası:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Kayıt işlemi
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await post<{ token: string; user: User }>('/auth/signup', {
        name,
        email,
        password,
      });

      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', response.token);
      setUser(response.user);

      return true;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  // Kullanıcı bilgilerini güncelleme
  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...userData };
    });
  };

  // Context değerleri
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }
  return context;
}
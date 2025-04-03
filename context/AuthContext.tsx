import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';

interface AuthContextType {
    user: { id: number; role: string } | null;
    isLoading: boolean;
    login: (
      email: string, 
      password: string, 
      role: 'STUDENT' | 'TEACHER'
    ) => Promise<{ id: number; role: string }>; 
    signup: (payload: { name: string; email: string; password: string; role: string }) => Promise<void>;
    logout: () => Promise<void>;
  }
    
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsLoading(false);
        
        console.log('Auth check completed. User exists:', !!userData);
        if (!userData) {
          console.log('Redirecting to login');
          router.replace('/auth/LoginScreen');
        } else {
          console.log('Redirecting to dashboard');
          router.replace(userData.role === 'TEACHER' ? '/teacher/ProfileScreen' : '/student/StudentCategoryScreen');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);
  
  const handleLogin = async (
    email: string,
    password: string,
    role: 'STUDENT' | 'TEACHER'
  ) => {
    try {
      const userData = await authService.login(email, password, role);
      setUser({
        id: userData.id,
        role: userData.role,
      });
      return userData;
    } catch (error) {
      setUser(null); 
      await authService.logout();
      throw error; 
    }
  };
  const handleSignup = async (payload: { 
    name: string; 
    email: string; 
    password: string; 
    role: string 
  }) => {
    try {
      await authService.signup({
        ...payload,
        role: payload.role.toUpperCase() as 'STUDENT' | 'TEACHER',
      });
      
      router.replace('/auth/LoginScreen');
    } catch (error: any) {
      throw new Error(error.message); 
    }
  };
    
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    router.replace('/auth/LoginScreen');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
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
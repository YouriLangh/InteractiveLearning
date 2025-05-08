import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';

interface AuthContextType {
    user: { id: number; role: string } | null;
    isLoading: boolean;
    login: (
<<<<<<< HEAD
      email: string, 
      password: string, 
      role: 'STUDENT' | 'TEACHER'
    ) => Promise<{ id: number; role: string }>; 
    signup: (payload: { name: string; email: string; password: string; role: string }) => Promise<void>;
    logout: () => Promise<void>;
  }
    
=======
      name: string, 
      code: string, 
      role: 'STUDENT' | 'TEACHER'
    ) => Promise<{ id: number; role: string }>; 
    signup: (payload: { name: string; code: string; role: string }) => Promise<void>;
    logout: () => Promise<void>;
}

>>>>>>> Fahim2
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsLoading(false);
<<<<<<< HEAD
        
=======

>>>>>>> Fahim2
        if (!isInitialized) {
          setIsInitialized(true);
          if (!userData) {
            router.replace('/auth/LoginScreen');
          } else {
            router.replace(userData.role === 'TEACHER' ? '/teacher/ProfileScreen' : '/student/StudentExerciseList');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router, isInitialized]);
<<<<<<< HEAD
  
  const handleLogin = async (
    email: string,
    password: string,
    role: 'STUDENT' | 'TEACHER'
  ) => {
    try {
      const userData = await authService.login(email, password, role);
=======

  const handleLogin = async (
    name: string,
    code: string,
    role: 'STUDENT' | 'TEACHER'
  ) => {
    try {
      const userData = await authService.login(name, code, role);
>>>>>>> Fahim2
      setUser({
        id: userData.id,
        role: userData.role,
      });
      return userData;
    } catch (error) {
<<<<<<< HEAD
      setUser(null); 
      await authService.logout();
      throw error; 
    }
  };
  const handleSignup = async (payload: { 
    name: string; 
    email: string; 
    password: string; 
=======
      setUser(null);
      await authService.logout();
      throw error;
    }
  };

  const handleSignup = async (payload: { 
    name: string; 
    code: string; 
>>>>>>> Fahim2
    role: string 
  }) => {
    try {
      await authService.signup({
        ...payload,
        role: payload.role.toUpperCase() as 'STUDENT' | 'TEACHER',
      });
<<<<<<< HEAD
      
      router.replace('/auth/LoginScreen');
    } catch (error: any) {
      throw new Error(error.message); 
    }
  };
    
=======

      router.replace('/auth/LoginScreen');
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

>>>>>>> Fahim2
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    router.replace('/auth/LoginScreen');
  };
<<<<<<< HEAD
  
=======

>>>>>>> Fahim2
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
<<<<<<< HEAD
};
=======
};
>>>>>>> Fahim2

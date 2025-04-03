// services/authService.ts
import axios, { AxiosError } from 'axios';
import api from './api';
import { storeSecureValue, removeSecureValue, getSecureValue } from '@/services/secureStorage';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  role: 'STUDENT' | 'TEACHER';
  exp: number;
}

interface SignupResponse {
    message: string;
  }

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: 'STUDENT' | 'TEACHER';
  };
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'TEACHER';
}

class AuthService {
    async signup(payload: SignupPayload): Promise<SignupResponse> {
        try {
          const response = await api.post<SignupResponse>('/auth/signup', payload);
          
          if (response.status >= 200 && response.status < 300) {
            return response.data;
          }
      
          throw new Error(response.data.message || 'Registration failed');
      
        } catch (error) {
          const normalizedError = this.normalizeError(error);
          
          if (normalizedError.message.toLowerCase().includes('email')) {
            normalizedError.message = 'This email is already registered';
          }
          
          throw normalizedError;
        }
      }
      
  async login(
    email: string,
    password: string,
    role: 'STUDENT' | 'TEACHER'
  ): Promise<LoginResponse['user']> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password, role });

      if (response.data.user.role !== role) {
        throw new Error('Login failed');
      }
    
      if (response.status >= 400) { 
        throw this.normalizeError({
          response: {
            status: response.status,
            data: response.data
          }
        });
      }
  
      await storeSecureValue('authToken', response.data.token);
      await storeSecureValue('userRole', response.data.user.role);
      await storeSecureValue('userId', String(response.data.user.id));
      
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw this.normalizeError(error);
    }
  }
    
  async logout(): Promise<void> {
    await Promise.all([
      removeSecureValue('authToken'),
      removeSecureValue('userRole'),
      removeSecureValue('userId'),
    ]);
  }

  async getCurrentUser(): Promise<{ id: number; role: string } | null> {
    const token = await getSecureValue('authToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return {
        id: decoded.id,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  private normalizeError(error: unknown): { message: string } {
    if (typeof error === 'object' && error !== null) {
      const apiError = error as { 
        status?: number;
        message?: string;
        data?: { error?: string };
      };
      
      if (apiError.status === 400) {
        return { message: 'Email already registered' };
      }
      
      return { 
        message: apiError.data?.error || 
               apiError.message || 
               'Authentication failed' 
      };
    }
    return { message: 'Unknown error occurred' };
  }
        }

export const authService = new AuthService();
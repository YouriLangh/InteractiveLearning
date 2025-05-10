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

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: 'STUDENT' | 'TEACHER';
  };
}

interface SignupPayload {
  name: string;
  code: string;
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
          
          if (normalizedError.message.toLowerCase().includes('name') || normalizedError.message.toLowerCase().includes('code')) {
            normalizedError.message = 'This name and code combination is already taken';
          }
          
          throw normalizedError;
        }
      }
      
  async login(name: string, code: string, role: 'STUDENT' | 'TEACHER'): Promise<LoginResponse> {
    try {
      console.log('Login request payload:', { name, code, role });
      const response = await api.post<LoginResponse>('/auth/login', { name, code, role });
      
      console.log('Raw login response:', JSON.stringify(response.data, null, 2));

      // Check if we have a valid response with user data
      if (!response.data) {
        console.error('No response data received');
        throw new Error('Invalid response from server');
      }

      if (!response.data.user) {
        console.error('No user object in response:', response.data);
        throw new Error('Invalid response from server');
      }

      if (!response.data.user.role) {
        console.error('No role in user object:', response.data.user);
        throw new Error('Invalid response from server');
      }

      if (response.data.user.role.toUpperCase() !== role.toUpperCase()) {
        throw new Error('Invalid role for this account');
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
      
      // Return the user object directly since that's what the LoginScreen expects
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login network error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      } else {
        console.error('Login error:', error);
      }
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
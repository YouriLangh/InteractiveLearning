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
<<<<<<< HEAD
    message: string;
  }
=======
  message: string;
}
>>>>>>> Fahim2

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
<<<<<<< HEAD
  email: string;
  password: string;
=======
  code: string;
>>>>>>> Fahim2
  role: 'STUDENT' | 'TEACHER';
}

class AuthService {
<<<<<<< HEAD
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
=======
  async signup(payload: SignupPayload): Promise<SignupResponse> {
    try {
      const response = await api.post<SignupResponse>('/auth/signup', payload);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw new Error(response.data.message || 'Registration failed');

    } catch (error) {
      const normalizedError = this.normalizeError(error);

      if (normalizedError.message.toLowerCase().includes('name and code')) {
        normalizedError.message = 'This name and code combination is already taken';
      }

      throw normalizedError;
    }
  }

  async login(
    name: string,
    code: string,
    role: 'STUDENT' | 'TEACHER'
  ): Promise<LoginResponse['user']> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { name, code, role });
>>>>>>> Fahim2

      if (response.data.user.role !== role) {
        throw new Error('Login failed');
      }
<<<<<<< HEAD
    
      if (response.status >= 400) { 
=======

      if (response.status >= 400) {
>>>>>>> Fahim2
        throw this.normalizeError({
          response: {
            status: response.status,
            data: response.data
          }
        });
      }
<<<<<<< HEAD
  
      await storeSecureValue('authToken', response.data.token);
      await storeSecureValue('userRole', response.data.user.role);
      await storeSecureValue('userId', String(response.data.user.id));
      
=======

      await storeSecureValue('authToken', response.data.token);
      await storeSecureValue('userRole', response.data.user.role);
      await storeSecureValue('userId', String(response.data.user.id));

>>>>>>> Fahim2
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw this.normalizeError(error);
    }
  }
<<<<<<< HEAD
    
=======

>>>>>>> Fahim2
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
<<<<<<< HEAD
      const apiError = error as { 
=======
      const apiError = error as {
>>>>>>> Fahim2
        status?: number;
        message?: string;
        data?: { error?: string };
      };
<<<<<<< HEAD
      
      if (apiError.status === 400) {
        return { message: 'Email already registered' };
      }
      
      return { 
        message: apiError.data?.error || 
               apiError.message || 
               'Authentication failed' 
=======

      if (apiError.status === 400) {
        return { message: 'This name and code combination is already taken' };
      }

      return {
        message: apiError.data?.error ||
          apiError.message ||
          'Authentication failed'
>>>>>>> Fahim2
      };
    }
    return { message: 'Unknown error occurred' };
  }
<<<<<<< HEAD
        }

export const authService = new AuthService();
=======
}

export const authService = new AuthService();
>>>>>>> Fahim2

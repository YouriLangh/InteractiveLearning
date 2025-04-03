import * as SecureStore from 'expo-secure-store';

export type TokenType = 'accessToken' | 'refreshToken';
export type { AuthTokens } from '@/types';

export const storeToken = async (type: TokenType, token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(type, token);
  } catch (error) {
    console.error(`Failed to store ${type}`, error);
    throw new Error('Secure storage failed');
  }
};

export const getToken = async (type: TokenType): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(type);
  } catch (error) {
    console.error(`Failed to retrieve ${type}`, error);
    return null;
  }
};

export const deleteToken = async (type: TokenType): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(type);
  } catch (error) {
    console.error(`Failed to delete ${type}`, error);
  }
};

export const clearAllTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
    ]);
  } catch (error) {
    console.error('Failed to clear tokens', error);
  }
};

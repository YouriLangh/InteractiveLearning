import * as SecureStore from 'expo-secure-store';

export const storeSecureValue = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log('Stored secure value for key:', key);
    } catch (error) {
      console.error('SecureStore set error:', error);
      throw error;
    }
  };
  
export const getSecureValue = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const removeSecureValue = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

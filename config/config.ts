import Constants from 'expo-constants';

type ExtraConfig = {
  apiUrl?: string; 
};

const { apiUrl } = (Constants.expoConfig?.extra as ExtraConfig) || {};

export default {
  apiUrl: apiUrl || '', 
};

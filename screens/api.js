import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://tbooke.net/api', // Updated to use the live API
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

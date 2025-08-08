import api from './axiosConfig';
import { User, AuthTokens, RegisterData, LoginData } from '../types';

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/users/register/', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthTokens> => {
    const response = await api.post('/token/', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me/');
    return response.data;
  },
};
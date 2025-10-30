import api from './api';
import { useAuthStore } from './store/authStore';
import { LoginResponse, User } from './types';

export const authService = {
  async register(data: {
    email: string;
    username: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/token/', {
      email,
      password,
    });

    const { access, refresh, user } = response.data;

    // Store access token in memory (Zustand)
    useAuthStore.getState().setAuth(user, access);

    // Store refresh token in localStorage (in production, use httpOnly cookie from backend)
    localStorage.setItem('refresh_token', refresh);

    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      useAuthStore.getState().clearAuth();
      localStorage.removeItem('refresh_token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/users/me/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/auth/users/me/', data);
    useAuthStore.getState().updateUser(response.data);
    return response.data;
  },

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },
};
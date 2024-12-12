import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { AUTH_API } from '../lib/api/constants';
import { BACKEND_URL } from '../config';

interface User {
  name: string;
  email: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean; // Add this line
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set,get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,

      // Login function with backend API call
      login: async (email: string, password: string) => {
        try {
          const { data } = await axios.post(AUTH_API.LOGIN, { email, password });
          set({
            isAuthenticated: true,
            user: {
              name: data.name,
              email: data.email,
              avatar: data.avatar || '',
            },
            token: data.token,
          });
          localStorage.setItem('token', data.token);
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      validateResetToken: async (token) => {
        await axios.get(AUTH_API.VALIDATE_RESET_TOKEN(token));
      },
      resetPassword: async (token, password) => {
        await axios.post(AUTH_API.RESET_PASSWORD(token), { password });
      },

      updateProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
      
        try {
          const { data } = await axios.post(AUTH_API.UPDATE_PROFILE_PICTURE, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${get().token}`,
            },
          });
      
          set((state) => ({
            user: state.user ? { ...state.user, avatar: data.avatar } : null,
          }));
        } catch (error) {
          console.error('Error updating profile picture:', error);
          throw error;
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });
        try {
          await axios.post(
            `${BACKEND_URL}/api/auth/change-password`,
            { currentPassword, newPassword },
            {
              headers: {
                Authorization: `Bearer ${get().token}`,
              },
            }
          );
        } catch (error) {
          console.error('Error changing password:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      // Register function with backend API call
      register: async (name: string, email: string, password: string) => {
        try {
          await axios.post(AUTH_API.REGISTER, { name, email, password });
          const { data } = await axios.post(AUTH_API.LOGIN, { email, password });
          set({
            isAuthenticated: true,
            user: { name: data.name, email: data.email },
            token: data.token,
          });
          localStorage.setItem('token', data.token);
        } catch (error:any) {
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      },

      // Logout function
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
        localStorage.removeItem('token');
      },

      // Update user information
      updateUser: async (updates) => {
        set({ isLoading: true });
        try {
          const { data } = await axios.put(
            `${BACKEND_URL}/api/auth/update-profile`,
            updates,
            {
              headers: {
                Authorization: `Bearer ${get().token}`,
              },
            }
          );
      
          // Update the user state with the new data
          set((state) => ({
            user: state.user ? { ...state.user, ...data.user } : null,
          }));
        } catch (error) {
          console.error('Error updating user profile:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

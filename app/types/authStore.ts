// app/types/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { User } from './user';
import { API_BASE_URL } from '../../utils/constant'; // ✅ Centralized URL

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;

  login: (email: string, password: string, type?: 'admin' | 'institution' | 'student') => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setPaymentStatus: (isPaymentDone: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
  setUser: (user: User | null) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      isAuthenticated: false,
      initialized: false,

      setUser: (user) => set({ user }),

      initialize: () => set({ initialized: true }),

      login: async (email, password, type = 'student') => {
        set({ loading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, type }),
            credentials: 'include',
          });

          if (!response.ok) {
            const errorText = await response.text();
            Alert.alert('Login Error', errorText || 'Login failed');
            set({ loading: false });
            return false;
          }

          const data = await response.json();

          const user: User = {
            id: data.id || data.userId,
            name: data.name || '',
            email: data.email,
            phone: data.phone || '',
            role: data.role || type,
            isPaymentDone: data.isPaymentDone || false,
            isProfileCompleted: data.isProfileCompleted || false,
          };

          set({
            user,
            isAuthenticated: true,
            loading: false,
            initialized: true,
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          Alert.alert('Error', 'Network error. Try again.');
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, isAuthenticated: false, loading: false });
          router.replace('/(auth)/login');
        }
      },

      refreshUser: async () => {
        const { initialized } = get();
        set({ loading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) throw new Error('Session expired');

          const data = await response.json();

          const user: User = {
            id: data.id || data.userId,
            name: data.name || '',
            email: data.email,
            phone: data.phone || '',
            role: data.role,
            isPaymentDone: data.isPaymentDone || false,
            isProfileCompleted: data.isProfileCompleted || false,
          };

          set({ user, isAuthenticated: true, loading: false, initialized: true });
        } catch (error) {
          console.error('Refresh user error:', error);
          set({ user: null, isAuthenticated: false, loading: false, initialized: true });

          if (initialized) router.replace('/(auth)/login');
        }
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) set({ user: { ...user, ...updates } });
      },

      setPaymentStatus: (isPaymentDone) => {
        const { user } = get();
        if (user) set({ user: { ...user, isPaymentDone } });
      },

      setProfileCompleted: (isProfileCompleted) => {
        const { user } = get();
        if (user) set({ user: { ...user, isProfileCompleted } }); // ✅ Correctly nested
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

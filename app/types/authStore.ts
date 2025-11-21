// app/types/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL } from '../../utils/constant';
import { User } from './user';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  token: string | null;

  login: (email: string, password: string, type?: 'admin' | 'institution' | 'student') => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setPaymentStatus: (isPaymentDone: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      isAuthenticated: false,
      initialized: false,
      token: null,

      login: async (email, password, type = 'student') => {
        set({ loading: true });
        try {
            const storedCookie = await AsyncStorage.getItem('authCookie') || '';
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            ...(storedCookie && { 'Cookie': storedCookie})},
            body: JSON.stringify({ email, password, type }),
            credentials: 'include', // Use cookies instead of token
          });

          if (!res.ok) {
            const text = await res.text();
            Alert.alert('Login failed', text || 'Invalid credentials');
            set({ loading: false });
            return false;
          }

          const json = await res.json();
          // Assume backend sets cookie on success, no token returned
          if (!json.status || json.status !== 'success') {
            Alert.alert('Login failed', json.message || 'Invalid server response');
            set({ loading: false });
            return false;
          }

          set({ loading: false });
          return true;
        } catch (err) {
          console.error('Login error:', err);
          Alert.alert('Error', 'Network error');
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
            const storedCookie = await AsyncStorage.getItem('authCookie') || '';
          await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
              credentials: 'include',
              headers: {
                  ...(storedCookie && { 'Cookie': storedCookie }),
              },
          });
            await AsyncStorage.removeItem('authCookie');
        } catch (e) {
          console.error('Logout error:', e);
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
          router.replace('/(auth)/login');
        }
      },

      refreshUser: async () => {
        set({ loading: true });
        try {
            const storedCookie = await AsyncStorage.getItem('authCookie') || '';
          const res = await fetch(`${API_BASE_URL}/api/v1/profile`, {
            credentials: 'include', // Use cookies
              headers: {
                  ...(storedCookie && { 'Cookie': storedCookie }),
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache',
              },
          });

          if (!res.ok) throw new Error('Session invalid');

          const json = await res.json();
          const data = json.data || json.user || json;

          const user: User = {
            id: data.id || data._id || '',
            name: data.name || '',
            email: data.email || '',
            phone: data.contactNumber || data.phone || '',
            designation: data.designation || '',
            linkedin: data.linkedin || '',
            verified: data.verified ?? true,
            institution: data.institution || '',
            isPaymentDone: data.isPaymentDone ?? false,
            isProfileCompleted: data.isProfileCompleted ?? false,
            role: data.role || 'student',
            googleId: data.googleId,
            contactNumber: data.contactNumber,
            address: data.address,
            birthday: data.birthday,
            profilePicture: data.profilePicture,
          };

          set({ user, isAuthenticated: !!user.id, loading: false, initialized: true });
        } catch (err) {
          console.error('refreshUser error:', err);
          set({ user: null, token: null, isAuthenticated: false, loading: false, initialized: true });
        }
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) set({ user: { ...user, ...updates } });
      },

      setPaymentStatus: (isPaymentDone) => {
        const { user } = get();
        if (user) get().updateUser({ isPaymentDone });
      },

      setProfileCompleted: (isProfileCompleted) => {
        const { user } = get();
        if (user) get().updateUser({ isProfileCompleted });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.initialized = true;
      },
    }
  )
);
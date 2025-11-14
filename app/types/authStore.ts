// types/authStore.ts
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

  login: (
    email: string,
    password: string,
    type?: 'admin' | 'institution' | 'student'
  ) => Promise<boolean>;
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

      /** Login user with email/password */
      login: async (email, password, type = 'student') => {
        set({ loading: true });
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, type }),
            credentials: 'include',
          });

          const json = await res.json();

          if (!res.ok || json.status !== 'success') {
            Alert.alert('Login failed', json.message || 'Invalid credentials');
            set({ loading: false });
            return false;
          }

          set({ token: json.token || null });
          await get().refreshUser();
          set({ loading: false });
          return true;
        } catch (err) {
          console.error('Login error:', err);
          Alert.alert('Error', 'Network error');
          set({ loading: false });
          return false;
        }
      },

      /** Logout user */
      logout: async () => {
        try {
          await fetch(`${API_BASE_URL}/api/v1/auth/logout`, { credentials: 'include' });
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
          router.replace('/(auth)/login');
        }
      },

      /** Fetch the current logged-in user */
      refreshUser: async () => {
        set({ loading: true });
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/profile`, { credentials: 'include' });
          if (!res.ok) throw new Error('Session invalid');

          const json = await res.json();
          const data = json.data || json.user || json;

          const user: User = {
            id: data.id || data._id || '',
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || data.contactNumber || '',
            contactNumber: data.contactNumber || data.phone || '',
            designation: data.designation || '',
            linkedin: data.linkedin || '',
            verified: data.verified ?? true,
            institution: data.institution || '',
            isPaymentDone: data.isPaymentDone ?? false,
            isProfileCompleted: data.isProfileCompleted ?? false,
            role: data.role || 'student',
            googleId: data.googleId,
            address: data.address,
            birthday: data.birthday,
            profilePicture: data.profilePicture,
            gender: data.gender,
            nationality: data.nationality,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            lastLogin: data.lastLogin,
            ...data, // keep any extra fields from backend
          };

          set({ user, isAuthenticated: !!user.id, loading: false, initialized: true });
        } catch (err) {
          console.error('refreshUser error:', err);
          set({ user: null, token: null, isAuthenticated: false, loading: false, initialized: true });
        }
      },

      /** Update user object partially */
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) set({ user: { ...user, ...updates } });
      },

      /** Update payment status */
      setPaymentStatus: (isPaymentDone: boolean) => {
        get().updateUser({ isPaymentDone });
      },

      /** Mark profile as completed */
      setProfileCompleted: (isProfileCompleted: boolean) => {
        get().updateUser({ isProfileCompleted });
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

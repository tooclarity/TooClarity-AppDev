// lib/auth-context.tsx (updated provider)
import React, { createContext, useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../types/authStore';
import { User } from '../types/user';
import { API_BASE_URL } from '../../utils/constant';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, type?: 'admin' | 'institution' | 'student') => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setPaymentStatus: (isPaymentDone: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized, isAuthenticated, updateUser, setPaymentStatus, setProfileCompleted, refreshUser: storeRefresh } = useAuthStore();

  // Login function with consistent fetch and credentials
  const login = async (
    email: string,
    password: string,
    type: 'admin' | 'institution' | 'student' = 'student'
  ): Promise<boolean> => {
    console.log('[Login] Attempting login with:', email);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
        credentials: 'include', // send cookies
      });

      const text = await res.text();
      console.log('[Login] Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.warn('[Login] Response is not JSON');
        return false;
      }

      if (res.status === 200 && data.status === 'success') {
        console.log('[Login] Login successful, refreshing user...');
        await storeRefresh(); // fetch user info from /profile
        return true;
      }

      console.log('[Login] Login failed:', data.message || 'Unknown error');
      return false;
    } catch (err) {
      console.error('[Login] Network or unexpected error:', err);
      return false;
    }
  };

  const logout = async () => {
    console.log('[Logout] Logging out...');
    // Call backend logout if needed
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, { credentials: 'include' });
    } catch (e) {
      console.error('Logout API error:', e);
    }
    updateUser({} as User);
  };

  const refreshUser = async () => {
    storeRefresh();
  };

  useEffect(() => {
    refreshUser();
  }, []);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A46E4" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        isAuthenticated,
        login,
        logout,
        refreshUser,
        updateUser,
        setPaymentStatus,
        setProfileCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
import React, { createContext, useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../types/authStore';
import type { User } from '../types/user';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string, type?: 'admin' | 'institution' | 'student') => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => void;
  setPaymentStatus: (isPaymentDone: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
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
  } = useAuthStore();

  useEffect(() => {
    refreshUser().catch((error) => console.error('Failed to refresh user on startup:', error));
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    loading,
    initialized,
    login,
    logout,
    refreshUser,
    isAuthenticated,
    updateUser,
    setPaymentStatus,
    setProfileCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

// HOC for protected screens
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      );
    }

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return null;
    }

    return <Component {...props} />;
  };
}

export default AuthProvider;

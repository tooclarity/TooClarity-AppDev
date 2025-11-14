// types/authContext.ts
import React, { createContext, useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../types/authStore';
import { User } from '../types/user';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    loading,
    initialized,
    isAuthenticated,
    login,
    logout,
    refreshUser: storeRefresh,
    updateUser,
    setPaymentStatus,
    setProfileCompleted,
  } = useAuthStore();

  // Refresh user on mount
  useEffect(() => {
    storeRefresh();
  }, [storeRefresh]);

  // Show loader until store is initialized
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
        refreshUser: storeRefresh,
        updateUser,
        setPaymentStatus,
        setProfileCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to access auth context safely */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};

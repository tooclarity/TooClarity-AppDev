import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './AuthContext';
import { useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  initialized: boolean;
  logout: () => void;
}

function InitialLayout() {
  const auth = useAuth() as AuthContextType | null;

  useEffect(() => {
    // No splash screen logic needed
  }, []); // Empty dependency array to run once on mount

  if (!auth || !auth.initialized) {
    return null; // Wait until auth is initialized
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {auth.isAuthenticated ? (
        <Stack.Screen name="screens" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function AppLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './AuthContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Define the AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  initialized: boolean;
  logout: () => void;
}

// Prevent the splash screen from auto-hiding before AuthProvider is ready
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const auth = useAuth() as AuthContextType | null;

  useEffect(() => {
    if (auth?.initialized) {
      SplashScreen.hideAsync();
    }
  }, [auth?.initialized]);

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
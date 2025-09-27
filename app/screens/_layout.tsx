import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disable the default header to match your preference
      }}
    >
      <Stack.Screen name="profileSetup" />
      <Stack.Screen name="AcademicInterestsScreen" />
    </Stack>
  );
}
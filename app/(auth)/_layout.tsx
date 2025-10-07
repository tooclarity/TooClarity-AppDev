import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="OtpVerificationScreen" />
      <Stack.Screen name="VerificationSuccessScreen" />
      <Stack.Screen name="profilesetup" />
      <Stack.Screen name="AcademicInterestsScreen" />
    </Stack>
  );
}

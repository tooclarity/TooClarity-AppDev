// app/(auth)/login.tsx - Full React Native StudentLogin (Email/Password + Google)
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import { API_BASE_URL } from '../../utils/constant'; // ✅ Centralized API URL

const { width } = Dimensions.get('window');

// Mock studentAuthAPI - replace with your real API logic
const studentAuthAPI = {
  login: async (formData: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const text = await response.text();
        return { success: false, message: text || 'Login failed' };
      }

      const json = await response.json();
      console.log('Login API response:', json);
      return json;
    } catch (error) {
      console.error('Login fetch error:', error);
      return { success: false, message: 'Login failed' };
    }
  },
};

// Mock useAuth hook
const useAuth = () => ({
  refreshUser: async () => console.log('Refreshing user...'),
});

interface StudentLoginProps {
  onSuccess?: () => void;
}

export default function StudentLogin({ onSuccess }: StudentLoginProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiResponse = await studentAuthAPI.login(formData);
      const isSuccess =
        apiResponse.success !== false ||
        (apiResponse.message && apiResponse.message.toLowerCase().includes('success'));

      if (!isSuccess) {
        setError(apiResponse.message || 'Login failed');
        Alert.alert('Error', apiResponse.message || 'Login failed');
        return;
      }

      await refreshUser();

      if (onSuccess) {
        onSuccess();
        return;
      }

      router.replace('/VerificationSuccessScreen');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginButtonDisabled = isLoading || !formData.email || !formData.password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoSection}>
        <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your account.</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={text => handleInputChange('password', text)}
              secureTextEntry
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loginButtonDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loginButtonDisabled}
        >
          {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
          <Text style={styles.submitButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>

      {/* Sign up link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* OR Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingVertical: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backButton: { padding: 4, borderRadius: 20 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 120, height: 60, marginBottom: 24 },
  titleSection: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  form: { marginBottom: 24 },
  errorContainer: { backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, color: '#DC2626', textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
  textInput: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingHorizontal: 44, paddingVertical: 12, fontSize: 16, color: '#111827' },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563EB', borderRadius: 16, paddingVertical: 12 },
  disabledButton: { backgroundColor: '#D1D5DB', opacity: 0.5 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  signupText: { fontSize: 14, color: '#6B7280' },
  signupLink: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  divider: { flexDirection: 'row', alignItems: 'center', width: Math.min(361, width - 40), marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  orText: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 12 },
});

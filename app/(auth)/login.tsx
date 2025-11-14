import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import GoogleLogo from '../../assets/images/google-logo.png';
import { useAuth } from '../lib/auth-context';

// Use process.env for API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.5.101:3001'; 

export default function StudentLogin() {
  const router = useRouter();
  const { refreshUser, user } = useAuth();

  // Google Auth setup with env variables
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_CLIENT_ID || '',
    iosClientId: process.env.IOS_CLIENT_ID || '',
    androidClientId: process.env.ANDROID_CLIENT_ID || '',
    webClientId: process.env.WEB_CLIENT_ID || '',
  });

  const [formData, setFormData] = useState({ contactNumber: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<null | 'google'>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Google sign-in cancelled or failed');
      setLoadingProvider(null);
    }
  }, [response]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const navigateAfterLogin = (tempUser: any) => {
    if (!tempUser?.id) {
      Alert.alert('Error', 'User profile not loaded. Please try again.');
      return;
    }
    router.replace(tempUser.isProfileCompleted ? '/(tabs)/home' : '/screens/profilesetup');
  };

  const handleSubmit = async () => {
    if (!formData.contactNumber || !formData.password) {
      setError('Please enter mobile number and password');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'student' }),
        credentials: 'include',
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data?.message || 'Login failed');
        return;
      }

      // Save cookies
      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) await AsyncStorage.setItem('authCookie', setCookieHeader);

      const storedCookie = (await AsyncStorage.getItem('authCookie')) || '';
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: { ...(storedCookie && { Cookie: storedCookie }) },
      });

      const profileData = await profileRes.json();
      const tempUser = profileData.data || profileData.user || profileData;

      if (!tempUser?.id) {
        setError('Invalid user data received.');
        return;
      }

      navigateAfterLogin(tempUser);
    } catch (err: any) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoadingProvider('google');
    await promptAsync({ showInRecents: true });
  };

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
        credentials: 'include',
      });

      const text = await res.text();
      if (!res.ok) {
        const data = text ? JSON.parse(text) : {};
        Alert.alert('Error', data?.message || 'Google login failed');
        return;
      }

      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) await AsyncStorage.setItem('authCookie', setCookieHeader);

      const storedCookie = (await AsyncStorage.getItem('authCookie')) || '';
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: { ...(storedCookie && { Cookie: storedCookie }) },
      });

      const profileData = await profileRes.json();
      const tempUser = profileData.data || profileData.user || profileData;

      if (!tempUser?.id) {
        Alert.alert('Error', 'Invalid user data received.');
        return;
      }

      navigateAfterLogin(tempUser);
    } catch (err) {
      Alert.alert('Error', 'Google login failed');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoSection}>
        <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your account.</Text>
      </View>

      <View style={styles.form}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Mobile Number"
            value={formData.contactNumber}
            onChangeText={text => handleInputChange('contactNumber', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (isLoading || !formData.contactNumber || !formData.password) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading || !formData.contactNumber || !formData.password}>
          {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[styles.oauthButton, loadingProvider === 'google' && styles.disabledButton]}
          onPress={handleGoogleClick}
          disabled={loadingProvider === 'google'}>
          <Image source={GoogleLogo} style={styles.googleIcon} />
          <Text style={styles.oauthButtonText}>
            {loadingProvider === 'google' ? 'Loading Google...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles remain the same as your previous file

// Styling
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backButton: { padding: 4, borderRadius: 20 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 120, height: 60 },
  titleSection: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#6B7280' },
  form: { marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: { position: 'absolute', left: 12 },
  textInput: {
    flex: 1,
    paddingLeft: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    height: 48,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  disabledButton: { opacity: 0.5, backgroundColor: '#D1D5DB' },
  submitButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  signupText: { fontSize: 14, color: '#6B7280' },
  signupLink: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  orText: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 8 },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 12,
  },
  oauthButtonText: { fontSize: 16, fontWeight: '500', color: '#111827' },
  googleIcon: { width: 20, height: 20 },
  errorText: { color: '#DC2626', marginBottom: 12, textAlign: 'center' },
});
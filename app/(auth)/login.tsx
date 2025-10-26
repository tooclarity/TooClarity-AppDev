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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import GoogleLogo from '../../assets/images/google-logo.png';
import { useAuth } from '../lib/auth-context';
import { API_BASE_URL } from '../../utils/constant';

const { width } = Dimensions.get('window');

export default function StudentLogin() {
  const router = useRouter();

  // ✅ from AuthContext
  const { login, refreshUser, user } = useAuth();

  // ✅ Google Auth setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '906583664549-c22ppjehvg75mi0ea89up61jbh139u9c.apps.googleusercontent.com',
  });

  // ✅ Local state
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<null | 'google'>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    } else if (response?.type === 'error') {
      console.log('[Google OAuth] Error:', response);
      Alert.alert('Error', 'Google sign-in cancelled or failed');
      setLoadingProvider(null);
    }
  }, [response]);

  // ✅ input handling
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // ✅ redirect user after login
  const navigateAfterLogin = (u: any) => {
    if (u && !u.isProfileCompleted) {
      router.replace('/screens/profilesetup');
    } else {
      router.replace('/(tabs)/home');
    }
  };

  // ✅ normal login
  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log('[Login] Attempting login with:', formData.email);

    try {
      const success = await login(formData.email, formData.password, 'student');
      if (success) {
        console.log('[Login] Login successful');
        await refreshUser();
        navigateAfterLogin(user);
      } else {
        console.log('[Login] Login failed: Invalid credentials');
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('[Login] Error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleClick = async () => {
    console.log('[Google] Initiating Google login...');
    setLoadingProvider('google');
    await promptAsync({ showInRecents: true });
  };

  // ✅ Google login handler
  const handleGoogleLogin = async (idToken: string) => {
    console.log('[Google] Logging in with ID token:', idToken);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken, role: 'student', source: 'rn-app' }),
        credentials: 'include',
      });

      const text = await res.text();
      console.log('[Google] Response status:', res.status, 'Text:', text);

      if (!res.ok) {
        Alert.alert('Error', text || 'Google login failed');
        setLoadingProvider(null);
        return;
      }

      await refreshUser();
      console.log('[Google] Login successful via Google');
      navigateAfterLogin(user);
    } catch (err) {
      console.error('[Google] Login error:', err);
      Alert.alert('Error', 'Google login failed');
    } finally {
      setLoadingProvider(null);
    }
  };

  const loginButtonDisabled = isLoading || !formData.email || !formData.password;
  const googleButtonDisabled = loadingProvider === 'google';

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

        <View style={styles.inputContainer}>
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

        <TouchableOpacity
          style={[styles.submitButton, loginButtonDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loginButtonDisabled}>
          {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.oauthButton, googleButtonDisabled && styles.disabledButton]}
          onPress={handleGoogleClick}
          disabled={googleButtonDisabled}>
          <Image source={GoogleLogo} style={styles.googleIcon} resizeMode="contain" />
          <Text style={styles.oauthButtonText}>
            {googleButtonDisabled ? 'Loading Google...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 💅 Styling
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
    marginTop: 16,
  },
  oauthButtonText: { fontSize: 16, fontWeight: '500', color: '#111827' },
  googleIcon: { width: 20, height: 20 },
  errorText: { color: '#DC2626', marginBottom: 12, textAlign: 'center' },
});

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import GoogleLogo from '../../assets/images/google-logo.png';
import { useAuth } from '../lib/auth-context';
import {API_BASE_URL} from "@/utils/constant";

const { width } = Dimensions.get('window');

// Helper function to parse Set-Cookie headers into a Cookie header value
function parseCookies(setCookieHeader: string | null | string[]): string {
  if (!setCookieHeader) return '';
  const setCookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  const cookies: string[] = [];
  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(';');
    if (parts.length > 0) {
      const nameValue = parts[0].trim();
      if (nameValue) {
        cookies.push(nameValue);
      }
    }
  }
  return cookies.join('; ');
}

export default function StudentLogin() {
  const router = useRouter();

  // from AuthContext
  const { refreshUser, user, updateUser } = useAuth();

  // Google Auth setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '906583664549-c22ppjehvg75mi0ea89up61jbh139u9c.apps.googleusercontent.com',
  });

  // Local state
  const [formData, setFormData] = useState({ contactNumber: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<null | 'google'>(null);
  const [error, setError] = useState<string | null>(null);

  // handle Google OAuth response
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

  // input handling
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // redirect user after login (with id check)
  const navigateAfterLogin = (tempUser: any) => {
    if (!tempUser || !tempUser.id) {
      Alert.alert('Error', 'User profile not loaded. Please try again.');
      return;
    }
    if (!tempUser.isProfileCompleted) {
      router.replace('/(auth)/profilesetup');
    } else {
      router.replace('/(tabs)/home');
    }
  };

  // normal login with direct fetch
  const handleSubmit = async () => {
    if (!formData.contactNumber || !formData.password) {
      setError('Please enter mobile number and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log('[Login] Attempting login with:', formData.contactNumber);


    const loginData = {
      contactNumber: formData.contactNumber,
      password: formData.password,
      type: 'student',
    };

    console.log('[Login] Sending payload:', loginData);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const text = await res.text();
      console.log('[Login] Response status:', res.status, 'Text:', text);

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        let errMsg = 'Login failed. Please check your credentials.';
        if (data && Array.isArray(data.errors)) {
          errMsg = data.errors.map((e: any) => e.msg).join('; ');
        } else if (data && data.message) {
          errMsg = data.message;
        }
        setError(errMsg);
        return;
      }

      // Extract and store cookies manually to fix RN/Expo cookie sharing issue
      const setCookieHeader = res.headers.get('set-cookie');
      const cookieValue = parseCookies(setCookieHeader);
      if (cookieValue) {
        await AsyncStorage.setItem('authCookie', cookieValue);
        console.log('[Login] Stored cookie:', cookieValue);
      }

      // Manually fetch profile with the cookie to bypass store issue
      const storedCookie = await AsyncStorage.getItem('authCookie') || '';
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'GET',
        credentials: 'include', // Still include for any other cookies
        headers: {
          ...(storedCookie && { 'Cookie': storedCookie }),
        },
      });

      console.log('[Login] Profile response status:', profileRes.status);

      if (!profileRes.ok) {
        const profileText = await profileRes.text();
        console.log('[Login] Profile error text:', profileText);
        setError('Login successful but failed to load profile. Please try again.');
        return;
      }

      const profileData = await profileRes.json();
      console.log('[Login] Profile data:', profileData);

      // Fixed extraction: profile response has { data: { id, isProfileCompleted, ... }, ... }
      const tempUser = profileData.data || profileData.user || profileData;
        if (tempUser && tempUser._id && !tempUser.id) {
            tempUser.id = tempUser._id;
        }
      if (!tempUser || !tempUser.id) {
        setError('Invalid user data received.');
        return;
      }

      console.log('[Login] Login successful, user ID:', tempUser.id);
        updateUser(tempUser);

        // TODO: Update auth store (authStore.ts) to read 'authCookie' from AsyncStorage and add 'Cookie' header to all authenticated fetches
      // For now, skip refreshUser to avoid "Session invalid" error; manually navigate using tempUser
      await refreshUser(); // Commented out to prevent error until store is fixed

      navigateAfterLogin(tempUser);
    } catch (err) {
      console.error('[Login] Error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const handleGoogleClick = async () => {
    console.log('[Google] Initiating Google login...');
    setLoadingProvider('google');
    await promptAsync({ showInRecents: true });
  };

  // Google login handler
  const handleGoogleLogin = async (idToken: string) => {
    console.log('[Google] Logging in with ID token:', idToken ? 'present' : 'missing');
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
        credentials: 'include',
      });

      const text = await res.text();
      console.log('[Google] Response status:', res.status, 'Text:', text);

      if (!res.ok) {
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { message: text };
        }
        const errMsg = data?.message || text || 'Google login failed';
        Alert.alert('Error', errMsg);
        return;
      }

      // Extract and store cookies manually
      const setCookieHeader = res.headers.get('set-cookie');
      const cookieValue = parseCookies(setCookieHeader);
      if (cookieValue) {
        await AsyncStorage.setItem('authCookie', cookieValue);
        console.log('[Google] Stored cookie:', cookieValue);
      }

      // Manually fetch profile
      const storedCookie = await AsyncStorage.getItem('authCookie') || '';
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...(storedCookie && { 'Cookie': storedCookie }),
        },
      });

      console.log('[Google] Profile response status:', profileRes.status);

      if (!profileRes.ok) {
        const profileText = await profileRes.text();
        console.log('[Google] Profile error text:', profileText);
        Alert.alert('Error', 'Google login successful but failed to load profile');
        return;
      }

      const profileData = await profileRes.json();
      console.log('[Google] Profile data:', profileData);

      // Fixed extraction: profile response has { data: { id, isProfileCompleted, ... }, ... }
      const tempUser = profileData.data || profileData.user || profileData;
        if (tempUser && tempUser._id && !tempUser.id) {
            tempUser.id = tempUser._id;
        }
      if (!tempUser || !tempUser.id) {
        Alert.alert('Error', 'Invalid user data received.');
        return;
      }

      console.log('[Google] Login successful via Google, user ID:', tempUser.id);

      // TODO: Same as above for auth store

      navigateAfterLogin(tempUser);
    } catch (err) {
      console.error('[Google] Login error:', err);
      Alert.alert('Error', 'Google login failed');
    } finally {
      setLoadingProvider(null);
    }
  };

  const loginButtonDisabled = isLoading || !formData.contactNumber || !formData.password;
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
          <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Mobile Number"
            value={formData.contactNumber}
            onChangeText={text => handleInputChange('contactNumber', text)}
            keyboardType="phone-pad"
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

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>Don&#39;t have an account? </Text>
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
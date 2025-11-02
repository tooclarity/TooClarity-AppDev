// app/(auth)/signup.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import GoogleLogo from '../../assets/images/google-logo.png';
import { useAuth } from '../lib/auth-context';
import { API_BASE_URL } from '../../utils/constant';

const { width } = Dimensions.get('window');

export default function StudentRegistration() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '906583664549-c22ppjehvg75mi0ea89up61jbh139u9c.apps.googleusercontent.com',
  });

  const [loadingProvider, setLoadingProvider] = useState<null | 'google'>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    role: 'student',
    status: 'active',
  });

  // Google Registration Flow
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      setLoadingProvider('google');

      fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: id_token, role: 'student', source: 'rn-app' }),
        credentials: 'include', // Include cookies for auth
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            if (text.includes('duplicate key error')) {
              setError('This email is already registered. Please log in.');
            } else {
              setError(text || 'Google sign-up failed');
            }
            Alert.alert('Error', error || 'Google sign-up failed');
            return;
          }
          await handleRegisterSuccess();
        })
        .catch((err) => {
          console.error('Google register error:', err);
          Alert.alert('Error', 'Network error during Google sign-up.');
        })
        .finally(() => setLoadingProvider(null));
    }
  }, [response]);

  const handleRegisterSuccess = async () => {
    await refreshUser();

    const user = useAuth().user;
    if (user?.role === 'student') {
      if (!user?.isProfileCompleted) {
        router.replace('/screens/profilesetup');
        return;
      }
      if (user?.isProfileCompleted) {
        router.replace('/(tabs)/home');
        return;
      }
    }
    router.replace('/(auth)/VerificationSuccessScreen');
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const { name, email, contactNumber, address, role, status } = formData;

    if (!name || !email || !contactNumber) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name,
        email,
        contactNumber,
        address,
        role,
        status,
        source: 'rn-app',
      };
      const res = await fetch(`${API_BASE_URL}/api/v1/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Include cookies for auth
      });

      if (!res.ok) {
        const text = await res.text();
        if (text.includes('duplicate key error')) {
          setError('This email is already registered. Please log in.');
        } else {
          setError(text || 'Registration failed');
        }
        Alert.alert('Error', error || 'Registration failed');
        return;
      }

      await handleRegisterSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitButtonDisabled = isLoading || !formData.name || !formData.email || !formData.contactNumber;
  const googleButtonDisabled = loadingProvider === 'google';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoSection}>
        <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your student account</Text>
      </View>

      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            {error.includes('already registered') && (
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Click here to log in</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <InputField
          icon="person"
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(v) => handleInputChange('name', v)}
        />

        <InputField
          icon="mail"
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(v) => handleInputChange('email', v)}
        />

        <InputField
          icon="call"
          placeholder="Mobile Number"
          keyboardType="number-pad"
          value={formData.contactNumber}
          onChangeText={(v) => handleInputChange('contactNumber', v.replace(/[^0-9]/g, '').slice(0, 10))}
        />

        <InputField
          icon="home"
          placeholder="Address (optional)"
          value={formData.address}
          onChangeText={(v) => handleInputChange('address', v)}
        />

        <TouchableOpacity
          style={[styles.submitButton, submitButtonDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitButtonDisabled}
        >
          {isLoading && <ActivityIndicator color="#fff" size="small" />}
          <Text style={styles.submitButtonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.oauthButton, googleButtonDisabled && styles.disabledButton]}
        onPress={() => promptAsync({ showInRecents: true })}
        disabled={googleButtonDisabled}
      >
        {loadingProvider === 'google' ? (
          <ActivityIndicator color="#2563EB" size="small" />
        ) : (
          <Image source={GoogleLogo} style={styles.googleIcon} resizeMode="contain" />
        )}
        <Text style={styles.oauthButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.signupLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const InputField = ({ icon, ...props }) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
      <TextInput {...props} style={styles.textInput} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingVertical: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backButton: { padding: 4, borderRadius: 20 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 120, height: 60 },
  titleSection: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  form: { marginBottom: 24 },
  errorContainer: { backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, color: '#DC2626', textAlign: 'center' },
  loginLink: { fontSize: 14, color: '#2563EB', textAlign: 'center', marginTop: 8 },
  inputContainer: { marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
  textInput: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingHorizontal: 44, paddingVertical: 12, fontSize: 16, color: '#111827' },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', borderRadius: 16, paddingVertical: 12 },
  disabledButton: { backgroundColor: '#D1D5DB', opacity: 0.5 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  signupText: { fontSize: 14, color: '#6B7280' },
  signupLink: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  divider: { flexDirection: 'row', alignItems: 'center', width: Math.min(361, width - 40), marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  orText: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 12 },
  oauthButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 12 },
  oauthButtonText: { fontSize: 16, fontWeight: '500', color: '#111827' },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
});
// app/(auth)/signup.tsx - React Native Student Registration
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

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import GoogleLogo from '../../assets/images/google-logo.png';
import { useAuth } from '../lib/auth-context';
import { API_BASE_URL } from '../../utils/constant'; // ✅ Centralized API URL

const { width } = Dimensions.get('window');

export default function StudentRegistration() {
  const router = useRouter();
  const { refreshUser, user } = useAuth();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<null | 'google'>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    type: 'student',
    designation: 'Student',
  });

  // Load Google script simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsScriptLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterSuccess = async () => {
    await refreshUser();
    const role = user?.role;
    if (role === 'student') router.replace('/(auth)/VerificationSuccessScreen');
  };

  const handleGoogleClick = async () => {
    setLoadingProvider('google');
    try {
      const credential = 'mock-google-credential';
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, type: 'register' }),
      });

      if (!response.ok) {
        const text = await response.text();
        Alert.alert('Error', text || 'Google sign-up failed');
        return;
      }

      await handleRegisterSuccess();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Google sign-up failed');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    let normalizedValue = value;
    if (name === 'contactNumber') normalizedValue = value.replace(/[^0-9]/g, '').slice(-10);
    setFormData(prev => ({ ...prev, [name]: normalizedValue }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const { name, email, password, contactNumber } = formData;

    if (!name || !email || !password || !contactNumber) {
      setError('Please fill all fields');
      return;
    }

    // Password validation
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      setError('Password must be 8+ chars with Upper, lower, number, symbol');
      return;
    }

    if (contactNumber.length !== 10) {
      setError('Contact number must be 10 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || 'Registration failed');
        Alert.alert('Error', text || 'Registration failed');
        return;
      }

      await handleRegisterSuccess();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Logo */}
      <View style={styles.logoSection}>
        <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Form */}
      <View style={styles.form}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={text => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={formData.email}
          onChangeText={text => handleInputChange('email', text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={formData.password}
          onChangeText={text => handleInputChange('password', text)}
          secureTextEntry
        />
        <TextInput
          style={styles.textInput}
          placeholder="Mobile Number"
          value={formData.contactNumber}
          onChangeText={text => handleInputChange('contactNumber', text)}
          keyboardType="number-pad"
          maxLength={10}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Sign Up</Text>}
        </TouchableOpacity>

        <View style={{ marginVertical: 12, alignItems: 'center' }}>
          <Text>OR</Text>
        </View>

        <TouchableOpacity
          style={styles.oauthButton}
          onPress={handleGoogleClick}
          disabled={!isScriptLoaded || loadingProvider === 'google'}
        >
          {loadingProvider === 'google' ? (
            <ActivityIndicator />
          ) : (
            <Image source={GoogleLogo} style={{ width: 20, height: 20 }} />
          )}
          <Text style={{ marginLeft: 8 }}>
            {!isScriptLoaded ? 'Loading Google...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  logoSection: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 120, height: 60 },
  form: { marginTop: 12 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontWeight: '600' },
  errorText: { color: '#DC2626', marginBottom: 12, textAlign: 'center' },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
  },
});
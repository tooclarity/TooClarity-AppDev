<<<<<<< HEAD
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    designation: '',
    linkedin: '',
    password: '',
    repassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Admin Name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required.';
    if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Phone must be 10 digits.';
    if (!formData.designation.trim()) newErrors.designation = 'Designation required.';
    if (!formData.linkedin.trim()) newErrors.linkedin = 'LinkedIn required.';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ chars.';
    if (formData.password !== formData.repassword) newErrors.repassword = 'Passwords must match.';
    if (!acceptTerms) newErrors.terms = 'Accept terms.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
  // TODO: call API authAPI.signUp
  // On success open OTP screen with phone param in query string to satisfy router typing
  const phoneQuery = encodeURIComponent(formData.contactNumber || '');
  router.push(`/otp?phone=${phoneQuery}`);
    } catch (_err) {
      setErrors({ general: 'Network error' });
    } finally {
      setLoading(false);
=======
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
>>>>>>> origin/developer
    }
  };

  return (
<<<<<<< HEAD
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Welcome Aboard!</Text>
  <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 6 }}>Let&apos;s finalize your details.</Text>
      </View>

      <View style={{ gap: 12 }}>
        {errors.general && <Text style={{ color: '#EF4444' }}>{errors.general}</Text>}

        <TextInput
          placeholder="Admin Name"
          value={formData.name}
          onChangeText={(t) => setFormData({ ...formData, name: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(t) => setFormData({ ...formData, email: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={formData.contactNumber}
          onChangeText={(t) => setFormData({ ...formData, contactNumber: t.replace(/[^0-9]/g, '') })}
          maxLength={10}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Designation"
          value={formData.designation}
          onChangeText={(t) => setFormData({ ...formData, designation: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="LinkedIn"
          value={formData.linkedin}
          onChangeText={(t) => setFormData({ ...formData, linkedin: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(t) => setFormData({ ...formData, password: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Re-enter Password"
          secureTextEntry
          value={formData.repassword}
          onChangeText={(t) => setFormData({ ...formData, repassword: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)} style={{ marginRight: 8 }}>
            <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: acceptTerms ? '#0222D7' : '#fff' }} />
          </TouchableOpacity>
          <Text>Accept terms & conditions*</Text>
        </View>

        {errors.terms && <Text style={{ color: '#EF4444' }}>{errors.terms}</Text>}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !acceptTerms}
          style={{ backgroundColor: !loading && acceptTerms ? '#0222D7' : '#D1D5DB', padding: 14, borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>{loading ? 'Creating Account...' : 'Submit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 8, borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, alignItems: 'center' }}>
          <Text>Sign up with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
=======
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
>>>>>>> origin/developer

// app/(auth)/otp.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import { API_BASE_URL } from '../../utils/constant';
import { useAuth } from '../lib/auth-context';

const { width } = Dimensions.get('window');

export default function OtpScreen() {
  const router = useRouter();
  const { phone, type } = useLocalSearchParams();
  const phoneNumber = phone ? String(phone) : '+91 9177375319'; // Fallback
  const flowType = type ? String(type) : 'register'; // Align with web (register/login)

  const { refreshUser } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (error) setError(null);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        phone: phoneNumber,
        otp: otpString,
        type: flowType,
        deviceId: 'mobile-app', // Match web if it tracks device
        source: 'rn-app', // Match web if it tracks source
      };
      const response = await fetch(`${API_BASE_URL}/api/v1/student/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) {
          await AsyncStorage.setItem('authToken', data.token);
        }
        await refreshUser();
        Alert.alert('Success', 'Verified! Redirecting...');
        if (flowType === 'register') {
          router.replace('/screens/profilesetup');
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        const errorMsg = data.message || 'Invalid OTP. Please try again.';
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Network error. Please check your connection and try again.';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const payload = {
        phone: phoneNumber,
        type: flowType,
        source: 'rn-app', // Match web if it tracks source
      };
      const response = await fetch(`${API_BASE_URL}/v1/student/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResendTimer(59);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('Success', 'OTP resent! Check your phone.');
      } else {
        const errorMsg = data.message || 'Failed to resend OTP.';
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoSection}>
        <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Verify account with OTP</Text>
        <Text style={styles.subtitle}>We have sent 6 digit code to {phoneNumber}</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput, error && styles.otpInputError]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={handleKeyDown.bind(null, index)}
              editable={!isLoading}
              selectTextOnFocus
              textAlign="center"
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't get a code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendTimer}>Resend OTP in 00:{resendTimer.toString().padStart(2, '0')}</Text>
          )}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.verifyButton, (isLoading || otp.join('').length !== 6) && styles.verifyButtonDisabled]}
          onPress={handleVerifyOtp}
          disabled={isLoading || otp.join('').length !== 6}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <TouchableOpacity>
              <Text style={styles.termsLink}>T&C</Text>
            </TouchableOpacity>{' '}
            and{' '}
            <TouchableOpacity>
              <Text style={styles.termsLink}>Privacy policy</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backButton: { padding: 4, borderRadius: 20 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 120, height: 60 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24, fontWeight: '500' },
  errorText: { backgroundColor: '#FEF2F2', borderRadius: 8, borderWidth: 1, borderColor: '#FECACA', color: '#DC2626', fontSize: 14, paddingHorizontal: 12, paddingVertical: 8, textAlign: 'center', marginBottom: 16 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: Math.min(280, width - 40), marginBottom: 24 },
  otpInput: { width: 45, height: 50, borderWidth: 2, borderColor: '#BFDBFE', borderRadius: 8, fontSize: 18, fontWeight: '600', textAlign: 'center', backgroundColor: '#FFFFFF' },
  otpInputError: { borderColor: '#FECACA' },
  resendContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  resendText: { fontSize: 14, color: '#6B7280' },
  resendLink: { fontSize: 14, color: '#2563eb', fontWeight: '500', marginLeft: 4 },
  resendTimer: { fontSize: 14, color: '#2563eb', fontWeight: '500', marginLeft: 4 },
  bottomSection: { marginTop: 32, alignItems: 'center' },
  verifyButton: { width: Math.min(361, width - 40), height: 56, backgroundColor: '#2563EB', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  verifyButtonDisabled: { backgroundColor: '#D1D5DB' },
  verifyButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  termsContainer: { alignItems: 'center' },
  termsText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
  termsLink: { color: '#374151', fontWeight: '500' },
});
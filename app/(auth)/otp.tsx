
// app/(auth)/otp.tsx - Updated OTP Screen (handles both login and signup via type param)
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
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.210.101:3001'; // Local dev URL

export default function OtpScreen() {
  const router = useRouter();
  const { phone, type } = useLocalSearchParams(); // Get phone and type (login/register)
  const phoneNumber = phone ? String(phone) : '+91 9177375319'; // Fallback
  const flowType = type ? String(type) : 'login'; // Default to login

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]); // Fixed: Typed as array of TextInput refs

  // Timer for resend OTP
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

  // Handle OTP input change
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

  // Handle backspace
  const handleKeyDown = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    console.log('🔄 Verifying OTP with backend...');

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpString,
          type: flowType,
        }),
      });

      const data = await response.json();
      console.log('✅ Backend OTP response:', { status: response.status, data });

      if (response.ok && data.success) {
        console.log('🎉 OTP verified successfully!');
        // Store token (assuming backend returns token in data)
        if (data.token) {
          await AsyncStorage.setItem('authToken', data.token);
        }
        Alert.alert('Success', 'Verified! Redirecting...');
        // Navigate based on flow
        if (flowType === 'register') {
          router.replace('/(auth)/onboarding'); // For new users
        } else {
          router.replace('/(auth)/VerificationSuccessScreen');
        }
      } else {
        const errorMsg = data.message || 'Invalid OTP. Please try again.';
        console.error('❌ Backend OTP error:', errorMsg);
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      console.error('❌ Network/OTP Error:', err);
      const errorMsg = 'Network error. Please check your connection and try again.';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    console.log('🔄 Resending OTP to backend...');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          type: flowType,
        }),
      });

      const data = await response.json();
      console.log('✅ Resend response:', data);

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
      console.error('❌ Resend Error:', err);
      setError('Failed to resend OTP. Please try again.');
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  // Handle back button
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

        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }} // Fixed: Proper ref callback (assigns ref, returns void)
              style={[
                styles.otpInput,
                error && styles.otpInputError,
              ]}
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

        {/* Resend OTP */}
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
        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (isLoading || otp.join('').length !== 6) && styles.verifyButtonDisabled,
          ]}
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

        {/* Terms and Privacy */}
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 60,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  errorText: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    color: '#DC2626',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Math.min(280, width - 40),
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  otpInputError: {
    borderColor: '#FECACA',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
    marginLeft: 4,
  },
  resendTimer: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
    marginLeft: 4,
  },
  bottomSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  verifyButton: {
    width: Math.min(361, width - 40),
    height: 56,
    backgroundColor: '#2563EB', // Fixed: Blue for enabled state
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#D1D5DB', // Gray for disabled
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  termsLink: {
    color: '#374151',
    fontWeight: '500',
  },
});

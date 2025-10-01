import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const tooclarityLogo = require('../../assets/images/Tooclaritylogo.png');

const OTP_LENGTH = 6;
// OTP verification modes:
// 'any' - accept any 6-digit number (useful for testing)
// 'fixed' - require a fixed OTP (set FIXED_OTP)
// 'generate' - generate a random OTP on mount (shown in dev only)
const OTP_MODE = 'any'; // change to 'fixed' or 'generate' as needed
const FIXED_OTP = '170523';
const RESEND_SECONDS = 60;

export default function OtpScreen() {
  const params = useLocalSearchParams();
  const phone = params?.phone;
  const email = params?.email;
  const router = useRouter();

  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [timerActive, setTimerActive] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputsRef = useRef([]);
  const [generatedOtp, setGeneratedOtp] = useState(null);

  useEffect(() => {
  let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (OTP_MODE === 'generate') {
      // create a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      // For convenience in testing, set the inputs to the generated OTP (optional)
      setOtp(code.split(''));
    }
  }, []);

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    setIsInvalid(false);
    if (text && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(RESEND_SECONDS);
    setTimerActive(true);
    setOtp(new Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
  };

  const handleVerify = () => {
    const joined = otp.join('');
    if (joined.length !== OTP_LENGTH) {
      setIsInvalid(true);
      return;
    }
    // Verification modes
    if (OTP_MODE === 'any') {
      // accept any 6-digit OTP
      router.push('/VerificationSuccessScreen');
      return;
    }
    if (OTP_MODE === 'fixed') {
      if (joined === FIXED_OTP) {
        router.push('/VerificationSuccessScreen');
        return;
      }
      setIsInvalid(true);
      return;
    }
    if (OTP_MODE === 'generate') {
      if (joined === generatedOtp) {
        router.push('/VerificationSuccessScreen');
        return;
      }
      setIsInvalid(true);
      return;
    }
  };

  const isButtonEnabled = otp.join('').length === OTP_LENGTH;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 22 }}>{'←'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}>
        <Image source={tooclarityLogo} style={{ width: 180, height: 60, marginBottom: 12 }} resizeMode="contain" />
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 6 }}>Verify account with OTP</Text>
        <Text style={{ color: '#6B7280', textAlign: 'center', marginBottom: 16 }}>
          We have sent a 6 digit code to {phone ? `+91 ${phone}` : email || '+91 9177375319'}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 12 }}>
          {otp.map((d, i) => {
            const showError = isInvalid && otp.join('').length === OTP_LENGTH;
            const borderColor = showError
              ? '#EF4444'
              : focusedIndex === i
              ? '#0222D7'
              : d
              ? '#22A3FF'
              : '#E6E6E6';
            const backgroundColor = d ? '#FFFFFF' : '#FFFFFF';
            return (
              <TextInput
                key={i}
                ref={(r) => { inputsRef.current[i] = r; }}
                value={d}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex(-1)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor,
                  textAlign: 'center',
                  fontSize: 18,
                  marginRight: 10,
                  backgroundColor,
                }}
              />
            );
          })}
        </View>

        {isInvalid && <Text style={{ color: '#EF4444', marginBottom: 8 }}>Invalid OTP. Please try again.</Text>}

        <View style={{ marginBottom: 16 }}>
          {!timerActive ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{ color: '#0222D7' }}>{'Resend Code'}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#6B7280' }}>Resend OTP in {timer}s</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={!isButtonEnabled}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 12,
            backgroundColor: isButtonEnabled ? '#0222D7' : '#E6E6E6',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
            opacity: isButtonEnabled ? 1 : 0.7,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{'Verify OTP'}</Text>
        </TouchableOpacity>

        <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 16 }}>By continuing, you agree to our T&C and Privacy policy</Text>
      </View>
    </SafeAreaView>
  );
}

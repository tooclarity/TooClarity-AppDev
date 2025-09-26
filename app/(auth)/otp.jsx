import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';

// ✅ Correct image import with extension (same as ProfileSetup)
import tooclarityLogo from '../../assets/images/Tooclaritylogo.png';

const OTP_LENGTH = 6;
const RESEND_TIMER_SECONDS = 60;

export default function OtpVerificationScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRefs = useRef([]);

  // Timer logic
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

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setIsInvalid(false);
    if (text !== '' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    setTimer(RESEND_TIMER_SECONDS);
    setTimerActive(true);
  };

  const handleVerifyOTP = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === OTP_LENGTH) {
      navigation.navigate('VerificationSuccessScreen');
    } else {
      setIsInvalid(true);
    }
  };

  const isButtonEnabled = otp.join('').length === OTP_LENGTH;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Back button with same style as profileSetup */}
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center bg-white p-6">
        {/* Logo + Title */}
        <View className="w-full items-center mb-10">
          <Image
            source={tooclarityLogo} // ✅ updated import usage
            className="w-48 h-20 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-rubik-bold text-gray-800 mb-2">
            Verify account with OTP
          </Text>
          <Text className="text-base font-rubik text-gray-600 text-center">
            We have sent a 6-digit code to{' '}
            <Text className="font-rubik-bold text-gray-800">+91 9177375319</Text>
          </Text>
        </View>

        {/* OTP Inputs */}
        <View className="flex-row justify-between w-full mb-4">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`w-12 h-14 text-center text-2xl font-rubik-bold rounded-xl border-2 ${
                isInvalid
                  ? 'border-red-500 text-red-500'
                  : otp[index]
                  ? 'border-primary'
                  : 'border-gray-300'
              }`}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              value={digit}
            />
          ))}
        </View>

        {isInvalid && (
          <Text className="text-red-500 text-sm mt-2">Invalid OTP. Please try again.</Text>
        )}

        {/* Resend code */}
        <Text className="text-gray-500 text-center mb-6 font-rubik">
          Didn't get a code?
          {timerActive ? (
            <Text className="text-gray-400"> Resend in {timer.toString().padStart(2, '0')}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text className="text-primary font-rubik-medium"> Resend code</Text>
            </TouchableOpacity>
          )}
        </Text>

        {/* Verify Button */}
        <TouchableOpacity
          className={`w-full py-4 rounded-xl ${isButtonEnabled ? 'bg-primary' : 'bg-gray-300'}`}
          onPress={handleVerifyOTP}
          disabled={!isButtonEnabled}
        >
          <Text className="text-white text-base font-rubik-bold text-center">
            Verify OTP
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text className="text-gray-500 text-xs mt-6 text-center font-rubik">
          By continuing, you agree to our{' '}
          <Text className="text-primary font-rubik-medium"> T&C</Text> and{' '}
          <Text className="text-primary font-rubik-medium"> Privacy policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

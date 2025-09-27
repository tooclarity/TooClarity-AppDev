import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
import GoogleLogo from '../../assets/images/google-logo.png';
import MicrosoftLogo from '../../assets/images/microsoft-logo.png';
import AppleLogo from '../../assets/images/apple-logo.png';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const isButtonEnabled = phoneNumber.length > 0;

  const handleLogin = () => {
    // Navigate to OTP screen when Continue is pressed
    router.push('/(auth)/otp');
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Logo + Heading */}
      <View className="items-center mb-10">
        <Image source={TooClarityLogo} className="w-48 h-20 mb-6" resizeMode="contain" />
        <Text
          style={{
            fontFamily: 'Montserrat-SemiBold',
            fontWeight: '600',
            fontSize: 20,
            lineHeight: 20,
            width: 133,
            height: 20,
            textAlign: 'center',
            color: '#060B13',
          }}
        >
          Enter your phone number
        </Text>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 18,
            width: 361,
            height: 20,
            textAlign: 'center',
            color: '#060B13',
            marginTop: 2,
          }}
        >
          We'll send you a text with a verification code.
        </Text>
      </View>

      {/* Phone Number Input */}
      <View style={{ width: 350, marginBottom: 24, position: 'relative' }}>
        <Text
          style={{
            position: 'absolute',
            top: -2,
            left: 32,
            backgroundColor: 'white',
            paddingHorizontal: 10,
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 14,
            lineHeight: 18,
            color: '#6B7280',
          }}
        >
          Mobile Number
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              fontWeight: '500',
              fontSize: 16,
              color: '#060B13',
            }}
          >
            +91
          </Text>
          <TextInput
            style={{
              flex: 1,
              fontFamily: 'Montserrat-Medium',
              fontWeight: '500',
              fontSize: 16,
              color: '#060B13',
              marginLeft: 8,
            }}
            placeholder="Enter mobile number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            autoFocus
          />
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={{
          width: 361,
          height: 60,
          borderRadius: 12,
          backgroundColor: isButtonEnabled ? '#0222D7' : '#D1D5DB',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 8,
        }}
        onPress={handleLogin}
        disabled={!isButtonEnabled}
      >
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 18,
            lineHeight: 18,
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 361,
          marginVertical: 24,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: '#D1D5DB' }} />
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 18,
            color: '#6B7280',
            marginHorizontal: 16,
          }}
        >
          or
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#D1D5DB' }} />
      </View>

      {/* Social Logins */}
      <TouchableOpacity
        style={{
          width: 361,
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Image source={GoogleLogo} style={{ width: 24, height: 24, marginRight: 8 }} />
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 18,
            color: '#060B13',
          }}
        >
          Continue with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 361,
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Image source={MicrosoftLogo} style={{ width: 24, height: 24, marginRight: 8 }} />
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 18,
            color: '#060B13',
          }}
        >
          Continue with Microsoft
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 361,
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <Image source={AppleLogo} style={{ width: 24, height: 24, marginRight: 8 }} />
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 18,
            color: '#060B13',
          }}
        >
          Continue with Apple
        </Text>
      </TouchableOpacity>

      {/* Sign up text */}
      <Text
        style={{
          fontFamily: 'Montserrat-Medium',
          fontWeight: '500',
          fontSize: 16,
          lineHeight: 18,
          textAlign: 'center',
          color: '#060B13',
        }}
      >
        Don’t have an account?{' '}
        <Text style={{ color: '#0222D7', fontFamily: 'Montserrat-Medium', fontWeight: '500' }}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}
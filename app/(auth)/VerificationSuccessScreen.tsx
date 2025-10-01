import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

export default function VerificationSuccessScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#A6E6A0] p-6">
      <View className="relative">
        <Image
          source={require('../../assets/images/verificationtickbgouter.png')} // Outer circle (#63D75B)
          className="w-40 h-40 mb-6"
          resizeMode="contain"
          style={{ tintColor: '#63D75B' }} // Apply #63D75B color to outer circle
        />
        <Image
          source={require('../../assets/images/verificatintionbginner.png')} // Inner circle with tick (#3AC530)
          className="w-24 h-24 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          resizeMode="contain"
          style={{ tintColor: '#3AC530' }} // Apply #3AC530 color to inner circle with tick
        />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#0B2D16', textAlign: 'center', marginBottom: 24 }}>
        OTP Verified Successfully
      </Text>
      <TouchableOpacity
        style={{ width: '100%', paddingVertical: 14, backgroundColor: '#0222D7', borderRadius: 12 }}
        onPress={() => router.push('/screens/profilesetup')}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
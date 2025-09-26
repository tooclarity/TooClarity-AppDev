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
        //   source={require('../../assets/images/verificationtickbginner.png')} // Inner circle with tick (#3AC530)
          className="w-24 h-24 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          resizeMode="contain"
          style={{ tintColor: '#3AC530' }} // Apply #3AC530 color to inner circle with tick
        />
      </View>
      <Text className="text-2xl font-rubik-bold text-gray-800 text-center mb-6">
        OTP Verified Successfully
      </Text>
      <TouchableOpacity
        className="w-full py-4 bg-blue-600 rounded-xl"
        onPress={() => router.push('/screens/profilesetup')} // Updated to match screenshot, removed .jsx for consistency
      >
        <Text className="text-white text-base font-rubik-bold text-center">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
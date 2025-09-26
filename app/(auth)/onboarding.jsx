import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: "All Your Learning Options in One Place",
    description: "Search, compare, and read reviews for thousands of courses, tuitions, and certifications from top institutions.",
    buttonText: "Next",
  },
  {
    id: 2,
    title: "Find the Skills to Shape Your Future",
    description: "From coding bootcamps to public speaking workshops, find the right course to help you achieve your career goals.",
    buttonText: "Next",
  },
  {
    id: 3,
    title: "The Perfect Path for Your Child",
    description: "Easily find, compare, and enroll your child in trusted classes and tutoring. Secure their future with the best education.",
    buttonText: "Get Started",
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/home'); // Navigate to home
    }
  };

  const handleSkip = () => {
    router.replace('/home'); // Navigate to home
  };

  const currentData = onboardingData[currentStep];

  return (
    <LinearGradient
      colors={['#E8E3FF', '#D4C7FF', '#C4B5FD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top Bar */}
      <View className="flex-row justify-between items-center">
        <Text className="text-black text-base font-semibold">9:41</Text>
        <View className="flex-row items-center space-x-1">
          <View className="flex-row space-x-1">
            <View className="w-1 h-3 bg-black rounded-full"></View>
            <View className="w-1 h-4 bg-black rounded-full"></View>
            <View className="w-1 h-5 bg-black rounded-full"></View>
            <View className="w-1 h-6 bg-black rounded-full"></View>
          </View>
          <Text className="text-black text-lg">📶</Text>
          <Text className="text-black text-lg">🔋</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-gray-600 text-sm font-medium">SKIP &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center">
        {/* Image Placeholder */}
        <View className="w-80 h-80 mb-8 rounded-2xl bg-white/20 backdrop-blur-sm justify-center items-center">
          <Text className="text-white/60 text-center text-sm">
            {currentStep === 0 && "👫 Couple studying together"}
            {currentStep === 1 && "👩‍💻 Woman with laptop"}
            {currentStep === 2 && "👨‍👩‍👧 Family with thumbs up"}
          </Text>
        </View>

        {/* Bottom Card */}
        <View className="bg-white rounded-t-3xl w-full py-8 shadow-2xl items-center">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-4 leading-tight">
            {currentData.title}
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6 mb-6">
            {currentData.description}
          </Text>

          {/* Page Indicators */}
          <View className="flex-row justify-center space-x-2 mb-6">
            {onboardingData.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="bg-blue-600 py-4 rounded-xl shadow-lg active:bg-blue-700 w-1/2"
          >
            <Text className="text-white text-center text-base font-semibold">
              {currentData.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

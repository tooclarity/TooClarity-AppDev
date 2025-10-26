import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import EmptyWishlistImage from '../../assets/images/emptywishlistimage.png';

export default function WishlistScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView className="flex-1">
        {/* Gradient Background */}
        <LinearGradient
          colors={['#A8B5FF', '#F5F5FF']} // Top to bottom gradient
          style={{ flex: 1 }}
        >
          <View className="px-4 pt-12 pb-4 bg-transparent">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <Ionicons name="chevron-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text className="font-montserrat-semibold text-xl text-black">Wishlist</Text>
            </View>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-center items-center px-8 pb-10">
              <View className="w-[191px] h-[182px] items-center justify-center mb-6">
                <Image
                  source={EmptyWishlistImage}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
              
              <Text className="font-montserrat-semibold text-2xl text-black text-center mb-3">
                No wishlist items yet!
              </Text>
              
              <Text className="font-montserrat-regular text-sm text-gray-500 text-center leading-5 mb-12">
                You don't have any items in your wishlist at the moment, check back later or add some!
              </Text>

              <TouchableOpacity
                className="bg-blue-700 py-4 px-12 rounded-full"
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text className="font-montserrat-semibold text-white text-center text-base">
                  Back to home
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

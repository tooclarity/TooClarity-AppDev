import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const schools = [
    {
      id: 1,
      name: 'Bachpan Play School',
      location: 'Jubilee Hills',
      description: 'Blending learning and technology, Bachpan is the best preschool',
      fees: '₹2.67L',
      duration: '1 year',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&h=250&fit=crop',
      logo: 'https://via.placeholder.com/30x30/red/ffffff?text=B',
    },
    {
      id: 2,
      name: "Helen O'Grady",
      location: 'Jubilee Hills',
      description: 'Blending learning and technology, Bachpan is the best preschool',
      fees: '₹2.67L',
      duration: '1 year',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&h=250&fit=crop',
      logo: 'https://via.placeholder.com/30x30/blue/ffffff?text=H',
    },
    {
      id: 3,
      name: 'Bachpan Play School',
      location: 'Jubilee Hills',
      description: 'Blending learning and technology, Bachpan is the best preschool',
      fees: '₹2.67L',
      duration: '1 year',
      image: 'https://images.unsplash.com/photo-1524178232363-933d15b3511e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&h=250&fit=crop',
      logo: 'https://via.placeholder.com/30x30/red/ffffff?text=B',
    },
    {
      id: 4,
      name: "First Cry Intellitots",
      location: 'Jubilee Hills',
      description: 'Blending learning and technology, Bachpan is the best preschool',
      fees: '₹2.67L',
      duration: '1 year',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&h=250&fit=crop',
      logo: 'https://via.placeholder.com/30x30/green/ffffff?text=F',
    },
  ];

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 bg-[#F5F5FF] px-4 pt-12">
        {/* Welcome Header */}
        <View className="flex-row items-center mb-6">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=50' }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-Montserrat-regular text-[14px] text-gray-500 leading-5">
              Welcome back
            </Text>
            <Text className="font-Montserrat-semibold text-[18px] text-black leading-6">
              Sai Kiran 👋
            </Text>
          </View>
          <TouchableOpacity 
            className="w-12 h-12 items-center justify-center bg-white rounded-full"
            onPress={() => router.push('/screens/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#1e1e1e" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-5 py-3 mb-6 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search courses"
            className="flex-1 ml-3 font-Montserrat-regular text-[16px] text-black"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity>
            <Ionicons name="options" size={20} color="#0222D7" />
          </TouchableOpacity>
        </View>

        {/* Schools List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {schools.map((school) => (
            <View 
              key={school.id} 
              className="mb-6 rounded-[12px] overflow-hidden bg-white"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {/* School Image */}
              <View className="relative">
                <Image 
                  source={{ uri: school.image }} 
                  className="w-full h-[202px]"
                  resizeMode="cover"
                />
                
                {/* Dark Overlay with School Info */}
                <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3">
                  <View className="flex-row items-center mb-2">
                    <Image
                      source={{ uri: school.logo }}
                      className="w-7 h-7 rounded mr-2"
                    />
                    <Text className="font-Montserrat-semibold text-white text-[16px] flex-1">
                      {school.name}
                    </Text>
                    <TouchableOpacity>
                      <Ionicons name="bookmark-outline" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="location-sharp" size={12} color="white" />
                    <Text className="font-Montserrat-regular text-white text-[12px] ml-1">
                      {school.location}
                    </Text>
                  </View>
                </View>
              </View>

              {/* School Details Section */}
              <View className="px-4 py-3 bg-white">
                <Text className="font-Montserrat-regular text-[13px] text-gray-700 leading-5 mb-3">
                  {school.description}
                </Text>
                
                <View className="flex-row justify-between mb-3">
                  <View>
                    <Text className="font-Montserrat-regular text-[11px] text-gray-500 mb-1">
                      Total Fees
                    </Text>
                    <Text className="font-Montserrat-semibold text-[14px] text-black">
                      {school.fees}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-Montserrat-regular text-[11px] text-gray-500 mb-1">
                      Duration
                    </Text>
                    <Text className="font-Montserrat-semibold text-[14px] text-black">
                      {school.duration}
                    </Text>
                  </View>
                </View>
                
                {/* View Details Button */}
                <TouchableOpacity
                  className="bg-[#0222D7] py-3 rounded-full"
                  onPress={() => router.push('/school-details')}
                  activeOpacity={0.8}
                >
                  <Text className="font-Montserrat-semibold text-white text-center text-[16px]">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
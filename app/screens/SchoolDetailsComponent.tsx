import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SchoolDetailsComponent() {
  const router = useRouter();
  const { courseData } = useLocalSearchParams();
  
  // Parse data passed from Home Screen
  const course = typeof courseData === 'string' ? JSON.parse(courseData) : null;

  if (!course) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Course details not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4"><Text className="text-blue-600">Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  const { title, institution, priceFormatted, mode, location, apiData } = course;
  const description = apiData?.aboutCourse || "No description provided.";
  const instituteLogo = apiData?.institution?.instituteLogo;
  const estDate = apiData?.institution?.establishmentDate || "N/A";
  
  // Dynamic Features based on API Data
  const renderFeature = (icon: any, label: string, value: string) => (
    <View className="bg-gray-50 rounded-lg p-3 mr-2 min-w-[80px] items-center mb-2">
      <Ionicons name={icon} size={20} color="#007AFF" className="mb-1" />
      <Text className="font-regular text-[10px] text-center text-gray-600 mb-1">{label}</Text>
      <Text className="font-semibold text-[12px] text-black text-center">{value || "Yes"}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F5F5FF]">
      <StatusBar hidden />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Image */}
        <View className="relative">
          <Image source={{ uri: course.image }} className="w-full h-[250px] bg-gray-300" resizeMode="cover" />
          
          <TouchableOpacity onPress={() => router.back()} className="absolute top-6 left-4 z-50 bg-white/20 backdrop-blur-md rounded-full p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="absolute bottom-0 left-0 right-0 h-[120px] justify-end px-4 py-4"
          >
            <View className="flex-row items-center mb-2">
              {instituteLogo && <Image source={{ uri: instituteLogo }} className="w-8 h-8 rounded-full mr-2 border border-white" />}
              <Text className="font-bold text-white text-lg flex-1" numberOfLines={1}>{institution}</Text>
            </View>
            <Text className="text-white/90 text-sm font-medium mb-1">{location}</Text>
          </LinearGradient>
        </View>

        {/* Content */}
        <View className="px-4 pt-5">
          
          {/* Title & Price */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-2">
                <View className="bg-blue-100 self-start px-2 py-1 rounded-md mb-2">
                    <Text className="text-blue-700 text-[10px] font-bold uppercase">{course.instituteType}</Text>
                </View>
                <Text className="font-bold text-xl text-gray-900">{title}</Text>
            </View>
            <View className="items-end">
                <Text className="font-bold text-lg text-[#0222D7]">{priceFormatted}</Text>
                <Text className="text-gray-500 text-xs">Total Fees</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View className="flex-row justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
             <View className="items-center flex-1 border-r border-gray-100">
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text className="text-xs text-gray-500 mt-1">Duration</Text>
                <Text className="font-bold text-sm">{apiData?.courseDuration || "N/A"}</Text>
             </View>
             <View className="items-center flex-1 border-r border-gray-100">
                <Ionicons name="school-outline" size={20} color="#666" />
                <Text className="text-xs text-gray-500 mt-1">Mode</Text>
                <Text className="font-bold text-sm">{mode}</Text>
             </View>
             <View className="items-center flex-1">
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text className="text-xs text-gray-500 mt-1">Est.</Text>
                <Text className="font-bold text-sm">{new Date(estDate).getFullYear() || "N/A"}</Text>
             </View>
          </View>

          {/* About */}
          <Text className="font-bold text-lg text-gray-800 mb-2">About Course</Text>
          <Text className="text-gray-600 text-sm leading-6 mb-6">{description}</Text>

          {/* Features Grid */}
          <Text className="font-bold text-lg text-gray-800 mb-3">Highlights</Text>
          <View className="flex-row flex-wrap">
             {apiData?.hasWifi && renderFeature("wifi", "WiFi", "Yes")}
             {apiData?.hasAC && renderFeature("snow", "AC", "Yes")}
             {apiData?.placementDrives && renderFeature("briefcase", "Placements", "Yes")}
             {course.programDuration && renderFeature("hourglass", "Duration", course.programDuration)}
             {course.level && renderFeature("layers", "Level", course.level)}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-6 mb-10">
            <TouchableOpacity className="flex-1 bg-white border border-[#0222D7] py-4 rounded-full">
               <Text className="text-[#0222D7] font-bold text-center">Request Callback</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-[#0222D7] py-4 rounded-full shadow-lg">
               <Text className="text-white font-bold text-center">Book Demo</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
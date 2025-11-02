// File: app/components/SchoolDetailsComponent.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export type School = {
  id: string;
  name: string;
  category: string;
  curriculumType: string;
  duration: string;
  totalFees: string;
  estDate: string;
  mode: string;
  timing: string;
  location: string;
  about: string;
  operationalDays: string[];
  additionalFeatures: { icon: string; label: string; value: string }[];
  facilities: { icon: string; label: string; value: string }[];
  image: string;
  bannerImage: string;
  bannerText: string;
};

type Props = {
  school: School;
  onClose?: () => void;
};

export default function SchoolDetailsComponent({ school, onClose }: Props) {
  const {
    category,
    name,
    curriculumType,
    duration,
    totalFees,
    estDate,
    mode,
    timing,
    about,
    operationalDays,
    additionalFeatures,
    facilities,
    image,
    bannerImage,
    bannerText,
  } = school;

  const getCategorySpecificFeatures = (cat: string) => {
    switch (cat) {
      case 'UG/PG':
        return [
          { icon: 'briefcase', label: 'Placements', value: '361 x 261' },
          { icon: 'id-card', label: 'Resume', value: 'Yes' },
          { icon: 'logo-linkedin', label: 'Linkedin', value: 'Yes' },
          { icon: 'mic', label: 'Mock Interviews', value: 'Yes' },
        ];
      case 'Coaching Centre':
        return [
          { icon: 'wifi', label: 'Access to executive jobs', value: 'Yes' },
          { icon: 'briefcase', label: 'Placements', value: '361 x 261' },
        ];
      case 'Study Hall':
        return [{ icon: 'lock-closed', label: 'Personal Lockers', value: 'Yes' }];
      case 'Tuition Centre':
        return [
          { icon: 'id-card', label: 'Resume', value: 'Yes' },
          { icon: 'logo-linkedin', label: 'Linkedin', value: 'Yes' },
          { icon: 'mic', label: 'Mock', value: 'Yes' },
        ];
      case 'Study Abroad':
        return [
          { icon: 'briefcase', label: 'Placements', value: 'Yes' },
          { icon: 'document', label: 'Application Assistance', value: 'Yes' },
          { icon: 'airplane', label: 'Visa Processing', value: 'Yes' },
          { icon: 'bed', label: 'Accommodation', value: 'Yes' },
        ];
      case 'Exam Preparation':
        return [
          { icon: 'book', label: 'Study Materials', value: 'Yes' },
          { icon: 'people', label: 'Class Size', value: 'Yes' },
          { icon: 'school', label: 'Study Room', value: 'Yes' },
          { icon: 'checkmark-circle', label: 'Mock Tests', value: 'Yes' },
        ];
      default:
        return additionalFeatures;
    }
  };

  const categoryFeatures = getCategorySpecificFeatures(category);

  return (
    <View className="flex-1 bg-[#EEF3FF] border-t border-gray-200"> {/* match Home screen bg */}
      <StatusBar hidden />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Close Button */}
        {onClose && (
          <TouchableOpacity onPress={onClose} className="absolute top-6 right-4 z-50 bg-white rounded-full p-2 shadow">
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        )}

        {/* Hero Image */}
        <View className="relative">
          <Image source={{ uri: image }} className="w-full h-[250px]" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="absolute bottom-0 left-0 right-0 h-[100px]"
          >
            <View className="px-4 py-3 flex-1 justify-end">
              <View className="flex-row items-center mb-1">
                <Image source={{ uri: 'https://via.placeholder.com/30x30/red/ffffff?text=B' }} className="w-6 h-6 rounded mr-2" />
                <Text className="font-montserrat-semibold text-white text-[14px] flex-1">{name}</Text>
                <Ionicons name="bookmark-outline" size={20} color="white" />
              </View>
              <Text className="font-montserrat-regular text-white text-[12px] mb-1">{about}</Text>
              <View className="flex-row justify-between">
                <Text className="font-montserrat-medium text-white text-[12px]">Total Fees {totalFees}</Text>
                <Text className="font-montserrat-medium text-white text-[12px]">Duration: {duration}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* School Info */}
        <View className="px-4 pt-4">
          {/* Category Badge */}
          <View className="bg-blue-100 rounded-full px-3 py-1 mb-2">
            <Text className="font-montserrat-medium text-blue-600 text-[12px]">{category}</Text>
          </View>

          {/* Name and Curriculum */}
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: 'https://via.placeholder.com/30x30/red/ffffff?text=B' }} className="w-6 h-6 rounded mr-2" />
            <Text className="font-montserrat-semibold text-black text-[18px] flex-1">{name}</Text>
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text className="font-montserrat-medium text-[12px] text-gray-600">{curriculumType}</Text>
            </View>
          </View>

          {/* Duration & Fees */}
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="gray" className="mr-1" />
              <Text className="font-montserrat-medium text-[14px] text-black">{duration}</Text>
            </View>
            <Text className="font-montserrat-semibold text-[16px] text-black">Total Fees {totalFees}</Text>
          </View>

          {/* Est & Timing */}
          <View className="flex-row justify-between mb-3">
            <Text className="font-montserrat-medium text-[14px] text-gray-600">{estDate}</Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="gray" className="mr-1" />
              <Text className="font-montserrat-medium text-[14px] text-black">{timing}</Text>
            </View>
          </View>

          {/* Mode */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="school-outline" size={16} color="gray" className="mr-2" />
            <Text className="font-montserrat-medium text-[14px] text-black">{mode}</Text>
          </View>

          {/* About */}
          <Text className="font-montserrat-regular text-[14px] text-gray-700 mb-4 leading-5">{about}</Text>

          {/* Buttons */}
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity className="flex-1 bg-blue-50 border border-blue-200 rounded-full py-3 px-4 mr-2">
              <Text className="font-montserrat-semibold text-blue-600 text-center text-[14px]">Request a Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-[#007AFF] rounded-full py-3 px-4 ml-2">
              <Text className="font-montserrat-semibold text-white text-center text-[14px]">Book Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Operational Days */}
          <View className="mb-4">
            <Text className="font-montserrat-semibold text-[16px] text-black mb-2">Operational Days</Text>
            <View className="flex-row justify-around">
              {operationalDays.map((day, index) => (
                <TouchableOpacity key={index} className="bg-blue-50 rounded-full py-2 px-4">
                  <Text className="font-montserrat-medium text-blue-600 text-[12px]">{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Features */}
          <View className="mb-4">
            <Text className="font-montserrat-semibold text-[16px] text-black mb-3">Additional Features of Institute</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {categoryFeatures.map((feature, index) => (
                <View key={index} className="bg-gray-50 rounded-lg p-3 mr-2 min-w-[80px] items-center">
                  <Ionicons name={feature.icon as any} size={20} color="#007AFF" className="mb-1" />
                  <Text className="font-montserrat-regular text-[10px] text-center text-gray-600 mb-1">{feature.label}</Text>
                  <Text className="font-montserrat-semibold text-[12px] text-black">{feature.value}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Facilities */}
          <View className="mb-6">
            <Text className="font-montserrat-semibold text-[16px] text-black mb-3">Facilities</Text>
            <View className="flex-row flex-wrap justify-between">
              {facilities.map((facility, index) => (
                <View key={index} className="w-[48%] bg-gray-50 rounded-lg p-3 mb-2 items-center">
                  <Ionicons name={facility.icon as any} size={24} color="#007AFF" className="mb-1" />
                  <Text className="font-montserrat-regular text-[12px] text-center text-gray-600 mb-1">{facility.label}</Text>
                  <Text className="font-montserrat-semibold text-[12px] text-green-600">{facility.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Banner */}
          <View className="relative mb-2">
            <Image source={{ uri: bannerImage }} className="w-full h-[150px] rounded-lg" />
            <LinearGradient
              colors={['rgba(255, 193, 7, 0.8)', 'rgba(255, 152, 0, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute inset-0 rounded-lg justify-center items-center"
            >
              <Text className="font-montserrat-bold text-white text-[18px] text-center px-4">{bannerText}</Text>
            </LinearGradient>
          </View>

          {/* Show More */}
          <TouchableOpacity className="bg-gray-100 rounded-full py-3 px-6 mb-4">
            <Text className="font-montserrat-semibold text-center text-[16px] text-gray-700">Show More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

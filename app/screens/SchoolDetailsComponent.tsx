// app/components/SchoolDetailsComponent.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Course = {
  id: string;
  name: string;
  description: string;
  fees: string;
  duration: string;
  image: string;
  logo: string;
  mode: string;
  wishlisted: boolean;
  instituteType: string;
  location: string;
  apiData: any;
};

type Props = {
  school: Course;
  onClose?: () => void;
};

export default function SchoolDetailsComponent({ school, onClose }: Props) {
  const router = useRouter();
  const {
    id,
    name,
    description,
    fees,
    duration,
    image,
    logo,
    mode,
    wishlisted,
    instituteType,
    location,
    apiData,
  } = school;

  const institution = apiData?.institution ?? {};
  const instituteName = institution.instituteName ?? name;
  const instituteLogo = institution.instituteLogo ?? logo;
  const about = apiData?.aboutCourse ?? description;
  const totalFees =
    apiData?.priceOfCourse != null
      ? `₹${apiData.priceOfCourse.toLocaleString()}`
      : fees;
  const courseDuration = apiData?.courseDuration ?? duration;
  const courseMode = apiData?.mode ?? mode;
  const courseLocation = apiData?.location ?? location ?? 'Location not available';
  const estDate = apiData?.establishedYear
    ? `Est. ${apiData.establishedYear}`
    : 'Est. N/A';
  const timing = apiData?.operatingHours ?? 'N/A';

  const operationalDays: string[] =
    apiData?.operationalDays ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const facilities =
    apiData?.facilities?.map((f: string) => ({
      icon: 'checkmark-circle' as const,
      label: f,
      value: 'Yes',
    })) ?? [
      { icon: 'wifi', label: 'Wi-Fi', value: 'Yes' },
      { icon: 'car', label: 'Parking', value: 'Yes' },
      { icon: 'cafe', label: 'Cafeteria', value: 'Yes' },
    ];

  const getCategoryFeatures = (type: string) => {
    switch (type) {
      case 'Graduation':
      case 'UG/PG':
        return [
          { icon: 'briefcase', label: 'Placements', value: 'Yes' },
          { icon: 'id-card', label: 'Resume Help', value: 'Yes' },
          { icon: 'logo-linkedin', label: 'LinkedIn', value: 'Yes' },
          { icon: 'mic', label: 'Mock Interviews', value: 'Yes' },
        ];
      case 'Coaching Centre':
        return [
          { icon: 'wifi', label: 'Job Access', value: 'Yes' },
          { icon: 'briefcase', label: 'Placements', value: 'Yes' },
        ];
      case 'Study Hall':
        return [{ icon: 'lock-closed', label: 'Personal Lockers', value: 'Yes' }];
      case 'Tuition Centre':
        return [
          { icon: 'id-card', label: 'Resume', value: 'Yes' },
          { icon: 'logo-linkedin', label: 'LinkedIn', value: 'Yes' },
          { icon: 'mic', label: 'Mock Tests', value: 'Yes' },
        ];
      case 'Study Abroad':
        return [
          { icon: 'briefcase', label: 'Placements', value: 'Yes' },
          { icon: 'document', label: 'Applications', value: 'Yes' },
          { icon: 'airplane', label: 'Visa', value: 'Yes' },
          { icon: 'bed', label: 'Accommodation', value: 'Yes' },
        ];
      case 'Exam Preparation':
        return [
          { icon: 'book', label: 'Study Materials', value: 'Yes' },
          { icon: 'people', label: 'Small Batches', value: 'Yes' },
          { icon: 'school', label: 'Study Room', value: 'Yes' },
          { icon: 'checkmark-circle', label: 'Mock Tests', value: 'Yes' },
        ];
      default:
        return [
          { icon: 'star', label: 'Certified', value: 'Yes' },
          { icon: 'shield-checkmark', label: 'Safe', value: 'Yes' },
        ];
    }
  };
  const categoryFeatures = getCategoryFeatures(instituteType);

  const bannerImage = apiData?.bannerImage ?? image;
  const bannerText = apiData?.bannerText ?? 'Limited Seats Available!';

  const toggleWishlist = async () => {
    try {
      const saved = await AsyncStorage.getItem('wishlistedCourses');
      const ids = saved ? new Set(JSON.parse(saved)) : new Set();

      if (ids.has(id)) ids.delete(id);
      else ids.add(id);

      await AsyncStorage.setItem('wishlistedCourses', JSON.stringify(Array.from(ids)));

      Alert.alert('Wishlist', ids.has(id) ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (e) {
      console.error(e);
    }
  };

  const isModal = !!onClose;

  return (
    <View className={`flex-1 ${isModal ? 'bg-[#EEF3FF]' : 'bg-white'}`}>
      {isModal && <StatusBar hidden />}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {isModal ? (
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-6 right-4 z-50 bg-white rounded-full p-2 shadow"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-xl font-montserrat-semibold">Course Details</Text>
          </View>
        )}

        {/* Hero */}
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
                <Image source={{ uri: instituteLogo }} className="w-6 h-6 rounded mr-2" />
                <Text className="font-montserrat-semibold text-white text-[14px] flex-1">
                  {instituteName}
                </Text>
                <TouchableOpacity onPress={toggleWishlist}>
                  <Ionicons
                    name={wishlisted ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <Text className="font-montserrat-regular text-white text-[12px] mb-UC1">
                {about}
              </Text>
              <View className="flex-row justify-between">
                <Text className="font-montserrat-medium text-white text-[12px]">
                  Total Fees {totalFees}
                </Text>
                <Text className="font-montserrat-medium text-white text-[12px]">
                  Duration: {courseDuration}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content */}
        <View className="px-4 pt-4">
          <View className="bg-blue-100 rounded-full px-3 py-1 mb-2 self-start">
            <Text className="font-montserrat-medium text-blue-600 text-[12px]">
              {instituteType}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Image source={{ uri: instituteLogo }} className="w-6 h-6 rounded mr-2" />
            <Text className="font-montserrat-semibold text-black text-[18px] flex-1">
              {instituteName}
            </Text>
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text className="font-montserrat-medium text-[12px] text-gray-600">
                {apiData?.boardType ?? 'CBSE'}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text className="ml-1 font-montserrat-medium text-[14px] text-black">
                {courseDuration}
              </Text>
            </View>
            <Text className="font-montserrat-semibold text-[16px] text-black">
              Total Fees {totalFees}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="font-montserrat-medium text-[14px] text-gray-600">
              {estDate}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text className="ml-1 font-montserrat-medium text-[14px] text-black">
                {timing}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={16} color="gray" />
            <Text className="ml-2 font-montserrat-medium text-[14px] text-black">
              {courseLocation}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="school-outline" size={16} color="gray" />
            <Text className="ml-2 font-montserrat-medium text-[14px] text-black">
              {courseMode}
            </Text>
          </View>

          <Text className="font-montserrat-regular text-[14px] text-gray-700 mb-4 leading-5">
            {about}
          </Text>

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity className="flex-1 bg-blue-50 border border-blue-200 rounded-full py-3 px-4 mr-2">
              <Text className="font-montserrat-semibold text-blue-600 text-center text-[14px]">
                Request a Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-[#007AFF] rounded-full py-3 px-4 ml-2">
              <Text className="font-montserrat-semibold text-white text-center text-[14px]">
                Book Demo
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="font-montserrat-semibold text-[16px] text-black mb-2">
              Operational Days
            </Text>
            <View className="flex-row flex-wrap justify-center">
              {operationalDays.map((day, i) => (
                <View key={i} className="bg-blue-50 rounded-full py-2 px-4 m-1">
                  <Text className="font-montserrat-medium text-blue-600 text-[12px]">
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="font-montserrat-semibold text-[16px] text-black mb-3">
              Additional Features
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {categoryFeatures.map((f, i) => (
                <View key={i} className="bg-gray-50 rounded-lg p-3 mr-2 min-w-[80px] items-center">
                  <Ionicons name={f.icon as any} size={20} color="#007AFF" className="mb-1" />
                  <Text className="font-montserrat-regular text-[10px] text-center text-gray-600 mb-1">
                    {f.label}
                  </Text>
                  <Text className="font-montserrat-semibold text-[12px] text-black">
                    {f.value}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className="mb-6">
            <Text className="font-montserrat-semibold text-[16px] text-black mb-3">
              Facilities
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {facilities.map((f, i) => (
                <View key={i} className="w-[48%] bg-gray-50 rounded-lg p-3 mb-2 items-center">
                  <Ionicons name={f.icon as any} size={24} color="#007AFF" className="mb-1" />
                  <Text className="font-montserrat-regular text-[12px] text-center text-gray-600 mb-1">
                    {f.label}
                  </Text>
                  <Text className="font-montserrat-semibold text-[12px] text-green-600">
                    {f.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="relative mb-2">
            <Image source={{ uri: bannerImage }} className="w-full h-[150px] rounded-lg" />
            <LinearGradient
              colors={['rgba(255,193,7,0.8)', 'rgba(255,152,0,0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute inset-0 rounded-lg justify-center items-center"
            >
              <Text className="font-montserrat-bold text-white text-[18px] text-center px-4">
                {bannerText}
              </Text>
            </LinearGradient>
          </View>

          <TouchableOpacity className="bg-gray-100 rounded-full py-3 px-6 mb-4">
            <Text className="font-montserrat-semibold text-center text-[16px] text-gray-700">
              Show More
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
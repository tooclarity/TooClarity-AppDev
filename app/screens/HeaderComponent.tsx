// app/screens/Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type School = {
  id: string;
  name: string;
  location: string;
  description: string;
  fees: string;
  duration: string;
  image: string;
  logo: string;
  category: string;
  curriculumType: string;
  estDate: string;
  timing: string;
  about: string;
  operationalDays: string[];
  additionalFeatures: Array<{ icon: string; label: string; value: string }>;
  facilities: Array<{ icon: string; label: string; value: string }>;
  bannerImage: string;
  bannerText: string;
};

type HeaderProps = {
  user: any;
  profilePic: string | null;
  getInitials: (name: string) => string;
  selectedSchool: School | null;
  showFilters: boolean;
};

const Header: React.FC<HeaderProps> = ({ user, profilePic, getInitials, selectedSchool, showFilters }) => {
  const router = useRouter();

  if (selectedSchool || showFilters) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity onPress={() => router.push('/screens/profilesetup')} className="mr-3">
          {profilePic || user?.profilePicture ? (
            <Image
              source={{ uri: profilePic || user?.profilePicture }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-[#0A46E4] justify-center items-center">
              <Text className="text-white font-Montserrat-semibold text-lg">
                {getInitials(user?.name)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <View>
          <Text className="font-Montserrat-regular text-[14px] text-gray-500">
            Welcome back
          </Text>
          <Text className="font-Montserrat-semibold text-[18px] text-black">
            {user?.name || 'User'} 👋
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => router.push('/screens/notifications')}
          className="w-14 h-14 items-center justify-center bg-white rounded-full shadow-sm"
        >
          <Ionicons name="notifications-outline" size={26} color="#1e1e1e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
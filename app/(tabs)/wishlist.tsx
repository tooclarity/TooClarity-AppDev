import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../types/authStore';
import Header from '../screens/HeaderComponent';
import SearchBar from '../screens/globalsearchbarcomponent';
import EmptyWishlistImage from '../../assets/images/emptywishlistimage.png';

export default function WishlistScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showPicAlert, setShowPicAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  const fetchProfileInline = useCallback(async () => {
    try {
      const d = { profilePicture: null }; // Replace with API data
      return { profilePicture: d.profilePicture };
    } catch {
      console.log('Failed to load profile');
      return {};
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      await refreshUser();
      const { profilePicture } = await fetchProfileInline();
      if (profilePicture) setProfilePic(profilePicture);
      else if (!hasShownAlert) {
        setShowPicAlert(true);
        setHasShownAlert(true);
      }
      setLoading(false);
    };
    init();
  }, [user?.id, refreshUser, fetchProfileInline, hasShownAlert]);

  useEffect(() => {
    if (showPicAlert) {
      Alert.alert('Profile Picture Missing', "Update your profile pic, it's missing!", [
        { text: 'OK', style: 'default' },
        { text: 'Edit Profile', onPress: () => router.push('/screens/profilesetup') },
      ]);
      setShowPicAlert(false);
    }
  }, [showPicAlert, router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F5FF]">
        <ActivityIndicator size="large" color="#0A46E4" />
        <Text className="mt-4 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View className="flex-1 bg-[#F5F5FF]">
        {/* Gradient background (top-to-bottom) */}
        <LinearGradient
          colors={['#A8B5FF', '#F5F5FF']}
          className="absolute inset-0"
          pointerEvents="none"
        />

        <SafeAreaView className="flex-1 px-4 pt-12">
          {/* Header */}
          <Header
            user={user}
            profilePic={profilePic}
            getInitials={getInitials}
            selectedSchool={null}
            showFilters={false}
          />

          {/* SEARCH BAR */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilter={false}
          />

          {/* Empty Wishlist Section */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
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
                className="bg-[#0222D7] py-4 px-12 rounded-full"
                onPress={() => router.push('/(tabs)/home')}
                activeOpacity={0.8}
              >
                <Text className="font-montserrat-semibold text-white text-center text-base">
                  Back to home
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}
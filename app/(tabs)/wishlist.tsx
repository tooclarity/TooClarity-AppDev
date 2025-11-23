// app/screens/WishlistScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../types/authStore';
import Header from '../screens/HeaderComponent';
import SearchBar from '../screens/globalsearchbarcomponent';
import EmptyWishlistImage from '../../assets/images/emptywishlistimage.png';

// ----------------------------------------------------------------------
// 1. HELPERS & TRANSFORM LOGIC
// ----------------------------------------------------------------------
const API_BASE_URL = 'https://tooclarity.onrender.com/api';

const getPriceRange = (price: number): string => {
  if (price < 75000) return "Below ₹75,000";
  if (price <= 150000) return "₹75,000 - ₹1,50,000";
  if (price <= 300000) return "₹1,50,000 - ₹3,00,000";
  return "Above ₹3,00,000";
};

const transformCourse = (apiCourse: any) => {
  if (!apiCourse) return null;

  const modeMap: Record<string, string> = {
    "Offline": "Offline",
    "Online": "Online",
    "Hybrid": "Hybrid",
  };

  const price = apiCourse.priceOfCourse || 0;
  
  return {
    id: apiCourse._id || apiCourse.id || "",
    title: apiCourse.courseName || "Untitled Course",
    institution: apiCourse.institution?.instituteName || "Unknown Institution",
    image: apiCourse.imageUrl || "https://via.placeholder.com/400x250",
    rating: apiCourse.rating || 4.5,
    reviews: apiCourse.reviews || 0,
    students: apiCourse.studentsEnrolled || 0,
    price: price,
    priceFormatted: `₹${price.toLocaleString()}`,
    level: apiCourse.level || "Lower kindergarten",
    mode: modeMap[apiCourse.mode || "Online"] || apiCourse.mode || "Online",
    wishlisted: true, // It is wishlisted by definition in this screen
    location: apiCourse.location || apiCourse.institution?.instituteName || "",
    
    // Filtering Fields
    ageGroup: apiCourse.ageGroup || "3 - 4 Yrs", 
    programDuration: apiCourse.programDuration || apiCourse.courseDuration || "Academic Year",
    priceRange: getPriceRange(price),
    instituteType: apiCourse.institution?.instituteType || "Kindergarten", 
    
    // Store original API data for Details Page
    apiData: apiCourse, 
  };
};

export default function WishlistScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wishlistCourses, setWishlistCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const getInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  // ----------------------------------------------------------------------
  // 2. FETCH DATA (User Specific)
  // ----------------------------------------------------------------------
  const fetchWishlistData = useCallback(async () => {
    // Wait for user to be loaded
    if (!user?.id) {
        setLoading(false);
        return;
    }

    try {
      setLoading(true);

      // 1. Get IDs from Local Storage using USER SPECIFIC KEY
      const storageKey = `wishlistedCourses_${user.id}`;
      const savedIdsString = await AsyncStorage.getItem(storageKey);
      const savedIds = savedIdsString ? JSON.parse(savedIdsString) : [];

      if (savedIds.length === 0) {
        setWishlistCourses([]);
        setFilteredCourses([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 2. Fetch All Courses from API
      const response = await fetch(`${API_BASE_URL}/v1/public/courses`);
      const json = await response.json();

      if (!json.success && !Array.isArray(json.data)) {
        throw new Error("Failed to fetch courses");
      }

      const allCourses = Array.isArray(json.data) ? json.data : (json.items || []);

      // 3. Filter & Transform
      // Keep only courses that are in the savedIds array
      const wishlistedItems = allCourses
        .filter((c: any) => savedIds.includes(c._id || c.id))
        .map((c: any) => transformCourse(c))
        .filter(Boolean);

      setWishlistCourses(wishlistedItems);
      setFilteredCourses(wishlistedItems);

    } catch (error) {
      console.error("Wishlist Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]); // Dependency on user.id

  // Reload data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWishlistData();
      if (user?.profilePicture) setProfilePic(user.profilePicture);
    }, [fetchWishlistData, user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlistData();
  };

  // ----------------------------------------------------------------------
  // 3. ACTIONS
  // ----------------------------------------------------------------------
  
  // Remove item from wishlist
  const removeFromWishlist = async (id: string) => {
    if (!user?.id) return;

    try {
      // 1. Update UI immediately
      const updatedList = wishlistCourses.filter(item => item.id !== id);
      setWishlistCourses(updatedList);
      setFilteredCourses(updatedList); // Update filtered list too

      // 2. Update Storage using USER SPECIFIC KEY
      const storageKey = `wishlistedCourses_${user.id}`;
      const savedIdsString = await AsyncStorage.getItem(storageKey);
      let savedIds = savedIdsString ? JSON.parse(savedIdsString) : [];
      savedIds = savedIds.filter((savedId: string) => savedId !== id);
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(savedIds));
      
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Alert.alert("Error", "Could not remove item.");
    }
  };

  const navigateToDetails = (item: any) => {
    router.push({ 
        pathname: '/screens/SchoolDetailsComponent', 
        params: { courseData: JSON.stringify(item) } 
    });
  };

  // Filter based on Search Query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses(wishlistCourses);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = wishlistCourses.filter(
        c => c.title.toLowerCase().includes(q) || c.institution.toLowerCase().includes(q)
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, wishlistCourses]);


  // ----------------------------------------------------------------------
  // 4. RENDERERS
  // ----------------------------------------------------------------------

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8 pb-10 mt-10">
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
  );

  const renderCard = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-5 shadow-sm border border-gray-100 overflow-hidden mx-1">
      <View className="relative">
        <Image source={{ uri: item.image }} className="w-full h-44 bg-gray-200" resizeMode="cover" />
        <View className="absolute bottom-0 w-full bg-black/40 p-3 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            {item.apiData?.institution?.instituteLogo && (
               <Image source={{ uri: item.apiData.institution.instituteLogo }} className="w-6 h-6 rounded-full mr-2 border border-white" />
            )}
            <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.institution}</Text>
          </View>
          
          {/* Remove Button */}
          <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
            <Ionicons name="bookmark" size={22} color="#0222D7" /> 
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="font-bold text-lg text-gray-800 mb-1">{item.title}</Text>
        <Text className="text-xs text-gray-500 mb-3" numberOfLines={2}>{item.apiData?.aboutCourse || "No description available."}</Text>
        
        <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-blue-50 px-2 py-1 rounded-md"><Text className="text-blue-600 text-[10px] font-bold">{item.mode}</Text></View>
            <View className="bg-purple-50 px-2 py-1 rounded-md"><Text className="text-purple-600 text-[10px] font-bold">{item.priceFormatted}</Text></View>
        </View>

        <TouchableOpacity 
          className="bg-[#0222D7] py-3 rounded-xl"
          onPress={() => navigateToDetails(item)}
        >
          <Text className="text-white text-center font-bold">View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View className="flex-1 bg-[#F5F5FF]">
        <LinearGradient
          colors={['#A8B5FF', '#F5F5FF']}
          className="absolute inset-0 h-64"
          pointerEvents="none"
        />

        <SafeAreaView className="flex-1 px-4">
          {/* Header */}
          <Header
            user={user}
            profilePic={profilePic}
            getInitials={getInitials}
            selectedSchool={null}
            showFilters={false}
          />

          {/* Title */}
          <View className="mt-2 mb-2">
            <Text className="text-2xl font-bold text-gray-800">Your Wishlist</Text>
          </View>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilter={false}
          />

          {loading ? (
             <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0A46E4" />
             </View>
          ) : (
            <FlatList
              data={filteredCourses}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 10, flexGrow: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0222D7" />
              }
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </SafeAreaView>
      </View>
    </>
  );
}
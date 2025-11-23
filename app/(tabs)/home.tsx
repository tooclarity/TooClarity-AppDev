// // app/screens/HomeScreen.tsx
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   StatusBar,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   ToastAndroid,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../lib/auth-context';
// import { API_BASE_URL } from '../../utils/constant';
// import axios from 'axios';
// import debounce from 'lodash.debounce';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import PlaceholderProfile from '../../assets/images/placeholder-profile.png';

// const { width } = Dimensions.get('window');
// const isTablet = width >= 768;

// // ───────────────────────────────────────────────────────────────────────
// //  Types
// // ───────────────────────────────────────────────────────────────────────
// type School = {
//   id: string;
//   name: string;
//   location: string;
//   description: string;
//   fees: string;
//   duration: string;
//   image: string;
//   logo: string;
//   rating?: number;
//   reviews?: number;
//   students?: number;
//   level?: string;
//   mode?: string;
//   wishlisted?: boolean;
// };

// export default function HomeScreen() {
//   const router = useRouter();
//   const { user, refreshUser } = useAuth();

//   const [schools, setSchools] = useState<School[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [academicProfile, setAcademicProfile] = useState<any>(null);
//   const [profilePic, setProfilePic] = useState<string | null>(null);
//   const [showPicAlert, setShowPicAlert] = useState(false);
//   const [hasShownAlert, setHasShownAlert] = useState(false);
//   const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

//   // ───────────────────────────────────────────────────────────────────────
//   //  Helper: initials
//   // ───────────────────────────────────────────────────────────────────────
//   const getInitials = (name: string) =>
//     name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);

//   // ───────────────────────────────────────────────────────────────────────
//   //  Load wishlist from AsyncStorage
//   // ───────────────────────────────────────────────────────────────────────
//   const loadWishlist = async () => {
//     try {
//       const json = await AsyncStorage.getItem('wishlist');
//       if (json) setWishlistedIds(new Set(JSON.parse(json)));
//     } catch (e) {
//       console.warn('Failed to load wishlist', e);
//     }
//   };

//   const saveWishlist = async (ids: Set<string>) => {
//     try {
//       await AsyncStorage.setItem('wishlist', JSON.stringify([...ids]));
//     } catch (e) {
//       console.warn('Failed to save wishlist', e);
//     }
//   };

//   // ───────────────────────────────────────────────────────────────────────
//   //  Fetch profile (picture + academicProfile)
//   // ───────────────────────────────────────────────────────────────────────
//   const fetchProfileInline = useCallback(async () => {
//     try {
//       console.log('Fetching profile...');
//       const { data } = await axios.get(`${API_BASE_URL}/api/v1/profile`, {
//         withCredentials: true,
//       });
//       const d = data?.data || data;
//       console.log('Profile fetched:', d);
//       return {
//         profilePicture: d?.profilePicture || d?.ProfilePicutre,
//         academicProfile: d?.academicProfile,
//       };
//     } catch (e: any) {
//       console.error('Profile fetch error:', e?.response?.data || e);
//       ToastAndroid.show('Failed to load profile', ToastAndroid.SHORT);
//       return {};
//     }
//   }, []);

//   // ───────────────────────────────────────────────────────────────────────
//   //  Fetch institutes – **ALWAYS logs**
//   // ───────────────────────────────────────────────────────────────────────
//   const fetchInstitutes = useCallback(
//     async (query: string, profileType: string) => {
//       setLoading(true);
//       const url = `${API_BASE_URL}/api/v1/institutes`;
//       const params = {
//         search: query || undefined,
//         type: profileType,
//         limit: 20,
//       };
//       console.log('Fetching institutes →', { url, params });

//       try {
//         const { data } = await axios.get(url, {
//           params,
//           withCredentials: true,
//         });

//         console.log('Institutes raw response:', data);

//         const institutes: School[] = (data?.data || []).map((i: any) => ({
//           id: i._id || i.id,
//           name: i.instituteName || i.name || 'Unnamed',
//           location: i.address || i.location || 'Unknown',
//           description: i.about || i.description || '',
//           fees: i.priceOfCourse ? `₹${i.priceOfCourse}` : '₹0',
//           duration: i.courseDuration || '1 year',
//           image: i.image || i.brochure || '',
//           logo:
//             i.logo ||
//             `https://via.placeholder.com/30x30/${Math.random()
//               .toString(16)
//               .slice(-6)}/fff?text=${(i.instituteName || i.name)
//               .charAt(0)
//               .toUpperCase()}`,
//           rating: i.rating ?? 4.5,
//           reviews: i.reviews ?? 0,
//           students: i.studentsEnrolled ?? 0,
//           level: i.level || 'Primary',
//           mode: i.mode || 'Offline',
//           wishlisted: wishlistedIds.has(i._id || i.id),
//         }));

//         console.log(`Fetched ${institutes.length} institutes`);
//         setSchools(institutes);
//       } catch (e: any) {
//         console.error('Institutes fetch error:', e?.response?.data || e);
//         setSchools([]);
//         const msg =
//           e?.response?.status === 404
//             ? 'No institutes found for this profile.'
//             : 'Failed to load recommendations.';
//         ToastAndroid.show(msg, ToastAndroid.LONG);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [wishlistedIds]
//   );

//   // ───────────────────────────────────────────────────────────────────────
//   //  Debounced search
//   // ───────────────────────────────────────────────────────────────────────
//   const debouncedFetch = useMemo(
//     () =>
//       debounce((q: string, type: string) => {
//         console.log('Debounced search:', q);
//         fetchInstitutes(q, type);
//       }, 600),
//     [fetchInstitutes]
//   );

//   // ───────────────────────────────────────────────────────────────────────
//   //  On mount – load everything
//   // ───────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       if (!user?.id) {
//         console.log('No logged-in user → skip fetch');
//         setLoading(false);
//         return;
//       }

//       await loadWishlist();
//       await refreshUser();

//       const { profilePicture, academicProfile } = await fetchProfileInline();

//       setAcademicProfile(academicProfile);
//       if (profilePicture) setProfilePic(profilePicture);
//       else if (!hasShownAlert) {
//         setShowPicAlert(true);
//         setHasShownAlert(true);
//       }

//       // ── Map profile type → backend string ──
//       const typeMap: Record<string, string> = {
//         KINDERGARTEN: 'Kindergarten/childcare center',
//         SCHOOL: "School's",
//         INTERMEDIATE: 'Intermediate college(K12)',
//         GRADUATION: 'Under Graduation/Post Graduation',
//         COACHING_CENTER: 'Coaching centers',
//         STUDY_HALLS: 'Study Halls',
//         TUITION_CENTER: "Tution Center's",
//         STUDY_ABROAD: 'Study Abroad',
//       };
//       const backendType =
//         typeMap[academicProfile?.profileType || 'SCHOOL'] || 'SCHOOL';

//       console.log('Initial fetch with type:', backendType);
//       await fetchInstitutes('', backendType);
//     };

//     init();
//     return () => debouncedFetch.cancel();
//   }, [
//     user?.id,
//     refreshUser,
//     fetchProfileInline,
//     debouncedFetch,
//     hasShownAlert,
//   ]);

//   // ───────────────────────────────────────────────────────────────────────
//   //  Profile-pic missing alert
//   // ───────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (showPicAlert) {
//       Alert.alert(
//         'Profile Picture Missing',
//         "Update your profile pic, it's missing!",
//         [
//           { text: 'OK', style: 'default' },
//           {
//             text: 'Edit Profile',
//             onPress: () => router.push('/screens/profile-setup'),
//           },
//         ]
//       );
//       setShowPicAlert(false);
//     }
//   }, [showPicAlert, router]);

//   // ───────────────────────────────────────────────────────────────────────
//   //  Search handler
//   // ───────────────────────────────────────────────────────────────────────
//   const handleSearch = useCallback(
//     (txt: string) => {
//       setSearchQuery(txt);
//       const typeMap: Record<string, string> = {
//         KINDERGARTEN: 'Kindergarten/childcare center',
//         SCHOOL: "School's",
//         INTERMEDIATE: 'Intermediate college(K12)',
//         GRADUATION: 'Under Graduation/Post Graduation',
//         COACHING_CENTER: 'Coaching centers',
//         STUDY_HALLS: 'Study Halls',
//         TUITION_CENTER: "Tution Center's",
//         STUDY_ABROAD: 'Study Abroad',
//       };
//       const type =
//         typeMap[(user as any)?.academicProfile?.profileType || 'SCHOOL'] ||
//         'SCHOOL';
//       debouncedFetch(txt, type);
//     },
//     [user, debouncedFetch]
//   );

//   // ───────────────────────────────────────────────────────────────────────
//   //  Wishlist toggle + persistence
//   // ───────────────────────────────────────────────────────────────────────
//   const toggleWishlist = async (id: string) => {
//     const newSet = new Set(wishlistedIds);
//     if (newSet.has(id)) newSet.delete(id);
//     else newSet.add(id);
//     setWishlistedIds(newSet);
//     await saveWishlist(newSet);

//     setSchools((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, wishlisted: !s.wishlisted } : s))
//     );
//   };

//   // ───────────────────────────────────────────────────────────────────────
//   //  Loading UI
//   // ───────────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-[#F5F5FF]">
//         <ActivityIndicator size="large" color="#0A46E4" />
//         <Text className="mt-4 text-gray-600">Loading recommendations...</Text>
//       </View>
//     );
//   }

//   // ───────────────────────────────────────────────────────────────────────
//   //  Main UI
//   // ───────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <StatusBar hidden />
//       <View className="flex-1 bg-[#F5F5FF] px-4 pt-12">
//         {/* ==================== HEADER ==================== */}
//         <View className="flex-row items-center justify-between mb-6">
//           <View className="flex-row items-center flex-1">
//             <TouchableOpacity
//               onPress={() => router.push('/screens/profile-setup')}
//               className="mr-3"
//             >
//               {profilePic || user?.profilePicture ? (
//                 <Image
//                   source={{ uri: profilePic || user?.profilePicture }}
//                   className="w-12 h-12 rounded-full"
//                 />
//               ) : (
//                 <View className="w-12 h-12 rounded-full bg-[#0A46E4] justify-center items-center">
//                   <Text className="text-white font-Montserrat-semibold text-lg">
//                     {getInitials(user?.name || 'User')}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>

//             <View>
//               <Text className="font-Montserrat-regular text-[14px] text-gray-500">
//                 Welcome back
//               </Text>
//               <Text className="font-Montserrat-semibold text-[18px] text-black">
//                 {user?.name || 'User'} Wave
//               </Text>
//             </View>
//           </View>

//           <View className="flex-row gap-3">
//             <TouchableOpacity
//               onPress={() => router.push('/screens/notifications')}
//               className="w-12 h-12 items-center justify-center bg-white rounded-full shadow-sm"
//             >
//               <Ionicons name="notifications-outline" size={24} color="#1e1e1e" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => router.push('/screens/wishlist')}
//               className="w-12 h-12 items-center justify-center bg-white rounded-full shadow-sm"
//             >
//               <Ionicons name="heart-outline" size={24} color="#1e1e1e" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ==================== SEARCH BAR ==================== */}
//         <View className="flex-row items-center bg-white rounded-full px-5 py-3 mb-6 shadow-sm">
//           <Ionicons name="search" size={20} color="#9CA3AF" />
//           <TextInput
//             placeholder="Search courses"
//             className="flex-1 ml-3 font-Montserrat-regular text-[16px] text-black"
//             placeholderTextColor="#9CA3AF"
//             value={searchQuery}
//             onChangeText={handleSearch}
//           />
//           <TouchableOpacity onPress={() => router.push('/screens/filters')}>
//             <Ionicons name="options" size={20} color="#0222D7" />
//           </TouchableOpacity>
//         </View>

//         {/* ==================== PERSONALIZED TEXT ==================== */}
//         {academicProfile && (
//           <Text className="text-[16px] font-semibold text-[#111827] mb-4">
//             Recommended for your{' '}
//             {academicProfile.profileType?.toLowerCase() || 'school'} profile
//           </Text>
//         )}

//         {/* ==================== COURSE GRID / EMPTY STATE ==================== */}
//         {schools.length === 0 ? (
//           <View className="flex-1 justify-center items-center px-6">
//             <Ionicons name="school-outline" size={64} color="#9CA3AF" />
//             <Text className="mt-4 text-lg font-Montserrat-semibold text-gray-700 text-center">
//               No recommendations yet
//             </Text>
//             <Text className="mt-2 text-sm text-gray-500 text-center">
//               Try searching or check back later.
//             </Text>
//           </View>
//         ) : (
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 flexWrap: 'wrap',
//                 justifyContent: 'space-between',
//                 paddingBottom: 20,
//               }}
//             >
//               {schools.map((school) => (
//                 <CourseCard
//                   key={school.id}
//                   school={school}
//                   onWishlistToggle={toggleWishlist}
//                   onPress={() =>
//                     router.push({
//                       pathname: '/school-details',
//                       params: { id: school.id },
//                     })
//                   }
//                 />
//               ))}
//             </View>
//           </ScrollView>
//         )}
//       </View>
//     </>
//   );
// }

// /* =====================================================================
//    COURSE CARD COMPONENT
//    ===================================================================== */
// type CourseCardProps = {
//   school: School;
//   onWishlistToggle: (id: string) => void;
//   onPress: () => void;
// };

// const CourseCard: React.FC<CourseCardProps> = ({
//   school,
//   onWishlistToggle,
//   onPress,
// }) => {
//   const cardWidth = isTablet ? (width - 48) / 2 : width - 32;

//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={onPress}
//       style={{ width: cardWidth, marginBottom: 16 }}
//       className="bg-white rounded-xl overflow-hidden shadow-sm"
//     >
//       {/* Image + Badge + Wishlist */}
//       <View className="relative">
//         <Image
//           source={{ uri: school.image || 'https://via.placeholder.com/400x250?text=No+Image' }}
//           style={{ width: '100%', height: 170 }}
//           resizeMode="cover"
//         />
//         {/* Level badge */}
//         <View className="absolute top-2 left-2 bg-[#0222D7] px-2 py-1 rounded-md">
//           <Text className="text-white text-xs font-Montserrat-semibold">
//             {school.level}
//           </Text>
//         </View>

//         {/* Wishlist */}
//         <TouchableOpacity
//           onPress={(e) => {
//             e.stopPropagation();
//             onWishlistToggle(school.id);
//           }}
//           className="absolute top-2 right-2 w-9 h-9 bg-white/90 rounded-full items-center justify-center"
//         >
//           <Ionicons
//             name={school.wishlisted ? 'heart' : 'heart-outline'}
//             size={20}
//             color={school.wishlisted ? '#EF4444' : '#1e1e1e'}
//           />
//         </TouchableOpacity>

//         {/* Logo overlay */}
//         <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 flex-row items-center">
//           <Image source={{ uri: school.logo }} className="w-7 h-7 rounded mr-2" />
//           <Text className="text-white font-Montserrat-semibold flex-1 text-sm">
//             {school.name}
//           </Text>
//         </View>
//       </View>

//       {/* Content */}
//       <View className="p-3">
//         <View className="flex-row items-center mb-1">
//           <Ionicons name="location-sharp" size={12} color="#6B7280" />
//           <Text className="ml-1 text-xs text-gray-600">{school.location}</Text>
//         </View>

//         <Text numberOfLines={2} className="text-gray-700 text-xs mb-2 leading-4">
//           {school.description}
//         </Text>

//         <View className="flex-row items-center mb-2">
//           <Text className="text-yellow-500 mr-1">***** </Text>
//           <Text className="font-Montserrat-semibold text-sm">{school.rating}</Text>
//           <Text className="text-gray-500 text-xs ml-1">({school.reviews} reviews)</Text>
//         </View>

//         <Text className="text-xs text-gray-500 mb-2">
//           {school.students?.toLocaleString()} students
//         </Text>

//         <View className="mb-2">
//           <Text className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full self-start">
//             {school.mode}
//           </Text>
//         </View>

//         <View className="flex-row justify-between items-center mt-2">
//           <View>
//             <Text className="text-xs text-gray-500">Total Fees</Text>
//             <Text className="font-Montserrat-semibold text-base">{school.fees}</Text>
//           </View>
//           <TouchableOpacity className="bg-[#0222D7] px-4 py-2 rounded-full">
//             <Text className="text-white font-Montserrat-semibold text-sm">
//               View Details
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };
// app/screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import FiltersComponent from '../screens/FiltersComponent';
import SearchBar from '../screens/globalsearchbarcomponent';
import Header from '../screens/HeaderComponent';
import { useAuth } from '../lib/auth-context';

// ----------------------------------------------------------------------
// 1. API & CONFIGURATION
// ----------------------------------------------------------------------
const API_BASE_URL = 'https://tooclarity.onrender.com/api';

// Price Range Helper
const getPriceRange = (price: number): string => {
  if (price < 75000) return "Below ₹75,000";
  if (price <= 150000) return "₹75,000 - ₹1,50,000";
  if (price <= 300000) return "₹1,50,000 - ₹3,00,000";
  return "Above ₹3,00,000";
};

// Data Transformation Logic
const transformCourse = (apiCourse: any, wishlisted: boolean) => {
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
    wishlisted, // <--- Correct status passed here
    location: apiCourse.location || apiCourse.institution?.instituteName || "",
    
    // --- Filtering Fields ---
    ageGroup: apiCourse.ageGroup || "3 - 4 Yrs", 
    programDuration: apiCourse.programDuration || apiCourse.courseDuration || "Academic Year",
    priceRange: getPriceRange(price),
    instituteType: apiCourse.institution?.instituteType || "Kindergarten", 
    boardType: apiCourse.boardType || "CBSE",
    graduationType: apiCourse.graduationType || "Under Graduation",
    streamType: apiCourse.streamType || "Engineering and Technology (B.E./B.Tech.)",
    educationType: apiCourse.educationType || "Full time",
    classSize: apiCourse.classSize,
    seatingType: apiCourse.seatingType,
    operatingHours: apiCourse.operatingHours,
    duration: apiCourse.duration,
    subjects: apiCourse.subjects,

    // Store original API data
    apiData: apiCourse, 
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // State
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const COURSES_PER_PAGE = 6;

  // Filters State
  const [activeFilters, setActiveFilters] = useState<any>({
    instituteType: "",
    kindergartenLevels: [],
    schoolLevels: [],
    modes: [],
    ageGroup: [],
    programDuration: [],
    priceRange: [],
    boardType: [],
    graduationType: [],
    streamType: [],
    educationType: [],
    classSize: [],
    seatingType: [],
    operatingHours: [],
    duration: [],
    subjects: [],
  });

  const getInitials = (name: string) => 
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  // ----------------------------------------------------------------------
  // 2. DATA FETCHING (User Specific)
  // ----------------------------------------------------------------------

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      
      // A. Fetch from Live API
      const response = await fetch(`${API_BASE_URL}/v1/public/courses`);
      const json = await response.json();
      
      if (!json.success && !Array.isArray(json.data)) {
        throw new Error(json.message || "Failed to fetch courses");
      }

      const apiData = Array.isArray(json.data) ? json.data : (json.items || []);

      // B. Get Wishlist from Storage (USER SPECIFIC)
      let wishlistSet = new Set();
      if (user?.id) {
        // 🔑 KEY CHANGE: Use specific user ID
        const storageKey = `wishlistedCourses_${user.id}`;
        const savedWishlist = await AsyncStorage.getItem(storageKey);
        if (savedWishlist) {
            wishlistSet = new Set(JSON.parse(savedWishlist));
        }
      }

      // C. Transform Data
      const transformed = apiData
        .map((c: any) => transformCourse(c, wishlistSet.has(c._id || c.id)))
        .filter(Boolean);

      setCourses(transformed);
      setFilteredCourses(transformed);
      setDisplayedCourses(transformed.slice(0, COURSES_PER_PAGE));
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      Alert.alert("Error", "Could not load courses. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]); // 🔑 KEY CHANGE: Re-run if user ID changes

  useEffect(() => {
    if (!authLoading) {
        fetchCourses();
    }
  }, [fetchCourses, authLoading]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // ----------------------------------------------------------------------
  // 3. FILTERING LOGIC
  // ----------------------------------------------------------------------

  const applyFilters = useCallback((query: string, filters: any, source: any[]) => {
    let result = source;

    // Search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((c) => 
        c.title.toLowerCase().includes(q) || 
        c.institution.toLowerCase().includes(q)
      );
    }

    // Institute Type
    if (filters.instituteType) {
      result = result.filter(c => c.instituteType === filters.instituteType);
    }

    // Dynamic Array Filters
    const filterMappings: Record<string, string> = {
        modes: 'mode',
        priceRange: 'priceRange',
        kindergartenLevels: 'level',
        schoolLevels: 'level',
        programDuration: 'programDuration',
        ageGroup: 'ageGroup',
        boardType: 'boardType',
        graduationType: 'graduationType',
        streamType: 'streamType',
        educationType: 'educationType',
        classSize: 'classSize',
        seatingType: 'seatingType',
        operatingHours: 'operatingHours',
        duration: 'duration',
        subjects: 'subjects'
    };

    Object.keys(filterMappings).forEach((filterKey) => {
        const courseKey = filterMappings[filterKey];
        const selectedOptions = filters[filterKey];

        if (selectedOptions && selectedOptions.length > 0) {
            result = result.filter((course) => {
                const courseValue = course[courseKey];
                if (Array.isArray(courseValue)) {
                    return courseValue.some((val: string) => selectedOptions.includes(val));
                } else {
                    return selectedOptions.includes(courseValue);
                }
            });
        }
    });
    
    setFilteredCourses(result);
    setDisplayedCourses(result.slice(0, COURSES_PER_PAGE));
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    applyFilters(searchQuery, activeFilters, courses);
  }, [searchQuery, activeFilters, courses, applyFilters]);

  const loadMore = () => {
    if (displayedCourses.length >= filteredCourses.length) return;
    const next = currentPage + 1;
    setDisplayedCourses(filteredCourses.slice(0, next * COURSES_PER_PAGE));
    setCurrentPage(next);
  };

  // ----------------------------------------------------------------------
  // 4. HANDLERS (User Specific)
  // ----------------------------------------------------------------------

  const handleWishlist = async (id: string) => {
    if (!user?.id) {
        Alert.alert("Login Required", "Please login to wishlist items.");
        return;
    }

    // 🔑 KEY CHANGE: Use specific user ID
    const storageKey = `wishlistedCourses_${user.id}`;
    
    try {
        const saved = await AsyncStorage.getItem(storageKey);
        let ids = saved ? JSON.parse(saved) : [];
        const exists = ids.includes(id);

        if (exists) ids = ids.filter((i: string) => i !== id);
        else ids.push(id);

        await AsyncStorage.setItem(storageKey, JSON.stringify(ids));

        // Update Local State instantly
        const updateList = (list: any[]) => list.map(c => c.id === id ? {...c, wishlisted: !exists} : c);
        setCourses(prev => updateList(prev));
        setFilteredCourses(prev => updateList(prev));
        setDisplayedCourses(prev => updateList(prev));
    } catch (error) {
        console.error("Failed to update wishlist", error);
    }
  };

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setActiveFilters((prev: any) => {
      const updated = { ...prev };
      if (type === 'instituteType') {
        updated.instituteType = checked ? value : "";
        if (checked) {
            Object.keys(updated).forEach(k => {
                if (Array.isArray(updated[k])) updated[k] = [];
            });
        }
      } else {
        const arr = updated[type] || [];
        if (checked) updated[type] = [...arr, value];
        else updated[type] = arr.filter((v: string) => v !== value);
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setActiveFilters({ instituteType: "", modes: [], priceRange: [], kindergartenLevels: [], schoolLevels: [], programDuration: [], ageGroup: [], boardType: [], graduationType: [], streamType: [], educationType: [], classSize: [], seatingType: [], operatingHours: [], duration: [], subjects: [] });
    setSearchQuery("");
  };

  const navigateToDetails = (item: any) => {
    router.push({ 
        pathname: '/screens/SchoolDetailsComponent', 
        params: { courseData: JSON.stringify(item) } 
    });
  };

  // ----------------------------------------------------------------------
  // 5. RENDER
  // ----------------------------------------------------------------------

  const renderCard = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl mb-5 shadow-sm border border-gray-100 overflow-hidden mx-1">
      <View className="relative">
        <Image source={{ uri: item.image }} className="w-full h-44 bg-gray-200" resizeMode="cover" />
        <View className="absolute bottom-0 w-full bg-black/40 p-3 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            {item.apiData?.institution?.instituteLogo ? (
               <Image source={{ uri: item.apiData.institution.instituteLogo }} className="w-6 h-6 rounded-full mr-2 border border-white" />
            ) : null}
            <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.institution}</Text>
          </View>
          <TouchableOpacity onPress={() => handleWishlist(item.id)}>
            <Ionicons name={item.wishlisted ? "bookmark" : "bookmark-outline"} size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="font-bold text-lg text-gray-800 mb-1">{item.title}</Text>
        <Text className="text-xs text-gray-500 mb-3" numberOfLines={2}>{item.apiData?.aboutCourse || "No description available."}</Text>
        
        <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-blue-50 px-2 py-1 rounded-md"><Text className="text-blue-600 text-[10px] font-bold">{item.mode}</Text></View>
            <View className="bg-purple-50 px-2 py-1 rounded-md"><Text className="text-purple-600 text-[10px] font-bold">{item.priceFormatted}</Text></View>
            {item.programDuration ? (
                <View className="bg-orange-50 px-2 py-1 rounded-md"><Text className="text-orange-600 text-[10px] font-bold">{item.programDuration}</Text></View>
            ) : null}
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

  if (authLoading) return <View className="flex-1 bg-white items-center justify-center"><ActivityIndicator color="#0222D7" /></View>;

  return (
    <View className="flex-1 bg-[#F5F5FF]">
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#A8B5FF', '#F5F5FF']} className="absolute inset-0 h-64" />
      
      <SafeAreaView className="flex-1 px-4">
        {!showFilters ? (
          <>
            <Header user={user} getInitials={getInitials} showFilters={false} selectedSchool={null} profilePic={user?.profilePicture || null} />
            <View className="mt-2 mb-4">
               <Text className="text-2xl font-bold text-gray-800">Explore Courses</Text>
               <Text className="text-gray-600 text-sm">Find the perfect match for your future</Text>
            </View>
            <SearchBar 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                onFilterPress={() => setShowFilters(true)} 
                showFilter={true} 
            />
            
            <FlatList
              data={displayedCourses}
              renderItem={renderCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0222D7" />}
              ListEmptyComponent={
                !loading && (
                    <View className="items-center justify-center py-20">
                        <Ionicons name="search-outline" size={50} color="#ccc" />
                        <Text className="text-gray-500 font-medium mt-4">No courses found matching your criteria.</Text>
                        <TouchableOpacity onPress={clearFilters} className="mt-4"><Text className="text-[#0222D7] font-bold">Clear Filters</Text></TouchableOpacity>
                    </View>
                )
              }
              ListFooterComponent={loading && !refreshing ? <ActivityIndicator className="py-4" color="#0222D7" /> : null}
            />
          </>
        ) : (
          <FiltersComponent
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClear={clearFilters}
            onShowResults={() => setShowFilters(false)}
            onClose={() => setShowFilters(false)}
            user={user}
            profilePic={user?.profilePicture || null}
            getInitials={getInitials}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
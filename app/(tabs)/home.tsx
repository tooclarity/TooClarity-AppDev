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
  Alert,
  FlatList,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import FiltersComponent from '../screens/FiltersComponent';
import SearchBar from '../screens/globalsearchbarcomponent';
import Header from '../screens/HeaderComponent';

// Auth
import { useAuth } from '../lib/auth-context';
import type { User } from '../types/user';

// ─────────────── API ───────────────
const studentDashboardAPI = {
  getVisibleCourses: async (): Promise<any[]> => {
    try {
      const res = await fetch('http://192.168.5.101:3001/api/v1/public/courses');
      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error(json.message || 'Invalid response');
      }
      return json.data;
    } catch (err: any) {
      throw new Error(err.message || 'Network error');
    }
  },
};

// ─────────────── Types ───────────────
interface ActiveFilters {
  instituteType?: string;
  kindergartenLevels?: string[];
  schoolLevels?: string[];
  modes?: string[];
  ageGroup?: string[];
  programDuration?: string[];
  priceRange?: string[];
  boardType?: string[];
  graduationType?: string[];
  streamType?: string[];
  educationType?: string[];
  classSize?: string[];
  seatingType?: string[];
  operatingHours?: string[];
  duration?: string[];
  subjects?: string[];
}

// ─────────────── Helpers ───────────────
const transformCourse = (apiCourse: any, wishlisted: boolean): any => {
  if (!apiCourse || !apiCourse._id) {
    console.warn('Invalid course object:', apiCourse);
    return null;
  }

  const price = apiCourse.priceOfCourse ?? 0;
  const duration = apiCourse.courseDuration ?? 'N/A';
  const image = apiCourse.imageUrl ?? 'https://via.placeholder.com/400x250';
  const logo = apiCourse.institution?.instituteLogo ?? 'https://via.placeholder.com/30';

  return {
    id: apiCourse._id,
    name: apiCourse.courseName ?? 'Untitled Course',
    description: apiCourse.aboutCourse ?? '',
    fees: `₹${price.toLocaleString()}`,
    duration,
    image,
    logo,
    mode: apiCourse.mode ?? 'Online',
    wishlisted,
    priceRange: getPriceRange(price),
    instituteType: apiCourse.instituteType || 'Kindergarten',
    levels: apiCourse.levels || [],
    boardType: apiCourse.boardType || '',
    ageGroup: apiCourse.ageGroup || '',
    programDuration: apiCourse.programDuration || '',
    graduationType: apiCourse.graduationType || '',
    streamType: apiCourse.streamType || '',
    educationType: apiCourse.educationType || '',
    classSize: apiCourse.classSize || '',
    seatingType: apiCourse.seatingType || '',
    operatingHours: apiCourse.operatingHours || '',
    subjects: apiCourse.subjects || [],
    location: apiCourse.location || '',
    apiData: apiCourse,
  };
};

const getPriceRange = (p: number): string => {
  if (p < 75000) return 'Below ₹75,000';
  if (p <= 150000) return '₹75,000 - ₹1,50,000';
  if (p <= 300000) return '₹1,50,000 - ₹3,00,000';
  return 'Above ₹3,00,000';
};

// ─────────────── HomeScreen ───────────────
export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showPicAlert, setShowPicAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const COURSES_PER_PAGE = 6;

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    instituteType: '',
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

  const getInitials = (name: string): string =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  // ─────────────── Wishlist Storage ───────────────
  const getWishlistedIds = async (): Promise<Set<string>> => {
    try {
      const saved = await AsyncStorage.getItem('wishlistedCourses');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  };

  const saveWishlistedIds = async (ids: Set<string>) => {
    try {
      await AsyncStorage.setItem('wishlistedCourses', JSON.stringify(Array.from(ids)));
    } catch (e) {
      console.error(e);
    }
  };

  // ─────────────── Fetch Courses (BULLETPROOF) ───────────────
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await studentDashboardAPI.getVisibleCourses();

      if (!Array.isArray(raw)) {
        setCourses([]);
        setFilteredCourses([]);
        setDisplayedCourses([]);
        setCurrentPage(1);
        return;
      }

      const wishIds = await getWishlistedIds();
      const transformed = raw
        .map(c => transformCourse(c, wishIds.has(c?._id)))
        .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined);

      setCourses(transformed);
      setFilteredCourses(transformed);
      setDisplayedCourses(transformed.slice(0, COURSES_PER_PAGE));
      setCurrentPage(1);
    } catch (err: any) {
      ToastAndroid.show(err.message || 'Failed to load courses', ToastAndroid.LONG);
      setCourses([]);
      setFilteredCourses([]);
      setDisplayedCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ─────────────── Load More ───────────────
  const loadMore = () => {
    if (loadingMore || displayedCourses.length >= filteredCourses.length) return;
    setLoadingMore(true);
    const next = currentPage + 1;
    const end = next * COURSES_PER_PAGE;
    setDisplayedCourses(filteredCourses.slice(0, end));
    setCurrentPage(next);
    setLoadingMore(false);
  };

  // ─────────────── Filter Logic (SAFE) ───────────────
  const filterCourses = useCallback(
    (query: string, filters: ActiveFilters, src: any[]) => {
      let res = src;

      if (query.trim()) {
        const q = query.toLowerCase();
        res = res.filter(
          (c: any) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
      }

      if (filters.instituteType) {
        res = res.filter((c: any) => c.instituteType === filters.instituteType);
      }

      if (filters.modes?.length) {
        res = res.filter((c: any) => filters.modes.includes(c.mode));
      }

      if (filters.priceRange?.length) {
        res = res.filter((c: any) => filters.priceRange.includes(c.priceRange));
      }

      if (filters.kindergartenLevels?.length) {
        res = res.filter((c: any) =>
          filters.kindergartenLevels.some((lvl: string) => c.levels.includes(lvl))
        );
      }

      if (filters.schoolLevels?.length) {
        res = res.filter((c: any) =>
          filters.schoolLevels.some((lvl: string) => c.levels.includes(lvl))
        );
      }

      if (filters.ageGroup?.length) {
        res = res.filter((c: any) => filters.ageGroup.includes(c.ageGroup));
      }

      if (filters.programDuration?.length) {
        res = res.filter((c: any) => filters.programDuration.includes(c.programDuration));
      }

      if (filters.boardType?.length) {
        res = res.filter((c: any) => filters.boardType.includes(c.boardType));
      }

      if (filters.graduationType?.length) {
        res = res.filter((c: any) => filters.graduationType.includes(c.graduationType));
      }

      if (filters.streamType?.length) {
        res = res.filter((c: any) => filters.streamType.includes(c.streamType));
      }

      if (filters.educationType?.length) {
        res = res.filter((c: any) => filters.educationType.includes(c.educationType));
      }

      if (filters.classSize?.length) {
        res = res.filter((c: any) => filters.classSize.includes(c.classSize));
      }

      if (filters.seatingType?.length) {
        res = res.filter((c: any) => filters.seatingType.includes(c.seatingType));
      }

      if (filters.operatingHours?.length) {
        res = res.filter((c: any) => filters.operatingHours.includes(c.operatingHours));
      }

      if (filters.duration?.length) {
        res = res.filter((c: any) => filters.duration.includes(c.duration));
      }

      if (filters.subjects?.length) {
        res = res.filter((c: any) =>
          filters.subjects.some((sub: string) => c.subjects.includes(sub))
        );
      }

      const valid = res.filter((c): c is NonNullable<typeof c> => c && c.id);
      setFilteredCourses(valid);
      setDisplayedCourses(valid.slice(0, COURSES_PER_PAGE));
      setCurrentPage(1);
    },
    []
  );

  useEffect(() => {
    filterCourses(searchQuery, activeFilters, courses);
  }, [searchQuery, activeFilters, courses, filterCourses]);

  // ─────────────── Wishlist Toggle ───────────────
  const toggleWishlist = async (id: string) => {
    const ids = await getWishlistedIds();
    const was = ids.has(id);
    if (was) ids.delete(id);
    else ids.add(id);
    await saveWishlistedIds(ids);
    const upd = (list: any[]) =>
      list.map(c => (c.id === id ? { ...c, wishlisted: !c.wishlisted } : c));
    setCourses(upd);
    setFilteredCourses(upd);
    setDisplayedCourses(upd);
  };

  // ─────────────── Filter Handlers ───────────────
  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      if (type === 'instituteType') {
        updated.instituteType = checked ? value : '';
      } else {
        const key = type as keyof ActiveFilters;
        const arr = (updated[key] as string[]) || [];
        if (checked && !arr.includes(value)) {
          updated[key] = [...arr, value] as any;
        } else if (!checked) {
          updated[key] = arr.filter(v => v !== value) as any;
        }
      }
      return updated;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      instituteType: '',
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
  };

  // ─────────────── View Details ───────────────
  const handleViewDetails = (course: any) => {
    router.push({
      pathname: '/screens/SchoolDetailsComponent',
      params: { id: course.id },
      // @ts-ignore
      state: { course },
    });
  };

  // ─────────────── Profile Alert ───────────────
  useEffect(() => {
    if (!authLoading && user?.profilePicture && !profilePic) {
      setProfilePic(user.profilePicture);
    } else if (!authLoading && !user?.profilePicture && !hasShownAlert) {
      setShowPicAlert(true);
      setHasShownAlert(true);
    }
  }, [authLoading, user, profilePic, hasShownAlert]);

  useEffect(() => {
    if (showPicAlert) {
      Alert.alert(
        'Profile Picture Missing',
        "Update your profile pic, it's missing!",
        [
          { text: 'OK' },
          { text: 'Edit Profile', onPress: () => router.push('/screens/profilesetup') },
        ]
      );
      setShowPicAlert(false);
    }
  }, [showPicAlert, router]);

  // ─────────────── Render Card (100% SAFE) ───────────────
  const renderSchool = ({ item }: { item: any }) => {
    if (!item || !item.id) return null;

    return (
      <View className="mb-8 rounded-[8.7px] overflow-hidden border border-gray-200 bg-white">
        <Image source={{ uri: item.image }} className="w-full h-[202px]" />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3">
          <View className="flex-row items-center mb-1">
            <Image source={{ uri: item.logo }} className="w-6 h-6 rounded mr-2" />
            <Text className="font-montserrat-semibold text-white text-[14px] flex-1">
              {item.name}
            </Text>
            <TouchableOpacity onPress={() => toggleWishlist(item.id)}>
              <Ionicons
                name={item.wishlisted ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <Text className="font-montserrat-regular text-white text-[12px] mb-1">
            {item.description}
          </Text>
          <View className="flex-row justify-between">
            <Text className="font-montserrat-medium text-white text-[12px]">
              Total Fees {item.fees}
            </Text>
            <Text className="font-montserrat-medium text-white text-[12px]">
              Duration: {item.duration}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-[#0222D7] py-3 px-4 mt-[-1px]"
          onPress={() => handleViewDetails(item)}
        >
          <Text className="font-montserrat-semibold text-white text-center text-[16px]">
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ─────────────── Loading State ───────────────
  if (loading || authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F5FF]">
        <ActivityIndicator size="large" color="#0A46E4" />
        <Text className="mt-4 text-gray-600 font-montserrat-regular text-base">
          Loading...
        </Text>
      </View>
    );
  }

  // ─────────────── Main Render ───────────────
  return (
    <View className="flex-1 bg-[#F5F5FF]">
      <LinearGradient
        colors={['#A8B5FF', '#F5F5FF']}
        className="absolute inset-0"
        pointerEvents="none"
      />

      <SafeAreaView className="flex-1 px-4 pt-12">
        <Header
          user={user as User}
          profilePic={profilePic}
          getInitials={getInitials}
          showFilters={showFilters}
        />

        {!showFilters && (
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterPress={() => setShowFilters(true)}
            showFilter={true}
          />
        )}

        {!showFilters && (
          <FlatList
            data={displayedCourses}
            renderItem={renderSchool}
            keyExtractor={(item, index) => item?.id ?? `fallback-${index}`}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
            }
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-gray-500 font-montserrat-regular">
                  No courses found.
                </Text>
              </View>
            }
          />
        )}

        {showFilters && (
          <FiltersComponent
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClear={clearAllFilters}
            onShowResults={() => setShowFilters(false)}
            onClose={() => setShowFilters(false)}
            user={user as User}
            profilePic={profilePic}
            getInitials={getInitials}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
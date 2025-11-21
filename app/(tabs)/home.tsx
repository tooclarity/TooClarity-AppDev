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
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../types/authStore';
import Header from '../screens/HeaderComponent';
import SearchBar from '../screens/globalsearchbarcomponent';
import SchoolDetailsComponent from '../screens/SchoolDetailsComponent';
import FiltersComponent from '../screens/FiltersComponent';

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

export default function HomeScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [academicProfile, setAcademicProfile] = useState<any>(null);
  const [showPicAlert, setShowPicAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleMode = (mode: string) => {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const clearAllFilters = () => {
    setSelectedInstitute('');
    setSelectedLevels([]);
    setSelectedModes([]);
  };

  const fetchFilteredResults = () => {
    console.log('Fetching filtered results...');
    setShowFilters(false);
  };

  // Dummy data
  const schools: School[] = [
    {
      id: '1',
      name: 'Bachpan Play School',
      location: 'Jubilee Hills',
      description: 'Blending learning and technology, Bachpan is the best preschool',
      fees: '₹2.67L',
      duration: '1 year',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
      logo: 'https://via.placeholder.com/30x30/red/ffffff?text=B',
      category: 'FS Kindergarten',
      curriculumType: 'CBSE',
      estDate: 'Est July 2012',
      timing: '9 AM - 4 PM',
      about: 'Lorem ipsum simply dummy text of the printing and typesetting industry.',
      operationalDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      additionalFeatures: [
        { icon: 'school', label: 'Government', value: 'Yes' },
        { icon: 'people', label: 'Only Girls', value: 'No' },
      ],
      facilities: [
        { icon: 'home', label: 'Hostel Facility', value: 'Yes' },
        { icon: 'bus', label: 'Bus Service', value: 'Yes' },
      ],
      bannerImage:
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
      bannerText: 'Bachpan Sirf Aata Hai',
    },
  ];

  const getInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  const fetchProfileInline = useCallback(async () => {
    try {
      const d = { profilePicture: null, academicProfile: { profileType: 'SCHOOL' } };
      return { profilePicture: d.profilePicture, academicProfile: d.academicProfile };
    } catch {
      ToastAndroid.show('Failed to load profile', ToastAndroid.SHORT);
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
      const { profilePicture, academicProfile } = await fetchProfileInline();
      setAcademicProfile(academicProfile);
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
        { text: 'Edit Profile', onPress: () => router.push('/(auth)/profilesetup') },
      ]);
      setShowPicAlert(false);
    }
  }, [showPicAlert, router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F5FF]">
        <ActivityIndicator size="large" color="#0A46E4" />
        <Text className="mt-4 text-gray-600 font-Montserrat-regular text-base">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F5F5FF] px-4 pt-12">
      <StatusBar hidden />

      <Header
        user={user}
        profilePic={profilePic}
        getInitials={getInitials}
        selectedSchool={selectedSchool}
        showFilters={showFilters}
      />

      {/* SEARCH BAR AND FILTER - Always visible, separated */}
      {!selectedSchool && !showFilters && (
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterPress={() => setShowFilters(true)}
          showFilter={true}
        />
      )}

      {/* SCHOOL LIST */}
      {!selectedSchool && !showFilters && (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {schools.map((school) => (
            <View
              key={school.id}
              className="mb-8 rounded-[8.7px] overflow-hidden border border-gray-200 bg-white"
            >
              <Image source={{ uri: school.image }} className="w-full h-[202px]" />
              <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3">
                <View className="flex-row items-center mb-1">
                  <Image source={{ uri: school.logo }} className="w-6 h-6 rounded mr-2" />
                  <Text className="font-Montserrat-semibold text-white text-[14px] flex-1">
                    {school.name}
                  </Text>
                  <Ionicons name="bookmark-outline" size={20} color="white" />
                </View>
                <Text className="font-Montserrat-regular text-white text-[12px] mb-1">
                  {school.description}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="font-Montserrat-medium text-white text-[12px]">
                    Total Fees {school.fees}
                  </Text>
                  <Text className="font-Montserrat-medium text-white text-[12px]">
                    Duration: {school.duration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="bg-[#0222D7] py-3 px-4 mt-[-1px]"
                onPress={() => setSelectedSchool(school)}
              >
                <Text className="font-Montserrat-semibold text-white text-center text-[16px]">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* DETAILS OR FILTERS SECTION */}
      {selectedSchool && (
        <SchoolDetailsComponent school={selectedSchool} onClose={() => setSelectedSchool(null)} />
      )}

      {showFilters && (
        <FiltersComponent
          selectedInstitute={selectedInstitute}
          selectedLevels={selectedLevels}
          selectedModes={selectedModes}
          onInstituteChange={setSelectedInstitute}
          onLevelChange={toggleLevel}
          onModeChange={toggleMode}
          onClear={clearAllFilters}
          onShowResults={fetchFilteredResults}
          onClose={() => setShowFilters(false)}
          user={user}
          profilePic={profilePic}
          getInitials={getInitials}
        />
      )}
    </View>
  );
}
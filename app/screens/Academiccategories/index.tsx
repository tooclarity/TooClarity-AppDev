// // app/screens/AcademicCategories/index.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../lib/auth-context';
// import { API_BASE_URL } from '../../../utils/constant';

// import kindergarten from '../../../assets/images/kindergarten.png';
// import school from '../../../assets/images/school.png';
// import intermediate from '../../../assets/images/intermediate.png';
// import graduation from '../../../assets/images/graduation.png';
// import coachingcenters from '../../../assets/images/coachingcenters.png';
// import studyhalls from '../../../assets/images/studyhalls.png';
// import tuitioncenter from '../../../assets/images/tuitioncenter.png';
// import studyabroad from '../../../assets/images/studyabroad.png';

// interface Interest {
//   key: string;
//   label: string;
// }

// const AcademicInterestsScreen: React.FC = () => {
//   const router = useRouter();
//   const { user, refreshUser } = useAuth();
//   const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Ensure user is refreshed if id is missing
//   useEffect(() => {
//     if (!user?.id) {
//       console.log('User ID missing, refreshing...');
//       refreshUser().then(() => {
//         console.log('Refreshed user ID:', user?.id);
//       });
//     }
//   }, [user?.id, refreshUser]);

//   const interests: Interest[] = [
//     { key: 'KINDERGARTEN', label: 'Kindergarten' },
//     { key: 'SCHOOL', label: 'School' },
//     { key: 'INTERMEDIATE', label: 'Intermediate' },
//     { key: 'GRADUATION', label: 'Graduation' },
//     { key: 'COACHING_CENTER', label: 'Coaching Centers' },
//     { key: 'STUDY_HALLS', label: 'Study Halls' },
//     { key: 'TUITION_CENTER', label: 'Tuition Center' },
//     { key: 'STUDY_ABROAD', label: 'Study Abroad' },
//   ];

//   const imageMap: Record<string, any> = {
//     'KINDERGARTEN': kindergarten,
//     'SCHOOL': school,
//     'INTERMEDIATE': intermediate,
//     'GRADUATION': graduation,
//     'COACHING_CENTER': coachingcenters,
//     'STUDY_HALLS': studyhalls,
//     'TUITION_CENTER': tuitioncenter,
//     'STUDY_ABROAD': studyabroad,
//   };

//   const updateAcademicProfileInline = async (profileType: string, details: Record<string, any>): Promise<boolean> => {
//     if (!user?.id) {
//       console.error('User ID missing in update:', user);
//       Alert.alert('Error', 'User ID not found. Please log in again.');
//       return false;
//     }
//     console.log('Updating profile for user ID:', user.id, 'Type:', profileType); // Debug
//     console.log('Sending academic profile:', { profileType, details }); // Matching web log
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/students/${user.id}/academic-profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profileType, details }),
//         credentials: 'include',
//       });

//       console.log('Update response status:', response.status); // Debug

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Update error response:', errorText); // Debug
//         Alert.alert('Update Error', errorText || 'Failed to update academic profile.');
//         return false;
//       }

//       const responseData = await response.json();
//       console.log('Update success response:', responseData); // Debug

//       await refreshUser();
//       return true;
//     } catch (error) {
//       console.error('Update error:', error);
//       Alert.alert('Error', 'Network error. Try again.');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInterestSelect = (interest: Interest) => {
//     console.log('Selected interest:', interest.key); // Debug
//     setSelectedInterest(interest.key);
//   };

//   const handleContinue = async () => {
//     if (!selectedInterest) {
//       Alert.alert('Select', 'Please select an academic interest.');
//       return;
//     }

//     // For Study Halls, quick complete like web
//     if (selectedInterest === 'STUDY_HALLS') {
//       const success = await updateAcademicProfileInline(selectedInterest, { any: true });
//       if (success) {
//         Alert.alert('Success', 'Profile completed!');
//         router.push('/(tabs)/home');
//       }
//       return;
//     }

//     // For others, navigate to specific category screen
//     const pathname = `/AcademicCategories/${selectedInterest.toLowerCase()}`;
//     console.log('Navigating to route:', pathname); // Debug
//     router.push(pathname as any); // Use 'as any' to bypass TS strict typing for pathname
//   };

//   const renderHeader = () => (
//     <View className="px-5 pt-14 pb-6">
//       <View className="w-[270px] h-[10px] bg-neutral-200 rounded-[5px] mb-6 overflow-hidden self-center">
//         <View className="w-[25%] h-full bg-primary rounded-[5px]" />
//       </View>

//       <Text className="font-montserrat font-medium text-[24px] text-text leading-[24px] tracking-normal mb-[30px] self-start">Academic Interests</Text>
//     </View>
//   );

//   const renderItem = ({ item }: { item: Interest }) => (
//     <TouchableOpacity 
//       className={`w-[48%] h-[97px] bg-gray-300 rounded-[8px] justify-center items-center mb-3 mr-2 ${selectedInterest === item.key ? 'border-2 border-primary' : ''}`}
//       onPress={() => handleInterestSelect(item)}
//       activeOpacity={0.7}
//       disabled={loading}
//     >
//       <Image source={imageMap[item.key]} className="w-full h-full rounded-[8px]" resizeMode="cover" />
//       {loading && <View className="absolute inset-0 bg-white bg-opacity-50 rounded-[8px] justify-center items-center" />}
//     </TouchableOpacity>
//   );

//   return (
//     <View className="flex-1 bg-white">
//       <TouchableOpacity 
//         className="absolute top-14 left-5 w-8 h-8 justify-center items-center z-10"
//         onPress={() => router.back()}
//         activeOpacity={0.6}
//         disabled={loading}
//       >
//         <Ionicons name="chevron-back" size={24} color="#060B13" />
//       </TouchableOpacity>

//       <TouchableOpacity 
//         className="absolute top-14 right-5 flex-row items-center h-8 z-10"
//         onPress={() => router.push('/(tabs)/home')}
//         activeOpacity={0.6}
//         disabled={loading}
//       >
//         <Text className="font-montserrat font-medium text-[14px] text-text leading-[17px] tracking-normal text-center">SKIP</Text>
//         <Ionicons name="chevron-forward" size={11} color="#060B13" style={{marginLeft: 2.5, marginTop: 2.5}} />
//       </TouchableOpacity>

//       <FlatList
//         data={interests}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.key}
//         numColumns={2}
//         ListHeaderComponent={renderHeader}
//         contentContainerStyle={{paddingBottom: 140}}
//         columnWrapperStyle={{justifyContent: 'space-between'}}
//         showsVerticalScrollIndicator={false}
//       />

//       <TouchableOpacity
//         className="self-center w-full h-12 bg-primary rounded-lg justify-center items-center mb-10"
//         onPress={handleContinue}
//         activeOpacity={0.8}
//         disabled={!selectedInterest || loading}
//       >
//         <Text className="font-montserrat font-medium text-[18px] text-white">{loading ? 'Updating...' : 'Continue'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default AcademicInterestsScreen;
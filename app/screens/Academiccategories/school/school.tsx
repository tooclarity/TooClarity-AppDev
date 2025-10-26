// // app/screens/AcademicCategories/school/school.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../../lib/auth-context';
// import { API_BASE_URL } from '../../../../utils/constant';

// const School = () => {
//   const router = useRouter();
//   const { profileType } = useLocalSearchParams<{ profileType: string }>();
//   const { user, refreshUser } = useAuth();
//   const [studyingIn, setStudyingIn] = useState('');
//   const [isStudyingOpen, setIsStudyingOpen] = useState(false);
//   const [preferredStream, setPreferredStream] = useState('');
//   const [isStreamOpen, setIsStreamOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const studyingOptions = [
//     'Completed Class 10th',
//     'Class 10th',
//     'Class 9th',
//     'Class 8th',
//     'Class 7th',
//     'Class 6th',
//     'Class 5th',
//     'Class 4th',
//     'Class 3rd',
//     'Class 2nd',
//     'Class 1st',
//   ];

//   const streamOptions = [
//     'MPC (Engineering)',
//     'BiPC (Medical)',
//     'CEC (Commerce)',
//     'HEC (History)',
//     'Other\'s',
//     'Not Decided',
//   ];

//   const updateAcademicProfileInline = async (details: object) => {
//     if (!user?.id) {
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
//         Alert.alert('Update Error', errorText || 'Failed to update profile.');
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

//   const handleContinue = async () => {
//     if (!studyingIn || !preferredStream) {
//       Alert.alert('Incomplete', 'Please fill all fields.');
//       return;
//     }

//     const details = { studyingIn, preferredStream };

//     const success = await updateAcademicProfileInline(details);
//     if (success) {
//       Alert.alert('Success', 'School profile updated!');
//       router.push('/(tabs)/home');
//     }
//   };

//   const closeDropdowns = () => {
//     setIsStudyingOpen(false);
//     setIsStreamOpen(false);
//   };

//   const isContinueEnabled = !!studyingIn && !!preferredStream && !loading;

//   return (
//     <ScrollView 
//       className="flex-1 bg-white"
//       contentContainerStyle={{paddingHorizontal: 20, paddingTop: 56, paddingBottom: 90}}
//       showsVerticalScrollIndicator={false}
//     >
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

//       <View className="w-[270px] h-[10px] bg-neutral-200 rounded-[5px] mt-11 mb-6 overflow-hidden self-center">
//         <View className="w-[50%] h-full bg-primary rounded-[5px]" />
//       </View>

//       <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5">Your Academic Profile</Text>

//       <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Academic Status</Text>
//       <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
//         <TouchableOpacity
//           className="h-12 flex-row items-center justify-between px-4"
//           onPress={() => {
//             setIsStudyingOpen(!isStudyingOpen);
//             closeDropdowns();
//           }}
//           activeOpacity={0.7}
//           disabled={loading}
//         >
//           <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${!studyingIn ? 'text-neutral-400' : 'text-text'}`}>
//             {studyingIn || 'Select studying in'}
//           </Text>
//           <Ionicons 
//             name={isStudyingOpen ? "chevron-up" : "chevron-down"} 
//             size={20} 
//             color="#060B13" 
//           />
//         </TouchableOpacity>

//         {isStudyingOpen && (
//           <View className="bg-neutral-100">
//             {studyingOptions.map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 className="flex-row items-center px-4 py-[14px]"
//                 onPress={() => {
//                   setStudyingIn(item);
//                   setIsStudyingOpen(false);
//                 }}
//                 activeOpacity={0.7}
//                 disabled={loading}
//               >
//                 <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                   {studyingIn === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//                 </View>
//                 <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//       <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Preferred Stream</Text>
//       <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
//         <TouchableOpacity
//           className="h-12 flex-row items-center justify-between px-4"
//           onPress={() => {
//             setIsStreamOpen(!isStreamOpen);
//             closeDropdowns();
//           }}
//           activeOpacity={0.7}
//           disabled={loading}
//         >
//           <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${!preferredStream ? 'text-neutral-400' : 'text-text'}`}>
//             {preferredStream || 'Select Your Preferred Stream'}
//           </Text>
//           <Ionicons 
//             name={isStreamOpen ? "chevron-up" : "chevron-down"} 
//             size={20} 
//             color="#060B13" 
//           />
//         </TouchableOpacity>

//         {isStreamOpen && (
//           <View className="bg-neutral-100">
//             {streamOptions.map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 className="flex-row items-center px-4 py-[14px]"
//                 onPress={() => {
//                   setPreferredStream(item);
//                   setIsStreamOpen(false);
//                 }}
//                 activeOpacity={0.7}
//                 disabled={loading}
//               >
//                 <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                   {preferredStream === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//                 </View>
//                 <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//       <TouchableOpacity
//         className={`self-center w-full h-12 rounded-[12px] justify-center items-center mb-10 ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
//         onPress={handleContinue}
//         disabled={!isContinueEnabled}
//         activeOpacity={0.8}
//       >
//         <Text className={`font-montserrat font-medium text-[18px] text-center ${isContinueEnabled ? 'text-white' : 'text-gray-400'}`}>
//           {loading ? 'Updating...' : 'Continue'}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default School;
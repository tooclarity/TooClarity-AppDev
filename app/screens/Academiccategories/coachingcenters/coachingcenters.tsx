// // app/screens/AcademicCategories/coachingcenters/coachingcenters.tsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../../lib/auth-context';
// import { API_BASE_URL } from '../../../../utils/constant';

// const CoachingCenters = () => {
//   const router = useRouter();
//   const { profileType } = useLocalSearchParams<{ profileType: string }>();
//   const { user, refreshUser } = useAuth();
//   const [lookingFor, setLookingFor] = useState('');
//   const lookingForOptions = [
//     'Upskilling / Skill Development',
//     'Exam Preparation',
//     'Vocational Training',
//   ];
//   const [academicLevel, setAcademicLevel] = useState('');
//   const [isLevelOpen, setIsLevelOpen] = useState(false);
//   const levelOptions = [
//     'Completed Class 10',
//     'Studying in Class 11',
//     'Studying in Class 12',
//     'Completed Class 12',
//     'Pursuing Under Graduation',
//     'Completed Under Graduation',
//     'Pursuing Post Graduation',
//     'Completed Post Graduation',
//   ];
//   const [stream, setStream] = useState('');
//   const [isStreamOpen, setIsStreamOpen] = useState(false);
//   const [passoutYear, setPassoutYear] = useState('');
//   const [loading, setLoading] = useState(false);

//   const coachingStreamOptions = useMemo(() => {
//     switch (academicLevel) {
//       case 'Completed Class 10':
//         return ['State Board', 'CBSE', 'ICSE', 'Other\'s'];
//       case 'Completed Class 12':
//       case 'Studying in Class 11':
//       case 'Studying in Class 12':
//         return ['MPC', 'BiPC', 'CEC', 'HEC', 'Other\'s', 'Not Decided'];
//       case 'Pursuing Under Graduation':
//       case 'Completed Under Graduation':
//         return ['B.Tech', 'BBA', 'B.Sc', 'B.Com', 'BCA', 'B.A', 'Other\'s', 'Not Decided'];
//       case 'Pursuing Post Graduation':
//       case 'Completed Post Graduation':
//         return ['M.Tech', 'MBA', 'M.Sc', 'M.Com', 'MCA', 'Other\'s', 'Not Decided'];
//       default:
//         return ['General', 'Other\'s'];
//     }
//   }, [academicLevel]);

//   useEffect(() => {
//     setStream('');
//   }, [academicLevel]);

//   const updateAcademicProfileInline = async (details: object) => {
//     if (!user?.id) {
//       Alert.alert('Error', 'User ID not found. Please log in again.');
//       return false;
//     }
//     console.log('Updating profile for user ID:', user.id, 'Type:', profileType); // Debug
//     console.log('Sending academic profile:', { profileType, details }); // Matching web log
//     setLoading(true);
//     try {
//       let lookingForMapped = 'EXAM_PREPARATION';
//       if (lookingFor === 'Upskilling / Skill Development') lookingForMapped = 'UPSKILLING_SKILL_DEVELOPMENT';
//       else if (lookingFor === 'Vocational Training') lookingForMapped = 'VOCATIONAL_TRAINING';
//       const payloadDetails = { lookingFor: lookingForMapped, academicLevel, stream, passoutYear };
//       const response = await fetch(`${API_BASE_URL}/api/v1/students/${user.id}/academic-profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profileType, details: payloadDetails }),
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
//     if (!lookingFor || !academicLevel || !stream || !passoutYear.trim()) {
//       Alert.alert('Incomplete', 'Please fill all fields.');
//       return;
//     }

//     const details = {};

//     const success = await updateAcademicProfileInline(details);
//     if (success) {
//       Alert.alert('Success', 'Coaching profile updated!');
//       router.push('/(tabs)/home');
//     }
//   };

//   const closeDropdown = (openKey: string) => {
//     if (openKey !== 'level') setIsLevelOpen(false);
//     if (openKey !== 'stream') setIsStreamOpen(false);
//   };

//   const isContinueEnabled = !!lookingFor && !!academicLevel && !!stream && !!passoutYear.trim() && !loading;

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

//       <ScrollView 
//         contentContainerStyle={{paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 56, paddingBottom: 90}}
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="w-full h-[10px] bg-neutral-200 rounded-[5px] mt-5 mb-6 overflow-hidden">
//           <View className="w-[75%] h-full bg-primary rounded-[5px]" />
//         </View>

//         <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5">Your Academic Profile</Text>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">What are you looking for?</Text>
//         {lookingForOptions.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             className="flex-row items-center mb-4"
//             onPress={() => setLookingFor(item)}
//             activeOpacity={0.6}
//             disabled={loading}
//           >
//             <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//               {lookingFor === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//             </View>
//             <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//           </TouchableOpacity>
//         ))}

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">What is your academic level?</Text>
//         <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
//           <TouchableOpacity
//             className="h-12 flex-row items-center justify-between px-4"
//             onPress={() => {
//               setIsLevelOpen(!isLevelOpen);
//               closeDropdown('level');
//             }}
//             activeOpacity={0.7}
//             disabled={loading}
//           >
//             <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${!academicLevel ? 'text-neutral-400' : 'text-text'}`}>
//               {academicLevel || 'Select your academic status'}
//             </Text>
//             <Ionicons
//               name={isLevelOpen ? 'chevron-up' : 'chevron-down'}
//               size={20}
//               color="#060B13"
//             />
//           </TouchableOpacity>

//           {isLevelOpen && (
//             <View className="bg-neutral-100">
//               {levelOptions.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   className="flex-row items-center px-4 py-[14px]"
//                   onPress={() => {
//                     setAcademicLevel(item);
//                     setIsLevelOpen(false);
//                   }}
//                   activeOpacity={0.7}
//                   disabled={loading}
//                 >
//                   <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                     {academicLevel === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//                   </View>
//                   <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">Stream</Text>
//         <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
//           <TouchableOpacity
//             className="h-12 flex-row items-center justify-between px-4"
//             onPress={() => {
//               setIsStreamOpen(!isStreamOpen);
//               closeDropdown('stream');
//             }}
//             activeOpacity={0.7}
//             disabled={loading || !academicLevel}
//           >
//             <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${!stream ? 'text-neutral-400' : 'text-text'}`}>
//               {stream || 'Select your stream'}
//             </Text>
//             <Ionicons
//               name={isStreamOpen ? 'chevron-up' : 'chevron-down'}
//               size={20}
//               color="#060B13"
//             />
//           </TouchableOpacity>

//           {isStreamOpen && academicLevel && (
//             <View className="bg-neutral-100">
//               {coachingStreamOptions.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   className="flex-row items-center px-4 py-[14px]"
//                   onPress={() => {
//                     setStream(item);
//                     setIsStreamOpen(false);
//                   }}
//                   activeOpacity={0.7}
//                   disabled={loading}
//                 >
//                   <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                     {stream === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//                   </View>
//                   <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">Passout Year</Text>
//         <TextInput
//           className="h-12 border border-neutral-300 rounded-[12px] px-4 mb-6 text-base font-montserrat text-text"
//           placeholder="Enter year"
//           value={passoutYear}
//           onChangeText={setPassoutYear}
//           keyboardType="numeric"
//           maxLength={4}
//           editable={!loading}
//         />

//         <View className="flex-1 min-h-[40px]" />
//       </ScrollView>

//       <TouchableOpacity
//         className={`absolute bottom-[26px] left-[16.5px] w-[361px] h-12 rounded-[12px] justify-center items-center px-6 py-4 ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
//         onPress={handleContinue}
//         disabled={!isContinueEnabled}
//         activeOpacity={0.8}
//       >
//         <Text className={`font-montserrat font-medium text-[18px] leading-[22px] tracking-normal text-center ${isContinueEnabled ? 'text-white' : 'text-neutral-500'}`}>
//           {loading ? 'Updating...' : 'Continue'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default CoachingCenters;
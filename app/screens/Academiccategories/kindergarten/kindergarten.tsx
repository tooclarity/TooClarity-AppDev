// // app/screens/AcademicCategories/kindergarten/kindergarten.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../../lib/auth-context';
// import { API_BASE_URL } from '../../../../utils/constant';

// const Kindergarten: React.FC = () => {
//   const router = useRouter();
//   const { profileType } = useLocalSearchParams<{ profileType: string }>();
//   const { user, refreshUser } = useAuth();
//   const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   interface Option {
//     label: string;
//     value: string;
//   }

//   const options: Option[] = [
//     { label: 'Currently in Kindergarten', value: 'CURRENTLY_IN' },
//     { label: 'Completed Kindergarten', value: 'COMPLETED' },
//     { label: 'Seeking Admission to Kindergarten', value: 'SEEKING_ADMISSION' },
//   ];

//   const updateAcademicProfileInline = async (details: Record<string, any>): Promise<boolean> => {
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
//     if (!selectedStatus) {
//       Alert.alert('Incomplete', 'Please select an option.');
//       return;
//     }

//     const details = { status: selectedStatus };

//     const success = await updateAcademicProfileInline(details);
//     if (success) {
//       Alert.alert('Success', 'Kindergarten profile updated!');
//       router.push('/(tabs)/home');
//     }
//   };

//   const isContinueEnabled = !!selectedStatus && !loading;

//   return (
//     <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
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

//       <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-6">Academic Status</Text>

//       <View className="mb-auto">
//         {options.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             className="flex-row items-center mb-[28px]"
//             onPress={() => setSelectedStatus(item.value)}
//             activeOpacity={0.6}
//             disabled={loading}
//           >
//             <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//               {selectedStatus === item.value && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//             </View>
//             <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item.label}</Text>
//           </TouchableOpacity>
//         ))}
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

// export default Kindergarten;
// // app/screens/AcademicCategories/studyhalls/studyhalls.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, Alert, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { useAuth } from '../../../lib/auth-context';
// import { API_BASE_URL } from '../../../../utils/constant';

// const StudyHalls = () => {
//   const router = useRouter();
//   const { profileType } = useLocalSearchParams<{ profileType: string }>();
//   const { user, refreshUser } = useAuth();
//   const [loading, setLoading] = useState(true);

//   const updateAcademicProfileInline = async (profileType: string, details: Record<string, any>): Promise<boolean> => {
//     if (!user?.id) {
//       console.error('User ID missing in update:', user);
//       Alert.alert('Error', 'User ID not found. Please log in again.');
//       return false;
//     }
//     console.log('Updating profile for user ID:', user.id, 'Type:', profileType); // Debug
//     console.log('Sending academic profile:', { profileType, details }); // Matching web log
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
//     }
//   };

//   useEffect(() => {
//     const handleUpdate = async () => {
//       if (profileType === 'STUDY_HALLS') {
//         const success = await updateAcademicProfileInline(profileType, { any: true });
//         if (success) {
//           Alert.alert('Success', 'Profile completed!');
//           router.push('/(tabs)/home');
//         }
//       }
//       setLoading(false);
//     };
//     handleUpdate();
//   }, [profileType]);

//   if (loading) {
//     return (
//       <View className="flex-1 bg-white justify-center items-center">
//         <ActivityIndicator size="large" color="#060B13" />
//         <Text className="mt-4 font-montserrat text-text">Updating profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white justify-center items-center">
//       <Text>Study Halls Profile Updated!</Text>
//     </View>
//   );
// };

// export default StudyHalls;
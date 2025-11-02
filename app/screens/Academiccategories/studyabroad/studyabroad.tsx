// // app/screens/AcademicCategories/studyabroad/studyabroad.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../../lib/auth-context';
// import { API_BASE_URL } from '../../../../utils/constant';

// const StudyAbroad = () => {
//   const router = useRouter();
//   const { profileType } = useLocalSearchParams<{ profileType: string }>();
//   const { user, refreshUser } = useAuth();
//   const [highestEducation, setHighestEducation] = useState<string | null>(null);
//   const highestOptions = ['12th Grade', "Bachelor's", "Master's"];

//   const [hasBacklogs, setHasBacklogs] = useState<string | null>(null);
//   const backlogOptions = ['Yes', 'No'];

//   const [englishTestStatus, setEnglishTestStatus] = useState('');
//   const [isEnglishOpen, setIsEnglishOpen] = useState(false);
//   const englishOptions = [
//     "Haven't decided yet",
//     'Preparing for the exam',
//     'Booked my exam',
//     'Awaiting results',
//     'Already have my exam score',
//   ];

//   const [testType, setTestType] = useState<string | null>(null);
//   const testTypes = ['IELTS', 'PTE', 'TOEFL', 'Duolingo'];

//   const [overallScore, setOverallScore] = useState('');
//   const [examDate, setExamDate] = useState('');

//   const [studyGoals, setStudyGoals] = useState('');
//   const [budgetPerYear, setBudgetPerYear] = useState('');
//   const [isBudgetOpen, setIsBudgetOpen] = useState(false);
//   const budgetOptions = [
//     'Below ₹10 Lakhs',
//     '₹10 Lakhs - ₹20 Lakhs',
//     '₹20 Lakhs - ₹30 Lakhs',
//     '₹30 Lakhs - ₹40 Lakhs',
//     '₹40 Lakhs - ₹50 Lakhs',
//     'Above ₹50 Lakhs',
//   ];

//   const [preferredCountries, setPreferredCountries] = useState<{ flag: string; name: string }[]>([]);
//   const [countrySearch, setCountrySearch] = useState('');
//   const [showAllCountries, setShowAllCountries] = useState(false);

//   const allCountries = [
//     { flag: '🇺🇸', name: 'USA' },
//     { flag: '🇦🇺', name: 'Australia' },
//     { flag: '🇬🇧', name: 'UK' },
//     { flag: '🇨🇦', name: 'Canada' },
//     { flag: '🇮🇪', name: 'Ireland' },
//     { flag: '🇩🇪', name: 'Germany' },
//     { flag: '🇳🇿', name: 'New Zealand' },
//     { flag: '🇫🇷', name: 'France' },
//     { flag: '🇸🇪', name: 'Sweden' },
//     { flag: '🇳🇱', name: 'Netherlands' },
//     { flag: '🇮🇹', name: 'Italy' },
//     { flag: '🇸🇬', name: 'Singapore' },
//     { flag: '🇦🇹', name: 'Austria' },
//     { flag: '🇪🇸', name: 'Spain' },
//     { flag: '🇨🇭', name: 'Switzerland' },
//     { flag: '🇱🇹', name: 'Lithuania' },
//     { flag: '🇵🇱', name: 'Poland' },
//     { flag: '🇲🇾', name: 'Malaysia' },
//     { flag: '🇯🇵', name: 'Japan' },
//     { flag: '🇦🇪', name: 'UAE' },
//     { flag: '🇫🇮', name: 'Finland' },
//   ];

//   const filteredCountries = allCountries.filter((country) =>
//     country.name.toLowerCase().includes(countrySearch.toLowerCase())
//   );

//   const toggleCountry = (country: { flag: string; name: string }) => {
//     if (preferredCountries.find((c) => c.name === country.name)) {
//       setPreferredCountries(preferredCountries.filter((c) => c.name !== country.name));
//     } else if (preferredCountries.length < 3) {
//       setPreferredCountries([...preferredCountries, country]);
//     }
//   };

//   const [passportStatus, setPassportStatus] = useState<string | null>(null);
//   const passportOptions = ['Yes', 'No', 'Applied'];

//   const [loading, setLoading] = useState(false);

//   const showTestDetails = englishTestStatus === 'Already have my exam score';

//   const updateAcademicProfileInline = async (details: object) => {
//     if (!user?.id) {
//       Alert.alert('Error', 'User ID not found. Please log in again.');
//       return false;
//     }
//     console.log('Updating profile for user ID:', user.id, 'Type:', profileType); // Debug
//     console.log('Sending academic profile:', { profileType, details }); // Matching web log
//     setLoading(true);
//     try {
//       const payloadDetails = {
//         highestEducation,
//         hasBacklogs,
//         englishTestStatus,
//         ...(showTestDetails && { testType, overallScore, examDate }),
//         studyGoals: studyGoals || 'Not specified',
//         budgetPerYear: budgetPerYear || 'Not specified',
//         preferredCountries: preferredCountries.length > 0 ? preferredCountries.map((c) => c.name) : ['Not specified'],
//         passportStatus: passportStatus === 'Yes' ? 'YES' : passportStatus === 'No' ? 'NO' : 'APPLIED',
//       };
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
//     if (
//       !highestEducation ||
//       !hasBacklogs ||
//       !englishTestStatus ||
//       (showTestDetails && (!testType || !overallScore || !examDate)) ||
//       !studyGoals.trim() ||
//       !budgetPerYear ||
//       preferredCountries.length === 0 ||
//       !passportStatus
//     ) {
//       Alert.alert('Incomplete', 'Please fill all fields.');
//       return;
//     }

//     if (preferredCountries.length > 3) {
//       Alert.alert('Limit Exceeded', 'You can select up to 3 countries.');
//       return;
//     }

//     const details = {};

//     const success = await updateAcademicProfileInline(details);
//     if (success) {
//       Alert.alert('Success', 'Study Abroad profile updated!');
//       router.push('/(tabs)/home');
//     }
//   };

//   const closeAllDropdowns = () => {
//     setIsEnglishOpen(false);
//     setIsBudgetOpen(false);
//   };

//   const isContinueEnabled =
//     !!highestEducation &&
//     !!hasBacklogs &&
//     !!englishTestStatus &&
//     (!showTestDetails || (!!testType && !!overallScore && !!examDate)) &&
//     !!studyGoals.trim() &&
//     !!budgetPerYear &&
//     preferredCountries.length > 0 &&
//     preferredCountries.length <= 3 &&
//     !!passportStatus &&
//     !loading;

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
//         contentContainerStyle={{paddingHorizontal: 20, paddingTop: 56, paddingBottom: 90}}
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="w-[270px] h-[10px] bg-neutral-200 rounded-[5px] mt-11 mb-6 overflow-hidden self-center">
//           <View className="w-[75%] h-full bg-primary rounded-[5px]" />
//         </View>

//         <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5">Your Academic Profile</Text>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Highest Level of Education</Text>
//         <View className="flex-col mb-6">
//           {highestOptions.map((item) => (
//             <TouchableOpacity
//               key={item}
//               className="flex-row items-center py-3"
//               onPress={() => setHighestEducation(item)}
//               activeOpacity={0.7}
//               disabled={loading}
//             >
//               <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                 {highestEducation === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//               </View>
//               <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Do you have any backlogs?</Text>
//         <View className="flex-row justify-between mb-6">
//           {backlogOptions.map((item) => (
//             <TouchableOpacity
//               key={item}
//               className="flex-1 flex-row items-center justify-center py-3"
//               onPress={() => setHasBacklogs(item)}
//               activeOpacity={0.7}
//               disabled={loading}
//             >
//               <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                 {hasBacklogs === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//               </View>
//               <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">English Test Status</Text>
//         <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
//           <TouchableOpacity
//             className="h-12 flex-row items-center justify-between px-4"
//             onPress={() => {
//               setIsEnglishOpen(!isEnglishOpen);
//               closeAllDropdowns();
//             }}
//             activeOpacity={0.7}
//             disabled={loading}
//           >
//             <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${!englishTestStatus ? 'text-neutral-400' : 'text-text'}`}>
//               {englishTestStatus || 'Select Test Status'}
//             </Text>
//             <Ionicons 
//               name={isEnglishOpen ? "chevron-up" : "chevron-down"} 
//               size={20} 
//               color="#060B13" 
//             />
//           </TouchableOpacity>

//           {isEnglishOpen && (
//             <View className="bg-neutral-100">
//               {englishOptions.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   className="flex-row items-center px-4 py-[14px]"
//                   onPress={() => {
//                     setEnglishTestStatus(item);
//                     setIsEnglishOpen(false);
//                   }}
//                   activeOpacity={0.7}
//                   disabled={loading}
//                 >
//                   <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                     {englishTestStatus === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//                   </View>
//                   <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {showTestDetails && (
//           <>
//             <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Test Type</Text>
//             <View className="flex-row flex-wrap mb-6">
//               {testTypes.map((opt) => (
//                 <TouchableOpacity
//                   key={opt}
//                   onPress={() => setTestType(opt)}
//                   className={`px-4 h-[40px] rounded-[10px] border mr-2 mb-2 ${testType === opt ? 'bg-primary border-primary' : 'border-neutral-300 bg-white'}`}
//                   activeOpacity={0.7}
//                   disabled={loading}
//                 >
//                   <Text className={`text-base font-semibold ${testType === opt ? 'text-white' : 'text-text'}`}>{opt}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Overall Score</Text>
//             <TextInput
//               className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-6 text-base font-montserrat text-text"
//               placeholder="e.g., 7.5"
//               value={overallScore}
//               onChangeText={setOverallScore}
//               keyboardType="decimal-pad"
//               editable={!loading}
//             />

//             <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Date of Exam</Text>
//             <TextInput
//               className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-6 text-base font-montserrat text-text"
//               placeholder="DD/MM/YYYY"
//               value={examDate}
//               onChangeText={setExamDate}
//               editable={!loading}
//             />
//           </>
//         )}

//         <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5">Your Study Goals</Text>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">What do you want to study?</Text>
//         <TextInput
//           className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-6 text-base font-montserrat text-text"
//           placeholder="e.g., Master's in Computer Science"
//           value={studyGoals}
//           onChangeText={setStudyGoals}
//           editable={!loading}
//         />

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">What is your budget per year?</Text>
//         <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
//           <TouchableOpacity
//             className="h-12 flex-row items-center justify-between px-4"
//             onPress={() => {
//               setIsBudgetOpen(!isBudgetOpen);
//               closeAllDropdowns();
//             }}
//             activeOpacity={0.7}
//             disabled={loading}
//           >
//             <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${!budgetPerYear ? 'text-neutral-400' : 'text-text'}`}>
//               {budgetPerYear || 'Select budget range'}
//             </Text>
//             <Ionicons 
//               name={isBudgetOpen ? "chevron-up" : "chevron-down"} 
//               size={20} 
//               color="#060B13" 
//             />
//           </TouchableOpacity>

//           {isBudgetOpen && (
//             <View className="bg-neutral-100">
//               {budgetOptions.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   className="px-4 py-[14px]"
//                   onPress={() => {
//                     setBudgetPerYear(item);
//                     setIsBudgetOpen(false);
//                   }}
//                   activeOpacity={0.7}
//                   disabled={loading}
//                 >
//                   <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Preferred Countries</Text>
//         <Text className="font-montserrat text-[12px] text-neutral-500 mb-2">You can select up to 3 countries</Text>
//         <TextInput
//           className="h-12 w-full border border-neutral-300 rounded-[12px] pl-9 mb-4 text-base font-montserrat text-text"
//           placeholder="Find your country"
//           value={countrySearch}
//           onChangeText={setCountrySearch}
//           editable={!loading}
//         />
//         <View className="grid grid-cols-3 gap-2 mb-4">
//           {filteredCountries.slice(0, showAllCountries ? filteredCountries.length : 6).map((country) => {
//             const selected = preferredCountries.find((c) => c.name === country.name);
//             return (
//               <TouchableOpacity
//                 key={country.name}
//                 className={`h-[88px] rounded-[12px] border justify-center items-center ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-300'}`}
//                 onPress={() => toggleCountry(country)}
//                 activeOpacity={0.7}
//                 disabled={loading || (!selected && preferredCountries.length >= 3)}
//               >
//                 <Text className="text-2xl mb-1">{country.flag}</Text>
//                 <Text className={`text-[12px] font-semibold text-center ${selected ? 'text-primary' : 'text-text'}`}>
//                   {country.name}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//         {!showAllCountries && (
//           <TouchableOpacity onPress={() => setShowAllCountries(true)} disabled={loading}>
//             <Text className="text-primary text-center mb-3">See all</Text>
//           </TouchableOpacity>
//         )}

//         <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3">Do you have a valid passport?</Text>
//         <View className="flex-row justify-between mb-6">
//           {passportOptions.map((item) => (
//             <TouchableOpacity
//               key={item}
//               className="flex-1 flex-row items-center justify-center py-3"
//               onPress={() => setPassportStatus(item)}
//               activeOpacity={0.7}
//               disabled={loading}
//             >
//               <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
//                 {passportStatus === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
//               </View>
//               <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View className="flex-1 min-h-[40px]" />
//       </ScrollView>

//       <TouchableOpacity
//         className={`absolute bottom-[26px] left-[16.5px] w-[361px] h-12 rounded-[12px] justify-center items-center ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
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

// export default StudyAbroad;
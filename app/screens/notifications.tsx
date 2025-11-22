// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';

// // Import assets (add more images/icons here as needed)
// const EmptyIcon = require('../../assets/images/emptynotificationsicon.png');
// // Example for additional assets (uncomment and adjust paths as needed):
// // const ReminderIcon = require('../assets/images/reminder-icon.png');
// // const MatchIcon = require('../assets/images/match-icon.png');
// // const TipIcon = require('../assets/images/tip-icon.png');

// export default function Notifications() {
//   const router = useRouter();
  
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: 'Demo Reminder',
//       message: "Your session with a counselor is scheduled for tomorrow at 4 PM. Don't miss out on getting your questions answered!",
//       time: '1 day ago',
//       type: 'reminder',
//     },
//     {
//       id: 2,
//       title: 'New Matches Available',
//       message: "We've found 4 new institutes that match your profile and preferences. Tap here to explore your options.",
//       time: '1hr ago',
//       type: 'match',
//     },
//     {
//       id: 3,
//       title: 'New Matches Available',
//       message: "We've found 4 new institutes that match your profile and preferences. Tap here to explore your options.",
//       time: '1hr ago',
//       type: 'match',
//     },
//     {
//       id: 4,
//       title: 'Profile Tip',
//       message: 'Add your budget and preferred duration to get more accurate recommendations. Click to update your profile now.',
//       time: '3 days ago',
//       type: 'tip',
//     },
//   ]);

//   const renderEmptyState = () => (
//     <View className="flex-1 items-center justify-center px-8">
//       <View className="w-[191px] h-[182px] items-center justify-center mb-6">
//         <Image
//           source={EmptyIcon}
//           className="w-full h-full"
//           resizeMode="contain"
//         />
//       </View>
      
//       <Text className="font-Montserrat-semibold text-[22px] text-black text-center mb-3">
//         No notifications yet!
//       </Text>
      
//       <Text className="font-Montserrat-regular text-[14px] text-gray-500 text-center leading-5 mb-12">
//         You don't have any notification at the moment, check back later.
//       </Text>

//       <TouchableOpacity
//         className="bg-[#0222D7] py-4 px-12 rounded-full w-full"
//         onPress={() => router.back()}
//         activeOpacity={0.8}
//       >
//         <Text className="font-Montserrat-semibold text-white text-center text-[16px]">
//           Back to home
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const handleDelete = (rowMap, rowKey) => {
//     setNotifications(prev => prev.filter(notif => notif.id !== parseInt(rowKey)));
//     if (rowMap[rowKey]) {
//       rowMap[rowKey].closeRow();
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <View 
//       className="p-4 bg-white rounded-[12px] border-l-4 mb-3"
//       style={{
//         borderLeftColor: item.type === 'reminder' ? '#8B5CF6' : '#0222D7',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//       }}
//     >
//       <View className="flex-row items-start justify-between mb-2">
//         <Text className="font-Montserrat-semibold text-[16px] text-black flex-1">
//           {item.title}
//         </Text>
//         <Text className="font-Montserrat-regular text-[12px] text-gray-400 ml-2">
//           {item.time}
//         </Text>
//       </View>
      
//       <Text className="font-Montserrat-regular text-[14px] text-gray-700 leading-5">
//         {item.message}
//       </Text>
//     </View>
//   );

//   const renderHiddenItem = (rowData, rowMap) => (
//     <TouchableOpacity
//       className="flex-1 bg-red-500 justify-center px-4"
//       onPress={() => handleDelete(rowMap, rowData.item.id.toString())}
//       activeOpacity={0.7}
//     >
//       <Text className="text-white font-Montserrat-semibold text-[16px] text-center">Delete</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
//       <View className="flex-1">
//         {/* Full-screen gradient background */}
//         <LinearGradient
//           colors={['#A8B5FF', '#F5F5FF']} // Top to bottom gradient
//           className="absolute inset-0"
//           pointerEvents="none"
//         />
        
//         <SafeAreaView className="flex-1">
//           {/* Header */}
//           <View className="px-4 pb-4"> {/* Removed pt-12; SafeAreaView handles top inset */}
//             <View className="flex-row items-center">
//               <TouchableOpacity 
//                 onPress={() => router.back()}
//                 className="mr-4"
//               >
//                 <Ionicons name="chevron-back" size={24} color="#000" />
//               </TouchableOpacity>
//               <Text className="font-Montserrat-semibold text-[20px] text-black">
//                 Notifications
//               </Text>
//             </View>
//           </View>

//           {/* Content */}
//           {notifications.length > 0 ? (
//             <SwipeListView
//               data={notifications}
//               renderItem={renderItem}
//               renderHiddenItem={renderHiddenItem}
//               rightOpenValue={-75}
//               disableRightSwipe={true}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, flexGrow: 1 }}
//             />
//           ) : renderEmptyState()}
//         </SafeAreaView>
//       </View>
//     </>
//   );
// }

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  Image, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// =====================================================
// CONFIG & UTILS
// =====================================================

export const API_BASE_URL = 'https://tooclarity.onrender.com/api';

const EmptyIcon = require('../../assets/images/emptynotificationsicon.png');

function timeAgo(dateInput: string | number): string {
  const ts = new Date(dateInput).getTime();
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  const date = new Date(ts);
  return date.toLocaleDateString();
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok) throw new Error(data.message || 'Something went wrong');
    if (!('success' in data)) data.success = true;
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

const authAPI = {
  getProfile: async () => apiRequest("/v1/profile", { method: "GET" })
};

const notificationsAPI = {
  list: async (params: Record<string, any> = {}) => {
    const q: string[] = [];
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) 
        q.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    });
    const qs = q.length ? `?${q.join('&')}` : '';
    return apiRequest(`/v1/notifications${qs}`, { method: 'GET' });
  },
  
  remove: async (ids: string[]) =>
    apiRequest(`/v1/notifications`, { method: 'DELETE', body: JSON.stringify({ ids }) })
};


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const profileRes = await authAPI.getProfile();
      const user = profileRes.data?.user || profileRes.data;

      const params: any = {};
      if (user) {
        if (user.role === 'STUDENT') {
          params.scope = 'student';
          params.studentId = user._id || user.id;
        } else if (user.role === 'INSTITUTION') {
          params.scope = 'institution';
          params.institutionId = user._id || user.id;
        }
      }

      const res = await notificationsAPI.list(params);
      const items = res.data?.items || res.data || [];

      if (Array.isArray(items)) {
        const mapped = items.map((n: any) => ({
          id: n._id || n.id,
          title: n.title || 'Notification',
          message: n.description || '',
          time: n.createdAt || new Date().toISOString(),
          type: n.category || 'system',
          read: n.read || false
        }));

        mapped.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNotifications(mapped);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleDelete = async (rowMap: any, rowKey: string) => {
    if (rowMap[rowKey]) rowMap[rowKey].closeRow();
    const prev = [...notifications];
    setNotifications(prev.filter(notif => notif.id !== rowKey));

    try {
      await notificationsAPI.remove([rowKey]);
    } catch {
      Alert.alert("Error", "Failed to delete notification");
      setNotifications(prev);
    }
  };

  const getBorderColor = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('reminder') || t.includes('system')) return '#8B5CF6';
    if (t.includes('match') || t.includes('billing')) return '#0222D7';
    if (t.includes('tip') || t.includes('info')) return '#10B981';
    return '#0222D7';
  };


  // =====================================================
  // UI RENDERERS
  // =====================================================

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-[191px] h-[182px] items-center justify-center mb-6">
        <Image source={EmptyIcon} className="w-full h-full" resizeMode="contain" />
      </View>
      <Text className="font-Montserrat-semibold text-[22px] text-black text-center mb-3">
        No notifications yet!
      </Text>
      <Text className="font-Montserrat-regular text-[14px] text-gray-500 text-center leading-5 mb-12">
        You don't have any notification at the moment, check back later.
      </Text>
      <TouchableOpacity
        className="bg-[#0222D7] py-4 px-12 rounded-full w-full"
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text className="font-Montserrat-semibold text-white text-center text-[16px]">
          Back to home
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <View 
      className="p-4 bg-white rounded-[12px] border-l-4 mb-3 mx-4 mt-1"
      style={{
        borderLeftColor: getBorderColor(item.type),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        opacity: item.read ? 0.6 : 1
      }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-Montserrat-semibold text-[16px] text-black flex-1 mr-2">
          {item.title}
        </Text>
        <Text className="font-Montserrat-regular text-[12px] text-gray-400">
          {timeAgo(item.time)}
        </Text>
      </View>

      {item.message ? (
        <Text className="font-Montserrat-regular text-[14px] text-gray-700 leading-5">
          {item.message}
        </Text>
      ) : null}
    </View>
  );

  const renderHiddenItem = (rowData: any, rowMap: any) => (
    <View className="flex-1 items-end pr-4 mb-3 mt-1">
      <TouchableOpacity
        className="bg-red-500 justify-center items-center w-[75px] h-full rounded-r-[12px]"
        onPress={() => handleDelete(rowMap, rowData.item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text className="text-white font-Montserrat-semibold text-[12px] mt-1">
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View className="flex-1">

        <LinearGradient
          colors={['#A8B5FF', '#F5F5FF']}
          className="absolute inset-0"
          pointerEvents="none"
        />

        <SafeAreaView className="flex-1">
          <View className="px-4 pb-4">
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="mr-4"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text className="font-Montserrat-semibold text-[20px] text-black">
                Notifications
              </Text>
            </View>
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#0222D7" />
            </View>
          ) : notifications.length > 0 ? (
            <SwipeListView
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-75}
              disableRightSwipe={true}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh} 
                  colors={['#0222D7']}
                  tintColor="#0222D7"
                />
              }
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                />
              }
            >
              {renderEmptyState()}
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </>
  );
}

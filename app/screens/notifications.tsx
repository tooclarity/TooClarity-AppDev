import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Import assets (add more images/icons here as needed)
const EmptyIcon = require('../../assets/images/emptynotificationsicon.png');
// Example for additional assets (uncomment and adjust paths as needed):
// const ReminderIcon = require('../assets/images/reminder-icon.png');
// const MatchIcon = require('../assets/images/match-icon.png');
// const TipIcon = require('../assets/images/tip-icon.png');

export default function Notifications() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Demo Reminder',
      message: "Your session with a counselor is scheduled for tomorrow at 4 PM. Don't miss out on getting your questions answered!",
      time: '1 day ago',
      type: 'reminder',
    },
    {
      id: 2,
      title: 'New Matches Available',
      message: "We've found 4 new institutes that match your profile and preferences. Tap here to explore your options.",
      time: '1hr ago',
      type: 'match',
    },
    {
      id: 3,
      title: 'New Matches Available',
      message: "We've found 4 new institutes that match your profile and preferences. Tap here to explore your options.",
      time: '1hr ago',
      type: 'match',
    },
    {
      id: 4,
      title: 'Profile Tip',
      message: 'Add your budget and preferred duration to get more accurate recommendations. Click to update your profile now.',
      time: '3 days ago',
      type: 'tip',
    },
  ]);

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-[191px] h-[182px] items-center justify-center mb-6">
        <Image
          source={EmptyIcon}
          className="w-full h-full"
          resizeMode="contain"
        />
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

  const handleDelete = (rowMap, rowKey) => {
    setNotifications(prev => prev.filter(notif => notif.id !== parseInt(rowKey)));
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const renderItem = ({ item, index }) => (
    <View 
      className="p-4 bg-white rounded-[12px] border-l-4 mb-3"
      style={{
        borderLeftColor: item.type === 'reminder' ? '#8B5CF6' : '#0222D7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-Montserrat-semibold text-[16px] text-black flex-1">
          {item.title}
        </Text>
        <Text className="font-Montserrat-regular text-[12px] text-gray-400 ml-2">
          {item.time}
        </Text>
      </View>
      
      <Text className="font-Montserrat-regular text-[14px] text-gray-700 leading-5">
        {item.message}
      </Text>
    </View>
  );

  const renderHiddenItem = (rowData, rowMap) => (
    <TouchableOpacity
      className="flex-1 bg-red-500 justify-center px-4"
      onPress={() => handleDelete(rowMap, rowData.item.id.toString())}
      activeOpacity={0.7}
    >
      <Text className="text-white font-Montserrat-semibold text-[16px] text-center">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View className="flex-1">
        {/* Full-screen gradient background */}
        <LinearGradient
          colors={['#A8B5FF', '#F5F5FF']} // Top to bottom gradient
          className="absolute inset-0"
          pointerEvents="none"
        />
        
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="px-4 pb-4"> {/* Removed pt-12; SafeAreaView handles top inset */}
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="mr-4"
              >
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text className="font-Montserrat-semibold text-[20px] text-black">
                Notifications
              </Text>
            </View>
          </View>

          {/* Content */}
          {notifications.length > 0 ? (
            <SwipeListView
              data={notifications}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-75}
              disableRightSwipe={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, flexGrow: 1 }}
            />
          ) : renderEmptyState()}
        </SafeAreaView>
      </View>
    </>
  );
}
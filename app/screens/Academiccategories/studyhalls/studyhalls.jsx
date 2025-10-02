import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const StudyHalls = () => {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const subInterests = [
    { id: '1', label: 'Library Study', icon: 'library' },
    { id: '2', label: 'Group Study', icon: 'people' },
    { id: '3', label: 'Quiet Rooms', icon: 'volume-mute' },
    { id: '4', label: 'Online Study Halls', icon: 'globe' },
    { id: '5', label: 'Virtual Study Groups', icon: 'videocam' },
    { id: '6', label: 'Study Cafes', icon: 'cafe' },
    { id: '7', label: 'Coworking Spaces', icon: 'briefcase' },
    { id: '8', label: 'Exam Prep Halls', icon: 'book' },
  ];

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const isContinueEnabled = selectedInterests.length > 0;

  const renderItem = ({ item }) => {
    const baseClasses = 'w-[48%] h-[120px] rounded-[16px] justify-center items-center p-4 mb-4 mr-2 shadow-sm border';
    const selectedClasses = 'bg-primary border-primary shadow-md';
    const unselectedClasses = 'bg-gray-50 border-gray-200';
    const className = `${baseClasses} ${selectedInterests.includes(item.id) ? selectedClasses : unselectedClasses}`;

    return (
      <TouchableOpacity
        className={className}
        onPress={() => toggleInterest(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={item.icon} 
          size={28} 
          color={selectedInterests.includes(item.id) ? 'white' : '#060B13'} 
        />
        <Text className={`mt-2 text-center font-montserrat text-sm ${selectedInterests.includes(item.id) ? 'text-white' : 'text-text'}`}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      <View className="w-[270px] h-[10px] bg-neutral-200 rounded-[5px] mt-11 mb-6 overflow-hidden self-center">
        <View className="w-[75%] h-full bg-primary rounded-[5px]" />
      </View>

      <Text className="font-montserrat font-semibold text-[24px] text-text leading-[28px] tracking-normal mb-4">Study Halls</Text>
      <Text className="font-montserrat text-[16px] text-gray-600 leading-[20px] tracking-normal mb-8">Select the types of study environments you're interested in</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity 
        className="absolute top-14 left-5 w-8 h-8 justify-center items-center z-10"
        onPress={() => router.back()}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-back" size={24} color="#060B13" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="absolute top-14 right-5 flex-row items-center h-8 z-10"
        onPress={() => router.push('/home')}
        activeOpacity={0.6}
      >
        <Text className="font-montserrat font-medium text-[14px] text-text leading-[17px] tracking-normal text-center">SKIP</Text>
        <Ionicons name="chevron-forward" size={11} color="#060B13" style={{marginLeft: 2.5, marginTop: 2.5}} />
      </TouchableOpacity>

      <FlatList
        data={subInterests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 56, paddingBottom: 140}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        className={`self-center w-[361px] h-12 rounded-[12px] justify-center items-center mb-10 ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => isContinueEnabled && router.push('/home')}
        disabled={!isContinueEnabled}
        activeOpacity={0.8}
      >
        <Text className={`font-montserrat font-medium text-[18px] leading-[22px] tracking-normal text-center ${isContinueEnabled ? 'text-white' : 'text-[#C7C7C7]'}`}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudyHalls;
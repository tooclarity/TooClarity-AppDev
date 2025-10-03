import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Intermediate = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('Select studying in');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState('Select Your Preferred Stream');
  const [isStreamOpen, setIsStreamOpen] = useState(false);

  const statusOptions = [
    '11th Grade',
    '12th Grade',
    'Junior College',
    'PUC'
  ];

  const streamOptions = [
    'Science Stream',
    'Commerce Stream',
    'Arts Stream',
    'Vocational Courses'
  ];

  const isContinueEnabled = 
    selectedStatus !== 'Select studying in' && 
    selectedStream !== 'Select Your Preferred Stream';

  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{paddingHorizontal: 20, paddingTop: 56, paddingBottom: 90}}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity 
        className="absolute top-14 left-5 w-8 h-8 justify-center items-center z-10"
        onPress={() => router.back()}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-back" size={24} color="#000000" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="absolute top-14 right-5 flex-row items-center h-8 z-10"
        onPress={() => router.push('/home')}
        activeOpacity={0.6}
      >
        <Text className="font-montserrat font-medium text-[14px] text-black leading-[17px] tracking-normal text-center">SKIP</Text>
        <Ionicons name="chevron-forward" size={11} color="#000000" style={{marginLeft: 2.5, marginTop: 2.5}} />
      </TouchableOpacity>

      <View className="w-[270px] h-[10px] bg-neutral-200 rounded-[5px] mt-11 mb-6 overflow-hidden self-center">
        <View className="w-[75%] h-full bg-primary rounded-[5px]" />
      </View>

      <Text className="font-montserrat font-medium text-[20px] text-black leading-[20px] tracking-normal mb-5">Academic Interests</Text>

      <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-1">Academic Status</Text>

      <TouchableOpacity
        className="w-full h-12 border border-neutral-300 rounded-[12px] flex-row items-center justify-between px-4 py-3 mb-6 bg-white"
        onPress={() => {
          setIsStatusOpen(!isStatusOpen);
          setIsStreamOpen(false);
        }}
        activeOpacity={0.7}
      >
        <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${selectedStatus === 'Select studying in' ? 'text-neutral-400' : 'text-text'}`}>
          {selectedStatus}
        </Text>
        <Ionicons 
          name={isStatusOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#060B13" 
        />
      </TouchableOpacity>

      {isStatusOpen && (
        <View className="w-full bg-white border border-neutral-300 rounded-[12px] -mt-5 mb-6 overflow-hidden">
          {statusOptions.map((item, index) => (
            <TouchableOpacity
              key={item}
              className={`px-4 py-[14px] ${index === statusOptions.length - 1 ? '' : 'border-b border-gray-200'}`}
              onPress={() => {
                setSelectedStatus(item);
                setIsStatusOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-1">Preferred Stream</Text>

      <TouchableOpacity
        className="w-full h-12 border border-neutral-300 rounded-[12px] flex-row items-center justify-between px-4 py-3 mb-6 bg-white"
        onPress={() => {
          setIsStreamOpen(!isStreamOpen);
          setIsStatusOpen(false);
        }}
        activeOpacity={0.7}
      >
        <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${selectedStream === 'Select Your Preferred Stream' ? 'text-neutral-400' : 'text-text'}`}>
          {selectedStream}
        </Text>
        <Ionicons 
          name={isStreamOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#060B13" 
        />
      </TouchableOpacity>

      {isStreamOpen && (
        <View className="w-full bg-white border border-neutral-300 rounded-[12px] -mt-5 mb-6 overflow-hidden">
          {streamOptions.map((item, index) => (
            <TouchableOpacity
              key={item}
              className={`px-4 py-[14px] ${index === streamOptions.length - 1 ? '' : 'border-b border-gray-200'}`}
              onPress={() => {
                setSelectedStream(item);
                setIsStreamOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View className="flex-1 min-h-[40px]" />

      <TouchableOpacity
        className={`absolute bottom-5 self-center w-[361px] h-12 rounded-[12px] justify-center items-center px-6 py-4 ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => isContinueEnabled && router.push('/nextScreen')}
        disabled={!isContinueEnabled}
        activeOpacity={0.8}
      >
        <Text className={`font-montserrat font-medium text-[18px] leading-[22px] tracking-normal text-center ${isContinueEnabled ? 'text-white' : 'text-[#C7C7C7]'}`}>
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Intermediate;
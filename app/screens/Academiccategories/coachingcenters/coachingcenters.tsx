
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CoachingCenters = () => {
  const router = useRouter();
  const [selectedLookingFor, setSelectedLookingFor] = useState(null);
  const lookingForOptions = [
    'Upskilling / Skill Development',
    'Exam Preparation',
    'Vocational Training',
  ];
  const [selectedLevel, setSelectedLevel] = useState('Select your academic status');
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const levelOptions = [
    'Completed Class 10',
    'Studying in Class 11',
    'Studying in Class 12',
    'Completed Class 12',
    'Pursuing Under Graduation',
    'Completed Under Graduation',
    'Pursuing Post Graduation',
    'Completed Post Graduation',
  ];
  const [selectedStream, setSelectedStream] = useState('Select your stream');
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const streamOptions = [
    'Entrance Exam Prep',
    'JEE Coaching',
    'NEET Coaching',
    'Civil Services',
    'Bank Exams',
    'SSC Exams',
    'Railway Exams',
    'Defence Exams',
  ];
  const [passoutYear, setPassoutYear] = useState('');

  const isContinueEnabled =
    selectedLookingFor &&
    selectedLevel !== 'Select your academic status' &&
    selectedStream !== 'Select your stream' &&
    passoutYear.trim() !== '';

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

      <ScrollView 
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 56, paddingBottom: 90}}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full h-[10px] bg-neutral-200 rounded-[5px] mt-5 mb-6 overflow-hidden">
          <View className="w-[75%] h-full bg-primary rounded-[5px]" />
        </View>

        <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5">Your Academic Profile</Text>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">What are you looking for?</Text>
        {lookingForOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center mb-4"
            onPress={() => setSelectedLookingFor(item)}
            activeOpacity={0.6}
          >
            <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
              {selectedLookingFor === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
            </View>
            <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
          </TouchableOpacity>
        ))}

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">What is your academic level?</Text>
        <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
          <TouchableOpacity
            className="h-12 flex-row items-center justify-between px-4"
            onPress={() => {
              setIsLevelOpen(!isLevelOpen);
              setIsStreamOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${selectedLevel === 'Select your academic status' ? 'text-neutral-400' : 'text-text'}`}>
              {selectedLevel}
            </Text>
            <Ionicons
              name={isLevelOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#060B13"
            />
          </TouchableOpacity>

          {isLevelOpen && (
            <View className="bg-neutral-100">
              {levelOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="flex-row items-center px-4 py-[14px]"
                  onPress={() => {
                    setSelectedLevel(item);
                    setIsLevelOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
                    {selectedLevel === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
                  </View>
                  <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">Stream</Text>
        <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
          <TouchableOpacity
            className="h-12 flex-row items-center justify-between px-4"
            onPress={() => {
              setIsStreamOpen(!isStreamOpen);
              setIsLevelOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text className={`font-montserrat font-normal text-base leading-[20px] tracking-normal flex-1 ${selectedStream === 'Select your stream' ? 'text-neutral-400' : 'text-text'}`}>
              {selectedStream}
            </Text>
            <Ionicons
              name={isStreamOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#060B13"
            />
          </TouchableOpacity>

          {isStreamOpen && (
            <View className="bg-neutral-100">
              {streamOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="flex-row items-center px-4 py-[14px]"
                  onPress={() => {
                    setSelectedStream(item);
                    setIsStreamOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="h-5 w-5 rounded-full border-2 border-text mr-3 justify-center items-center">
                    {selectedStream === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-text" />}
                  </View>
                  <Text className="font-montserrat font-normal text-base text-text leading-[20px] tracking-normal">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-[16px]">Passout Year</Text>
        <TextInput
          className="h-12 border border-neutral-300 rounded-[12px] px-4 mb-6 text-base font-montserrat text-text"
          placeholder="Enter year"
          placeholderTextColor="#A1A1A1"
          value={passoutYear}
          onChangeText={setPassoutYear}
          keyboardType="numeric"
          maxLength={4}
        />

        <View className="flex-1 min-h-[40px]" />
      </ScrollView>

      <TouchableOpacity
        className={`absolute bottom-[26px] left-[16.5px] w-[361px] h-12 rounded-[12px] justify-center items-center px-6 py-4 ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => isContinueEnabled && router.push('/home')}
        disabled={!isContinueEnabled}
        activeOpacity={0.8}
      >
        <Text className={`font-montserrat font-medium text-[18px] leading-[22px] tracking-normal text-center ${isContinueEnabled ? 'text-white' : 'text-neutral-500'}`}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CoachingCenters;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Kindergarten = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  
  const options = [
    'Currently in Kindergarten',
    'Completed Kindergarten',
    'Seeking Admission to Kindergarten',
  ];

  return (
    <View className="flex-1 bg-white px-5 pt-14">
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
        <View className="w-[65%] h-full bg-primary rounded-[5px]" />
      </View>

      <Text className="font-montserrat font-semibold text-[20px] text-black leading-[24px] tracking-normal mb-5">Academic Interests</Text>

      <Text className="font-montserrat font-semibold text-[18px] text-black leading-[22px] tracking-normal mb-6">Academic Status</Text>

      <View className="mb-auto">
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center mb-[28px]"
            onPress={() => setSelected(item)}
            activeOpacity={0.6}
          >
            <View className="h-5 w-5 rounded-full border-2 border-black mr-3 justify-center items-center">
              {selected === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-black" />}
            </View>
            <Text className="font-montserrat font-normal text-base text-black leading-[20px] tracking-normal">{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className={`self-center w-[361px] h-12 rounded-[12px] justify-center items-center mb-10 px-6 py-4 ${selected ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => selected && router.push('/nextScreen')}
        disabled={!selected}
        activeOpacity={0.8}
      >
        <Text className={`font-montserrat font-medium text-[18px] leading-[22px] tracking-normal text-center ${selected ? 'text-white' : 'text-[#C7C7C7]'}`}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Kindergarten;
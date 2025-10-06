import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import kindergarten from '../../assets/images/kindergarten.png';
import school from '../../assets/images/school.png';
import intermediate from '../../assets/images/intermediate.png';
import graduation from '../../assets/images/graduation.png';
import coachingcenters from '../../assets/images/coachingcenters.png';
import studyhalls from '../../assets/images/studyhalls.png';
import tuitioncenter from '../../assets/images/tuitioncenter.png';
import studyabroad from '../../assets/images/studyabroad.png';

const AcademicInterestsScreen = () => {
  const router = useRouter();
  const interests = ['Kindergarten', 'School', 'Intermediate', 'Graduation', 'Coaching Centers', 'Study Halls', 'Tuition Center', 'Study Abroad'];

  const routeMap = {
    'Kindergarten': 'kindergarten',
    'School': 'school',
    'Intermediate': 'intermediate',
    'Graduation': 'graduation',
    'Coaching Centers': 'coachingcenters',
    'Study Halls': 'studyhalls',
    'Tuition Center': 'tuitioncenters',
    'Study Abroad': 'studyabroad',
  };

  const imageMap = {
    'Kindergarten': kindergarten,
    'School': school,
    'Intermediate': intermediate,
    'Graduation': graduation,
    'Coaching Centers': coachingcenters,
    'Study Halls': studyhalls,
    'Tuition Center': tuitioncenter,
    'Study Abroad': studyabroad,
  };

  const renderHeader = () => (
    <View className="px-5 pt-14 pb-6">
      <View className="w-[270px] h-[10px] bg-neutral-200 rounded-[5px] mb-6 overflow-hidden self-center">
        <View className="w-[75%] h-full bg-primary rounded-[5px]" />
      </View>

      <Text className="font-montserrat font-medium text-[24px] text-text leading-[24px] tracking-normal mb-[30px] self-start">Academic Interests</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="w-[48%] h-[97px] bg-gray-300 rounded-[8px] justify-center items-center mb-3 mr-2"
      onPress={() => router.push(`/screens/Academiccategories/${routeMap[item]}/${routeMap[item]}`)}
      activeOpacity={0.7}
    >
      <Image source={imageMap[item]} className="w-full h-full rounded-[8px]" resizeMode="cover" />
    </TouchableOpacity>
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
        data={interests}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{paddingBottom: 140}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        className="self-center w-full h-12 bg-primary rounded-lg justify-center items-center mb-10"
        onPress={() => router.push('/home')}
        activeOpacity={0.8}
      >
        <Text className="font-montserrat font-medium text-[18px] text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AcademicInterestsScreen;
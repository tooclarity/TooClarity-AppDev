
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
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
  const { width } = Dimensions.get('window');
  const numColumns = Math.floor(width / 168); // Adjust based on tile width of 168px
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

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.tile}
      onPress={() => router.push(`/screens/Academiccategories/${routeMap[item]}/${routeMap[item]}`)}
    >
      <Image source={imageMap[item]} style={styles.tileImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academic Interests</Text>

      <FlatList
        data={interests}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingTop: 20, // Reduced padding to avoid extra space at the top
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#060B13',
    marginBottom: 30,
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  tile: {
    width: 168,
    height: 97,
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0222D7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default AcademicInterestsScreen;

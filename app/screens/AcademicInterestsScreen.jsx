import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const AcademicInterestsScreen = () => {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const numColumns = Math.floor(width / 168); // Adjust based on tile width of 168px
  const interests = ['Kindergarten', 'School', 'Intermediate', 'Graduation', 'Coaching Centers', 'Study Halls', 'Tuition Center', 'Study Abroad'];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tile}>
      <Text style={styles.tileText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

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
        onPress={() => router.push('/nextScreen')}
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
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 24,
    color: '#060B13',
  },
  progressBarContainer: {
    width: '90%',
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 40,
  },
  progressBarFill: {
    width: '50%', // Updated progress for this screen
    height: '100%',
    backgroundColor: '#0222D7',
    borderRadius: 2,
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
  tileText: {
    fontSize: 16,
    color: '#060B13',
    textAlign: 'center',
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

// app/screens/Academiccategories/kindergarten/kindergarten.jsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#060B13" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/home')}>
        <Text style={styles.skipText}>SKIP &gt;</Text>
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      <Text style={styles.title}>Academic Interests</Text>

      <Text style={styles.subTitle}>Academic Status</Text>

      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => setSelected(item)}
        >
          <View style={[
            styles.radioCircle,
            selected === item && styles.selectedRadioCircle
          ]} />
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: selected ? '#0222D7' : '#E5E5E5' }
        ]}
        onPress={() => selected && router.push('/nextScreen')}
        disabled={!selected}
      >
        <Text style={[
          styles.buttonText,
          { color: selected ? '#FFFFFF' : '#A1A1A1' }
        ]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 14,
    color: '#060B13',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 40,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#0222D7',
    borderRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#060B13',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#060B13',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#060B13',
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: '#060B13',
  },
  optionText: {
    fontSize: 16,
    color: '#060B13',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Kindergarten;

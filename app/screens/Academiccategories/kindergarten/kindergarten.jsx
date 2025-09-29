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
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-back" size={24} color="#000000" />
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={() => router.push('/home')}
        activeOpacity={0.6}
      >
        <Text style={styles.skipText}>SKIP</Text>
        <Ionicons name="chevron-forward" size={11} color="#000000" style={styles.skipIcon} />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarFill} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Academic Interests</Text>

      {/* Subtitle */}
      <Text style={styles.subTitle}>Academic Status</Text>

      {/* Radio Options */}
      <View style={styles.optionsContainer}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => setSelected(item)}
            activeOpacity={0.6}
          >
            <View style={styles.radioOuter}>
              {selected === item && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          selected ? styles.continueButtonActive : styles.continueButtonInactive
        ]}
        onPress={() => selected && router.push('/nextScreen')}
        disabled={!selected}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          selected ? styles.buttonTextActive : styles.buttonTextInactive
        ]}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    zIndex: 10,
  },
  skipText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: 'center',
  },
  skipIcon: {
    marginLeft: 2.5,
    marginTop: 2.5,
  },
  progressBarContainer: {
    width: 270,
    height: 10,
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
    marginTop: 44,
    marginBottom: 24,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressBarFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#0222D7',
    borderRadius: 5,
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
    letterSpacing: 0,
    marginBottom: 20,
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    letterSpacing: 0,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 'auto',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000000',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  optionText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 20,
    letterSpacing: 0,
  },
  continueButton: {
    width: 361,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  continueButtonActive: {
    backgroundColor: '#0222D7',
  },
  continueButtonInactive: {
    backgroundColor: '#E5E5E5',
  },
  buttonText: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  buttonTextInactive: {
    color: '#C7C7C7',
  },
});

export default Kindergarten;
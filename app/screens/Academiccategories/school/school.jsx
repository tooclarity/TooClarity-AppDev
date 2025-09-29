// app/screens/Academiccategories/school/school.jsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const School = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('Select studying in');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState('Select Your Preferred Stream');
  const [isStreamOpen, setIsStreamOpen] = useState(false);

  const statusOptions = [
    'Currently in Kindergarten',
    'Completed Kindergarten',
    'Seeking Admission to Kindergarten'
  ];

  const streamOptions = [
    'Play School',
    'Montessori',
    'Traditional Kindergarten',
    'Waldorf',
    'Reggio Emilia'
  ];

  const isContinueEnabled = 
    selectedStatus !== 'Select studying in' && 
    selectedStream !== 'Select Your Preferred Stream';

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
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

      {/* Academic Status Section */}
      <Text style={styles.subTitle}>Academic Status</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          setIsStatusOpen(!isStatusOpen);
          setIsStreamOpen(false);
        }}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          selectedStatus === 'Select studying in' ? styles.placeholderText : styles.selectedText
        ]}>
          {selectedStatus}
        </Text>
        <Ionicons 
          name={isStatusOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#060B13" 
        />
      </TouchableOpacity>

      {isStatusOpen && (
        <View style={styles.optionList}>
          {statusOptions.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionItem,
                index === statusOptions.length - 1 && styles.lastOptionItem
              ]}
              onPress={() => {
                setSelectedStatus(item);
                setIsStatusOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Preferred Stream Section */}
      <Text style={styles.subTitle}>Preferred Stream</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          setIsStreamOpen(!isStreamOpen);
          setIsStatusOpen(false);
        }}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          selectedStream === 'Select Your Preferred Stream' ? styles.placeholderText : styles.selectedText
        ]}>
          {selectedStream}
        </Text>
        <Ionicons 
          name={isStreamOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#060B13" 
        />
      </TouchableOpacity>

      {isStreamOpen && (
        <View style={styles.optionList}>
          {streamOptions.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionItem,
                index === streamOptions.length - 1 && styles.lastOptionItem
              ]}
              onPress={() => {
                setSelectedStream(item);
                setIsStreamOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          isContinueEnabled ? styles.continueButtonActive : styles.continueButtonInactive
        ]}
        onPress={() => isContinueEnabled && router.push('/nextScreen')}
        disabled={!isContinueEnabled}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          isContinueEnabled ? styles.buttonTextActive : styles.buttonTextInactive
        ]}>
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
  paddingHorizontal: 20,
  paddingTop: 56,
  paddingBottom: 40,
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
  alignSelf: 'center', // Changed from 'flex-start' to 'center'
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
  fontWeight: '500',
  color: '#000000',
  lineHeight: 20,
  letterSpacing: 0,
  marginBottom: 20,
},
subTitle: {
  fontFamily: 'Montserrat',
  fontSize: 18,
  fontWeight: '500',
  color: '#060B13',
  lineHeight: 22,
  letterSpacing: 0,
  marginBottom: 12,
  marginTop: 4,
},
dropdown: {
  width: '100%',
  height: 48,
  borderWidth: 1,
  borderColor: '#DADADA',
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
  marginBottom: 24,
  backgroundColor: '#FFFFFF',
},
dropdownText: {
  fontFamily: 'Montserrat',
  fontSize: 16,
  fontWeight: '400',
  lineHeight: 20,
  letterSpacing: 0,
  flex: 1,
},
placeholderText: {
  color: '#A1A1A1',
},
selectedText: {
  color: '#060B13',
},
optionList: {
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#DADADA',
  borderRadius: 12,
  marginTop: -20,
  marginBottom: 24,
  overflow: 'hidden',
},
optionItem: {
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#EEEEEE',
},
lastOptionItem: {
  borderBottomWidth: 0,
},
optionText: {
  fontFamily: 'Montserrat',
  fontSize: 16,
  fontWeight: '400',
  color: '#060B13',
  lineHeight: 20,
  letterSpacing: 0,
},
spacer: {
  flex: 1,
  minHeight: 40,
},
continueButton: {
  width: 361,
  height: 50,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
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

export default School;
// app/screens/Academiccategories/graduation/graduation.jsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Graduation = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('Select graduation type');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Select studying in');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState('Select Your Preferred Stream');
  const [isStreamOpen, setIsStreamOpen] = useState(false);

  const typeOptions = [
    'Under Graduation',
    'Post Graduation',
  ];

  const statusOptions = [
    'Pursuing',
    'Completed',
    'Seeking Admission'
  ];

  const streamOptions = [
    'Engineering',
    'Medicine',
    'Law',
    'Business',
    'Arts',
    'Science',
    'Computer Science',
    'Humanities'
  ];

  const isContinueEnabled = 
    selectedType !== 'Select graduation type' && 
    selectedStatus !== 'Select studying in' && 
    selectedStream !== 'Select Your Preferred Stream';

  return (
    <View style={styles.outerContainer}>
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

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Academic Interests</Text>

        {/* Graduation Type Section */}
        <Text style={styles.subTitle}>Graduation Type</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsStatusOpen(false);
              setIsStreamOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.dropdownText,
              selectedType === 'Select graduation type' ? styles.placeholderText : styles.selectedText
            ]}>
              {selectedType}
            </Text>
            <Ionicons 
              name={isTypeOpen ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#060B13" 
            />
          </TouchableOpacity>

          {isTypeOpen && (
            <View style={styles.optionList}>
              {typeOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedType(item);
                    setIsTypeOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioOuter}>
                    {selectedType === item && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Academic Status Section */}
        <Text style={styles.subTitle}>Academic Status</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsTypeOpen(false);
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
              {statusOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedStatus(item);
                    setIsStatusOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioOuter}>
                    {selectedStatus === item && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Preferred Stream Section */}
        <Text style={styles.subTitle}>Preferred Stream</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => {
              setIsStreamOpen(!isStreamOpen);
              setIsTypeOpen(false);
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
              {streamOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedStream(item);
                    setIsStreamOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioOuter}>
                    {selectedStream === item && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 90, // Adjusted to prevent overlap with fixed button
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
    width: '75%',
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
  dropdownContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  dropdownHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    backgroundColor: '#F5F6F9',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    color: '#060B13',
    lineHeight: 20,
    letterSpacing: 0,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  continueButton: {
    position: 'absolute',
    bottom: 26,
    left: 16.5,
    width: 361,
    height: 50,
    opacity: 1,
    gap: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingRight: 24,
    paddingBottom: 16,
    paddingLeft: 24,
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

export default Graduation;
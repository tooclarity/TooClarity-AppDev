import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
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
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-back" size={24} color="#060B13" />
      </TouchableOpacity>

      {/* Skip Button with Vector Icon */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/nextScreen')}
        accessibilityLabel="Skip to next screen"
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>SKIP</Text>
        <Ionicons name="arrow-forward" size={16} color="#060B13" style={styles.skipIcon} />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Your Academic Profile</Text>

      {/* Looking For Section */}
      <Text style={styles.subTitle}>What are you looking for?</Text>
      {lookingForOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => setSelectedLookingFor(item)}
          accessibilityLabel={'Select ' + item}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedLookingFor === item }}
        >
          <View style={styles.radioOuter}>
            {selectedLookingFor === item && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}

      {/* Academic Level Dropdown */}
      <Text style={styles.subTitle}>What is your academic level?</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setIsLevelOpen(!isLevelOpen)}
          accessibilityLabel="Select academic level"
          accessibilityRole="combobox"
          accessibilityState={{ expanded: isLevelOpen }}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedLevel === 'Select your academic status'
                ? styles.placeholderText
                : styles.selectedText,
            ]}
          >
            {selectedLevel}
          </Text>
          <Ionicons
            name={isLevelOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#060B13"
          />
        </TouchableOpacity>

        {isLevelOpen && (
          <View style={styles.optionList}>
            {levelOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.optionItem}
                onPress={() => {
                  setSelectedLevel(item);
                  setIsLevelOpen(false);
                }}
                accessibilityLabel={'Select ' + item}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedLevel === item }}
              >
                <View style={styles.radioOuter}>
                  {selectedLevel === item && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Stream Dropdown */}
      <Text style={styles.subTitle}>Stream</Text>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setIsStreamOpen(!isStreamOpen)}
          accessibilityLabel="Select stream"
          accessibilityRole="combobox"
          accessibilityState={{ expanded: isStreamOpen }}
        >
          <Text
            style={[
              styles.dropdownText,
              selectedStream === 'Select your stream'
                ? styles.placeholderText
                : styles.selectedText,
            ]}
          >
            {selectedStream}
          </Text>
          <Ionicons
            name={isStreamOpen ? 'chevron-up' : 'chevron-down'}
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
                accessibilityLabel={'Select ' + item}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedStream === item }}
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

      {/* Passout Year Input */}
      <Text style={styles.subTitle}>Passout Year</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter year"
        placeholderTextColor="#A1A1A1"
        value={passoutYear}
        onChangeText={setPassoutYear}
        keyboardType="numeric"
        maxLength={4}
        accessibilityLabel="Enter passout year"
        accessibilityRole="text"
      />

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          isContinueEnabled ? styles.continueButtonActive : styles.continueButtonInactive,
        ]}
        onPress={() => isContinueEnabled && router.push('/home')}
        disabled={!isContinueEnabled}
        accessibilityLabel="Next"
        accessibilityRole="button"
        accessibilityState={{ disabled: !isContinueEnabled }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            isContinueEnabled ? styles.buttonTextActive : styles.buttonTextInactive,
          ]}
        >
          Next
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
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  skipText: {
    fontSize: 14,
    color: '#060B13',
    fontWeight: '500',
  },
  skipIcon: {
    marginTop: 2,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginVertical: 20,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  progressBarFill: {
    width: '75%',
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
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioOuter: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#060B13',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#060B13',
  },
  optionText: {
    fontSize: 16,
    color: '#060B13',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#DADADD',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  dropdownHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
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
    paddingVertical: 12,
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#060B13',
  },
  continueButton: {
    width: 361,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  continueButtonActive: {
    backgroundColor: '#0222D7',
  },
  continueButtonInactive: {
    backgroundColor: '#E5E5E5',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  buttonTextInactive: {
    color: '#A1A1A1',
  },
});

export default CoachingCenters;
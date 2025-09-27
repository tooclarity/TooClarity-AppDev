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
          accessibilityLabel={`Select ${item}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedLookingFor === item }}
        >
          <View
            style={[
              styles.radioCircle,
              selectedLookingFor === item && styles.selectedRadioCircle,
            ]}
          />
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}

      {/* Academic Level Dropdown */}
      <Text style={styles.subTitle}>What is your academic level?</Text>
      <TouchableOpacity
        style={styles.dropdown}
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
          size={24}
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
              accessibilityLabel={`Select ${item}`}
              accessibilityRole="option"
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Stream Dropdown */}
      <Text style={styles.subTitle}>Stream</Text>
      <TouchableOpacity
        style={styles.dropdown}
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
          size={24}
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
              accessibilityLabel={`Select ${item}`}
              accessibilityRole="option"
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
        accessibilityRole="text" // Changed from 'textbox' to 'text'
      />

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: isContinueEnabled ? '#0222D7' : '#E5E5E5' },
        ]}
        onPress={() => isContinueEnabled && router.push('/home')}
        disabled={!isContinueEnabled}
        accessibilityLabel="Continue to next screen"
        accessibilityRole="button"
        accessibilityState={{ disabled: !isContinueEnabled }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            { color: isContinueEnabled ? '#FFFFFF' : '#A1A1A1' },
          ]}
        >
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
    marginBottom: 15,
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
  dropdown: {
    height: 50,
    width: '100%',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
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
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    maxHeight: 200,
    overflow: 'scroll',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#060B13',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CoachingCenters;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const StudyAbroad = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const countryOptions = [
    'USA',
    'UK',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'New Zealand',
    'Ireland',
  ];
  const [selectedLevel, setSelectedLevel] = useState('Select your academic level');
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const levelOptions = [
    'High School',
    'Under Graduation',
    'Post Graduation',
    'Doctoral',
  ];
  const [passoutYear, setPassoutYear] = useState('');

  const isContinueEnabled = selectedCountry && selectedLevel !== 'Select your academic level' && passoutYear.trim() !== '';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#060B13" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/nextScreen')}>
        <Text style={styles.skipText}>SKIP &gt;</Text>
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      <Text style={styles.title}>Your Study Abroad Profile</Text>

      <Text style={styles.subTitle}>Which country are you interested in?</Text>

      {countryOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => setSelectedCountry(item)}
        >
          <View style={[
            styles.radioCircle,
            selectedCountry === item && styles.selectedRadioCircle
          ]} />
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subTitle}>What is your academic level?</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsLevelOpen(!isLevelOpen)}
      >
        <Text style={[
          styles.dropdownText,
          selectedLevel === 'Select your academic level' ? styles.placeholderText : styles.selectedText
        ]}>{selectedLevel}</Text>
        <Ionicons name="chevron-down" size={24} color="#060B13" />
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
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.subTitle}>Passout Year (Optional)</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter year"
        placeholderTextColor="#A1A1A1"
        value={passoutYear}
        onChangeText={setPassoutYear}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: isContinueEnabled ? '#0222D7' : '#E5E5E5' }
        ]}
        onPress={() => isContinueEnabled && router.push('/nextScreen')}
        disabled={!isContinueEnabled}
      >
        <Text style={[
          styles.buttonText,
          { color: isContinueEnabled ? '#FFFFFF' : '#A1A1A1' }
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
  dropdown: {
    height: 50,
    width: '100%',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
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
    marginBottom: 20,
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
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default StudyAbroad;

// app/screens/Academiccategories/graduation/graduation.jsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  const isContinueEnabled = selectedType !== 'Select graduation type' && selectedStatus !== 'Select studying in' && selectedStream !== 'Select Your Preferred Stream';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#060B13" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/home')}>
        <Text style={styles.skipText}>SKIP &gt; </Text>
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      <Text style={styles.title}>Academic Interests</Text>

      <Text style={styles.subTitle}>Graduation Type</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsTypeOpen(!isTypeOpen)}
      >
        <Text style={[
          styles.dropdownText,
          selectedType === 'Select graduation type' ? styles.placeholderText : styles.selectedText
        ]}>{selectedType}</Text>
        <Ionicons name="chevron-down" size={24} color="#060B13" />
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
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.subTitle}>Academic Status</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsStatusOpen(!isStatusOpen)}
      >
        <Text style={[
          styles.dropdownText,
          selectedStatus === 'Select studying in' ? styles.placeholderText : styles.selectedText
        ]}>{selectedStatus}</Text>
        <Ionicons name="chevron-down" size={24} color="#060B13" />
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
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.subTitle}>Preferred Stream</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsStreamOpen(!isStreamOpen)}
      >
        <Text style={[
          styles.dropdownText,
          selectedStream === 'Select Your Preferred Stream' ? styles.placeholderText : styles.selectedText
        ]}>{selectedStream}</Text>
        <Ionicons name="chevron-down" size={24} color="#060B13" />
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
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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

export default Graduation;
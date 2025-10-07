import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Correct image import with extension
import userAvatar from '../../assets/images/user-avatar.png';

export default function ProfileSetup() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [location, setLocation] = useState('');

  // JS version—no TypeScript cast
  const handleContinue = () => navigation.navigate('AcademicInterestsScreen');

  const isComplete = name && birthday && location;

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <View style={styles.backWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.title}>Tell us about you</Text>

        <View style={styles.avatarWrapper}>
          <Image source={userAvatar} style={styles.avatar} />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="DD/MM/YYYY" value={birthday} onChangeText={setBirthday} style={styles.input} />
        <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isComplete}
          style={[styles.continueBtn, { backgroundColor: isComplete ? '#0222D7' : '#CCCCCC' }]}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backWrapper: { padding: 10 },
  backButton: { padding: 10 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  progressBar: { width: '90%', height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginBottom: 24 },
  progressFill: { width: '20%', height: 4, backgroundColor: '#0222D7', borderRadius: 2 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 24 },
  avatarWrapper: { marginBottom: 24 },
  avatar: { width: 150, height: 150, borderRadius: 75 },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0222D7',
    borderRadius: 16,
    padding: 6,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  continueBtn: {
    width: '100%',
    height: 50,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  continueText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
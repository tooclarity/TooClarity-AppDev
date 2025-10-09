import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Correct image import with extension
import userAvatar from '../../assets/images/user-avatar.png';

export default function ProfileSetup() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [location, setLocation] = useState('');

  // Focus states for inputs
  const [nameFocused, setNameFocused] = useState(false);
  const [birthdayFocused, setBirthdayFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);

  const handleContinue = () => navigation.navigate('AcademicInterestsScreen');

  const isComplete = name.trim() !== '' && birthday.trim() !== '' && location.trim() !== '';

  // Floating label input component
  const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    onFocus,
    onBlur,
    focused,
    placeholder,
    keyboardType,
  }) => {
    return (
      <View style={styles.inputWrapper}>
        {(focused || value) && <Text style={styles.floatingLabel}>{label}</Text>}
        <TextInput
          placeholder={focused ? '' : placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[styles.input, focused && styles.inputFocused]}
          keyboardType={keyboardType || 'default'}
          placeholderTextColor="#999"
        />
      </View>
    );
  };

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
          <Image
            source={userAvatar}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <FloatingLabelInput
          label="Full name"
          value={name}
          onChangeText={setName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          focused={nameFocused}
          placeholder="Full name"
        />
        <FloatingLabelInput
          label="Birthday"
          value={birthday}
          onChangeText={setBirthday}
          onFocus={() => setBirthdayFocused(true)}
          onBlur={() => setBirthdayFocused(false)}
          focused={birthdayFocused}
          placeholder="DD/MM/YYYY"
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
        />
        <FloatingLabelInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          onFocus={() => setLocationFocused(true)}
          onBlur={() => setLocationFocused(false)}
          focused={locationFocused}
          placeholder="Location"
        />
      </View>
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isComplete}
          style={[styles.continueBtn, { backgroundColor: isComplete ? '#0222D7' : '#CCCCCC' }]}
        >
          <Text style={[styles.continueText, { color: isComplete ? '#FFFFFF' : '#888888' }]}>Continue</Text>
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
  progressBar: { width: '90%', height: 8, backgroundColor: '#E0E0E0', borderRadius: 6, marginBottom: 24 },
  progressFill: { width: '40%', height: 8, backgroundColor: '#0222D7', borderRadius: 6 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 24, alignSelf: 'flex-start' },
  avatarWrapper: { marginBottom: 24, position: 'relative' },
  avatar: { width: 150, height: 150, borderRadius: 75, resizeMode: 'cover' },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0222D7',
    borderRadius: 12,
    padding: 6,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 24,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    fontSize: 12,
    color: '#0222D7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    fontWeight: '600',
    zIndex: 10,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  inputFocused: {
    borderColor: '#0222D7',
  },
  continueBtn: {
    width: '90%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    alignSelf: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

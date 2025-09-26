import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  // Removed unused imports from the original request but kept the necessary ones for the setup
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Essential for navigation

// This is the main component for the user profile setup screen.
export default function ProfileSetupScreen() {
  // Hook to access the navigation object provided by react-navigation
  const navigation = useNavigation();

  // State to hold the user's input for the profile fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // Could be a date picker in a real app

  // Handler function for the Continue button
  const handleContinue = () => {
    // In a real application, you would perform validation here
    if (!fullName || !email) {
        // Log error and potentially show a Toast/Modal to the user
        console.log("Validation Failed: Please fill in all required fields.");
        return;
    }

    // Navigates to the AcademicInterests screen. 
    // This assumes the route name 'AcademicInterests' is configured in your main navigator.
    console.log("Navigating to AcademicInterests...");
    navigation.navigate('AcademicInterests'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView handles the keyboard pushing the content up */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust offset for better fit
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Tell Us About Yourself</Text>
          <Text style={styles.subHeader}>
            Let's personalize your experience.
          </Text>

          {/* Full Name Input */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Alex Johnson"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          {/* Email Input */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., alex@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number Input */}
          <Text style={styles.label}>Phone Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., (555) 123-4567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={14} // Common limit for phone number entry
          />

          {/* Date of Birth Input */}
          <Text style={styles.label}>Date of Birth (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
            maxLength={10} // MM/DD/YYYY
          />
          
        </ScrollView>
        
        {/* Continue Button (Placed outside ScrollView to keep it always visible) */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            {/* Navigation for skipping the step */}
            <TouchableOpacity onPress={() => navigation.navigate('AcademicInterests')}>
                <Text style={styles.skipText}>
                    Skip for now
                </Text>
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20, 
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937', 
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#6B7280', 
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB', 
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB', 
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', 
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#10B981', 
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, 
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  skipText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  }
});

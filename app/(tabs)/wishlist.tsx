import React from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Platform, KeyboardAvoidingView, Alert
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth-context'; // ✅ Correct import
import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';

export default function ProfileSetupScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Clear auth state
      router.replace('/(auth)/login'); // Navigate to login screen
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.centerContent}>
            <View style={styles.logoWrapper}>
              <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
              <View style={styles.maintenanceOverlay}>
                <Text style={styles.maintenanceHeader}> Wish List Page Under Maintenance</Text>
                <Text style={styles.maintenanceText}>
                  We're currently updating this page. Please check back later.
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  centerContent: { alignItems: 'center' },
  logoWrapper: { width: '100%', alignItems: 'center', marginBottom: 40 },
  logo: { width: 180, height: 80, opacity: 0.2 },
  maintenanceOverlay: { position: 'absolute', top: -10, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  maintenanceHeader: { fontSize: 26, fontWeight: '700', color: '#EF4444', textAlign: 'center' },
  maintenanceText: { fontSize: 16, color: '#374151', textAlign: 'center', marginTop: 8 },
  logoutButton: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, alignItems: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  logoutButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});

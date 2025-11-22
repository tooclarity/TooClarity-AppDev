// app/screens/ProfileSetupScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useAuthStore } from "../types/authStore"; 
import { API_BASE_URL } from "../../utils/constant";
import {
  ChevronLeft,
  User,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
} from "lucide-react-native";

// 🖼️ Assets
// Make sure these paths are correct in your project structure
import PlaceholderProfile from "../../assets/images/placeholder-profile.png";
import ProgramsVisitedIcon from "../../assets/images/programsvisitedicon.png";
import WishlistIcon from "../../assets/images/wishlistcoloricon.png";
import RequestsRaisedIcon from "../../assets/images/requestsraised.png";

export default function ProfileSetupScreen() {
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Local state for avatar to ensure instant updates
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  /** Fetch profile directly from API */
  const fetchUserProfile = useCallback(async () => {
    try {
      console.log("🔄 [ProfileScreen] Fetching latest user data...");
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const res = await response.json();
      // Handle backend variations { success: true, data: user } OR just user object
      const data = res?.data?.user || res?.data || (res.success ? res : null);

      if (data) {
        console.log("✅ [ProfileScreen] User data loaded:", data.name);
        setUserData(data);
        
        // Handle Case Sensitivity
        const pic = data.profilePicture || data.ProfilePicture || null;
        setAvatarUrl(pic);
      }
    } catch (err) {
      console.error("❌ [ProfileScreen] Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Re-fetch data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  /** Pull-to-refresh */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
  };

  /** Edit profile navigation */
  const handleEditProfile = () => {
    // Navigate to your edit profile or setup screen
    router.push("/(auth)/profilesetup");
  };

  /** Logout */
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  /** Loading View */
  if (loading && !userData) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: "#555" }}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  /** Main UI */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              // Logic: Remote URL -> Placeholder Asset
              source={avatarUrl ? { uri: avatarUrl } : PlaceholderProfile}
              style={styles.profileImage}
              resizeMode="cover"
              onError={(e) => {
                  console.log("⚠️ Image Load Error:", e.nativeEvent.error);
                  // If remote image fails, fallback could be handled here by unsetting avatarUrl
                  // setAvatarUrl(null); 
              }}
            />
          </View>
          
          <Text style={styles.nameText}>{userData?.name || "User"}</Text>
          
          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>{userData?.email || "No email provided"}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit2 size={16} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {[
            { icon: ProgramsVisitedIcon, value: userData?.programsVisited || 0, label: "Programs Visited" },
            { icon: WishlistIcon, value: userData?.wishlist?.length || 0, label: "Wishlist" },
            { icon: RequestsRaisedIcon, value: userData?.requestsRaised || 0, label: "Requests Raised" },
          ].map((item, idx) => (
            <View style={styles.statItem} key={idx}>
              <View style={styles.statIconBox}>
                <Image source={item.icon} style={styles.statIcon} resizeMode="contain" />
              </View>
              <Text style={styles.statValue}>{item.value.toString().padStart(2, "0")}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          {[
            { icon: <User size={20} color="#6B7280" />, label: "Profile", route: "/(auth)/profilesetup" },
            { icon: <Bell size={20} color="#6B7280" />, label: "Notifications", route: "/screens/notifications" },
            { icon: <HelpCircle size={20} color="#6B7280" />, label: "Help Center", route: "/help" },
            { icon: <Shield size={20} color="#6B7280" />, label: "Security & Privacy", route: "/security" },
          ].map((item, idx) => (
            <TouchableOpacity 
                key={idx} 
                style={styles.menuItem}
                onPress={() => {
                    if(item.route) router.push(item.route as any);
                    else Alert.alert("Coming Soon", "This feature is under development.");
                }}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>{item.icon}</View>
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconContainer}>
                <LogOut size={20} color="#EF4444" strokeWidth={2} />
              </View>
              <Text style={[styles.menuText, { color: "#EF4444" }]}>Logout</Text>
            </View>
            <ChevronRight size={20} color="#EF4444" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Styles */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#EEF2FF",
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1F2937", fontFamily: "Montserrat-SemiBold" },
  headerSpacer: { width: 40 },

  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: "center", marginTop: 20, marginBottom: 32 },
  profileImageContainer: { width: 120, height: 120, borderRadius: 60, overflow: "hidden", marginBottom: 16, backgroundColor: "#fff", borderWidth: 3, borderColor: "#fff" },
  profileImage: { width: "100%", height: "100%" },
  nameText: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 8, fontFamily: "Montserrat-SemiBold" },
  emailContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  emailText: { fontSize: 14, color: "#6B7280", fontFamily: "Montserrat-Regular" },
  editButton: { padding: 4 },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32, gap: 12 },
  statItem: { flex: 1, alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statIconBox: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statIcon: { width: 28, height: 28 },
  statValue: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 4, fontFamily: "Montserrat-SemiBold" },
  statLabel: { fontSize: 12, color: "#6B7280", textAlign: "center", fontFamily: "Montserrat-Regular" },

  menuContainer: { gap: 12 },
  menuItem: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIconContainer: { width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  menuText: { fontSize: 16, color: "#374151", fontWeight: "500", fontFamily: "Montserrat-Medium" },
});
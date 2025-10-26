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
import { router } from "expo-router";
import { useAuthStore } from "../types/authStore"; // updated auth store
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
import PlaceholderProfile from "../../assets/images/placeholder-profile.png";
import ProgramsVisitedIcon from "../../assets/images/programsvisitedicon.png";
import WishlistIcon from "../../assets/images/wishlistcoloricon.png";
import RequestsRaisedIcon from "../../assets/images/requestsraised.png";

export default function ProfileSetupScreen() {
  const { user, refreshUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPicAlert, setShowPicAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  /** Fetch profile inline */
  const fetchProfileInline = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res = await response.json();
      const data = res?.data || res;
      return {
        id: data?.id || data?._id || "",
        name: data?.name || "",
        email: data?.email || "",
        phoneNumber: data?.contactNumber || "",
        profilePicture: data?.profilePicture || data?.ProfilePicutre || null,
        birthday: data?.birthday || null,
      };
    } catch (err) {
      console.error("❌ fetchProfileInline error:", err);
      return null;
    }
  }, []);

  /** Load user data */
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      await refreshUser();
      const profile = await fetchProfileInline();
      if (!profile) return;

      setUserData(profile);
      if (profile.profilePicture) setAvatarUrl(profile.profilePicture);
      else if (!hasShownAlert) {
        setShowPicAlert(true);
        setHasShownAlert(true);
      }
    } catch (err) {
      console.error("❌ fetchUserData error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchProfileInline, refreshUser, hasShownAlert]);

  useEffect(() => {
    fetchUserData();
  }, []);

  /** Pull-to-refresh */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
  };

  /** Missing profile picture alert */
  useEffect(() => {
    if (showPicAlert) {
      Alert.alert("Profile Picture Missing", "Update your profile pic, it's missing!", [
        { text: "OK", style: "default" },
        {
          text: "Edit Profile",
          onPress: handleEditProfile,
        },
      ]);
      setShowPicAlert(false);
    }
  }, [showPicAlert]);

  /** Edit profile */
  const handleEditProfile = () => {
    Alert.alert(
      "Coming Soon 🚧",
      "Profile editing is under progress.\nPlease go back for now.",
      [{ text: "OK" }]
    );
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

  /** Loading screen */
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[tw.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: "#555" }}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  /** Main UI */
  return (
    <SafeAreaView style={tw.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2FF" />

      {/* Header */}
      <View style={tw.header}>
        <TouchableOpacity onPress={() => router.back()} style={tw.backButton}>
          <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={tw.headerTitle}>Profile</Text>
        <View style={tw.headerSpacer} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={tw.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Section */}
        <View style={tw.profileSection}>
          <View style={tw.profileImageContainer}>
            <Image
              source={avatarUrl ? { uri: avatarUrl } : PlaceholderProfile}
              style={tw.profileImage}
              resizeMode="cover"
              onError={() => console.warn("⚠️ Failed to load profile image")}
            />
          </View>
          <Text style={tw.nameText}>{userData?.name || "User"}</Text>
          <View style={tw.emailContainer}>
            <Text style={tw.emailText}>{userData?.email || "example@gmail.com"}</Text>
            <TouchableOpacity style={tw.editButton} onPress={handleEditProfile}>
              <Edit2 size={16} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={tw.statsContainer}>
          {[
            { icon: ProgramsVisitedIcon, value: 42, label: "Programs Visited" },
            { icon: WishlistIcon, value: 5, label: "Wishlist" },
            { icon: RequestsRaisedIcon, value: 7, label: "Requests Raised" },
          ].map((item, idx) => (
            <View style={tw.statItem} key={idx}>
              <View style={tw.statIconBox}>
                <Image source={item.icon} style={tw.statIcon} resizeMode="contain" />
              </View>
              <Text style={tw.statValue}>{item.value.toString().padStart(2, "0")}</Text>
              <Text style={tw.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Section */}
        <View style={tw.menuContainer}>
          {[
            { icon: <User size={20} color="#6B7280" />, label: "Profile" },
            { icon: <Bell size={20} color="#6B7280" />, label: "Notifications" },
            { icon: <HelpCircle size={20} color="#6B7280" />, label: "Help Center" },
            { icon: <Shield size={20} color="#6B7280" />, label: "Security & Privacy" },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={tw.menuItem}>
              <View style={tw.menuLeft}>
                <View style={tw.menuIconContainer}>{item.icon}</View>
                <Text style={tw.menuText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity style={tw.menuItem} onPress={handleLogout}>
            <View style={tw.menuLeft}>
              <View style={tw.menuIconContainer}>
                <LogOut size={20} color="#6B7280" strokeWidth={2} />
              </View>
              <Text style={tw.menuText}>Logout</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Styles */
const tw = StyleSheet.create({
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
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1F2937", fontFamily: "montserrat-semibold" },
  headerSpacer: { width: 40 },

  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: "center", marginTop: 20, marginBottom: 32 },
  profileImageContainer: { width: 120, height: 120, borderRadius: 60, overflow: "hidden", marginBottom: 16, backgroundColor: "#fff", borderWidth: 3, borderColor: "#fff" },
  profileImage: { width: "100%", height: "100%" },
  nameText: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 8, fontFamily: "montserrat-semibold" },
  emailContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  emailText: { fontSize: 14, color: "#6B7280", fontFamily: "montserrat-regular" },
  editButton: { padding: 4 },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32, gap: 12 },
  statItem: { flex: 1, alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statIconBox: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statIcon: { width: 28, height: 28 },
  statValue: { fontSize: 20, fontWeight: "600", color: "#111827", marginBottom: 4, fontFamily: "montserrat-semibold" },
  statLabel: { fontSize: 12, color: "#6B7280", textAlign: "center", fontFamily: "montserrat-regular" },

  menuContainer: { gap: 12 },
  menuItem: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIconContainer: { width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  menuText: { fontSize: 16, color: "#374151", fontWeight: "500", fontFamily: "montserrat-medium" },
});

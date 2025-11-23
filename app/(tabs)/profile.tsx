// app/screens/ProfileSetupScreen.tsx
import React, { useState, useCallback } from "react";
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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useAuthStore } from "../types/authStore";
import { API_BASE_URL } from "../../utils/constant";
import {
  ChevronLeft,
  User,
  Bell,
  Info,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
  X,
  Paperclip,
} from "lucide-react-native";

// 🖼️ Assets
// Ensure these paths are correct in your project
import PlaceholderProfile from "../../assets/images/placeholder-profile.png";
import ProgramsVisitedIcon from "../../assets/images/programsvisitedicon.png";
import WishlistIcon from "../../assets/images/wishlistcoloricon.png";
import RequestsRaisedIcon from "../../assets/images/requestsraised.png";

// --- Types for Ticket System ---
interface TicketFormData {
  subject: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "";
}

interface TicketFormErrors {
  subject?: string;
  category?: string;
  description?: string;
  priority?: string;
}

const TICKET_CATEGORIES = [
  "Technical Issue",
  "Billing & Payment",
  "Course Information",
  "Account & Profile",
  "Counselling",
  "General Inquiry",
  "Other",
];

const TICKET_PRIORITIES = ["Low", "Medium", "High"];

export default function ProfileSetupScreen() {
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Image State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);

  // --- Ticket Modal State ---
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketData, setTicketData] = useState<TicketFormData>({
    subject: "",
    category: "",
    description: "",
    priority: "",
  });
  const [ticketErrors, setTicketErrors] = useState<TicketFormErrors>({});

  // --- Fetch Wishlist Count ---
  const fetchWishlistCount = async (userId: string) => {
    if (!userId) return;
    try {
      const storageKey = `wishlistedCourses_${userId}`;
      const savedIdsString = await AsyncStorage.getItem(storageKey);
      const savedIds = savedIdsString ? JSON.parse(savedIdsString) : [];
      setWishlistCount(savedIds.length);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      setWishlistCount(0);
    }
  };

  // --- Fetch User Profile & Fix Image Logic ---
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const res = await response.json();
      
      // Handle various response structures
      const data = res?.data?.user || res?.data || (res.success ? res : null);

      if (data) {
        setUserData(data);

        // 🔍 ROBUST IMAGE EXTRACTION LOGIC
        // Checks multiple keys and handles relative URLs
        let pic = 
          data.profilePicture || 
          data.ProfilePicture || 
          data.avatar || 
          data.profile_picture || 
          data.image || 
          null;

        if (pic) {
          // If the backend returns a relative path (e.g. "/uploads/user.jpg"), prepend Base URL
          if (!pic.startsWith('http') && !pic.startsWith('file')) {
             // Remove leading slash if API_BASE_URL already has one or vice versa to avoid double slashes
             const cleanBase = API_BASE_URL.replace(/\/$/, '');
             const cleanPath = pic.startsWith('/') ? pic : `/${pic}`;
             pic = `${cleanBase}${cleanPath}`;
          }
          setAvatarUrl(pic);
          setImageError(false); // Reset error state on new fetch
        } else {
          setAvatarUrl(null);
        }

        if (data._id) {
            await fetchWishlistCount(data._id);
        }
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
  };

  const handleLogout = async () => {
    try {
      setWishlistCount(0); 
      setUserData(null);
      await logout();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  // --- Ticket Logic ---
  const handleTicketChange = (field: keyof TicketFormData, value: string) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
    if (ticketErrors[field]) setTicketErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateTicketForm = (): boolean => {
    const newErrors: TicketFormErrors = {};
    if (!ticketData.subject.trim()) newErrors.subject = "Subject is required";
    if (!ticketData.category) newErrors.category = "Please select a category";
    if (!ticketData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (ticketData.description.trim().length < 10) {
      newErrors.description = "Must be at least 10 characters";
    }
    if (!ticketData.priority) newErrors.priority = "Select a priority";
    setTicketErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitTicket = async () => {
    if (!validateTicketForm()) return;
    setIsSubmittingTicket(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ticketData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Failed to submit ticket");

      Alert.alert("Success", "Ticket raised successfully!");
      setTicketData({ subject: "", category: "", description: "", priority: "" });
      setShowTicketModal(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit ticket.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  if (loading && !userData) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                (avatarUrl && !imageError) 
                  ? { uri: avatarUrl } 
                  : PlaceholderProfile
              }
              style={styles.profileImage}
              resizeMode="cover"
              onError={() => setImageError(true)} // Fallback if URL is broken
            />
          </View>
          <Text style={styles.nameText}>{userData?.name || "User"}</Text>
          
          <View style={styles.emailRow}>
            <Text style={styles.emailText}>{userData?.email || "No email provided"}</Text>
            <TouchableOpacity 
              style={styles.editIconWrapper}
              onPress={() => router.push("/(auth)/profilesetup")}
            >
              <Edit2 size={14} color="#0222D7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section - Replicating screenshot layout */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
               <Image source={ProgramsVisitedIcon} style={styles.statIcon} resizeMode="contain" />
            </View>
            <Text style={styles.statNumber}>{String(userData?.programsVisited || 0).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Programs Visited</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
               <Image source={WishlistIcon} style={styles.statIcon} resizeMode="contain" />
            </View>
            <Text style={styles.statNumber}>{String(wishlistCount).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
               <Image source={RequestsRaisedIcon} style={styles.statIcon} resizeMode="contain" />
            </View>
            <Text style={styles.statNumber}>{String(userData?.requestsRaised || 0).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Requests Raised</Text>
          </View>
        </View>

        {/* Menu List - Single Container Style */}
        <View style={styles.menuContainer}>
          
          {/* Profile */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(auth)/profilesetup")}>
            <View style={styles.menuLeft}>
              <User size={22} color="#374151" strokeWidth={1.5} />
              <Text style={styles.menuText}>Profile</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.separator} />

          {/* Notifications */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/screens/notifications")}>
            <View style={styles.menuLeft}>
              <Bell size={22} color="#374151" strokeWidth={1.5} />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.separator} />

          {/* Help center */}
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowTicketModal(true)}>
            <View style={styles.menuLeft}>
              <Info size={22} color="#374151" strokeWidth={1.5} />
              <Text style={styles.menuText}>Help center</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.separator} />

          {/* Security & Privacy */}
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Coming Soon", "Security settings are under development.")}>
            <View style={styles.menuLeft}>
              <Shield size={22} color="#374151" strokeWidth={1.5} />
              <Text style={styles.menuText}>Security & Privacy</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.separator} />

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <LogOut size={22} color="#374151" strokeWidth={1.5} />
              <Text style={styles.menuText}>Logout</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Ticket Modal */}
      <Modal
        visible={showTicketModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTicketModal(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Raise a Ticket</Text>
                <TouchableOpacity onPress={() => setShowTicketModal(false)} style={styles.closeButton}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Tell us about your issue and we'll help you.</Text>
              
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Subject <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={[styles.input, ticketErrors.subject && styles.inputError]}
                    placeholder="Brief description"
                    placeholderTextColor="#9CA3AF"
                    value={ticketData.subject}
                    onChangeText={(text) => handleTicketChange("subject", text)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
                  <View style={styles.chipContainer}>
                    {TICKET_CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.chip, ticketData.category === cat && styles.chipActive]}
                        onPress={() => handleTicketChange("category", cat)}
                      >
                        <Text style={[styles.chipText, ticketData.category === cat && styles.chipTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Priority <Text style={styles.required}>*</Text></Text>
                  <View style={styles.priorityContainer}>
                    {TICKET_PRIORITIES.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.priorityButton, 
                          ticketData.priority === p && styles.priorityButtonActive,
                          ticketData.priority === p && p === "High" ? { backgroundColor: '#FEE2E2', borderColor: '#EF4444' } : {}
                        ]}
                        onPress={() => handleTicketChange("priority", p as any)}
                      >
                        <Text style={[styles.priorityText, ticketData.priority === p && { fontWeight: "600" }]}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={[styles.textArea, ticketErrors.description && styles.inputError]}
                    placeholder="Describe your issue..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={ticketData.description}
                    onChangeText={(text) => handleTicketChange("description", text)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Attachment</Text>
                  <TouchableOpacity style={styles.attachmentButton}>
                    <Paperclip size={18} color="#6B7280" />
                    <Text style={styles.attachmentText}>Upload Screenshot</Text>
                  </TouchableOpacity>
                </View>
                <View style={{height: 20}} />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.submitButton, isSubmittingTicket && styles.submitButtonDisabled]}
                  onPress={submitTicket}
                  disabled={isSubmittingTicket}
                >
                  {isSubmittingTicket ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Ticket</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "Montserrat-SemiBold",
  },
  headerSpacer: {
    width: 32,
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Profile Info
  profileSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6", // Subtle border for white images
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    fontFamily: "Montserrat-Bold",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emailText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Montserrat-Regular",
  },
  editIconWrapper: {
    padding: 2,
  },

  // Stats Grid
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: '100%',
    height: '100%',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    fontFamily: "Montserrat-Bold",
  },
  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },

  // Menu List Container
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB", // Clean border as per screenshot
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    fontFamily: "Montserrat-Medium",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, height: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  modalTitle: { fontSize: 18, fontWeight: "700", fontFamily: "Montserrat-Bold", color: "#111827" },
  closeButton: { padding: 4 },
  modalSubtitle: { fontSize: 13, color: "#6B7280", paddingHorizontal: 20, marginTop: 10, marginBottom: 15, fontFamily: "Montserrat-Regular" },
  modalScroll: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8, fontFamily: "Montserrat-Medium" },
  required: { color: "#EF4444" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: "#F9FAFB", fontFamily: "Montserrat-Regular", color: "#111827" },
  textArea: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: "#F9FAFB", height: 100, fontFamily: "Montserrat-Regular", color: "#111827" },
  inputError: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "transparent" },
  chipActive: { backgroundColor: "#DBEAFE", borderColor: "#3B82F6" },
  chipText: { fontSize: 13, color: "#4B5563", fontFamily: "Montserrat-Medium" },
  chipTextActive: { color: "#1D4ED8", fontWeight: "600" },
  priorityContainer: { flexDirection: "row", gap: 10 },
  priorityButton: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: "#F3F4F6", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  priorityButtonActive: { backgroundColor: "#D1FAE5", borderColor: "#10B981" },
  priorityText: { fontSize: 14, color: "#4B5563", fontFamily: "Montserrat-Medium" },
  attachmentButton: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, borderStyle: "dashed", backgroundColor: "#F9FAFB" },
  attachmentText: { fontSize: 14, color: "#6B7280", fontFamily: "Montserrat-Regular" },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingBottom: Platform.OS === "ios" ? 30 : 20 },
  submitButton: { backgroundColor: "#0222D7", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  submitButtonDisabled: { backgroundColor: "#93C5FD" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", fontFamily: "Montserrat-SemiBold" },
});
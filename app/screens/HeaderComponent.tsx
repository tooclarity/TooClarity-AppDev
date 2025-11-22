// app/screens/Header.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- API HELPER (Inline to keep component self-contained) ---
const API_BASE_URL = 'https://tooclarity.onrender.com/api';

async function fetchLatestProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const json = await response.json();
    // Handle both data structures: { data: user } or just user
    return json.data?.user || json.data || (json.success ? json : null);
  } catch (e) {
    console.log("Header profile fetch failed:", e);
    return null;
  }
}

type School = {
  id: string;
  name: string;
  location: string;
  description: string;
  fees: string;
  duration: string;
  image: string;
  logo: string;
  category: string;
  curriculumType: string;
  estDate: string;
  timing: string;
  about: string;
  operationalDays: string[];
  additionalFeatures: Array<{ icon: string; label: string; value: string }>;
  facilities: Array<{ icon: string; label: string; value: string }>;
  bannerImage: string;
  bannerText: string;
};

type HeaderProps = {
  user: any;
  profilePic: string | null;
  getInitials: (name: string) => string;
  selectedSchool: School | null;
  showFilters: boolean;
};

const Header: React.FC<HeaderProps> = ({ user, profilePic, getInitials, selectedSchool, showFilters }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);

  // Determine initial image source from props
  // Note: Backend often sends "ProfilePicture" (Cap P) or "profilePicture"
  const propImage = profilePic || user?.profilePicture || user?.ProfilePicture || null;

  // --- EFFECT: Force Fetch if Missing ---
  useEffect(() => {
    // If we don't have an image from props, try fetching latest profile
    if (!propImage) {
        console.log("🖼️ [Header] Image missing in props. Fetching latest profile...");
        fetchLatestProfile().then((userData) => {
            if (userData) {
                const remoteImg = userData.profilePicture || userData.ProfilePicture;
                if (remoteImg) {
                    console.log("✅ [Header] Found image from API:", remoteImg);
                    setFetchedImage(remoteImg);
                } else {
                    console.log("⚠️ [Header] API returned user, but no image found.");
                }
            }
        });
    }
  }, [propImage]);

  // Final image logic: Fetched > Prop > User Object
  const finalImageUri = fetchedImage || propImage;

  if (selectedSchool || showFilters) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity onPress={() => router.push('/(auth)/profilesetup')} className="mr-3">
          
          {/* Show Image if URI exists and hasn't errored */}
          {finalImageUri && !imageError ? (
            <Image
              source={{ uri: finalImageUri }}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                console.error("❌ [Header] Image Load Error:", e.nativeEvent.error);
                setImageError(true); 
              }}
            />
          ) : (
            // Fallback: Initials
            <View className="w-12 h-12 rounded-full bg-[#0A46E4] justify-center items-center">
              <Text className="text-white font-Montserrat-semibold text-lg">
                {getInitials(user?.name || "?")}
              </Text>
            </View>
          )}

        </TouchableOpacity>
        <View>
          <Text className="font-Montserrat-regular text-[14px] text-gray-500">
            Welcome back
          </Text>
          <Text className="font-Montserrat-semibold text-[18px] text-black">
            {user?.name || 'User'} 👋
          </Text>
        </View>
      </View>
      
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => router.push('/screens/notifications')}
          className="w-14 h-14 items-center justify-center bg-white rounded-full shadow-sm"
        >
          <Ionicons name="notifications-outline" size={26} color="#1e1e1e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
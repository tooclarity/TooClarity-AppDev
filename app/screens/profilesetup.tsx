'use client';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ============================================
// SECTION: API AND CONFIGURATION
// ============================================

// Updated API_BASE_URL
const API_BASE_URL = "https://tooclarity.onrender.com/api";

// ============================================
// SECTION: CUSTOM HOOKS
// ============================================

// Simulated useAuth (replace with actual)
const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const updateUser = (updates: any) => setUser((prev: any) => ({ ...prev, ...updates }));
  const setProfileCompleted = (completed: boolean) => updateUser({ isProfileCompleted: completed });
  const refreshUser = async () => {
    try {
      const storedCookie = await AsyncStorage.getItem('authCookie') || '';
      const res = await fetch(`${API_BASE_URL}/v1/profile`, { 
        credentials: 'include',
        headers: {
          ...(storedCookie && { 'Cookie': storedCookie }),
        },
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to refresh user');
      }
      setUser(data.data || data);
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  };
  return { user, updateUser, setProfileCompleted, refreshUser };
};

// ============================================
// SECTION: ASSETS
// ============================================

// Assets
const coachingcenters = require('@/assets/images/coachingcenters.png');
const graduation = require('@/assets/images/graduation.png');
const intermediate = require('@/assets/images/intermediate.png');
const kindergarten = require('@/assets/images/kindergarten.png');
const placeholderAvatar = require('@/assets/images/profileicon.png');
const school = require('@/assets/images/school.png');
const studyabroad = require('@/assets/images/studyabroad.png');
const studyhalls = require('@/assets/images/studyhalls.png');
const tuitioncenter = require('@/assets/images/tuitioncenter.png');

// ============================================
// SECTION: TYPES
// ============================================

// Types
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
interface Errors { [key: string]: string | undefined; }

// ============================================
// SECTION: VALIDATION FUNCTIONS
// ============================================

// Validation
const NAME_REGEX = /^[A-Za-z][A-Za-z ]{0,78}[A-Za-z]$/;
const LOCATION_ALLOWED = /^[A-Za-z0-9 ,.'\-/()#]{3,120}$/;

function validateNameInstant(value: string): string | undefined {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length < 2) return "Name must be at least 2 characters";
  if (!NAME_REGEX.test(normalized)) return "Only letters and spaces allowed";
  return undefined;
}

function validateLocationInstant(value: string): string | undefined {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length < 3) return "Location must be at least 3 characters";
  if (!LOCATION_ALLOWED.test(normalized)) return "Use letters, numbers, , . - / ( ) #";
  return undefined;
}

function validateDateInstant(value: string, isBirthday = false): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const m = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return 'Enter valid date as DD/MM/YYYY';
  const [_, d, mo, y] = m.map(Number);
  const date = new Date(y, mo - 1, d);
  if (date.getDate() !== d || date.getMonth() !== mo - 1 || date.getFullYear() !== y) return 'Invalid date';
  if (isBirthday && date > new Date()) return 'Birthday cannot be in the future';
  return undefined;
}

function formatISOToDDMMYYYY(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ============================================
// SECTION: INTERESTS DATA
// ============================================

// Interests
const interests = [
  { key: "KINDERGARTEN", label: "Kindergarten", img: kindergarten },
  { key: "SCHOOL", label: "School", img: school },
  { key: "INTERMEDIATE", label: "Intermediate", img: intermediate },
  { key: "GRADUATION", label: "Graduation", img: graduation },
  { key: "COACHING_CENTER", label: "Coaching\nCenter", img: coachingcenters },
  { key: "STUDY_HALLS", label: "Study\nHalls", img: studyhalls },
  { key: "TUITION_CENTER", label: "Tuition\ncenter", img: tuitioncenter },
  { key: "STUDY_ABROAD", label: "Study\nAbroad", img: studyabroad },
];

// ============================================
// SECTION: HELPER FUNCTIONS
// ============================================

// Helper to get stored cookie
async function getStoredCookie(): Promise<string> {
  return await AsyncStorage.getItem('authCookie') || '';
}

// ============================================
// SECTION: S3 UPLOAD FUNCTIONS
// ============================================

// S3
interface PresignedUrlResponse { uploadUrl: string; }
interface UploadResult { success: boolean; fileUrl?: string; error?: string; }

async function getPresignedUrl(filename: string, filetype: string): Promise<string> {
  const storedCookie = await getStoredCookie();
  const res = await fetch(`${API_BASE_URL}/s3/upload-url`, {
    method: "POST",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json",
      ...(storedCookie && { 'Cookie': storedCookie }),
    },
    body: JSON.stringify({ filename, filetype }),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    throw new Error(data?.message || `Failed to get presigned URL (${res.status})`);
  }
  const presigned: PresignedUrlResponse = data;
  return presigned.uploadUrl;
}

async function uploadToS3(file: any): Promise<UploadResult> {
  try {
    const uploadURL = await getPresignedUrl(file.name || 'profile.jpg', file.type || 'image/jpeg');
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": file.type || 'image/jpeg' },
      body: file,
    });
    const text = await uploadResponse.text();
    if (!uploadResponse.ok) {
      throw new Error(text || `Failed to upload file to S3 (${uploadResponse.status})`);
    }
    const fileUrl = uploadURL.split("?")[0];
    return { success: true, fileUrl };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return { success: false, error: message };
  }
}

// ============================================
// SECTION: API FUNCTIONS
// ============================================

async function getProfileFallback(user: any): Promise<any> {
  try {
    const storedCookie = await getStoredCookie();
    const res = await fetch(`${API_BASE_URL}/v1/profile`, { 
      credentials: 'include',
      headers: {
        ...(storedCookie && { 'Cookie': storedCookie }),
      },
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }
    if (!res.ok) throw new Error(data?.message || 'Failed to fetch profile');
    return data.data || data;
  } catch (e) {
    console.warn('Profile fetch failed, using user store', e);
    return user || { id: '', name: '', email: '' };
  }
}

async function updateStudent(id: string, payload: any): Promise<any> {
  const storedCookie = await getStoredCookie();
  const res = await fetch(`${API_BASE_URL}/v1/students/${encodeURIComponent(id)}`, {
    method: "PUT",
    credentials: 'include',
    headers: { 
      "Content-Type": "application/json",
      ...(storedCookie && { 'Cookie': storedCookie }),
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) throw new Error(data?.message || 'Failed to update student');
  return data;
}

async function updateAcademicProfile(id: string, payload: any): Promise<any> {
  const storedCookie = await getStoredCookie();
  const res = await fetch(`${API_BASE_URL}/v1/students/${encodeURIComponent(id)}/academic-profile`, {
    method: "PUT",
    credentials: 'include',
    headers: { 
      "Content-Type": "application/json",
      ...(storedCookie && { 'Cookie': storedCookie }),
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) throw new Error(data?.message || 'Failed to update academic profile');
  return data;
}

// ============================================
// SECTION: MAIN COMPONENT - ProfileSetup
// ============================================

// Component
const ProfileSetup: React.FC = () => {
  const router = useRouter();
  const { user, updateUser, setProfileCompleted, refreshUser } = useAuth();

  // ============================================
  // SUBSECTION: STATE DECLARATIONS
  // ============================================

  const [step, setStep] = useState<Step>(1);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [location, setLocation] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  const [academicStatus, setAcademicStatus] = useState("");
  const [preferredStream, setPreferredStream] = useState("");
  const [graduationType, setGraduationType] = useState("");
  const [studyingIn, setStudyingIn] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [stream, setStream] = useState("");
  const [passoutYear, setPassoutYear] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [hasBacklogs, setHasBacklogs] = useState("");
  const [englishTestStatus, setEnglishTestStatus] = useState("");
  const [testType, setTestType] = useState("");
  const [overallScore, setOverallScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyGoals, setStudyGoals] = useState("");
  const [budgetPerYear, setBudgetPerYear] = useState("");
  const [preferredCountries, setPreferredCountries] = useState<string[]>([]);
  const [passportStatus, setPassportStatus] = useState("");
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // ============================================
  // SUBSECTION: COUNTRY DATA AND HELPERS
  // ============================================

  const topDestinations = ["USA","Australia","UK","Canada","Ireland","Germany"];
  const popular = ["New Zealand","France","Sweden","Netherlands","Italy","Singapore"];
  const moreOptions = ["Austria","Spain","Switzerland","Lithuania","Poland","Malaysia","Japan","UAE","Finland"];
  const allCountries = [
    "USA","Australia","UK","Canada","Ireland","Germany",
    "New Zealand","France","Sweden","Netherlands","Italy","Singapore",
    "Austria","Spain","Switzerland","Lithuania","Poland","Malaysia",
    "Japan","UAE","Finland"
  ];
  const _countryToFlag: Record<string,string> = {
    USA: "🇺🇸", Australia: "🇦🇺", UK: "🇬🇧", Canada: "🇨🇦", Ireland: "🇮🇪", Germany: "🇩🇪",
    "New Zealand": "🇳🇿", France: "🇫🇷", Sweden: "🇸🇪", Netherlands: "🇳🇱", Italy: "🇮🇹", Singapore: "🇸🇬",
    Austria: "🇦🇹", Spain: "🇪🇸", Switzerland: "🇨🇭", Lithuania: "🇱🇹", Poland: "🇵🇱", Malaysia: "🇲🇾",
    Japan: "🇯🇵", UAE: "🇦🇪", Finland: "🇫🇮",
  };

  const matches = (q: string, name: string) => name.toLowerCase().includes(q.trim().toLowerCase());

  // ============================================
  // SUBSECTION: MEMOIZED COACHING STREAM OPTIONS
  // ============================================

  const coachingStreamOptions = useMemo(() => {
    switch (academicLevel) {
      case "Completed Class 10": return ["State Board", "CBSE", "ICSE", "Other's"];
      case "Completed Class 12":
      case "Studying in Class 11":
      case "Studying in Class 12":
        return ["MPC", "BiPC", "CEC", "HEC", "Other's", "Not Decided"];
      case "Pursuing Under Graduation":
      case "Completed Under Graduation":
        return ["B.Tech", "BBA", "B.Sc", "B.Com", "BCA", "B.A", "Other's", "Not Decided"];
      case "Pursuing Post Graduation":
      case "Completed Post Graduation":
        return ["M.Tech", "MBA", "M.Sc", "M.Com", "MCA", "Other's", "Not Decided"];
      default: return ["General", "Other's"];
    }
  }, [academicLevel]);

  useEffect(() => { setStream(""); }, [academicLevel]);

  // ============================================
  // SUBSECTION: USE EFFECTS
  // ============================================

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await getProfileFallback(user);
        if (!mounted || !p) return;
        if (p.name && !fullName) {
          setFullName(p.name);
          const nameError = validateNameInstant(p.name);
          if (nameError) setErrors(prev => ({ ...prev, fullName: nameError }));
        }
        if (p.profilePicture) setAvatarUrl(p.profilePicture);
        if (p.birthday && !birthday) setBirthday(formatISOToDDMMYYYY(p.birthday));
        if (p.address && !location) {
          setLocation(p.address);
          const locError = validateLocationInstant(p.address);
          if (locError) setErrors(prev => ({ ...prev, location: locError }));
        }
      } catch (e) {
        if (user?.name && !fullName) {
          setFullName(user.name);
          const nameError = validateNameInstant(user.name);
          if (nameError) setErrors(prev => ({ ...prev, fullName: nameError }));
        }
      }
    })();
    return () => { mounted = false; };
  }, [user, fullName, birthday, location]);

  // ============================================
  // SUBSECTION: MEMOIZED PROGRESS PERCENTAGE
  // ============================================

  const progressPct = useMemo(() => {
    if (step < 5) return 12;
    if (step === 5) return 25;
    if (step === 6) return 50;
    if (step === 7) return 75;
    return 100;
  }, [step]);

  // ============================================
  // SUBSECTION: VALIDATION CALLBACKS
  // ============================================

  const validatePersonal = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    const nameMsg = validateNameInstant(fullName);
    if (nameMsg) nextErrors.fullName = nameMsg;
    const dobMsg = validateDateInstant(birthday, true);
    if (dobMsg) nextErrors.birthday = dobMsg;
    const locMsg = validateLocationInstant(location);
    if (locMsg) nextErrors.location = locMsg;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fullName, birthday, location]);

  const canContinuePersonal = useMemo(() => {
    return !validateNameInstant(fullName) && !validateDateInstant(birthday, true) && !validateLocationInstant(location);
  }, [fullName, birthday, location]);

  // ============================================
  // SUBSECTION: AVATAR HANDLING
  // ============================================

  const onPickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo access to change avatar');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = { uri, blob, name: `avatar-${Date.now()}.jpg`, type: 'image/jpeg', size: blob.size };
      setAvatarFile(file);
      setAvatarUrl(uri);
    }
  };

  // ============================================
  // SUBSECTION: PROFILE PICTURE PERSISTENCE
  // ============================================

  const persistProfilePictureIfNeeded = useCallback(async (studentIdParam?: string) => {
    try {
      const studentIdFinal = studentIdParam || studentId;
      if (!studentIdFinal) return { success: false, message: "Profile not initialized yet. Please try again." } as const;

      if (!avatarFile) {
        if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
          try {
            await updateStudent(studentIdFinal, { profilePicture: avatarUrl });
            setErrors((p) => { const n = { ...p }; delete n.profilePicture; return n; });
            return { success: true } as const;
          } catch (e: unknown) {
            const msg = ((e as Error)?.message || "Failed to save picture to profile.");
            setErrors((p) => ({ ...p, profilePicture: msg }));
            return { success: false, message: msg } as const;
          }
        }
        const msg = "Profile picture is required.";
        setErrors((p) => ({ ...p, profilePicture: msg }));
        return { success: false, message: msg } as const;
      }

      const maxBytes = 5 * 1024 * 1024;
      const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if ((avatarFile.size || 0) > maxBytes) {
        const msg = "Profile picture is too large (max 5MB).";
        setErrors((p) => ({ ...p, profilePicture: msg }));
        return { success: false, message: msg } as const;
      }
      if (!allowed.includes(avatarFile.type)) {
        const msg = "Unsupported image format. Use JPG/PNG/WEBP.";
        setErrors((p) => ({ ...p, profilePicture: msg }));
        return { success: false, message: msg } as const;
      }

      const uploaded = await uploadToS3(avatarFile.blob || avatarFile);
      if (!uploaded.success || !uploaded.fileUrl) {
        const msg = uploaded.error || "Failed to upload profile picture. Please try again.";
        setErrors((p) => ({ ...p, profilePicture: msg }));
        return { success: false, message: msg } as const;
      }

      await updateStudent(studentIdFinal, { profilePicture: uploaded.fileUrl });

      setErrors((p) => { const n = { ...p }; delete n.profilePicture; return n; });
      updateUser({ profilePicture: uploaded.fileUrl });
      await refreshUser();
      return { success: true } as const;
    } catch (e: unknown) {
      let msg = "Could not upload profile picture.";
      if (typeof (e as { message?: string })?.message === 'string' && /presigned|500/i.test((e as { message?: string })?.message)) {
        msg = "Upload service not configured (presign failed). Please contact support.";
      }
      setErrors((p) => ({ ...p, profilePicture: msg }));
      return { success: false, message: msg } as const;
    }
  }, [avatarFile, avatarUrl, studentId, updateUser, refreshUser]);

  // ============================================
  // SUBSECTION: CONTINUE HANDLER
  // ============================================

  const handleContinue = async () => {
    setErrors(prev => ({ ...prev, submit: undefined, interest: undefined }));

    if (step < 5) {
      if (!validatePersonal()) return;
      setSubmitting(true);
      try {
        let currentUser = user;
        try {
          const profileRes = await getProfileFallback(user);
          currentUser = profileRes;
        } catch (e) {
          console.warn('Profile fetch failed in continue, using user', e);
        }
        if (!currentUser.id) throw new Error("Unable to get user profile. Please try logging in again.");

        const payload = {
          name: fullName.trim(),
          email: user?.email || "",
          contactNumber: user?.phone && /^\d{10}$/.test(user.phone) ? user.phone : undefined,
          address: location.trim(),
          birthday: birthday || undefined,
        };

        await updateStudent(currentUser.id, payload);
        setStudentId(currentUser.id);
        updateUser(payload);
        await refreshUser();
        setStep(5);
      } catch (e: any) {
        console.error("Error updating student profile:", e);
        setErrors((p) => ({ ...p, submit: e.message || "Failed to save" }));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (step === 5) {
      if (!selectedInterest) {
        setErrors({ interest: "Please select an interest" });
        return;
      }
      if (selectedInterest === 'STUDY_HALLS') {
        try {
          setSubmitting(true);
          let sid = studentId;
          if (!sid) {
            const profileRes = await getProfileFallback(user);
            sid = profileRes.id;
            setStudentId(sid);
          }
          const pic = await persistProfilePictureIfNeeded(sid);
          if (!pic.success) {
            setErrors({ submit: pic.message || "Profile picture is required." });
            return;
          }
          setProfileCompleted(true);
          await refreshUser();
          router.replace('/(tabs)/home');
        } catch (e: any) {
          console.error('Study Halls quick-complete failed', e);
          setErrors({ submit: e.message || 'Failed to complete onboarding' });
        } finally {
          setSubmitting(false);
        }
        return;
      }
      setStep(6);
      return;
    }

    if (step === 6) {
      let sid = studentId;
      if (!sid) {
        const profileRes = await getProfileFallback(user);
        sid = profileRes.id;
        setStudentId(sid);
      }
      if (!sid) {
        setErrors({ submit: "Student not initialized. Please go back and try again." });
        return;
      }
      const validationError = validateAcademicForm();
      if (validationError) {
        setErrors({ submit: validationError });
        return;
      }
      if (selectedInterest === "STUDY_ABROAD") {
        setStep(7);
        return;
      }
      await submitAcademicProfile();
      return;
    }

    if (step === 7) {
      const err = validateStudyAbroadStep2();
      if (err) {
        setErrors({ submit: err });
        return;
      }
      await submitAcademicProfile();
      return;
    }
  };

  // ============================================
  // SUBSECTION: VALIDATION FUNCTIONS FOR ACADEMIC FORMS
  // ============================================

  const validateAcademicForm = (): string | null => {
    switch (selectedInterest) {
      case "KINDERGARTEN":
        if (!academicStatus) return "Please select your academic status";
        break;
      case "SCHOOL":
      case "INTERMEDIATE":
        if (!studyingIn) return "Please select what you're studying in";
        if (!preferredStream) return "Please select your preferred stream";
        break;
      case "GRADUATION":
        if (!graduationType) return "Please select graduation type";
        if (!studyingIn) return "Please select what you're studying in";
        if (!preferredStream) return "Please select your preferred stream";
        break;
      case "COACHING_CENTER":
        if (!lookingFor) return "Please select what you're looking for";
        if (!academicLevel) return "Please select your academic level";
        if (!stream) return "Please select your stream";
        if (!passoutYear) return "Please enter your passout year";
        break;
      case "STUDY_ABROAD":
        if (!highestEducation) return "Please select your highest education";
        if (!hasBacklogs) return "Please specify if you have backlogs";
        if (!englishTestStatus) return "Please select your English test status";
        if (englishTestStatus === "Already have my exam score") {
          if (!testType) return "Please select test type";
          if (!overallScore) return "Please enter your overall score";
          if (!examDate) return "Please enter exam date";
        }
        break;
      case "TUITION_CENTER":
        if (!studyingIn) return "Please select what you're studying in";
        if (!preferredStream) return "Please select your preferred stream";
        break;
    }
    return null;
  };

  const validateStudyAbroadStep2 = (): string | null => {
    if (!studyGoals) return "Please specify what you want to study";
    if (!budgetPerYear) return "Please select your budget range";
    if (preferredCountries.length === 0) return "Please select at least one preferred country";
    if (preferredCountries.length > 3) return "You can select up to 3 countries";
    if (!passportStatus) return "Please specify your passport status";
    return null;
  };

  // ============================================
  // SUBSECTION: ACADEMIC PROFILE SUBMISSION
  // ============================================

  const submitAcademicProfile = async () => {
    setSubmitting(true);
    try {
      let sid = studentId;
      if (!sid) {
        const profileRes = await getProfileFallback(user);
        sid = profileRes.id;
        setStudentId(sid);
      }
      if (!sid) throw new Error("No student ID");

      let details: Record<string, unknown> = {};
      let profileTypeToSend = selectedInterest;

      switch (selectedInterest) {
        case "KINDERGARTEN":
          let status = "CURRENTLY_IN";
          if (academicStatus === "Completed Kindergarten") status = "COMPLETED";
          if (academicStatus === "Seeking Admission to Kindergarten") status = "SEEKING_ADMISSION";
          details = { status };
          break;
        case "SCHOOL":
        case "INTERMEDIATE":
        case "TUITION_CENTER":
          details = { studyingIn, preferredStream };
          break;
        case "GRADUATION":
          let graduationTypeMapped = "UNDER_GRADUATE";
          if (graduationType === "Post Graduation") graduationTypeMapped = "POST_GRADUATE";
          details = { graduationType: graduationTypeMapped, studyingIn, preferredStream };
          break;
        case "COACHING_CENTER":
          let lookingForMapped = "EXAM_PREPARATION";
          if (lookingFor === "Upskilling / Skill Development") lookingForMapped = "UPSKILLING_SKILL_DEVELOPMENT";
          if (lookingFor === "Vocational Training") lookingForMapped = "VOCATIONAL_TRAINING";
          details = { lookingFor: lookingForMapped, academicLevel, stream, passoutYear };
          break;
        case "STUDY_ABROAD":
          details = {
            highestEducation,
            hasBacklogs,
            englishTestStatus,
            ...(englishTestStatus === "Already have my exam score" && {
              testType,
              overallScore,
              examDate
            }),
            studyGoals: studyGoals || "Not specified",
            budgetPerYear: budgetPerYear || "Not specified", 
            preferredCountries: preferredCountries.length > 0 ? preferredCountries : ["Not specified"],
            passportStatus: passportStatus === "Yes" ? "YES" : passportStatus === "No" ? "NO" : "APPLIED"
          };
          break;
        case "STUDY_HALLS":
          details = { studyHalls: true };
          break;
      }

      await updateAcademicProfile(sid, { profileType: profileTypeToSend, details });

      const pic = await persistProfilePictureIfNeeded(sid);
      if (!pic.success) {
        setErrors((p) => ({ ...p, submit: pic.message || "Profile picture is required." }));
        return;
      }
      setProfileCompleted(true);
      await refreshUser();
      router.replace("/(tabs)/home");
    } catch (e: any) {
      console.error("Error submitting academic profile:", e);
      setErrors((p) => ({ ...p, submit: e.message || "Failed to save academic profile" }));
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // SUBSECTION: UI SUB-COMPONENTS
  // ============================================

  // UI Components
  const ProgressBar = () => (
    <View className="w-full h-1 bg-[#E9ECF4] rounded-full overflow-hidden mb-4">
      <View className="h-full bg-[#0A46E4]" style={{ width: `${progressPct}%` }} />
    </View>
  );

  const Title = () => (
    <Text className="text-lg font-semibold text-[#111827] mb-4">
      {step === 5 ? "Academic Interests" : step === 6 ? "Your Academic Profile" : step === 7 ? (showAllCountries ? "Select country" : "Your Study Goals") : "Tell us about you"}
    </Text>
  );

  const AvatarSection = () => (
    <View className="flex flex-col items-center gap-4 mt-6">
      <View className="relative w-[120px] h-[120px] rounded-full bg-gray-200 overflow-hidden shadow-sm">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-full h-full object-cover" />
        ) : (
          <View className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#4F46E5" }}>
            <Text className="text-3xl font-semibold text-white">
              {(fullName || "").trim().split(" ").slice(0,2).map(w => w[0]).filter(Boolean).join("") || "?"}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={onPickAvatar} className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#0A46E4] shadow">
          <Ionicons name="pencil" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const InputField = ({ label, value, onChange, placeholder, error, keyboardType = 'default', maxLength, multiline = false, rows = 3 }: any) => (
    <View className="mb-4">
      <Text className="text-xs font-semibold text-[#111827] mb-1">{label}</Text>
      <TextInput
        className={`w-full px-4 rounded-xl border ${error ? 'border-red-400 bg-white' : 'border-[#E5E7EB] bg-white'} ${multiline ? 'h-20 py-3' : 'h-12'}`}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={rows}
        editable={!submitting}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );

  const Dropdown = ({ value, onChange, options, placeholder, error }: any) => {
    const [open, setOpen] = useState(false);
    return (
      <View className="mb-4">
        <TouchableOpacity onPress={() => setOpen(!open)} disabled={submitting} className={`h-12 px-4 rounded-xl border flex-row items-center justify-between ${error ? 'border-red-400' : 'border-[#E5E7EB]'} bg-white`}>
          <Text className={`${value ? 'text-[#111827]' : 'text-[#9CA3AF]'} text-base`}>{value || placeholder}</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#111827" />
        </TouchableOpacity>
        {open && (
          <View className="bg-white border border-[#E5E7EB] rounded-xl mt-1 max-h-60">
            {options.map((opt: string) => (
              <TouchableOpacity key={opt} onPress={() => { onChange(opt); setOpen(false); }} className="px-4 py-3 flex-row items-center">
                <View className={`w-5 h-5 rounded-full border-2 border-[#111827] mr-3 items-center justify-center ${value === opt ? 'border-[#0A46E4]' : ''}`}>
                  {value === opt && <View className="w-2.5 h-2.5 bg-[#0A46E4] rounded-full" />}
                </View>
                <Text className="text-base text-[#111827]">{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
      </View>
    );
  };

  const RadioGroup = ({ label, value, onChange, options, horizontal = false, error }: any) => (
    <View className="mb-4">
      {label && <Text className="text-xs font-semibold text-[#111827] mb-3">{label}</Text>}
      <View className={horizontal ? 'flex-row justify-between' : 'flex-col space-y-3'}>
        {options.map((opt: string) => (
          <TouchableOpacity key={opt} onPress={() => onChange(opt)} className={`flex-row items-center py-3 px-2 rounded-lg ${value === opt ? 'bg-[#0A46E4]/10 border border-[#0A46E4]' : 'border border-[#E5E7EB]'}`}>
            <View className="w-5 h-5 rounded-full border-2 border-[#111827] mr-3 items-center justify-center">
              {value === opt && <View className="w-2.5 h-2.5 bg-[#0A46E4] rounded-full" />}
            </View>
            <Text className="text-base text-[#111827]">{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );

  const ChipButton = ({ opt, selected, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className={`px-4 h-10 rounded-lg border ${selected ? 'bg-[#0A46E4] text-white border-[#0A46E4]' : 'border-[#E5E7EB] text-[#111827]'}`}>
      <Text className={`text-sm font-medium ${selected ? 'text-white' : ''}`}>{opt}</Text>
    </TouchableOpacity>
  );

  // ============================================
  // SUBSECTION: RENDER FUNCTIONS FOR STEPS
  // ============================================

  // Render functions
  const renderPersonalForm = () => (
    <>
      {AvatarSection()}
      <InputField
        label="Full Name"
        value={fullName}
        onChange={(v) => {
          setFullName(v);
          const msg = validateNameInstant(v);
          setErrors((prev) => { const n = { ...prev }; if (msg) n.fullName = msg; else delete n.fullName; return n; });
        }}
        placeholder="Enter full name"
        error={errors.fullName}
        maxLength={80}
      />
      <InputField
        label="Birthday"
        value={birthday}
        onChange={(v) => {
          setBirthday(v);
          const msg = validateDateInstant(v, true);
          setErrors((prev) => { const n = { ...prev }; if (msg) n.birthday = msg; else delete n.birthday; return n; });
        }}
        placeholder="DD/MM/YYYY"
        error={errors.birthday}
        keyboardType="numeric"
      />
      <InputField
        label="Location"
        value={location}
        onChange={(v) => {
          setLocation(v);
          const msg = validateLocationInstant(v);
          setErrors((prev) => { const n = { ...prev }; if (msg) n.location = msg; else delete n.location; return n; });
        }}
        placeholder="Enter location"
        error={errors.location}
        maxLength={120}
      />
    </>
  );

  const renderInterests = () => (
    <FlatList
      data={interests}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      keyExtractor={(i) => i.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => setSelectedInterest(item.key)}
          className={`w-[48%] h-24 rounded-xl overflow-hidden mb-3 shadow-sm ${selectedInterest === item.key ? 'ring-2 ring-[#0A46E4]' : ''}`}
          style={{ elevation: 2 }}
        >
          <Image source={item.img} className="w-full h-full" resizeMode="cover" />
          <View className="absolute inset-0 bg-black/20" />
          <Text className="absolute bottom-2 left-2 text-white font-semibold text-sm">{item.label.replace('\n', ' ')}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );

  const renderAcademicForm = () => {
    if (!selectedInterest) return <Text className="text-center text-gray-500">Please select an academic interest to continue.</Text>;
    switch (selectedInterest) {
      // CATEGORY: KINDERGARTEN
      case "KINDERGARTEN":
        return <RadioGroup label="Academic Status" value={academicStatus} onChange={setAcademicStatus} options={["Currently in Kindergarten", "Completed Kindergarten", "Seeking Admission to Kindergarten"]} error={errors.academicStatus} />;

      // CATEGORY: SCHOOL
      case "SCHOOL":
        return (
          <>
            <Text className="text-xs font-semibold text-[#111827] mb-1">Academic Status</Text>
            <Dropdown value={studyingIn} onChange={setStudyingIn} options={["Completed Class 10th","Class 10th","Class 9th","Class 8th","Class 7th","Class 6th","Class 5th","Class 4th","Class 3rd","Class 2nd","Class 1st"]} placeholder="Select studying in" error={errors.studyingIn} />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
            <Dropdown value={preferredStream} onChange={setPreferredStream} options={["MPC (Engineering)","BiPC (Medical)","CEC (Commerce)","HEC (History)","Other's","Not Decided"]} placeholder="Select Your Preferred Stream" error={errors.preferredStream} />
          </>
        );

      // CATEGORY: INTERMEDIATE
      case "INTERMEDIATE":
        return (
          <>
            <Text className="text-xs font-semibold text-[#111827] mb-1">Academic Status</Text>
            <Dropdown value={studyingIn} onChange={setStudyingIn} options={["Class 12th Passed","Class 12th","Class 11th"]} placeholder="Select studying in" error={errors.studyingIn} />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
            <Dropdown value={preferredStream} onChange={setPreferredStream} options={["Engineering (B.E./B.Tech.)","Medical Sciences","Arts and Humanities (B.A.)","Science (B.Sc.)","Commerce (B.Com.)","Business Administration (BBA)","Computer Applications (BCA)","Fine Arts (BFA)","Law (L.L.B./Integrated Law Courses)","Other's"]} placeholder="Select Your Preferred Stream" error={errors.preferredStream} />
          </>
        );

      // CATEGORY: GRADUATION
      case "GRADUATION":
        return (
          <>
            <Dropdown value={graduationType} onChange={setGraduationType} options={["Under Graduation", "Post Graduation"]} placeholder="Select graduation type" error={errors.graduationType} />
            {graduationType === "Under Graduation" && (
              <>
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Academic Status</Text>
                <Dropdown value={studyingIn} onChange={setStudyingIn} options={["Passed Out","1st Year","2nd Year","3rd Year","4th Year"]} placeholder="Select studying in" error={errors.studyingIn} />
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
                <Dropdown value={preferredStream} onChange={setPreferredStream} options={["B.Tech","B.Sc","B.A","B.Com","BBA","BCA","BFA","L.L.B","B.Pharmacy","Other's","Not Decided"]} placeholder="Select Your Preferred Stream" error={errors.preferredStream} />
              </>
            )}
            {graduationType === "Post Graduation" && (
              <>
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Academic Status</Text>
                <Dropdown value={studyingIn} onChange={setStudyingIn} options={["PG Passed","1st Year","2nd Year"]} placeholder="Select studying in" error={errors.studyingIn} />
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
                <Dropdown value={preferredStream} onChange={setPreferredStream} options={["MBA","MCA","M.SC","MS","M.TECH","M.COM","M.PHARMACY","L.L.M","Other's"]} placeholder="Select Your Preferred Stream" error={errors.preferredStream} />
              </>
            )}
          </>
        );

      // CATEGORY: COACHING_CENTER
      case "COACHING_CENTER":
        return (
          <>
            <RadioGroup label="What are you looking for?" value={lookingFor} onChange={setLookingFor} options={["Upskilling / Skill Development", "Exam Preparation", "Vocational Training"]} error={errors.lookingFor} />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">What is your academic level?</Text>
            <Dropdown value={academicLevel} onChange={setAcademicLevel} options={["Completed Class 10","Studying in Class 11","Studying in Class 12","Completed Class 12","Pursuing Under Graduation","Completed Under Graduation","Pursuing Post Graduation","Completed Post Graduation"]} placeholder="Select your academic status" error={errors.academicLevel} />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Stream</Text>
            <Dropdown value={stream} onChange={setStream} options={coachingStreamOptions} placeholder="Select your stream" error={errors.stream} />
            <InputField label="Passout Year" value={passoutYear} onChange={setPassoutYear} placeholder="Enter year" error={errors.passoutYear} keyboardType="numeric" maxLength={4} />
          </>
        );

      // CATEGORY: TUITION_CENTER
      case "TUITION_CENTER":
        return (
          <>
            <Text className="text-xs font-semibold text-[#111827] mb-1">Academic Status</Text>
            <Dropdown value={studyingIn} onChange={setStudyingIn} options={["6th Grade","7th Grade","8th Grade","9th Grade","10th Grade","11th Grade","12th Grade"]} placeholder="Select studying in" error={errors.studyingIn} />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
            <Dropdown value={preferredStream} onChange={setPreferredStream} options={["Math","Science","English","Social Studies"]} placeholder="Select Your Preferred Stream" error={errors.preferredStream} />
          </>
        );

      // CATEGORY: STUDY_ABROAD (Step 6)
      case "STUDY_ABROAD":
        return (
          <>
            <RadioGroup label="Highest Level of Education" value={highestEducation} onChange={setHighestEducation} options={["12th Grade", "Bachelor's", "Master's"]} error={errors.highestEducation} />
            <RadioGroup label="Do you have any backlogs?" value={hasBacklogs} onChange={setHasBacklogs} options={["Yes", "No"]} horizontal error={errors.hasBacklogs} />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">English Test Status</Text>
            <Dropdown value={englishTestStatus} onChange={setEnglishTestStatus} options={["Haven't decided yet","Preparing for the exam","Booked my exam","Awaiting results","Already have my exam score"]} placeholder="Select Test Status" error={errors.englishTestStatus} />
            {englishTestStatus === "Already have my exam score" && (
              <>
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Test Type</Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {["IELTS", "PTE", "TOEFL", "Duolingo"].map((opt) => (
                    <ChipButton key={opt} opt={opt} selected={testType === opt} onPress={() => setTestType(opt)} />
                  ))}
                </View>
                {errors.testType && <Text className="text-xs text-red-500 mb-2">{errors.testType}</Text>}
                <InputField label="Overall Score" value={overallScore} onChange={setOverallScore} placeholder="e.g., 7.5" error={errors.overallScore} />
                <InputField label="Date of Exam" value={examDate} onChange={(v) => {
                  setExamDate(v);
                  const msg = validateDateInstant(v);
                  setErrors((prev) => { const n = { ...prev }; if (msg) n.examDate = msg; else delete n.examDate; return n; });
                }} placeholder="DD/MM/YYYY" error={errors.examDate} keyboardType="numeric" />
              </>
            )}
          </>
        );

      // CATEGORY: STUDY_HALLS
      case "STUDY_HALLS":
        return <Text className="text-center text-gray-500 mt-4">No additional details needed for Study Halls.</Text>;

      // DEFAULT CASE
      default:
        return <Text className="text-center text-gray-500">Please select an academic interest to continue.</Text>;
    }
  };

  // CATEGORY: STUDY_ABROAD (Step 7)
  const renderStudyAbroadStep2 = () => (
    <>
      <InputField
        label="What do you want to study?"
        value={studyGoals}
        onChange={setStudyGoals}
        placeholder="e.g., Master's in Computer Science"
        error={errors.studyGoals}
      />
      <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">What is your budget per year?</Text>
      <Dropdown
        value={budgetPerYear}
        onChange={setBudgetPerYear}
        options={["Below ₹10 Lakhs", "₹10 Lakhs - ₹20 Lakhs", "₹20 Lakhs - ₹30 Lakhs","₹30 Lakhs - ₹40 Lakhs","₹40 Lakhs - ₹50 Lakhs","Above ₹50 Lakhs"]}
        placeholder="Select budget range"
        error={errors.budgetPerYear}
      />
      <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Countries</Text>
      <Text className="text-xs text-[#9CA3AF] mb-2">You can select up to 3 countries</Text>
      {!showAllCountries ? (
        <>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-semibold">Top Destinations</Text>
            <TouchableOpacity onPress={() => setShowAllCountries(true)}>
              <Text className="text-[#0A46E4] text-xs">See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topDestinations}
            numColumns={3}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const selected = preferredCountries.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => {
                    setPreferredCountries((prev) => {
                      if (prev.includes(item)) return prev.filter((c) => c !== item);
                      if (prev.length >= 3) return prev;
                      return [...prev, item];
                    });
                  }}
                  className={`flex-1 h-20 m-1 rounded-xl border items-center justify-center ${selected ? 'border-[#0A46E4] bg-[#0A46E4]/5' : 'border-[#E5E7EB]'}`}
                >
                  <Text className="text-2xl">{_countryToFlag[item]}</Text>
                  <Text className="text-xs font-semibold mt-1">{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      ) : (
        <View className="border border-[#E5E7EB] rounded-xl p-3">
          <Text className="text-xs font-semibold mb-2">Select country</Text>
          <View className="mb-3">
            <View className="relative">
              <TextInput
                className="h-10 px-4 pl-10 rounded-xl border border-[#E5E7EB] bg-white"
                placeholder="Find your country"
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
              <Ionicons name="search" size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 6 }} />
            </View>
          </View>
          {topDestinations.filter(c => matches(countrySearch, c)).length > 0 && (
            <>
              <Text className="text-xs font-semibold mb-2">Top Destinations</Text>
              <FlatList
                data={topDestinations.filter(c => matches(countrySearch, c))}
                numColumns={3}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = preferredCountries.includes(item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setPreferredCountries((prev) => {
                          if (prev.includes(item)) return prev.filter((c) => c !== item);
                          if (prev.length >= 3) return prev;
                          return [...prev, item];
                        });
                      }}
                      className={`flex-1 h-18 m-1 rounded-xl border items-center justify-center ${selected ? 'border-[#0A46E4] bg-[#0A46E4]/5' : 'border-[#E5E7EB]'}`}
                    >
                      <Text className="text-2xl">{_countryToFlag[item]}</Text>
                      <Text className="text-xs font-semibold mt-1">{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}
          {popular.filter(c => matches(countrySearch, c)).length > 0 && (
            <>
              <Text className="text-xs font-semibold mb-2 mt-4">Other Popular Choices</Text>
              <FlatList
                data={popular.filter(c => matches(countrySearch, c))}
                numColumns={3}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = preferredCountries.includes(item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setPreferredCountries((prev) => {
                          if (prev.includes(item)) return prev.filter((c) => c !== item);
                          if (prev.length >= 3) return prev;
                          return [...prev, item];
                        });
                      }}
                      className={`flex-1 h-18 m-1 rounded-xl border items-center justify-center ${selected ? 'border-[#0A46E4] bg-[#0A46E4]/5' : 'border-[#E5E7EB]'}`}
                    >
                      <Text className="text-2xl">{_countryToFlag[item]}</Text>
                      <Text className="text-xs font-semibold mt-1">{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}
          {moreOptions.filter(c => matches(countrySearch, c)).length > 0 && (
            <>
              <Text className="text-xs font-semibold mb-2 mt-4">More Options</Text>
              <FlatList
                data={moreOptions.filter(c => matches(countrySearch, c))}
                numColumns={3}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = preferredCountries.includes(item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setPreferredCountries((prev) => {
                          if (prev.includes(item)) return prev.filter((c) => c !== item);
                          if (prev.length >= 3) return prev;
                          return [...prev, item];
                        });
                      }}
                      className={`flex-1 h-18 m-1 rounded-xl border items-center justify-center ${selected ? 'border-[#0A46E4] bg-[#0A46E4]/5' : 'border-[#E5E7EB]'}`}
                      style={{ maxHeight: 200 }}
                    >
                      <Text className="text-2xl">{_countryToFlag[item]}</Text>
                      <Text className="text-xs font-semibold mt-1">{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}
          <TouchableOpacity 
            onPress={() => setShowAllCountries(false)} 
            disabled={preferredCountries.length === 0}
            className={`w-full h-11 rounded-xl items-center justify-center mt-3 ${preferredCountries.length === 0 ? 'bg-gray-200' : 'bg-[#0A46E4]'}`}
          >
            <Text className={`font-medium ${preferredCountries.length === 0 ? 'text-gray-500' : 'text-white'}`}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
      {errors.preferredCountries && <Text className="text-xs text-red-500 mt-1">{errors.preferredCountries}</Text>}
      <RadioGroup
        label="Do you have a valid passport?"
        value={passportStatus}
        onChange={setPassportStatus}
        options={["Yes", "No", "Applied"]}
        horizontal
        error={errors.passportStatus}
      />
    </>
  );

  // ============================================
  // SUBSECTION: MAIN RENDER
  // ============================================

  return (
    <SafeAreaView className="flex-1 bg-[#F5F6F9]">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row items-center justify-between px-5 pt-4">
          <TouchableOpacity onPress={() => setStep((s) => (s > 1 ? (s - 1) as Step : s))} disabled={submitting}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} disabled={submitting}>
            <Text className="text-sm font-medium text-[#111827]">SKIP</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <ProgressBar />
          <Title />
          {step <= 4 && renderPersonalForm()}
          {step === 5 && renderInterests()}
          {step === 6 && renderAcademicForm()}
          {step === 7 && renderStudyAbroadStep2()}
          {errors.submit && <Text className="text-center text-red-500 mt-4">{errors.submit}</Text>}
          {errors.interest && <Text className="text-center text-red-500 mt-4">{errors.interest}</Text>}
          {errors.profilePicture && <Text className="text-center text-red-500 mt-4">{errors.profilePicture}</Text>}
        </ScrollView>
        {!showAllCountries && (
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={handleContinue}
              disabled={submitting || (step < 5 && !canContinuePersonal) || (step === 5 && !selectedInterest)}
              className={`w-full h-12 rounded-xl items-center justify-center ${submitting || (step < 5 && !canContinuePersonal) || (step === 5 && !selectedInterest) ? 'bg-gray-200 disabled:text-gray-500' : 'bg-[#0A46E4]'}`}
            >
              {submitting ? <ActivityIndicator color="white" /> : <Text className="text-white font-medium text-base">Continue</Text>}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileSetup;
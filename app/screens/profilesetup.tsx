// screens/profilesetup.tsx (full updated component aligned with Next.js logic)
'use client';

import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
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

import { API_BASE_URL } from '../../utils/constant';
import { useAuth } from '../lib/auth-context';

// ---------------------------------------------------------------------
//  ASSETS
// ---------------------------------------------------------------------
import coachingcenters from '@/assets/images/coachingcenters.png';
import graduation from '@/assets/images/graduation.png';
import intermediate from '@/assets/images/intermediate.png';
import kindergarten from '@/assets/images/kindergarten.png';
import placeholderAvatar from '@/assets/images/profileicon.png';
import school from '@/assets/images/school.png';
import studyabroad from '@/assets/images/studyabroad.png';
import studyhalls from '@/assets/images/studyhalls.png';
import tuitioncenter from '@/assets/images/tuitioncenter.png';

// ---------------------------------------------------------------------
//  TYPE DEFINITIONS
// ---------------------------------------------------------------------
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Errors {
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------
//  VALIDATION HELPERS (aligned with Next.js)
const NAME_REGEX = /^[A-Za-z][A-Za-z ]{0,78}[A-Za-z]$/;
const LOCATION_ALLOWED = /^[A-Za-z0-9 ,.'\-/()#]{3,120}$/;

const validateNameInstant = (value: string): string | undefined => {
  const n = value.replace(/\s+/g, ' ').trim();
  if (n.length < 2) return 'Name must be at least 2 characters';
  if (!NAME_REGEX.test(n)) return 'Only letters and spaces allowed';
  return undefined;
};

const validateLocationInstant = (value: string): string | undefined => {
  const n = value.replace(/\s+/g, ' ').trim();
  if (n.length < 3) return 'Location must be at least 3 characters';
  if (!LOCATION_ALLOWED.test(n))
    return 'Use letters, numbers, , . - / ( ) #';
  return undefined;
};

const validateDateInstant = (
  value: string,
  isBirthday = false,
): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const m = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return 'Enter valid date as DD/MM/YYYY';
  const [_, d, mo, y] = m.map(Number);
  const date = new Date(y, mo - 1, d);
  if (
    date.getDate() !== d ||
    date.getMonth() !== mo - 1 ||
    date.getFullYear() !== y
  )
    return 'Invalid date';
  if (isBirthday && date > new Date())
    return 'Birthday cannot be in the future';
  return undefined;
};

// ---------------------------------------------------------------------
//  COMPONENT
// ---------------------------------------------------------------------
const ProfileSetup: React.FC = () => {
  const router = useRouter();
  const { user, updateUser, setProfileCompleted, refreshUser } = useAuth();

  // ------------------- GLOBAL STATE -------------------
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [personalSubmitted, setPersonalSubmitted] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  // ------------------- PERSONAL -------------------
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState(''); // DD/MM/YYYY
  const [location, setLocation] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // ------------------- INTEREST -------------------
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  // ------------------- ACADEMIC -------------------
  const [academicStatus, setAcademicStatus] = useState('');
  const [studyingIn, setStudyingIn] = useState('');
  const [preferredStream, setPreferredStream] = useState('');
  const [graduationType, setGraduationType] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [stream, setStream] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [highestEducation, setHighestEducation] = useState('');
  const [hasBacklogs, setHasBacklogs] = useState('');
  const [englishTestStatus, setEnglishTestStatus] = useState('');
  const [testType, setTestType] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [examDate, setExamDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // ------------------- STUDY ABROAD STEP 2 -------------------
  const [studyGoals, setStudyGoals] = useState('');
  const [budgetPerYear, setBudgetPerYear] = useState('');
  const [preferredCountries, setPreferredCountries] = useState<string[]>([]);
  const [passportStatus, setPassportStatus] = useState('');
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // -----------------------------------------------------------------
  //  INTERESTS & IMAGES (aligned with web)
  // -----------------------------------------------------------------
  const interests = [
    { key: 'KINDERGARTEN', label: 'Kindergarten', img: kindergarten },
    { key: 'SCHOOL', label: 'School', img: school },
    { key: 'INTERMEDIATE', label: 'Intermediate', img: intermediate },
    { key: 'GRADUATION', label: 'Graduation', img: graduation },
    { key: 'COACHING_CENTER', label: 'Coaching\nCenter', img: coachingcenters },
    { key: 'STUDY_HALLS', label: 'Study\nHalls', img: studyhalls },
    { key: 'TUITION_CENTER', label: 'Tuition\ncenter', img: tuitioncenter },
    { key: 'STUDY_ABROAD', label: 'Study\nAbroad', img: studyabroad },
  ];

  // -----------------------------------------------------------------
  //  COUNTRY DATA (aligned with Next.js)
  // -----------------------------------------------------------------
  const topDestinations = ['USA', 'Australia', 'UK', 'Canada', 'Ireland', 'Germany'];
  const allCountries = [
    'USA', 'Australia', 'UK', 'Canada', 'Ireland', 'Germany',
    'New Zealand', 'France', 'Sweden', 'Netherlands', 'Italy', 'Singapore',
    'Austria', 'Spain', 'Switzerland', 'Lithuania', 'Poland', 'Malaysia',
    'Japan', 'UAE', 'Finland',
  ];
  const countryToFlag: Record<string, string> = {
    USA: '🇺🇸',
    Australia: '🇦🇺',
    UK: '🇬🇧',
    Canada: '🇨🇦',
    Ireland: '🇮🇪',
    Germany: '🇩🇪',
    'New Zealand': '🇳🇿',
    France: '🇫🇷',
    Sweden: '🇸🇪',
    Netherlands: '🇳🇱',
    Italy: '🇮🇹',
    Singapore: '🇸🇬',
    Austria: '🇦🇹',
    Spain: '🇪🇸',
    Switzerland: '🇨🇭',
    Lithuania: '🇱🇹',
    Poland: '🇵🇱',
    Malaysia: '🇲🇾',
    Japan: '🇯🇵',
    UAE: '🇦🇪',
    Finland: '🇫🇮',
  };

  // -----------------------------------------------------------------
  //  DYNAMIC COACHING STREAM OPTIONS (aligned with Next.js)
  // -----------------------------------------------------------------
  const coachingStreamOptions = useMemo(() => {
    switch (academicLevel) {
      case 'Completed Class 10':
        return ['State Board', 'CBSE', 'ICSE', "Other's"];
      case 'Completed Class 12':
      case 'Studying in Class 11':
      case 'Studying in Class 12':
        return ['MPC', 'BiPC', 'CEC', 'HEC', "Other's", 'Not Decided'];
      case 'Pursuing Under Graduation':
      case 'Completed Under Graduation':
        return ['B.Tech', 'BBA', 'B.Sc', 'B.Com', 'BCA', 'B.A', "Other's", 'Not Decided'];
      case 'Pursuing Post Graduation':
      case 'Completed Post Graduation':
        return ['M.Tech', 'MBA', 'M.Sc', 'M.Com', 'MCA', "Other's", 'Not Decided'];
      default:
        return ['General', "Other's"];
    }
  }, [academicLevel]);

  // Reset stream when level changes
  useEffect(() => setStream(''), [academicLevel]);

  // -----------------------------------------------------------------
  //  PREFILL FROM USER (aligned with Next.js: fetch profile first)
  // -----------------------------------------------------------------
  useEffect(() => {
    const prefillFromProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/profile`, { credentials: 'include' });
        if (res.ok) {
          const profile = await res.json();
          const p = profile.data;
          if (p.name && !fullName) {
            setFullName(p.name);
            const nameError = validateNameInstant(p.name);
            if (nameError) setErrors((prev) => ({ ...prev, fullName: nameError }));
          }
          if (p.birthday && !birthday) setBirthday(p.birthday);
          if (p.address && !location) {
            setLocation(p.address);
            const locError = validateLocationInstant(p.address);
            if (locError) setErrors((prev) => ({ ...prev, location: locError }));
          }
          if (p.profilePicture) setAvatarUri(p.profilePicture);
        }
      } catch (e) {
        console.error('Prefill error:', e);
        // Fallback to user state
        if (user.name && !fullName) {
          setFullName(user.name);
          const nameError = validateNameInstant(user.name);
          if (nameError) setErrors((prev) => ({ ...prev, fullName: nameError }));
        }
        if (user.birthday && !birthday) setBirthday(user.birthday);
        if (user.address && !location) {
          setLocation(user.address);
          const locError = validateLocationInstant(user.address);
          if (locError) setErrors((prev) => ({ ...prev, location: locError }));
        }
        if (user.profilePicture) setAvatarUri(user.profilePicture);
      }
    };
    prefillFromProfile();
  }, [user]);

  // -----------------------------------------------------------------
  //  PROGRESS CALCULATION
  // -----------------------------------------------------------------
  const progressPct = useMemo(() => {
    if (step < 5) return 12;
    if (step === 5) return 25;
    if (step === 6) return 50;
    if (step === 7) return 75;
    return 100;
  }, [step]);

  // -----------------------------------------------------------------
  //  AVATAR PICKER + S3 UPLOAD (aligned with backend)
  // -----------------------------------------------------------------
  const pickAvatar = async () => {
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
      setAvatarUri(uri);
      await uploadAvatarToS3(uri);
    }
  };

  const uploadAvatarToS3 = async (uri: string) => {
    if (!studentId && !user?.id) return;
    setUploadingAvatar(true);
    try {
      const filename = `profile-${studentId || user.id}-${Date.now()}.jpg`;
      const match = uri.match(/\.(\w+)$/);
      const filetype = match ? `image/${match[1]}` : 'image/jpeg';

      // Get presigned URL
      const { data } = await axios.post(
        `${API_BASE_URL}/api/s3/upload-url`,
        { filename, filetype },
        { withCredentials: true },
      );
      const { uploadUrl, publicUrl } = data;

      // Upload file
      const blob = await (await fetch(uri)).blob();
      await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': filetype },
      });

      const finalUrl = publicUrl || uploadUrl.split('?')[0];

      // Save to profile
      await axios.put(
        `${API_BASE_URL}/api/v1/students/${studentId || user.id}`,
        { profilePicture: finalUrl },
        { withCredentials: true },
      );

      setAvatarUri(finalUrl);
      updateUser({ profilePicture: finalUrl });
      await refreshUser();
    } catch (e: any) {
      console.error('Avatar upload error', e);
      Alert.alert('Upload failed', e.response?.data?.error || 'Try again later');
      setAvatarUri(user?.profilePicture || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // -----------------------------------------------------------------
  //  PERSONAL VALIDATION & SUBMIT (aligned with Next.js: get profile first, then update)
  // -----------------------------------------------------------------
  const validatePersonal = useCallback((): boolean => {
    const nextErrors: Errors = {};
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
    return (
      !validateNameInstant(fullName) &&
      !validateDateInstant(birthday, true) &&
      !validateLocationInstant(location)
    );
  }, [fullName, birthday, location]);

  const handleName = useCallback((v: string) => {
    setFullName(v);
    const msg = validateNameInstant(v);
    setErrors((prev) => {
      const n = { ...prev };
      if (msg) n.fullName = msg;
      else delete n.fullName;
      return n;
    });
  }, []);

  const handleBirthday = useCallback((v: string) => {
    setBirthday(v);
    const msg = validateDateInstant(v, true);
    setErrors((prev) => {
      const n = { ...prev };
      if (msg) n.birthday = msg;
      else delete n.birthday;
      return n;
    });
  }, []);

  const handleLocation = useCallback((v: string) => {
    setLocation(v);
    const msg = validateLocationInstant(v);
    setErrors((prev) => {
      const n = { ...prev };
      if (msg) n.location = msg;
      else delete n.location;
      return n;
    });
  }, []);

  const submitPersonalText = async (): Promise<boolean> => {
    if (!validatePersonal()) return false;
    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return false;
    }
    setLoading(true);
    try {
      // Get current profile first (aligned with Next.js)
      const profileRes = await fetch(`${API_BASE_URL}/api/v1/profile`, { credentials: 'include' });
      if (!profileRes.ok) throw new Error('Failed to fetch profile');
      const profile = await profileRes.json();
      const currentUser = profile.data;

      const payload = {
        name: fullName.trim(),
        email: user.email || '',
        contactNumber: user.phone && /^\d{10}$/.test(user.phone) ? user.phone : undefined,
        address: location.trim(),
        birthday: birthday || undefined,
        profilePicture: avatarUri && !avatarUri.startsWith('file://') ? avatarUri : undefined,
      };

      // Update student
      await axios.put(
        `${API_BASE_URL}/api/v1/students/${currentUser.id || user.id}`,
        payload,
        { withCredentials: true },
      );

      updateUser({
        name: payload.name,
        address: payload.address,
        birthday: payload.birthday,
        profilePicture: payload.profilePicture,
      });
      await refreshUser();
      setStudentId(currentUser.id || user.id);
      setPersonalSubmitted(true);
      return true;
    } catch (e: any) {
      console.error('Personal submit error:', e);
      Alert.alert('Save failed', e.response?.data?.error || e.message);
      setErrors((prev) => ({ ...prev, submit: e.response?.data?.error || e.message || 'Failed to save' }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  //  ACADEMIC VALIDATION (aligned with Next.js)
  // -----------------------------------------------------------------
  const validateAcademic = (): string | null => {
    switch (selectedInterest) {
      case 'KINDERGARTEN':
        if (!academicStatus) return 'Please select your academic status';
        break;
      case 'SCHOOL':
      case 'INTERMEDIATE':
      case 'TUITION_CENTER':
        if (!studyingIn) return 'Please select what you\'re studying in';
        if (!preferredStream) return 'Please select your preferred stream';
        break;
      case 'GRADUATION':
        if (!graduationType) return 'Please select graduation type';
        if (!studyingIn) return 'Please select what you\'re studying in';
        if (!preferredStream) return 'Please select your preferred stream';
        break;
      case 'COACHING_CENTER':
        if (!lookingFor) return 'Please select what you\'re looking for';
        if (!academicLevel) return 'Please select your academic level';
        if (!stream) return 'Please select your stream';
        if (!passoutYear) return 'Please enter your passout year';
        break;
      case 'STUDY_ABROAD':
        if (!highestEducation) return 'Please select your highest education';
        if (!hasBacklogs) return 'Please specify if you have backlogs';
        if (!englishTestStatus) return 'Please select your English test status';
        if (englishTestStatus === 'Already have my exam score') {
          if (!testType) return 'Please select test type';
          if (!overallScore) return 'Please enter your overall score';
          if (!examDate) return 'Please enter exam date';
        }
        break;
      case 'STUDY_HALLS':
        return null;
    }
    return null;
  };

  const validateStudyAbroadStep2 = (): string | null => {
    if (!studyGoals) return 'Please specify what you want to study';
    if (!budgetPerYear) return 'Please select your budget range';
    if (preferredCountries.length === 0) return 'Please select at least one preferred country';
    if (preferredCountries.length > 3) return 'You can select up to 3 countries';
    if (!passportStatus) return 'Please specify your passport status';
    return null;
  };

  // -----------------------------------------------------------------
  //  ACADEMIC SUBMISSION (aligned with Next.js: build details, update)
  // -----------------------------------------------------------------
  const submitAcademicProfile = async (): Promise<boolean> => {
    if (!studentId || !selectedInterest) {
      setErrors({ submit: 'Student not initialized. Please go back and try again.' });
      return false;
    }
    try {
      let details: any = {};
      let profileTypeToSend = selectedInterest;

      switch (selectedInterest) {
        case 'KINDERGARTEN':
          let status = 'CURRENTLY_IN';
          if (academicStatus === 'Completed Kindergarten') status = 'COMPLETED';
          if (academicStatus === 'Seeking Admission to Kindergarten') status = 'SEEKING_ADMISSION';
          details = { status };
          break;

        case 'SCHOOL':
        case 'INTERMEDIATE':
        case 'TUITION_CENTER':
          details = { studyingIn, preferredStream };
          break;

        case 'GRADUATION':
          let graduationTypeMapped = 'UNDER_GRADUATE';
          if (graduationType === 'Post Graduation') graduationTypeMapped = 'POST_GRADUATE';
          details = { graduationType: graduationTypeMapped, studyingIn, preferredStream };
          break;

        case 'COACHING_CENTER':
          let lookingForMapped = 'EXAM_PREPARATION';
          if (lookingFor === 'Upskilling / Skill Development') lookingForMapped = 'UPSKILLING_SKILL_DEVELOPMENT';
          if (lookingFor === 'Vocational Training') lookingForMapped = 'VOCATIONAL_TRAINING';
          details = {
            lookingFor: lookingForMapped,
            academicLevel,
            stream,
            passoutYear,
          };
          break;

        case 'STUDY_ABROAD':
          details = {
            highestEducation,
            hasBacklogs,
            englishTestStatus,
            ...(englishTestStatus === 'Already have my exam score' && {
              testType,
              overallScore,
              examDate,
            }),
            studyGoals: studyGoals || 'Not specified',
            budgetPerYear: budgetPerYear || 'Not specified',
            preferredCountries: preferredCountries.length > 0 ? preferredCountries : ['Not specified'],
            passportStatus: passportStatus === 'Yes' ? 'YES' : passportStatus === 'No' ? 'NO' : 'APPLIED',
          };
          break;

        case 'STUDY_HALLS':
          details = { any: true };
          break;
      }

      await axios.put(
        `${API_BASE_URL}/api/v1/students/${studentId}/academic-profile`,
        { profileType: profileTypeToSend, details },
        { withCredentials: true },
      );

      setProfileCompleted(true);
      await refreshUser();
      router.replace('/(tabs)/home');
      return true;
    } catch (e: any) {
      console.error('Error submitting academic profile:', e);
      setErrors((prev) => ({ ...prev, submit: e.response?.data?.error || e.message || 'Failed to save academic profile' }));
      return false;
    }
  };

  // -----------------------------------------------------------------
  //  FINAL SUBMIT
  // -----------------------------------------------------------------
  const submitAll = async () => {
    setLoading(true);
    try {
      if (!personalSubmitted) {
        const ok = await submitPersonalText();
        if (!ok) return;
      }

      if (avatarUri && avatarUri.startsWith('file://') && avatarUri !== user?.profilePicture) {
        await uploadAvatarToS3(avatarUri);
      }

      await submitAcademicProfile();
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  //  CONTINUE HANDLER (aligned with Next.js flow)
  // -----------------------------------------------------------------
  const handleContinue = async () => {
    setErrors((prev) => ({ ...prev, submit: undefined, interest: undefined }));

    if (step < 5) {
      if (!validatePersonal()) return;
      const ok = await submitPersonalText();
      if (ok) setStep(5);
      return;
    }

    if (step === 5) {
      if (!selectedInterest) {
        setErrors({ interest: 'Please select an interest' });
        return;
      }
      if (selectedInterest === 'STUDY_HALLS') {
        await submitAll();
        return;
      }
      setStep(6);
      return;
    }

    if (step === 6) {
      const validationError = validateAcademic();
      if (validationError) {
        setErrors({ submit: validationError });
        return;
      }
      if (selectedInterest === 'STUDY_ABROAD') {
        setStep(7);
        return;
      }
      await submitAll();
      return;
    }

    if (step === 7) {
      const err = validateStudyAbroadStep2();
      if (err) {
        setErrors({ submit: err });
        return;
      }
      await submitAll();
      return;
    }
  };

  // -----------------------------------------------------------------
  //  UI COMPONENTS (unchanged)
  // -----------------------------------------------------------------
  const ProgressBar = () => (
    <View className="w-full h-1 bg-[#E9ECF4] rounded-full overflow-hidden mb-4">
      <View
        className="h-full bg-[#0A46E4]"
        style={{ width: `${progressPct}%` }}
      />
    </View>
  );

  const getTitle = () => {
    if (step < 5) return 'Tell us about you';
    if (step === 5) return 'Academic Interests';
    if (step === 6) return 'Your Academic Profile';
    if (step === 7) return selectedInterest === 'STUDY_ABROAD' ? (showAllCountries ? 'Select country' : 'Your Study Goals') : 'Additional Info';
    return '';
  };

  const Title = () => (
    <Text className="text-lg font-semibold text-[#111827] mb-4">
      {getTitle()}
    </Text>
  );

  const AvatarSection = () => (
    <View className="items-center mb-6 relative">
      <View className="relative w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
        <Image
          source={
            uploadingAvatar
              ? placeholderAvatar
              : avatarUri
              ? { uri: avatarUri }
              : user?.profilePicture
              ? { uri: user.profilePicture }
              : placeholderAvatar
          }
          className="w-full h-full"
          resizeMode="cover"
        />
        {uploadingAvatar && (
          <View className="absolute inset-0 bg-black/50 rounded-full justify-center items-center">
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={pickAvatar}
        disabled={loading || uploadingAvatar}
        className="absolute bottom-0 right-0 bg-[#0A46E4] rounded-full p-2 shadow"
      >
        <Ionicons name="pencil" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    keyboardType = 'default',
    maxLength,
    multiline = false,
    rows = 3,
  }: any) => (
    <View className="mb-4">
      <Text className="text-xs font-semibold text-[#111827] mb-1">
        {label}
      </Text>
      <TextInput
        className={`w-full px-4 rounded-xl border ${
          error ? 'border-red-400 bg-white' : 'border-[#E5E7EB] bg-white'
        } ${multiline ? 'h-20 py-3' : 'h-12'}`}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={rows}
        editable={!loading && !uploadingAvatar}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );

  const Dropdown = ({
    value,
    onChange,
    options,
    placeholder,
    disabled,
    error,
  }: any) => {
    const [open, setOpen] = useState(false);
    return (
      <View className="mb-4">
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          disabled={disabled || loading || uploadingAvatar}
          className={`h-12 px-4 rounded-xl border flex-row items-center justify-between ${
            error ? 'border-red-400' : 'border-[#E5E7EB]'
          } bg-white`}
        >
          <Text
            className={`${
              value ? 'text-[#111827]' : 'text-[#9CA3AF]'
            } text-base`}
          >
            {value || placeholder}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#111827"
          />
        </TouchableOpacity>
        {open && (
          <View className="bg-white border border-[#E5E7EB] rounded-xl mt-1 max-h-60">
            {options.map((opt: string) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="px-4 py-3 flex-row items-center"
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 border-[#111827] mr-3 items-center justify-center ${
                    value === opt ? 'border-[#0A46E4]' : ''
                  }`}
                >
                  {value === opt && (
                    <View className="w-2.5 h-2.5 bg-[#0A46E4] rounded-full" />
                  )}
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

  const RadioGroup = ({
    label,
    value,
    onChange,
    options,
    horizontal = false,
    error,
  }: any) => (
    <View className="mb-4">
      {label && (
        <Text className="text-xs font-semibold text-[#111827] mb-3">
          {label}
        </Text>
      )}
      <View
        className={
          horizontal ? 'flex-row justify-between' : 'flex-col space-y-3'
        }
      >
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            className={`flex-row items-center py-3 px-2 rounded-lg ${
              value === opt ? 'bg-[#0A46E4]/10 border border-[#0A46E4]' : 'border border-[#E5E7EB]'
            }`}
          >
            <View className="w-5 h-5 rounded-full border-2 border-[#111827] mr-3 items-center justify-center">
              {value === opt && (
                <View className="w-2.5 h-2.5 bg-[#0A46E4] rounded-full" />
              )}
            </View>
            <Text className="text-base text-[#111827]">{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );

  const ChipButton = ({ opt, selected, onPress }: { opt: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 h-10 rounded-lg border ${
        selected ? 'bg-[#0A46E4] text-white border-[#0A46E4]' : 'border-[#E5E7EB] text-[#111827]'
      }`}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-white' : ''}`}>{opt}</Text>
    </TouchableOpacity>
  );

  // -----------------------------------------------------------------
  //  RENDERERS PER STEP (unchanged, aligned with Next.js forms)
  // -----------------------------------------------------------------
  const renderPersonalForm = () => (
    <>
      {AvatarSection()}
      <InputField
        label="Full Name"
        value={fullName}
        onChange={handleName}
        placeholder="Enter full name"
        error={errors.fullName}
        maxLength={80}
      />
      <InputField
        label="Birthday"
        value={birthday}
        onChange={handleBirthday}
        placeholder="DD/MM/YYYY"
        error={errors.birthday}
        keyboardType="numeric"
      />
      <InputField
        label="Location"
        value={location}
        onChange={handleLocation}
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
          className={`w-[48%] h-24 rounded-xl overflow-hidden mb-3 shadow-sm ${
            selectedInterest === item.key ? 'ring-2 ring-[#0A46E4]' : ''
          }`}
          style={{ elevation: 2 }}
        >
          <Image source={item.img} className="w-full h-full" resizeMode="cover" />
          <View className="absolute inset-0 bg-black/20" />
          <Text className="absolute bottom-2 left-2 text-white font-semibold text-sm">
            {item.label.replace('\n', ' ')}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );

  const renderAcademicForm = () => {
    if (!selectedInterest) return <Text className="text-center text-gray-500">Please select an academic interest.</Text>;

    switch (selectedInterest) {
      case 'KINDERGARTEN':
        return (
          <RadioGroup
            label="Academic Status"
            value={academicStatus}
            onChange={setAcademicStatus}
            options={['Currently in Kindergarten', 'Completed Kindergarten', 'Seeking Admission to Kindergarten']}
            error={errors.academicStatus}
          />
        );

      case 'SCHOOL':
        return (
          <>
            <Text className="text-xs font-semibold text-[#111827] mb-1">Academic Status</Text>
            <Dropdown
              value={studyingIn}
              onChange={setStudyingIn}
              options={[
                'Completed Class 10th', 'Class 10th', 'Class 9th', 'Class 8th', 'Class 7th', 'Class 6th',
                'Class 5th', 'Class 4th', 'Class 3rd', 'Class 2nd', 'Class 1st',
              ]}
              placeholder="Select studying in"
              error={errors.studyingIn}
            />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
            <Dropdown
              value={preferredStream}
              onChange={setPreferredStream}
              options={['MPC (Engineering)', 'BiPC (Medical)', 'CEC (Commerce)', 'HEC (History)', "Other's", 'Not Decided']}
              placeholder="Select Your Preferred Stream"
              error={errors.preferredStream}
            />
          </>
        );

      case 'INTERMEDIATE':
        return (
          <>
            <Text className="text-xs font-semibold text-[#111827] mb-1">Academic Status</Text>
            <Dropdown
              value={studyingIn}
              onChange={setStudyingIn}
              options={['Class 12th Passed', 'Class 12th', 'Class 11th']}
              placeholder="Select studying in"
              error={errors.studyingIn}
            />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
            <Dropdown
              value={preferredStream}
              onChange={setPreferredStream}
              options={[
                'Engineering (B.E./B.Tech.)', 'Medical Sciences', 'Arts and Humanities (B.A.)', 'Science (B.Sc.)',
                'Commerce (B.Com.)', 'Business Administration (BBA)', 'Computer Applications (BCA)', 'Fine Arts (BFA)',
                'Law (L.L.B./Integrated Law Courses)', "Other's",
              ]}
              placeholder="Select Your Preferred Stream"
              error={errors.preferredStream}
            />
          </>
        );

      case 'GRADUATION':
        return (
          <>
            <Dropdown
              value={graduationType}
              onChange={setGraduationType}
              options={['Under Graduation', 'Post Graduation']}
              placeholder="Select graduation type"
              error={errors.graduationType}
            />
            {graduationType === 'Under Graduation' && (
              <>
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Academic Status</Text>
                <Dropdown
                  value={studyingIn}
                  onChange={setStudyingIn}
                  options={['Passed Out', '1st Year', '2nd Year', '3rd Year', '4th Year']}
                  placeholder="Select studying in"
                  error={errors.studyingIn}
                />
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
                <Dropdown
                  value={preferredStream}
                  onChange={setPreferredStream}
                  options={['B.Tech', 'B.Sc', 'B.A', 'B.Com', 'BBA', 'BCA', 'BFA', 'L.L.B', 'B.Pharmacy', "Other's", 'Not Decided']}
                  placeholder="Select Your Preferred Stream"
                  error={errors.preferredStream}
                />
              </>
            )}
            {graduationType === 'Post Graduation' && (
              <>
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Academic Status</Text>
                <Dropdown
                  value={studyingIn}
                  onChange={setStudyingIn}
                  options={['PG Passed', '1st Year', '2nd Year']}
                  placeholder="Select studying in"
                  error={errors.studyingIn}
                />
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
                <Dropdown
                  value={preferredStream}
                  onChange={setPreferredStream}
                  options={['MBA', 'MCA', 'M.SC', 'MS', 'M.TECH', 'M.COM', 'M.PHARMACY', 'L.L.M', "Other's"]}
                  placeholder="Select Your Preferred Stream"
                  error={errors.preferredStream}
                />
              </>
            )}
          </>
        );

      case 'COACHING_CENTER':
        return (
          <>
            <RadioGroup
              label="What are you looking for?"
              value={lookingFor}
              onChange={setLookingFor}
              options={['Upskilling / Skill Development', 'Exam Preparation', 'Vocational Training']}
              error={errors.lookingFor}
            />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">What is your academic level?</Text>
            <Dropdown
              value={academicLevel}
              onChange={setAcademicLevel}
              options={[
                'Completed Class 10', 'Studying in Class 11', 'Studying in Class 12', 'Completed Class 12',
                'Pursuing Under Graduation', 'Completed Under Graduation', 'Pursuing Post Graduation', 'Completed Post Graduation',
              ]}
              placeholder="Select your academic status"
              error={errors.academicLevel}
            />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Stream</Text>
            <Dropdown
              value={stream}
              onChange={setStream}
              options={coachingStreamOptions}
              placeholder="Select your stream"
              error={errors.stream}
            />
            <InputField
              label="Passout Year"
              value={passoutYear}
              onChange={setPassoutYear}
              placeholder="Enter year"
              error={errors.passoutYear}
              keyboardType="numeric"
              maxLength={4}
            />
          </>
        );

      case 'TUITION_CENTER':
        return (
          <>
            <Text className="text-xs font-semibold text-[#111827] mb-1">Academic Status</Text>
            <Dropdown
              value={studyingIn}
              onChange={setStudyingIn}
              options={['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']}
              placeholder="Select studying in"
              error={errors.studyingIn}
            />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Preferred Stream</Text>
            <Dropdown
              value={preferredStream}
              onChange={setPreferredStream}
              options={['Math', 'Science', 'English', 'Social Studies']}
              placeholder="Select Your Preferred Stream"
              error={errors.preferredStream}
            />
          </>
        );

      case 'STUDY_ABROAD':
        return (
          <>
            <RadioGroup
              label="Highest Level of Education"
              value={highestEducation}
              onChange={setHighestEducation}
              options={['12th Grade', "Bachelor's", "Master's"]}
              error={errors.highestEducation}
            />
            <RadioGroup
              label="Do you have any backlogs?"
              value={hasBacklogs}
              onChange={setHasBacklogs}
              options={['Yes', 'No']}
              horizontal
              error={errors.hasBacklogs}
            />
            <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">English Test Status</Text>
            <Dropdown
              value={englishTestStatus}
              onChange={setEnglishTestStatus}
              options={[
                "Haven't decided yet", 'Preparing for the exam', 'Booked my exam', 'Awaiting results', 'Already have my exam score',
              ]}
              placeholder="Select Test Status"
              error={errors.englishTestStatus}
            />
            {englishTestStatus === 'Already have my exam score' && (
              <>
                <Text className="text-xs font-semibold text-[#111827] mb-1 mt-4">Test Type</Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {['IELTS', 'PTE', 'TOEFL', 'Duolingo'].map((opt) => (
                    <ChipButton
                      key={opt}
                      opt={opt}
                      selected={testType === opt}
                      onPress={() => setTestType(opt)}
                    />
                  ))}
                </View>
                {errors.testType && <Text className="text-xs text-red-500 mb-2">{errors.testType}</Text>}
                <InputField
                  label="Overall Score"
                  value={overallScore}
                  onChange={setOverallScore}
                  placeholder="e.g., 7.5"
                  error={errors.overallScore}
                />
                <InputField
                  label="Date of Exam"
                  value={examDate}
                  onChange={(v) => {
                    setExamDate(v);
                    const msg = validateDateInstant(v);
                    setErrors((prev) => ({ ...prev, examDate: msg || undefined }));
                  }}
                  placeholder="DD/MM/YYYY"
                  error={errors.examDate}
                  keyboardType="numeric"
                />
              </>
            )}
          </>
        );

      case 'STUDY_HALLS':
        return <Text className="text-center text-gray-500 mt-4">No additional details needed for Study Halls.</Text>;

      default:
        return <Text className="text-center text-gray-500">Please select an interest.</Text>;
    }
  };

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
        options={[
          'Below ₹10 Lakhs', '₹10 Lakhs - ₹20 Lakhs', '₹20 Lakhs - ₹30 Lakhs',
          '₹30 Lakhs - ₹40 Lakhs', '₹40 Lakhs - ₹50 Lakhs', 'Above ₹50 Lakhs',
        ]}
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
                  className={`flex-1 h-20 m-1 rounded-xl border items-center justify-center ${
                    selected ? 'border-[#0A46E4] bg-[#0A46E4]/5' : 'border-[#E5E7EB]'
                  }`}
                >
                  <Text className="text-2xl">{countryToFlag[item]}</Text>
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
              <Ionicons name="search" size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: 12 }} />
            </View>
          </View>
          <FlatList
            data={allCountries.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()))}
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
                  className={`flex-1 h-18 m-1 rounded-xl border items-center justify-center ${
                    selected ? 'border-[#0A46E4] bg-[#0A46E4]/5' : 'border-[#E5E7EB]'
                  }`}
                >
                  <Text className="text-2xl">{countryToFlag[item]}</Text>
                  <Text className="text-xs font-semibold mt-1">{item}</Text>
                </TouchableOpacity>
              );
            }}
            style={{ maxHeight: 240 }}
          />
          <TouchableOpacity
            onPress={() => setShowAllCountries(false)}
            className="w-full h-11 rounded-xl bg-[#0A46E4] items-center justify-center mt-3"
          >
            <Text className="text-white font-medium">Done</Text>
          </TouchableOpacity>
        </View>
      )}
      {errors.preferredCountries && <Text className="text-xs text-red-500 mt-1">{errors.preferredCountries}</Text>}
      <RadioGroup
        label="Do you have a valid passport?"
        value={passportStatus}
        onChange={setPassportStatus}
        options={['Yes', 'No', 'Applied']}
        horizontal
        error={errors.passportStatus}
      />
    </>
  );

  const renderAdditionalForm = () => (
    <InputField
      label="Additional Information"
      value={additionalInfo}
      onChange={(v) => {
        setAdditionalInfo(v);
        setErrors((prev) => {
          const n = { ...prev };
          if (!v.trim()) delete n.additionalInfo;
          return n;
        });
      }}
      placeholder="e.g., Any specific requirements, preferences, etc."
      multiline
      rows={3}
      error={errors.additionalInfo}
    />
  );

  // -----------------------------------------------------------------
  //  MAIN RENDER
  // -----------------------------------------------------------------
  return (
    <SafeAreaView className="flex-1 bg-[#F5F6F9]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4">
          <TouchableOpacity
            onPress={() => setStep((s) => (s > 1 ? (s - 1) as Step : s))}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/home')}
            disabled={loading}
          >
            <Text className="text-sm font-medium text-[#111827]">SKIP</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1 px-6 pt-6" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar />
          <Title />

          {/* Step-based content */}
          {step < 5 && renderPersonalForm()}
          {step === 5 && renderInterests()}
          {step === 6 && renderAcademicForm()}
          {step === 7 && (selectedInterest === 'STUDY_ABROAD' ? renderStudyAbroadStep2() : renderAdditionalForm())}
          {step === 8 && <Text>Complete!</Text>}

          {errors.submit && <Text className="text-center text-red-500 mt-4">{errors.submit}</Text>}
          {errors.interest && <Text className="text-center text-red-500 mt-4">{errors.interest}</Text>}
        </ScrollView>

        {/* Continue Button (hidden if showAllCountries) */}
        {!showAllCountries && (
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={handleContinue}
              disabled={
                loading ||
                uploadingAvatar ||
                (step < 5 && !canContinuePersonal) ||
                (step === 5 && !selectedInterest)
              }
              className={`w-full h-12 rounded-xl items-center justify-center ${
                loading ||
                uploadingAvatar ||
                (step < 5 && !canContinuePersonal) ||
                (step === 5 && !selectedInterest)
                  ? 'bg-[#E5E7EB]'
                  : 'bg-[#0A46E4]'
              }`}
            >
              {loading || uploadingAvatar ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-medium text-base">
                  {loading ? 'Saving...' : 'Continue'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileSetup;
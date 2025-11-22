import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardTypeOptions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const API_BASE_URL = 'https://tooclarity.onrender.com/api';

const THEME = {
  primary: '#0A46E4',
  secondary: '#E9ECF4',
  text: '#111827',
  textGray: '#6B7280',
  background: '#F5F6F9',
  white: '#FFFFFF',
  error: '#EF4444',
  border: '#E5E7EB',
  success: '#10B981',
};

const INTERESTS = [
  { key: "KINDERGARTEN", label: "Kindergarten", color: "#3C5BFF", icon: "👶" },
  { key: "SCHOOL", label: "School", color: "#FF8A3D", icon: "🏫" },
  { key: "INTERMEDIATE", label: "Intermediate", color: "#69C9FF", icon: "🎓" },
  { key: "GRADUATION", label: "Graduation", color: "#A77BFF", icon: "📜" },
  { key: "COACHING_CENTER", label: "Coaching Center", color: "#FF5A4E", icon: "📚" },
  { key: "STUDY_HALLS", label: "Study Halls", color: "#FF8B64", icon: "📖" },
  { key: "TUITION_CENTER", label: "Tuition Center", color: "#6E6BFF", icon: "📝" },
  { key: "STUDY_ABROAD", label: "Study Abroad", color: "#2BD76F", icon: "✈️" },
];

// ==========================================
// TYPES
// ==========================================

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  error?: string;
}

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

// ==========================================
// API UTILITIES
// ==========================================

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    console.log(`\n🚀 [API Request] ${options.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error(`❌ [API Error] ${response.status}:`, data);
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    if (data && typeof data === 'object' && !('success' in data)) {
      data.success = true;
    }

    return data;
  } catch (error: any) {
    console.error("❌ [Network/API Error]:", error);
    return { success: false, message: error.message };
  }
}

const getMimeType = (uri: string) => {
    const lower = uri.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    return 'image/jpeg'; 
};

async function uploadToS3(imageUri: string) {
  try {
    console.log("🖼️ [S3] Starting upload for:", imageUri);
    
    const fileType = getMimeType(imageUri);
    const filename = imageUri.split('/').pop();

    const presignedRes = await apiRequest('/s3/upload-url', {
      method: "POST",
      body: JSON.stringify({ filename, filetype: fileType }),
    });

    if (!presignedRes.uploadUrl) {
        throw new Error(presignedRes.message || "Failed to get upload URL");
    }

    const uploadUrl = presignedRes.uploadUrl;
    const imgResponse = await fetch(imageUri);
    const blob = await imgResponse.blob();

    console.log(`📦 [S3] Uploading ${blob.size} bytes...`);

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": fileType },
      body: blob,
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 Upload failed: ${uploadResponse.status}`);
    }

    const finalUrl = presignedRes.publicUrl || uploadUrl.split("?")[0];
    console.log("✅ [S3] Upload Success:", finalUrl);
    
    return { success: true, fileUrl: finalUrl };

  } catch (e: any) {
    console.error("❌ [S3 Upload Error]", e);
    return { success: false, error: e.message };
  }
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

const CustomInput: React.FC<CustomInputProps> = React.memo(({ label, value, onChangeText, placeholder, error, keyboardType, maxLength }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error ? styles.inputError : undefined]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
));

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onSelect, error }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.input, styles.dropdownInput, error ? styles.inputError : undefined]} 
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.inputText, !value && { color: '#9CA3AF' }]}>
          {value || `Select ${label}`}
        </Text>
        <Text style={{color: THEME.textGray}}>▼</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select {label}</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={styles.closeText}>Done</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                  >
                    <Text style={[styles.optionText, value === item && styles.optionTextSelected]}>
                      {item}
                    </Text>
                    {value === item && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, error }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.radioContainer}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.radioButton, value === opt && styles.radioButtonSelected]}
          onPress={() => onChange(opt)}
        >
          <View style={[styles.radioCircle, value === opt && styles.radioCircleSelected]}>
            {value === opt && <View style={styles.radioInnerCircle} />}
          </View>
          <Text style={[styles.radioText, value === opt && styles.radioTextSelected]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ProfileSetup() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  
  // Loading states for button
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [errors, setErrors] = useState<any>({});

  // Personal Data
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState(""); 
  const [location, setLocation] = useState("");
  
  // Avatar
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [serverAvatarUrl, setServerAvatarUrl] = useState<string | null>(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  // Interests & Academic
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  
  // Form Fields
  const [academicStatus, setAcademicStatus] = useState("");
  const [studyingIn, setStudyingIn] = useState("");
  const [preferredStream, setPreferredStream] = useState("");
  const [graduationType, setGraduationType] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [stream, setStream] = useState("");
  const [passoutYear, setPassoutYear] = useState("");
  
  // Study Abroad Fields
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

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/v1/profile', { method: 'GET' });
      const user = res.data?.user || res.data || (res.success ? res : null);
      
      if (user) {
        // Batch updates to prevent re-renders
        setFullName(user.name || "");
        setLocation(user.address || "");
        
        if (user.birthday) {
            try {
                const d = new Date(user.birthday);
                if (!isNaN(d.getTime())) {
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    setBirthday(`${day}/${month}/${year}`);
                }
            } catch (e) { /* ignore */ }
        }

        const pic = user.profilePicture || user.ProfilePicture;
        if (pic) setServerAvatarUrl(pic);
      }
    } catch (e) {
      console.log("Error fetching profile:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
        setIsAvatarChanged(true);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open gallery");
    }
  };

  const validateDate = (val: string) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    if (!val) return "Birthday is required";
    if (!regex.test(val)) return "Use DD/MM/YYYY format";
    return undefined;
  };

  // Use callback to ensure stable function reference
  const handleContinue = useCallback(async () => {
    setErrors({});

    // 1. Validate Personal Info
    if (step < 5) {
      const errs: any = {};
      if (!fullName.trim() || fullName.length < 2) errs.fullName = "Name must be at least 2 chars";
      const dateErr = validateDate(birthday);
      if (dateErr) errs.birthday = dateErr;
      if (!location.trim() || location.length < 3) errs.location = "Location must be at least 3 chars";

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      setSubmitting(true);
      try {
        let finalAvatarUrl = serverAvatarUrl;

        if (isAvatarChanged && avatarUri) {
          setUploadingImage(true);
          const uploadRes = await uploadToS3(avatarUri);
          setUploadingImage(false);

          if (uploadRes.success) {
            finalAvatarUrl = uploadRes.fileUrl as string;
            setServerAvatarUrl(finalAvatarUrl);
            setAvatarUri(null); 
            setIsAvatarChanged(false);
          } else {
            Alert.alert("Image Upload Failed", uploadRes.error || "Could not upload image.");
          }
        }

        const payload: any = {
          name: fullName,
          address: location,
          birthday: birthday,
        };
        
        if (finalAvatarUrl) {
            payload.ProfilePicture = finalAvatarUrl;
        }

        const res = await apiRequest('/v1/students/', {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (res.success || (res.data && res.data._id)) {
          setStep(5);
        } else {
          Alert.alert("Update Failed", res.message || "Could not save profile");
        }
      } catch (e: any) {
        setUploadingImage(false);
        Alert.alert("Error", e.message || "Network error");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // 2. Validate Interests
    if (step === 5) {
      if (!selectedInterest) {
        setErrors({ interest: "Please select an interest" });
        return;
      }

      if (selectedInterest === "STUDY_HALLS") {
         await submitAcademicProfile("STUDY_HALLS", {});
         return;
      }

      setStep(6);
      return;
    }

    // 3. Validate Academic Form
    if (step === 6) {
      const validationErr = validateAcademicForm();
      if (validationErr) {
        Alert.alert("Missing Fields", validationErr);
        return;
      }

      if (selectedInterest === 'STUDY_ABROAD') {
        setStep(7);
        return;
      }

      await submitAcademicProfile();
      return;
    }

    // 4. Validate Study Abroad Extra
    if (step === 7) {
      if (!studyGoals || !budgetPerYear || !passportStatus) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }
      if (preferredCountries.length === 0) {
        Alert.alert("Error", "Select at least one country");
        return;
      }
      await submitAcademicProfile();
    }
  }, [step, fullName, birthday, location, avatarUri, isAvatarChanged, serverAvatarUrl, selectedInterest, academicStatus, studyingIn, preferredStream, graduationType, lookingFor, academicLevel, stream, passoutYear, highestEducation, hasBacklogs, englishTestStatus, testType, overallScore, examDate, studyGoals, budgetPerYear, passportStatus, preferredCountries]);

  const validateAcademicForm = () => {
    switch (selectedInterest) {
        case "KINDERGARTEN": if(!academicStatus) return "Select status"; break;
        case "SCHOOL": 
        case "INTERMEDIATE": 
        case "TUITION_CENTER": if(!studyingIn || !preferredStream) return "Select all options"; break;
        case "GRADUATION": if(!graduationType) return "Select graduation type"; break;
        case "COACHING_CENTER": if(!lookingFor || !academicLevel || !stream) return "Fill all details"; break;
        case "STUDY_ABROAD": if(!highestEducation || !hasBacklogs || !englishTestStatus) return "Fill all details"; break;
    }
    return null;
  };

  const submitAcademicProfile = async (overrideType?: string, overrideDetails?: any) => {
    setSubmitting(true);
    try {
        let details = overrideDetails || {};
        
        if (!overrideDetails) {
            if (selectedInterest === 'KINDERGARTEN') {
                details = { 
                    status: academicStatus === 'Currently in Kindergarten' ? 'CURRENTLY_IN' : 
                           (academicStatus === 'Completed Kindergarten' ? 'COMPLETED' : 'SEEKING_ADMISSION') 
                };
            } else if (['SCHOOL', 'INTERMEDIATE', 'TUITION_CENTER'].includes(selectedInterest || '')) {
                details = { studyingIn, preferredStream };
            } else if (selectedInterest === 'GRADUATION') {
                details = { 
                    graduationType: graduationType === 'Post Graduation' ? 'POST_GRADUATE' : 'UNDER_GRADUATE', 
                    studyingIn, 
                    preferredStream 
                };
            } else if (selectedInterest === 'COACHING_CENTER') {
                let lookingForMapped = "EXAM_PREPARATION";
                if (lookingFor === "Upskilling / Skill Development") lookingForMapped = "UPSKILLING_SKILL_DEVELOPMENT";
                if (lookingFor === "Vocational Training") lookingForMapped = "VOCATIONAL_TRAINING";
                
                details = { lookingFor: lookingForMapped, academicLevel, stream, passoutYear };
            } else if (selectedInterest === 'STUDY_ABROAD') {
                details = {
                    highestEducation,
                    hasBacklogs,
                    englishTestStatus,
                    studyGoals: studyGoals || "Not specified",
                    budgetPerYear: budgetPerYear || "Not specified",
                    preferredCountries: preferredCountries.length > 0 ? preferredCountries : ["Not specified"],
                    passportStatus: passportStatus === 'Yes' ? 'YES' : (passportStatus === 'No' ? 'NO' : 'APPLIED'),
                    ...(englishTestStatus === "Already have my exam score" ? { testType, overallScore, examDate } : {})
                };
            }
        }

        const payload = {
            profileType: overrideType || selectedInterest,
            details
        };

        const res = await apiRequest('/v1/students/academic-profile', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });

        if (res.success) {
            Alert.alert("Success", "Profile Setup Complete!", [
                { 
                    text: "Go to Home", 
                    onPress: () => router.replace('/(tabs)/home')
                }
            ]);
        } else {
            Alert.alert("Error", res.message || "Failed to save academic profile");
        }
    } catch (e) {
        Alert.alert("Error", "Something went wrong submitting data");
    } finally {
        setSubmitting(false);
    }
  };

  // --- RENDERS ---

  const progress = useMemo(() => {
      if(step < 5) return 0.25;
      if(step === 5) return 0.5;
      if(step === 6) return 0.75;
      return 1.0;
  }, [step]);

  const displayAvatar = useMemo(() => {
      if (avatarUri) return { uri: avatarUri };
      if (serverAvatarUrl) return { uri: serverAvatarUrl };
      return null;
  }, [avatarUri, serverAvatarUrl]);

  if (loading) {
      return (
          <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
              <ActivityIndicator size="large" color={THEME.primary} />
              <Text style={{marginTop:10, color: THEME.textGray}}>Loading profile...</Text>
          </View>
      );
  }

  const renderPersonal = () => (
      <View>
        <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
                {displayAvatar ? (
                    <Image source={displayAvatar} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitials}>
                            {fullName ? fullName.trim().split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : "?"}
                        </Text>
                    </View>
                )}
                <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
                    <Text style={{fontSize: 14}}>📷</Text>
                </TouchableOpacity>
            </View>
        </View>

        <CustomInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="John Doe" error={errors.fullName} />
        <CustomInput label="Birthday" value={birthday} onChangeText={(t) => {
            if (t.length === 2 && birthday.length === 1) t += '/';
            if (t.length === 5 && birthday.length === 4) t += '/';
            setBirthday(t);
        }} placeholder="DD/MM/YYYY" keyboardType="numeric" maxLength={10} error={errors.birthday} />
        <CustomInput label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" error={errors.location} />
      </View>
  );

  const renderInterests = () => (
      <View style={styles.gridContainer}>
          {INTERESTS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                    styles.interestCard,
                    { backgroundColor: item.color },
                    selectedInterest === item.key && styles.interestCardSelected
                ]}
                onPress={() => setSelectedInterest(item.key)}
              >
                  <Text style={{fontSize:32}}>{item.icon}</Text>
                  <Text style={styles.interestLabel}>{item.label}</Text>
                  {selectedInterest === item.key && <View style={styles.selectedOverlay}><Text style={{color:'white'}}>✓</Text></View>}
              </TouchableOpacity>
          ))}
      </View>
  );

  const renderAcademic = () => {
      if(selectedInterest === 'KINDERGARTEN') {
          return <RadioGroup label="Status" options={["Currently in Kindergarten", "Completed Kindergarten", "Seeking Admission"]} value={academicStatus} onChange={setAcademicStatus} />;
      }
      if(['SCHOOL', 'INTERMEDIATE', 'TUITION_CENTER'].includes(selectedInterest || '')) {
          return (
              <View>
                  <CustomDropdown label="Current Class" options={["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"]} value={studyingIn} onSelect={setStudyingIn} />
                  <CustomDropdown label="Preferred Stream" options={["MPC","BiPC","CEC","HEC","Math","Science","English","Other"]} value={preferredStream} onSelect={setPreferredStream} />
              </View>
          );
      }
      if(selectedInterest === 'GRADUATION') {
        return (
            <View>
                <CustomDropdown label="Type" options={["Under Graduation", "Post Graduation"]} value={graduationType} onSelect={setGraduationType} />
                {graduationType && <CustomDropdown label="Year" options={["1st Year","2nd Year","3rd Year","4th Year","Passed Out"]} value={studyingIn} onSelect={setStudyingIn} />}
                {graduationType && <CustomDropdown label="Stream" options={["B.Tech","B.Sc","MBA","MCA","B.Com","Other"]} value={preferredStream} onSelect={setPreferredStream} />}
            </View>
        );
      }
      if(selectedInterest === 'COACHING_CENTER') {
          return (
            <View>
                <CustomDropdown label="Looking For" options={["Upskilling / Skill Development","Exam Preparation","Vocational Training"]} value={lookingFor} onSelect={setLookingFor} />
                <CustomDropdown label="Level" options={["Completed Class 10","Studying in Class 12","Completed Class 12","Pursuing Under Graduation"]} value={academicLevel} onSelect={setAcademicLevel} />
                <CustomDropdown label="Stream" options={["Engineering","Medical","General","State Board","CBSE"]} value={stream} onSelect={setStream} />
                <CustomInput label="Passout Year" value={passoutYear} onChangeText={setPassoutYear} keyboardType="numeric" maxLength={4} />
            </View>
          );
      }
      if(selectedInterest === 'STUDY_ABROAD') {
          return (
              <View>
                  <RadioGroup label="Highest Education" options={["12th Grade", "Bachelor's", "Master's"]} value={highestEducation} onChange={setHighestEducation} />
                  <RadioGroup label="Backlogs?" options={["Yes", "No"]} value={hasBacklogs} onChange={setHasBacklogs} />
                  <CustomDropdown label="English Test" options={["Haven't decided", "Preparing", "Booked", "Already have my exam score"]} value={englishTestStatus} onSelect={setEnglishTestStatus} />
                  {englishTestStatus === "Already have my exam score" && (
                      <View style={{marginTop: 10}}>
                          <RadioGroup label="Type" options={["IELTS", "TOEFL", "PTE"]} value={testType} onChange={setTestType} />
                          <CustomInput label="Score" value={overallScore} onChangeText={setOverallScore} keyboardType="numeric" />
                          <CustomInput label="Date" value={examDate} onChangeText={setExamDate} placeholder="DD/MM/YYYY" />
                      </View>
                  )}
              </View>
          );
      }
      return <Text style={{textAlign:'center', color:THEME.textGray, marginTop:20}}>No specific details needed for this category. Click Continue.</Text>;
  };

  const renderStudyAbroadExtra = () => (
      <View>
          <CustomInput label="Study Goal" value={studyGoals} onChangeText={setStudyGoals} placeholder="e.g. MS in CS" />
          <CustomDropdown label="Budget / Year" options={["Below 10L", "10L - 20L", "20L - 30L", "Above 30L"]} value={budgetPerYear} onSelect={setBudgetPerYear} />
          
          <Text style={[styles.label, {marginTop:16}]}>Preferred Countries (Max 3)</Text>
          <View style={{flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16}}>
              {["USA", "UK", "Canada", "Australia", "Germany", "Ireland", "New Zealand"].map(c => (
                  <TouchableOpacity 
                    key={c} 
                    style={[styles.chip, preferredCountries.includes(c) && styles.chipSelected]}
                    onPress={() => {
                        if(preferredCountries.includes(c)) setPreferredCountries(p => p.filter(x=>x!==c));
                        else if(preferredCountries.length < 3) setPreferredCountries(p => [...p, c]);
                    }}
                  >
                      <Text style={[styles.chipText, preferredCountries.includes(c) && {color:'white'}]}>{c}</Text>
                  </TouchableOpacity>
              ))}
          </View>
          <RadioGroup label="Valid Passport?" options={["Yes", "No", "Applied"]} value={passportStatus} onChange={setPassportStatus} />
      </View>
  );

  // Use "padding" on iOS and undefined on Android to prevent layout flickering
  const kbBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  const isBusy = submitting || uploadingImage;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={kbBehavior} style={{flex:1}}>
        
        {/* Header */}
        <View style={styles.header}>
            {step > 1 && (
                <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                    <Text style={{fontSize:24, color: THEME.text}}>←</Text>
                </TouchableOpacity>
            )}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
                {step < 5 ? "Tell us about you" : step === 5 ? "Academic Interests" : step === 7 ? "Study Goals" : "Academic Profile"}
            </Text>

            {step < 5 && renderPersonal()}
            {step === 5 && renderInterests()}
            {step === 6 && renderAcademic()}
            {step === 7 && renderStudyAbroadExtra()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
            {errors.submit && <Text style={styles.errorTextCenter}>{errors.submit}</Text>}
            <TouchableOpacity 
                style={[styles.button, isBusy ? styles.buttonDisabled : undefined]}
                onPress={handleContinue}
                disabled={isBusy}
            >
                {/* 
                   STABLE LAYOUT FIX: 
                   We only render ActivityIndicator OR Text, 
                   and ensure justifyContent is center to prevent jumping.
                */}
                {isBusy ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                )}
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: THEME.primary, borderRadius: 3 },
  scrollContent: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 22, fontWeight: '700', color: THEME.text, marginBottom: 20 },

  // Avatar
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white', backgroundColor: '#e1e1e1' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  avatarInitials: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: THEME.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },

  // Inputs
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: THEME.text, marginBottom: 6 },
  input: { backgroundColor: 'white', height: 50, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, paddingHorizontal: 16, fontSize: 16, color: THEME.text },
  inputError: { borderColor: THEME.error },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputText: { fontSize: 16 },
  errorText: { color: THEME.error, fontSize: 12, marginTop: 4 },
  errorTextCenter: { color: THEME.error, fontSize: 12, textAlign: 'center', marginBottom: 8 },

  // Grid & Interests
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  interestCard: { width: '48%', aspectRatio: 1.1, borderRadius: 16, padding: 14, marginBottom: 14, justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  interestCardSelected: { borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  interestLabel: { color: 'white', fontSize: 15, fontWeight: '700' },
  selectedOverlay: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },

  // Radio & Chips
  radioContainer: { flexDirection: 'column', gap: 10 },
  radioButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
  radioButtonSelected: { borderColor: THEME.primary, backgroundColor: '#EFF6FF' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#9CA3AF', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: THEME.primary },
  radioInnerCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: THEME.primary },
  radioText: { fontSize: 15, color: THEME.text },
  radioTextSelected: { color: THEME.primary, fontWeight: '600' },
  
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: 'white', borderWidth: 1, borderColor: THEME.border },
  chipSelected: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  chipText: { fontSize: 14, color: THEME.text },

  // Footer
  footer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: THEME.border },
  button: { height: 52, backgroundColor: THEME.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.border },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  closeText: { color: THEME.primary, fontSize: 16, fontWeight: '600' },
  optionItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between' },
  optionText: { fontSize: 16, color: THEME.text },
  optionTextSelected: { color: THEME.primary, fontWeight: '600' },
  checkmark: { color: THEME.primary, fontWeight: 'bold' },
});
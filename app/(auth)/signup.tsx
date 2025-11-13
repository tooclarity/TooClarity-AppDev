// // app/(auth)/signup.tsx
// import { Ionicons } from '@expo/vector-icons';
// import * as Google from 'expo-auth-session/providers/google';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import TooClarityLogo from '../../assets/images/Tooclaritylogo.png';
// import GoogleLogo from '../../assets/images/google-logo.png';
// import { useAuth } from '../lib/auth-context';
// import { API_BASE_URL } from '../../utils/constant';

// const { width } = Dimensions.get('window');

// export default function StudentRegistration() {
//   const router = useRouter();
//   const { refreshUser } = useAuth();

//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId: '906583664549-c22ppjehvg75mi0ea89up61jbh139u9c.apps.googleusercontent.com',
//   });

//   const [loadingProvider, setLoadingProvider] = useState<null | 'google'>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contactNumber: '',
//     address: '',
//     role: 'student',
//     status: 'active',
//   });

//   // Google Registration Flow
//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;
//       setLoadingProvider('google');

//       fetch(`${API_BASE_URL}/api/v1/auth/google`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token: id_token, role: 'student', source: 'rn-app' }),
//         credentials: 'include', // Include cookies for auth
//       })
//         .then(async (res) => {
//           if (!res.ok) {
//             const text = await res.text();
//             if (text.includes('duplicate key error')) {
//               setError('This email is already registered. Please log in.');
//             } else {
//               setError(text || 'Google sign-up failed');
//             }
//             Alert.alert('Error', error || 'Google sign-up failed');
//             return;
//           }
//           await handleRegisterSuccess();
//         })
//         .catch((err) => {
//           console.error('Google register error:', err);
//           Alert.alert('Error', 'Network error during Google sign-up.');
//         })
//         .finally(() => setLoadingProvider(null));
//     }
//   }, [response]);

//   const handleRegisterSuccess = async () => {
//     await refreshUser();

//     const user = useAuth().user;
//     if (user?.role === 'student') {
//       if (!user?.isProfileCompleted) {
//         router.replace('/screens/profilesetup');
//         return;
//       }
//       if (user?.isProfileCompleted) {
//         router.replace('/(tabs)/home');
//         return;
//       }
//     }
//     router.replace('/(auth)/VerificationSuccessScreen');
//   };

//   const handleInputChange = (name: string, value: string) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (error) setError(null);
//   };

//   const handleSubmit = async () => {
//     const { name, email, contactNumber, address, role, status } = formData;

//     if (!name || !email || !contactNumber) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const payload = {
//         name,
//         email,
//         contactNumber,
//         address,
//         role,
//         status,
//         source: 'rn-app',
//       };
//       const res = await fetch(`${API_BASE_URL}/api/v1/students`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//         credentials: 'include', // Include cookies for auth
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         if (text.includes('duplicate key error')) {
//           setError('This email is already registered. Please log in.');
//         } else {
//           setError(text || 'Registration failed');
//         }
//         Alert.alert('Error', error || 'Registration failed');
//         return;
//       }

//       await handleRegisterSuccess();
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError('Network error. Please try again.');
//       Alert.alert('Error', 'Network error. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const submitButtonDisabled = isLoading || !formData.name || !formData.email || !formData.contactNumber;
//   const googleButtonDisabled = loadingProvider === 'google';

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={20} color="#2563eb" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.logoSection}>
//         <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
//       </View>

//       <View style={styles.titleSection}>
//         <Text style={styles.title}>Sign Up</Text>
//         <Text style={styles.subtitle}>Create your student account</Text>
//       </View>

//       <View style={styles.form}>
//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//             {error.includes('already registered') && (
//               <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
//                 <Text style={styles.loginLink}>Click here to log in</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}

//         <InputField
//           icon="person"
//           placeholder="Full Name"
//           value={formData.name}
//           onChangeText={(v) => handleInputChange('name', v)}
//         />

//         <InputField
//           icon="mail"
//           placeholder="Email"
//           keyboardType="email-address"
//           value={formData.email}
//           onChangeText={(v) => handleInputChange('email', v)}
//         />

//         <InputField
//           icon="call"
//           placeholder="Mobile Number"
//           keyboardType="number-pad"
//           value={formData.contactNumber}
//           onChangeText={(v) => handleInputChange('contactNumber', v.replace(/[^0-9]/g, '').slice(0, 10))}
//         />

//         <InputField
//           icon="home"
//           placeholder="Address (optional)"
//           value={formData.address}
//           onChangeText={(v) => handleInputChange('address', v)}
//         />

//         <TouchableOpacity
//           style={[styles.submitButton, submitButtonDisabled && styles.disabledButton]}
//           onPress={handleSubmit}
//           disabled={submitButtonDisabled}
//         >
//           {isLoading && <ActivityIndicator color="#fff" size="small" />}
//           <Text style={styles.submitButtonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.divider}>
//         <View style={styles.dividerLine} />
//         <Text style={styles.orText}>OR</Text>
//         <View style={styles.dividerLine} />
//       </View>

//       <TouchableOpacity
//         style={[styles.oauthButton, googleButtonDisabled && styles.disabledButton]}
//         onPress={() => promptAsync({ showInRecents: true })}
//         disabled={googleButtonDisabled}
//       >
//         {loadingProvider === 'google' ? (
//           <ActivityIndicator color="#2563EB" size="small" />
//         ) : (
//           <Image source={GoogleLogo} style={styles.googleIcon} resizeMode="contain" />
//         )}
//         <Text style={styles.oauthButtonText}>Continue with Google</Text>
//       </TouchableOpacity>

//       <View style={styles.signupContainer}>
//         <Text style={styles.signupText}>Already have an account? </Text>
//         <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
//           <Text style={styles.signupLink}>Sign in</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const InputField = ({ icon, ...props }) => (
//   <View style={styles.inputContainer}>
//     <View style={styles.inputWrapper}>
//       <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
//       <TextInput {...props} style={styles.textInput} />
//     </View>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingVertical: 24 },
//   header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
//   backButton: { padding: 4, borderRadius: 20 },
//   logoSection: { alignItems: 'center', marginBottom: 40 },
//   logo: { width: 120, height: 60 },
//   titleSection: { marginBottom: 24 },
//   title: { fontSize: 24, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 8 },
//   subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
//   form: { marginBottom: 24 },
//   errorContainer: { backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', padding: 12, marginBottom: 16 },
//   errorText: { fontSize: 14, color: '#DC2626', textAlign: 'center' },
//   loginLink: { fontSize: 14, color: '#2563EB', textAlign: 'center', marginTop: 8 },
//   inputContainer: { marginBottom: 16 },
//   inputWrapper: { flexDirection: 'row', alignItems: 'center' },
//   inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
//   textInput: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingHorizontal: 44, paddingVertical: 12, fontSize: 16, color: '#111827' },
//   submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', borderRadius: 16, paddingVertical: 12 },
//   disabledButton: { backgroundColor: '#D1D5DB', opacity: 0.5 },
//   submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
//   signupContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
//   signupText: { fontSize: 14, color: '#6B7280' },
//   signupLink: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
//   divider: { flexDirection: 'row', alignItems: 'center', width: Math.min(361, width - 40), marginVertical: 24 },
//   dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
//   orText: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 12 },
//   oauthButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 12 },
//   oauthButtonText: { fontSize: 16, fontWeight: '500', color: '#111827' },
//   googleIcon: { width: 20, height: 20, marginRight: 8 },
// });
// app/(auth)/signup.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";

// ✅ Import local images
import TooClarityLogo from "../../assets/images/Tooclaritylogo.png";
import GoogleLogo from "../../assets/images/google-logo.png";

// Enable WebBrowser for expo-auth-session
WebBrowser.maybeCompleteAuthSession();

/* ===========================
   CONFIG
   =========================== */
const API_BASE_URL = "https://tooclarity.onrender.com/api";

/* ===========================
   In-memory auth token
   =========================== */
let _authToken: string | null = null;
const setToken = (token: string | null) => {
  _authToken = token;
  console.log("🔑 [setToken]:", token ? token.slice(0, 10) + "..." : null);
};
const getToken = () => _authToken;

/* ===========================
   Generic API request helper
   =========================== */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T }> {
  console.log("🛰️ [apiRequest] →", endpoint);
  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };
    if (options.body && typeof options.body === "string")
      headers["Content-Type"] = "application/json";

    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return { success: true, data };
  } catch (e: any) {
    console.log("💥 [apiRequest error]", e);
    return { success: false, message: e.message };
  }
}

/* ===========================
   API METHODS
   =========================== */
const authAPI = {
  signUp: (body: any) =>
    apiRequest("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: any) =>
    apiRequest("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  googleAuth: (token: string) =>
    apiRequest("/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  getProfile: () => apiRequest("/v1/profile", { method: "GET" }),
  logout: () => apiRequest("/v1/auth/logout", { method: "POST" }),
};

/* ===========================
   AUTH STORE + CONTEXT
   =========================== */
type User = {
  id?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  designation?: string;
  role?: string;
  profilePicture?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
};

type AuthStore = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  login: (payload: any) => Promise<boolean>;
  logout: () => Promise<void>;
};

function useCreateAuthStore(): AuthStore {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getProfile();
      if (res.success && res.data) setUser(res.data as any);
      else setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: any) => {
    const res = await authAPI.login(payload);
    if (res.success && res.data) {
      const token = (res.data as any)?.token;
      if (token) setToken(token);
      await refreshUser();
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    setToken(null);
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    refreshUser,
    login,
    logout,
  };
}

const AuthContext = createContext<AuthStore | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const store = useCreateAuthStore();

  useEffect(() => {
    store.refreshUser();
  }, []);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

/* ===========================
   SIGNUP SCREEN
   =========================== */
export default function SignupWrapper() {
  return (
    <AuthProvider>
      <SignupScreen />
    </AuthProvider>
  );
}

function SignupScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    designation: "STUDENT",
    password: "",
    logoUrl: "",
    role: "STUDENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_CLIENT_ID || "",
    iosClientId: process.env.IOS_CLIENT_ID || "",
    androidClientId: process.env.ANDROID_CLIENT_ID || "",
    webClientId: process.env.WEB_CLIENT_ID || "",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken =
        (response as any).params?.id_token ||
        (response as any).authentication?.idToken;
      if (idToken) handleGoogleSignup(idToken);
    }
  }, [response]);

  const handleGoogleSignup = async (token: string) => {
    try {
      setIsSubmitting(true);
      const res = await authAPI.googleAuth(token);
      if (!res.success) throw new Error(res.message || "Google sign-in failed");
      const tokenData = (res.data as any)?.token;
      if (tokenData) setToken(tokenData);
      await refreshUser();
      Alert.alert("Success", "Signed up successfully!", [
        { text: "OK", onPress: () => router.replace("/screens/profilesetup") },
      ]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!/^\d{10}$/.test(form.contactNumber))
      return setError("Phone number must be 10 digits.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters long.");

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        contactNumber: form.contactNumber.replace(/\D/g, ""),
        type: "student",
      };
      const res = await authAPI.signUp(payload);
      if (!res.success) throw new Error(res.message || "Signup failed");
      const token = (res.data as any)?.token;
      if (token) setToken(token);
      await refreshUser();
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/screens/profilesetup") },
      ]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrap}>
          {/* ✅ App Logo */}
          <Image source={TooClarityLogo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Enter your details to register.</Text>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#9CA3AF"
            value={form.name}
            onChangeText={(t) => updateField("name", t)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Email (optional)"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(t) => updateField("email", t)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="+91 Mobile number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={10}
            value={form.contactNumber}
            onChangeText={(t) =>
              updateField("contactNumber", t.replace(/\D/g, ""))
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(t) => updateField("password", t)}
          />
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rowCenter}>
          <Text style={styles.small}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.link}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* ✅ Google Login */}
        <TouchableOpacity
          style={[styles.providerBtn, { opacity: request ? 1 : 0.6 }]}
          onPress={() => promptAsync()}
          disabled={!request || isSubmitting}
        >
          <View style={styles.providerLeft}>
            <Image source={GoogleLogo} style={styles.providerIcon} />
          </View>
          <Text style={styles.providerLabel}>Continue with Google</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ===========================
   STYLES
   =========================== */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: "center",
    backgroundColor: "#F8FAFF",
  },
  logoWrap: { marginBottom: 18, alignItems: "center" },
  logo: { width: 160, height: 56, borderRadius: 8, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 18,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    position: "relative",
    marginBottom: 12,
    justifyContent: "center",
  },
  iconLeft: { position: "absolute", left: 14, zIndex: 10 },
  iconRight: {
    position: "absolute",
    right: 12,
    zIndex: 10,
    height: 40,
    justifyContent: "center",
  },
  input: {
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingLeft: 46,
    paddingRight: 46,
    fontSize: 16,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    alignItems: "center",
  },
  small: { fontSize: 14, color: "#6B7280" },
  link: { color: "#2563EB", fontWeight: "700", fontSize: 14, marginLeft: 4 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: "#E6E9EE" },
  orText: { fontSize: 12, color: "#9CA3AF", marginHorizontal: 8 },
  providerBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    width: "100%",
  },
  providerLeft: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  providerIcon: { width: 24, height: 24, resizeMode: "contain" },
  providerLabel: { fontSize: 14, color: "#111827", fontWeight: "600" },
});

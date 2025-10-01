import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    designation: '',
    linkedin: '',
    password: '',
    repassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Admin Name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required.';
    if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Phone must be 10 digits.';
    if (!formData.designation.trim()) newErrors.designation = 'Designation required.';
    if (!formData.linkedin.trim()) newErrors.linkedin = 'LinkedIn required.';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ chars.';
    if (formData.password !== formData.repassword) newErrors.repassword = 'Passwords must match.';
    if (!acceptTerms) newErrors.terms = 'Accept terms.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
  // TODO: call API authAPI.signUp
  // On success open OTP screen with phone param in query string to satisfy router typing
  const phoneQuery = encodeURIComponent(formData.contactNumber || '');
  router.push(`/otp?phone=${phoneQuery}`);
    } catch (_err) {
      setErrors({ general: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Welcome Aboard!</Text>
  <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 6 }}>Let&apos;s finalize your details.</Text>
      </View>

      <View style={{ gap: 12 }}>
        {errors.general && <Text style={{ color: '#EF4444' }}>{errors.general}</Text>}

        <TextInput
          placeholder="Admin Name"
          value={formData.name}
          onChangeText={(t) => setFormData({ ...formData, name: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(t) => setFormData({ ...formData, email: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={formData.contactNumber}
          onChangeText={(t) => setFormData({ ...formData, contactNumber: t.replace(/[^0-9]/g, '') })}
          maxLength={10}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Designation"
          value={formData.designation}
          onChangeText={(t) => setFormData({ ...formData, designation: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="LinkedIn"
          value={formData.linkedin}
          onChangeText={(t) => setFormData({ ...formData, linkedin: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(t) => setFormData({ ...formData, password: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <TextInput
          placeholder="Re-enter Password"
          secureTextEntry
          value={formData.repassword}
          onChangeText={(t) => setFormData({ ...formData, repassword: t })}
          style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, marginBottom: 8 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)} style={{ marginRight: 8 }}>
            <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: acceptTerms ? '#0222D7' : '#fff' }} />
          </TouchableOpacity>
          <Text>Accept terms & conditions*</Text>
        </View>

        {errors.terms && <Text style={{ color: '#EF4444' }}>{errors.terms}</Text>}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !acceptTerms}
          style={{ backgroundColor: !loading && acceptTerms ? '#0222D7' : '#D1D5DB', padding: 14, borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>{loading ? 'Creating Account...' : 'Submit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 8, borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 10, alignItems: 'center' }}>
          <Text>Sign up with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

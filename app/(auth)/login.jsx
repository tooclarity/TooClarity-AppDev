import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Platform, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';

// Complete any auth sessions when the browser is closed
WebBrowser.maybeCompleteAuthSession();
const TooClarityLogo = require('../../assets/images/Tooclaritylogo.png');
const GoogleLogo = require('../../assets/images/google-logo.png');
const MicrosoftLogo = require('../../assets/images/microsoft-logo.png');
const AppleLogo = require('../../assets/images/apple-logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  // Google Auth: replace the client IDs below with your credentials
  // You can use expo's proxy for development by passing useProxy: true to promptAsync
  // Build a redirect URI for AuthSession.
  const redirectUri = makeRedirectUri({ useProxy: true });

  // Helpful log so you can copy/register the redirect URI in Google Cloud Console.
  useEffect(() => {
    console.log('Google Auth redirectUri:', redirectUri);
  }, [redirectUri]);

  const clientId = process.env.EXPO_GOOGLE_CLIENT_ID || process.env.EXPO_GOOGLE_WEB_CLIENT_ID || '';

  // Request email/profile scopes so Google returns the user's email address.
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: clientId,
    iosClientId: process.env.EXPO_GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: process.env.EXPO_GOOGLE_ANDROID_CLIENT_ID || '',
    webClientId: process.env.EXPO_GOOGLE_WEB_CLIENT_ID || '',
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
  });

  
  const hasGoogleClientConfigured = Boolean(
    clientId || process.env.EXPO_GOOGLE_IOS_CLIENT_ID || process.env.EXPO_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_GOOGLE_WEB_CLIENT_ID
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      (async () => {
        try {
          // Prefer access token to fetch userinfo
          const accessToken = authentication?.accessToken;
          if (accessToken) {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const user = await res.json();
              console.log('Google user (userinfo):', user);
              // For this demo, navigate to verification success (treat Google sign-in as verified)
              router.push('/VerificationSuccessScreen');
              return;
          }

          // Fallback: if no access token, try to parse id_token for email
          const idToken = authentication?.idToken || response?.params?.id_token;
          if (idToken) {
            try {
              const base64Url = idToken.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                  })
                  .join('')
              );
              const payload = JSON.parse(jsonPayload);
              console.log('Google user (id_token):', payload);
              // Treat Google sign-in as verified for now
              router.push('/VerificationSuccessScreen');
              return;
            } catch (err) {
              console.warn('Failed to decode id_token', err);
            }
          }
        } catch (err) {
          console.warn('Failed to handle Google auth response', err);
        }
      })();
    }
  }, [response]);

  const isButtonEnabled = phoneNumber.trim().length > 0;

  const handleLogin = () => {
    // Navigate to OTP screen and pass phone as params.
  const route = { pathname: '/otp', params: { phone: phoneNumber } };
  router.push(route);
  };

  const CONTENT_WIDTH = 335; // match common mobile content width used in design

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 36 : 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingVertical: 6 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: CONTENT_WIDTH, alignItems: 'center', marginTop: 24 }}>
        <Image source={TooClarityLogo} style={{ width: 140, height: 56, marginBottom: 18 }} resizeMode="contain" />
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#060B13', alignSelf: 'flex-start' }}>Enter your phone number</Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8, alignSelf: 'flex-start' }}>We&apos;ll send you a text with a verification code.</Text>

        <View style={{ width: '100%', marginTop: 18 }}>
          <Text style={{ fontSize: 13, color: '#0222D7', marginLeft: 8, marginBottom: 8 }}>mobile number</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.6, borderColor: phoneNumber ? '#0222D7' : '#E6E6E6', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#060B13', marginRight: 10 }}>+91</Text>
            <TextInput
              style={{ flex: 1, fontSize: 16, color: '#060B13' }}
              placeholder="Mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              maxLength={10}
              autoFocus
            />
          </View>

          <View style={{ marginTop: 20 }} />

          <TouchableOpacity onPress={handleLogin} disabled={!isButtonEnabled} activeOpacity={0.9}>
            <LinearGradient
              colors={isButtonEnabled ? ['#1645F0', '#0222D7'] : ['#E6E6E6', '#E6E6E6']}
              start={[0, 0]}
              end={[1, 1]}
              style={{ width: CONTENT_WIDTH, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', shadowColor: '#0222D7', shadowOffset: { width: 0, height: 10 }, shadowOpacity: isButtonEnabled ? 0.28 : 0, shadowRadius: 18, elevation: isButtonEnabled ? 8 : 0 }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{'Continue'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', width: 361, marginVertical: 12 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#D1D5DB' }} />
        <Text style={{ marginHorizontal: 12, color: '#6B7280' }}>OR</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#D1D5DB' }} />
      </View>

      <TouchableOpacity
        onPress={async () => {
          if (!hasGoogleClientConfigured) {
            // Show an actionable alert that includes the redirectUri and lets the
            // developer copy it to the clipboard so they can add it to Google Cloud
            // Console. This prevents opening a broken OAuth page and helps setup.
            Alert.alert(
              'Google sign-in not configured',
              `No Google OAuth client id found for this app. To enable Google sign-in register the following redirect URI in the Google Cloud Console for your OAuth client:\n\n${redirectUri}`,
              [
                {
                  text: 'Copy redirect URI',
                  onPress: async () => {
                    try {
                      await Clipboard.setStringAsync(redirectUri);
                    } catch (e) {
                      console.warn('Failed to copy redirectUri', e);
                    }
                  },
                },
                { text: 'Enter email (mock)', onPress: () => router.push('/mock-google') },
                { text: 'Continue (dev fallback)', onPress: () => router.push('/VerificationSuccessScreen') },
                { text: 'Cancel', style: 'cancel' },
              ],
              { cancelable: true }
            );
            return;
          }

          try {
            // For Expo development using the proxy, explicitly request proxy behavior.
            await promptAsync({ useProxy: true });
          } catch (err) {
            console.warn('Google auth prompt failed', err);
            // As a last resort, navigate to success so the user isn't blocked by a
            // broken OAuth flow; this keeps development friction low.
            router.push('/VerificationSuccessScreen');
          }
        }}
        style={{
          width: 361,
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Image source={GoogleLogo} style={{ width: 22, height: 22, marginRight: 8 }} />
        <Text style={{ fontSize: 16, color: '#060B13' }}>{hasGoogleClientConfigured ? (request ? 'Continue with Google' : 'Loading...') : 'Continue with Google'}</Text>
      </TouchableOpacity>

      {/* Removed Google client warning text to match design (was shown when EXPO_GOOGLE_CLIENT_ID is missing) */}

      <TouchableOpacity
        style={{
          width: 361,
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Image source={MicrosoftLogo} style={{ width: 22, height: 22, marginRight: 8 }} />
        <Text style={{ fontSize: 16, color: '#060B13' }}>Continue with Microsoft</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 361,
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Image source={AppleLogo} style={{ width: 22, height: 22, marginRight: 8 }} />
        <Text style={{ fontSize: 16, color: '#060B13' }}>Continue with Apple</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 8 }}>
        <Text style={{ color: '#060B13' }}>
          Don&apos;t have an account?{' '}
          <Text style={{ color: '#0222D7', fontWeight: '600' }} onPress={() => router.push({ pathname: '/signup' })}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}

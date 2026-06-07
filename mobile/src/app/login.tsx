import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';

// Ensure the browser session can close correctly on redirects
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();
  const [loading, setLoading] = useState(false);

  const getBaseUrl = (targetIp: string) => {
    if (!targetIp) return 'http://localhost:3000';
    if (targetIp.startsWith('http://') || targetIp.startsWith('https://')) {
      return targetIp;
    }
    return `http://${targetIp}:3000`;
  };

  const baseUrl = getBaseUrl(ip || '');

  const handleLogin = async () => {
    setLoading(false);
    try {
      // 1. Prepare Expo deep link redirect URL
      const redirectUrl = Linking.createURL('redirect');

      // 2. Prepare Next.js callback URL with the redirect URL appended
      const authUrl = `${baseUrl}/api/auth/mobile-callback?redirect=${encodeURIComponent(redirectUrl)}`;
      console.log(`Starting AuthSession. Auth URL: ${authUrl}, Redirect: ${redirectUrl}`);

      setLoading(true);

      // 3. Open secure in-app browser overlay
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      // 4. Handle success redirect callback
      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const token = parsed.queryParams?.token as string;

        if (token) {
          // 5. Store JWT token securely in device keychain
          await SecureStore.setItemAsync('user_token', token);
          
          // 6. Cache the dev server IP so we can use it across the app
          await SecureStore.setItemAsync('dev_ip', ip || 'localhost');

          Alert.alert('Success', 'Successfully signed in! 🎉', [
            { text: 'OK', onPress: () => router.replace({ pathname: '/wins', params: { ip } }) }
          ]);
        } else {
          throw new Error('Authentication token was not returned by the server.');
        }
      } else if (result.type === 'cancel') {
        console.log('User cancelled the web authentication flow.');
      } else {
        throw new Error(`Browser auth flow failed with status: ${result.type}`);
      }
    } catch (error: any) {
      console.error('Mobile OAuth error:', error);
      Alert.alert('Authentication Failed', error.message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between rounded-none" style={{ paddingBottom: BottomTabInset }}>
      
      {/* Header / Logo */}
      <View className="items-center justify-center flex-1 my-4">
        <View className="mb-6 bg-slate-50 w-16 h-16 items-center justify-center border border-[#0F1739] rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,57,1)]">
          <Text className="text-3xl">🔑</Text>
        </View>
        <Text className="text-[#0F1739] text-4xl font-black text-center tracking-tight uppercase">
          Handyfor.me
        </Text>
        <Text className="text-slate-500 text-sm font-semibold text-center mt-2 px-6">
          Synchronize your tasks, goals, and habits.
        </Text>
      </View>

      {/* Login Card */}
      <View className="bg-white border border-[#0F1739] rounded-none p-6 mb-4 shadow-[4px_4px_0px_0px_rgba(15,23,57,1)]">
        <Text className="text-[#0F1739] font-extrabold text-xl mb-2 uppercase">Account Sign In</Text>
        <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
          Tapping sign-in will open a secure window to log in using Google or GitHub. Once completed, your phone will securely cache your session.
        </Text>

        <TouchableOpacity
          className="bg-[#DDF906] justify-center items-center py-4 rounded-none border border-[#0F1739] shadow-[3px_3px_0px_0px_rgba(15,23,57,1)] active:opacity-90"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F1739" size="small" />
          ) : (
            <Text className="text-[#0F1739] font-black text-sm uppercase tracking-wider">
              Sign In with Google / GitHub ➔
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 justify-center items-center py-2.5 rounded-none border border-dashed border-[#0F1739]"
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text className="text-[#0F1739] font-bold text-xs uppercase">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      {/* Server IP Indicator */}
      <View className="items-center py-2.5 bg-slate-50 rounded-none border border-[#0F1739]">
        <Text className="text-slate-500 text-xxs font-mono text-center uppercase">
          Target API Host: {baseUrl}
        </Text>
      </View>

    </SafeAreaView>
  );
}

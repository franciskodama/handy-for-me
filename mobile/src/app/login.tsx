import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Image 
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
            { text: 'OK', onPress: () => router.replace({ pathname: '/dashboard', params: { ip } }) }
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
      
      {/* Header / Logo (Mimics Web left panel) */}
      <View className="p-5 border-2 bg-white border-[#0F1739] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none my-4">
        <Image 
          source={require('../../assets/images/HandyForMe_Cog200x200.png')} 
          className="mb-4 w-16 h-16"
          resizeMode="contain"
        />
        <View className="flex-col uppercase w-full">
          <Text className="text-3xl font-black text-[#0F1739] leading-tight">
            Goodbye 👋{"\n"}overwhelm!
          </Text>
          <Text className="text-slate-500 text-xs font-semibold leading-relaxed mt-2 uppercase tracking-wide">
            Your personal hub for organizing daily tasks is just one click away!
          </Text>
        </View>
      </View>

      {/* Login Card (Mimics Web Card) */}
      <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Text className="text-black font-black text-3xl mb-1 uppercase tracking-tight">Login</Text>
        <Text className="text-slate-500 text-xs font-semibold mb-6">
          Life’s better when it’s handy – Let’s sign in!
        </Text>

        {/* Google sign-in */}
        <TouchableOpacity
          className="bg-[#0F1739] flex-row justify-center items-center py-3.5 rounded-none border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0F1739] active:opacity-90 mb-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-black text-xs uppercase tracking-widest">
              Sign In with Google
            </Text>
          )}
        </TouchableOpacity>

        {/* GitHub sign-in */}
        <TouchableOpacity
          className="bg-[#0F1739] flex-row justify-center items-center py-3.5 rounded-none border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0F1739] active:opacity-90 mb-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-black text-xs uppercase tracking-widest">
              Sign In with GitHub
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 justify-center items-center py-2.5 rounded-none border-2 border-dashed border-[#0F1739]"
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text className="text-[#0F1739] font-black text-xxs uppercase tracking-wider">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      {/* Server IP Indicator */}
      <View className="items-center py-2 bg-slate-50 rounded-none border-2 border-[#0F1739]">
        <Text className="text-slate-500 text-xxs font-mono text-center uppercase tracking-widest">
          Target API Host: {baseUrl}
        </Text>
      </View>

    </SafeAreaView>
  );
}

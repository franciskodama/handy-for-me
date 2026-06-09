import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import '@/global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      setIsCheckingAuth(true);
      console.log('[RootLayout] checkAuth start, segments:', segments);
      try {
        const token = await SecureStore.getItemAsync('user_token');
        console.log('[RootLayout] checkAuth found token:', !!token);
        setHasToken(!!token);
      } catch (e) {
        console.error('[RootLayout] Error reading auth token:', e);
      } finally {
        setIsCheckingAuth(false);
        setIsReady(true);
        console.log('[RootLayout] checkAuth end');
      }
    }
    checkAuth();
  }, [segments]); // Check auth on segment transitions to dynamic changes

  useEffect(() => {
    console.log('[RootLayout] guard run, isReady:', isReady, 'isCheckingAuth:', isCheckingAuth, 'hasToken:', hasToken, 'segments:', segments);
    if (!isReady || isCheckingAuth) return;

    const currentSegment = segments[0];
    
    // Guard the wins, decision-helper, bucket-list, vision-board, shortcuts, random-question, stoic-support and dashboard routes: if no token exists, send them back to the start/login
    if (!hasToken && (currentSegment === 'wins' || currentSegment === 'decision-helper' || currentSegment === 'bucket-list' || currentSegment === 'vision-board' || currentSegment === 'shortcuts' || currentSegment === 'random-question' || currentSegment === 'stoic-support' || currentSegment === 'dashboard')) {
      console.log('[RootLayout] redirect guard triggered! Replacing with /');
      // Use setTimeout to avoid calling navigation before layout finishes mounting
      const timer = setTimeout(() => {
        router.replace('/');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isReady, isCheckingAuth, hasToken, segments]);

  if (!isReady) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0F1739" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="wins" />
        <Stack.Screen name="login" />
        <Stack.Screen name="decision-helper" />
        <Stack.Screen name="bucket-list" />
        <Stack.Screen name="vision-board" />
        <Stack.Screen name="shortcuts" />
        <Stack.Screen name="random-question" />
        <Stack.Screen name="stoic-support" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </ThemeProvider>
  );
}

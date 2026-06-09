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

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        setHasToken(!!token);
      } catch (e) {
        console.error('Error reading auth token:', e);
      } finally {
        setIsReady(true);
      }
    }
    checkAuth();
  }, [segments]); // Check auth on segment transitions to dynamic changes

  useEffect(() => {
    if (!isReady) return;

    const currentSegment = segments[0];
    
    // Guard the wins, decision-helper and bucket-list routes: if no token exists, send them back to the start/login
    if (!hasToken && (currentSegment === 'wins' || currentSegment === 'decision-helper' || currentSegment === 'bucket-list')) {
      // Use setTimeout to avoid calling navigation before layout finishes mounting
      const timer = setTimeout(() => {
        router.replace('/');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isReady, hasToken, segments]);

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
      </Stack>
    </ThemeProvider>
  );
}

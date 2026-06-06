import React, { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import { Platform, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return "use browser devtools";
  }
  if (Device.isDevice) {
    return "shake device or press 'm' in terminal";
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return `press ${shortcut}`;
}

export default function HomeScreen() {
  const defaultIp = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const [ipAddress, setIpAddress] = useState(defaultIp);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiResponse, setApiResponse] = useState<string>('');

  const testConnection = async (targetIp: string) => {
    setStatus('loading');
    setApiResponse('');
    try {
      const url = `http://${targetIp}:3000/api/mobile/status`;
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus('success');
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setApiResponse(err.message || 'Failed to connect. Make sure your Next.js server is running.');
    }
  };

  useEffect(() => {
    // Proactively test connection on load
    testConnection(ipAddress);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-6 justify-between" style={{ paddingBottom: BottomTabInset }}>
      {/* Header / Hero */}
      <View className="items-center justify-center flex-1 my-4">
        <View className="mb-6 bg-slate-900 w-16 h-16 rounded-2xl items-center justify-center border border-slate-800 shadow-md">
          <Text className="text-3xl">⚙️</Text>
        </View>
        <Text className="text-white text-3xl font-extrabold text-center tracking-tight">
          Handyfor.me
        </Text>
        <Text className="text-slate-400 text-sm text-center mt-2 px-6">
          Your tasks and personal growth hub, now native.
        </Text>
      </View>

      {/* Connection Tester Card */}
      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
        <Text className="text-white font-bold text-lg mb-2">Backend Connection Tester</Text>
        <Text className="text-slate-400 text-xs mb-4">
          Enter your Next.js dev server IP address. Use <Text className="font-mono text-slate-300">10.0.2.2</Text> for Android Emulator or your computer's local Wi-Fi IP for physical devices.
        </Text>

        <View className="flex-row gap-2 mb-3">
          <TextInput
            className="flex-1 bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 text-sm"
            placeholder="e.g. 192.168.1.50"
            placeholderTextColor="#64748b"
            value={ipAddress}
            onChangeText={setIpAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            className="bg-red-500 justify-center items-center px-4 rounded-lg active:opacity-85"
            onPress={() => testConnection(ipAddress)}
            disabled={status === 'loading'}
          >
            <Text className="text-white font-semibold text-sm">
              {status === 'loading' ? 'Testing...' : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status indicator */}
        <View className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
          <View className="flex-row items-center mb-1">
            <View 
              className={`w-2 h-2 rounded-full mr-2 ${
                status === 'success' ? 'bg-emerald-500' :
                status === 'error' ? 'bg-rose-500' :
                status === 'loading' ? 'bg-amber-500' : 'bg-slate-600'
              }`} 
            />
            <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
              Status: {status}
            </Text>
          </View>
          {apiResponse ? (
            <Text className={`text-xs font-mono mt-1 ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {apiResponse}
            </Text>
          ) : (
            <Text className="text-slate-500 text-xs mt-1">No tests run yet.</Text>
          )}
        </View>
      </View>

      {/* Dev Menu Hint */}
      <View className="items-center py-2 bg-slate-900/40 rounded-xl border border-slate-900/80">
        <Text className="text-slate-500 text-xs text-center">
          Dev Menu: {getDevMenuHint()}
        </Text>
      </View>
    </SafeAreaView>
  );
}

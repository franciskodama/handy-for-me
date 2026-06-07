import React, { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import { Platform, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

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
  const router = useRouter();
  const defaultIp = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const [ipAddress, setIpAddress] = useState(defaultIp);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [hasToken, setHasToken] = useState(false);

  const getBaseUrl = (ip: string) => {
    if (!ip) return `http://${defaultIp}:3000`;
    let cleaned = ip.trim();
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.slice(0, -1);
    }
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned;
    }
    return `http://${cleaned}:3000`;
  };

  const testConnection = async (targetIp: string) => {
    setStatus('loading');
    setApiResponse('');
    try {
      const baseUrl = getBaseUrl(targetIp);
      const url = `${baseUrl}/api/mobile/status`;
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus('success');
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.log('Connection test failed:', err.message);
      setStatus('error');
      setApiResponse(err.message || 'Failed to connect. Make sure your Next.js server is running.');
    }
  };

  useEffect(() => {
    async function loadSavedData() {
      try {
        const savedIp = await SecureStore.getItemAsync('dev_ip');
        const token = await SecureStore.getItemAsync('user_token');
        setHasToken(!!token);
        
        const targetIp = savedIp || defaultIp;
        if (savedIp) {
          setIpAddress(savedIp);
        }
        
        // Auto-test connection if we have a saved IP/host
        testConnection(targetIp);
      } catch (e) {
        console.error('Failed to load saved config:', e);
      }
    }
    loadSavedData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between rounded-none" style={{ paddingBottom: BottomTabInset }}>
      
      {/* Header / Hero */}
      <View className="items-center justify-center flex-1 my-4">
        <View className="mb-6 bg-slate-50 w-16 h-16 items-center justify-center border border-[#0F1739] rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,57,1)]">
          <Text className="text-3xl">⚙️</Text>
        </View>
        <Text className="text-[#0F1739] text-4xl font-black text-center tracking-tight uppercase">
          Handyfor.me
        </Text>
        <Text className="text-slate-500 text-sm font-semibold text-center mt-2 px-6">
          Your tasks and personal growth hub, now native.
        </Text>
      </View>

      {/* Connection Tester Card */}
      <View className="bg-white border border-[#0F1739] rounded-none p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(15,23,57,1)]">
        <Text className="text-[#0F1739] font-extrabold text-xl mb-2 uppercase">Connection Tester</Text>
        <Text className="text-slate-500 text-xs font-semibold mb-4 leading-relaxed">
          Enter your Next.js dev server IP address. Use <Text className="font-mono text-slate-800">10.0.2.2</Text> for Android Emulator or your computer's local Wi-Fi IP for physical devices.
        </Text>

        <View className="flex-row gap-2 mb-3">
          <TextInput
            className="flex-1 bg-slate-50 text-[#0F1739] font-semibold rounded-none px-3 py-2 border border-[#0F1739] text-sm"
            placeholder="e.g. 192.168.1.50"
            placeholderTextColor="#94a3b8"
            value={ipAddress}
            onChangeText={setIpAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            className="bg-[#0F1739] justify-center items-center px-5 rounded-none active:opacity-85 border border-[#0F1739]"
            onPress={() => testConnection(ipAddress)}
            disabled={status === 'loading'}
          >
            <Text className="text-white font-bold text-sm uppercase">
              {status === 'loading' ? 'Testing...' : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status indicator */}
        <View className="mt-2 p-3 rounded-none bg-slate-50 border border-[#0F1739]">
          <View className="flex-row items-center mb-1">
            <View 
              className={`w-2.5 h-2.5 rounded-none mr-2 ${
                status === 'success' ? 'bg-emerald-500' :
                status === 'error' ? 'bg-rose-500' :
                status === 'loading' ? 'bg-amber-500' : 'bg-slate-400'
              }`} 
            />
            <Text className="text-[#0F1739] text-xs font-bold uppercase tracking-wider">
              Status: {status}
            </Text>
          </View>
          {apiResponse ? (
            <Text className={`text-xs font-mono mt-1 ${status === 'success' ? 'text-emerald-600 font-bold' : 'text-rose-600'}`}>
              {apiResponse}
            </Text>
          ) : (
            <Text className="text-slate-400 text-xs mt-1">No tests run yet.</Text>
          )}
        </View>

        {status === 'success' && (
          <TouchableOpacity
            className="mt-4 bg-[#DDF906] justify-center items-center py-3.5 rounded-none border border-[#0F1739] shadow-[3px_3px_0px_0px_rgba(15,23,57,1)] active:opacity-90"
            onPress={() => {
              if (hasToken) {
                router.push({ pathname: '/wins', params: { ip: ipAddress } });
              } else {
                router.push({ pathname: '/login', params: { ip: ipAddress } });
              }
            }}
          >
            <Text className="text-[#0F1739] font-black text-sm uppercase tracking-wider">
              {hasToken ? 'Go to Dashboard ➔' : 'Sign In to Dashboard ➔'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dev Menu Hint */}
      <View className="items-center py-2.5 bg-slate-50 rounded-none border border-[#0F1739]">
        <Text className="text-slate-500 text-xs font-semibold text-center lowercase">
          {getDevMenuHint()}
        </Text>
      </View>
    </SafeAreaView>
  );
}

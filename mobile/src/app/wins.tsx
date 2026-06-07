import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';

interface WeeklyWin {
  id: string;
  goal: string;
  type: 'Easy' | 'Moderate' | 'Challenging';
  done: boolean;
  uid: string;
  createdAt: string;
}

interface UserData {
  email: string;
  name?: string;
  image?: string;
}

// Pure JS base64 decoder that works flawlessly in Hermes / React Native environment
function decodeBase64(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }
  
  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < base64.length; i += 4) {
    const encoded1 = lookup[base64.charCodeAt(i)];
    const encoded2 = lookup[base64.charCodeAt(i + 1)];
    const encoded3 = lookup[base64.charCodeAt(i + 2)];
    const encoded4 = lookup[base64.charCodeAt(i + 3)];
    
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    if (p < bufferLength) {
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    }
    if (p < bufferLength) {
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
  }
  
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return decodeURIComponent(escape(result));
}

function decodeJWT(token: string): UserData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const jsonStr = decodeBase64(parts[1]);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return null;
  }
}

export default function WeeklyWinsScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();
  
  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [wins, setWins] = useState<WeeklyWin[]>([]);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newType, setNewType] = useState<'Easy' | 'Moderate' | 'Challenging'>('Easy');

  const getBaseUrl = (targetIp: string) => {
    if (!targetIp) return 'http://localhost:3000';
    let cleaned = targetIp.trim();
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.slice(0, -1);
    }
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned;
    }
    return `http://${cleaned}:3000`;
  };

  const baseUrl = getBaseUrl(ip || '');

  // Fetch weekly wins for the current user using Authorization Bearer token
  const fetchWins = async (activeToken?: string | null) => {
    const currentToken = activeToken !== undefined ? activeToken : token;
    if (!currentToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/mobile/weekly-wins`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (response.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please sign in again.');
        handleLogout();
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setWins(data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Could not load Weekly Wins. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle done status
  const handleToggleDone = async (win: WeeklyWin) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${baseUrl}/api/mobile/weekly-wins`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          id: win.id,
          done: !win.done,
        }),
      });

      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please sign in again.');
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error('Failed to update task');
      
      // Update local state
      setWins(prevWins => 
        prevWins.map(item => 
          item.id === win.id ? { ...item, done: !item.done } : item
        )
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to toggle status.');
    }
  };

  // Delete weekly win goal
  const handleDeleteWin = async (id: string) => {
    if (!token) return;
    
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to permanently delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}/api/mobile/weekly-wins?id=${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'ngrok-skip-browser-warning': 'true',
                },
              });

              if (response.status === 401) {
                Alert.alert('Session Expired', 'Please sign in again.');
                handleLogout();
                return;
              }

              if (!response.ok) throw new Error('Failed to delete task');

              setWins(prevWins => prevWins.filter(item => item.id !== id));
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete goal.');
            }
          }
        }
      ]
    );
  };

  // Add new weekly win goal
  const handleAddWin = async () => {
    if (!token) return;
    if (!newGoal.trim()) {
      Alert.alert('Warning', 'Please enter a goal description.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/mobile/weekly-wins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          goal: newGoal.trim(),
          type: newType,
        }),
      });

      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please sign in again.');
        handleLogout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create goal');
      }

      const addedWin = await response.json();
      setWins(prev => [addedWin, ...prev]);
      setNewGoal('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add weekly win.');
    }
  };

  // Sign out the user, clearing the token and returning to HomeScreen
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      router.replace('/');
    } catch (e) {
      console.error('Failed to logout user session:', e);
      router.replace('/');
    }
  };

  // Load auth state from keychain storage on mount
  useEffect(() => {
    async function loadAuth() {
      try {
        const storedToken = await SecureStore.getItemAsync('user_token');
        if (!storedToken) {
          router.replace('/');
          return;
        }
        setToken(storedToken);
        const decoded = decodeJWT(storedToken);
        setUserData(decoded);
        
        // Fetch wins with the verified token
        fetchWins(storedToken);
      } catch (e) {
        console.error('Failed to load session token:', e);
        router.replace('/');
      }
    }
    loadAuth();
  }, [ip]);

  // Compute stats
  const completedCount = wins.filter(w => w.done).length;
  const totalCount = wins.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group items by level
  const easyWins = wins.filter(w => w.type === 'Easy');
  const moderateWins = wins.filter(w => w.type === 'Moderate');
  const challengingWins = wins.filter(w => w.type === 'Challenging');

  const renderWinSection = (title: string, sectionWins: WeeklyWin[], colorClass: string) => {
    if (sectionWins.length === 0) return null;

    return (
      <View className="mb-6">
        <View className={`border border-[#0F1739] rounded-none self-start px-3 py-1.5 ${colorClass} shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] mb-3`}>
          <Text className="text-[#0F1739] font-black text-xs uppercase">
            {title} ({sectionWins.length})
          </Text>
        </View>
        {sectionWins.map(win => (
          <View 
            key={win.id} 
            className={`flex-row justify-between items-center bg-white border border-[#0F1739] rounded-none p-4 mb-2.5 shadow-[3px_3px_0px_0px_rgba(15,23,57,1)] ${
              win.done ? 'opacity-70 bg-slate-50' : ''
            }`}
          >
            <TouchableOpacity 
              className="flex-1 flex-row items-center mr-4"
              onPress={() => handleToggleDone(win)}
            >
              <View className={`w-6 h-6 rounded-none items-center justify-center border mr-3 ${
                win.done ? 'bg-[#DDF906] border-[#0F1739]' : 'bg-white border-[#0F1739]'
              }`}>
                {win.done && <Text className="text-[#0F1739] text-xs font-black">✓</Text>}
              </View>
              <Text className={`text-[#0F1739] text-sm font-bold flex-1 ${
                win.done ? 'line-through text-slate-400' : ''
              }`}>
                {win.goal}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-8 h-8 rounded-none items-center justify-center bg-slate-50 border border-[#0F1739] shadow-[1px_1px_0px_0px_rgba(15,23,57,1)] active:bg-rose-100"
              onPress={() => handleDeleteWin(win.id)}
            >
              <Text className="text-xs">🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-5 rounded-none" style={{ paddingBottom: BottomTabInset }}>
      
      {/* Header Block */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity 
          className="bg-slate-50 px-4 py-2 border border-[#0F1739] rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] active:bg-slate-100"
          onPress={() => router.back()}
        >
          <Text className="text-[#0F1739] text-xs font-black">◀ Back</Text>
        </TouchableOpacity>
        <Text className="text-[#0F1739] text-2xl font-black uppercase tracking-tight">Weekly Wins</Text>
        <TouchableOpacity 
          className="bg-slate-50 w-8 h-8 items-center justify-center border border-[#0F1739] rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] active:bg-slate-100"
          onPress={() => fetchWins()}
        >
          <Text className="text-[#0F1739] text-sm font-bold">🔄</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Bar */}
      <View className="bg-slate-50 border border-[#0F1739] rounded-none p-3.5 mb-4 flex-row justify-between items-center shadow-[3px_3px_0px_0px_rgba(15,23,57,1)]">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-8 h-8 rounded-none bg-slate-200 border border-[#0F1739] justify-center items-center mr-2">
            <Text className="text-xs">👤</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[#0F1739] text-xs font-black uppercase leading-tight">
              {userData?.name || 'Logged In User'}
            </Text>
            <Text className="text-slate-500 text-xxs font-mono truncate">
              {userData?.email || ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          className="bg-white px-3 py-1.5 border border-[#0F1739] rounded-none shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] active:bg-rose-50"
          onPress={handleLogout}
        >
          <Text className="text-rose-600 text-xxs font-black uppercase">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      {totalCount > 0 && (
        <View className="bg-white border border-[#0F1739] rounded-none p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(15,23,57,1)]">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#0F1739] text-xs font-extrabold uppercase">Weekly Progress</Text>
            <Text className="text-[#0F1739] text-sm font-black">{completedCount} of {totalCount} Wins</Text>
          </View>
          <View className="w-full bg-slate-100 rounded-none h-3.5 overflow-hidden border border-[#0F1739]">
            <View 
              className="bg-[#DDF906] h-full rounded-none border-r border-[#0F1739]" 
              style={{ width: `${progressPercent}%` }} 
            />
          </View>
          <Text className="text-slate-500 text-xxs mt-1.5 text-right font-mono font-bold">{progressPercent}% Completed</Text>
        </View>
      )}

      {/* Add Win Form */}
      <View className="bg-white border border-[#0F1739] rounded-none p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(15,23,57,1)]">
        <Text className="text-[#0F1739] font-black text-sm mb-2 uppercase">Add New Goal</Text>
        <TextInput
          className="bg-slate-50 text-[#0F1739] font-bold rounded-none px-3 py-2 border border-[#0F1739] text-xs mb-3"
          placeholder="What will you conquer this week?"
          placeholderTextColor="#94a3b8"
          value={newGoal}
          onChangeText={setNewGoal}
        />
        
        <View className="flex-row justify-between items-center">
          {/* Difficulty Levels selector */}
          <View className="flex-row bg-slate-50 rounded-none p-1 border border-[#0F1739] gap-1">
            {(['Easy', 'Moderate', 'Challenging'] as const).map(type => (
              <TouchableOpacity
                key={type}
                className={`px-3 py-1 rounded-none border ${
                  newType === type 
                    ? type === 'Easy' ? 'bg-green-500/20 border-green-500' :
                      type === 'Moderate' ? 'bg-amber-500/20 border-amber-500' :
                      'bg-rose-500/20 border-rose-500'
                    : 'border-transparent'
                }`}
                onPress={() => setNewType(type)}
              >
                <Text className={`text-xxs font-extrabold ${
                  newType === type
                    ? type === 'Easy' ? 'text-green-700' :
                      type === 'Moderate' ? 'text-amber-700' :
                      'text-red-700'
                    : 'text-slate-400'
                }`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="bg-[#0F1739] px-5 py-2 rounded-none active:opacity-85 border border-[#0F1739]"
            onPress={handleAddWin}
          >
            <Text className="text-white font-bold text-xs uppercase">＋ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wins Lists */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator color="#0F1739" size="large" />
            <Text className="text-slate-500 text-xs mt-2 font-mono font-semibold">Syncing database...</Text>
          </View>
        ) : wins.length === 0 ? (
          <View className="py-12 items-center justify-center bg-slate-50 border border-dashed border-[#0F1739] rounded-none">
            <Text className="text-[#0F1739] text-center font-black text-sm mb-1">Weekly Wins Not Found 👻</Text>
            <Text className="text-slate-400 text-center text-xs font-semibold px-8 leading-relaxed">
              Looks like your week is wide open! Add a goal above and let's get those wins.
            </Text>
          </View>
        ) : (
          <View>
            {renderWinSection('Challenging 🔥', challengingWins, 'bg-rose-100')}
            {renderWinSection('Moderate ⚡', moderateWins, 'bg-amber-100')}
            {renderWinSection('Easy 🟢', easyWins, 'bg-green-100')}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

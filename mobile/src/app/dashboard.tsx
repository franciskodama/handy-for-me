import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Image,
  Modal,
  Linking,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';

interface UserData {
  email: string;
  name?: string;
  image?: string;
}

interface Habit {
  id: string;
  createdAt: string;
  uid: string;
  name: string;
  lastResetAt: string;
  color: string | null;
  targetDate: string | null;
}

interface VisionBoardItem {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

interface ShortcutCategory {
  id: string;
  category: string;
  color: string;
}

interface Shortcut {
  id: string;
  shortcut: string;
  url: string;
  description: string;
  categoryId: string;
  category?: ShortcutCategory;
}

interface BucketListItem {
  id: string;
  item: string;
  done: boolean;
  createdAt: string;
}

// Pure JS base64 decoder for Hermes
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

const quotes = [
  { quote: "Your capacity to say 'No' determines your capacity to say 'Yes' to greater things.", author: "E. Stanley Jones" },
  { quote: "Do fewer things. Do them better. Know why you're doing them.", author: "Cal Newport" },
  { quote: "Stop managing your time. Start managing your focus.", author: "Unknown" },
  { quote: "If you don't like where you are, change it. You're not a tree.", author: "Jim Rohn" },
  { quote: "Forgive yourself for your faults and your mistakes and move on.", author: "Les Brown" },
  { quote: "What you do matters, but why you do it matters much more.", author: "Unknown" },
  { quote: "When the whole world is silent, even one voice becomes powerful.", author: "Malala Yousafzai" },
  { quote: "Do the thing you think you cannot do.", author: "Eleanor Roosevelt" },
  { quote: "Be not afraid of growing slowly; be afraid only of standing still.", author: "Chinese Proverb" },
  { quote: "Success isn't about how your life looks to others. It's about how it feels to you.", author: "Michelle Obama" },
  { quote: "Learn the rules like a pro, so you can break them like an artist.", author: "Pablo Picasso" },
  { quote: "People do not seem to realize that their opinion of the world is also a confession of character.", author: "Ralph A. Emerson" },
  { quote: "May your life be full in the simplicity of your actions.", author: "Unknown" },
  { quote: "You are what you do repeatedly.", author: "Unknown" },
  { quote: "The only person who needs to believe in you is you.", author: "Unknown" },
  { quote: "A stumble may prevent a fall.", author: "Gretchen Rubin" },
  { quote: "Empathy is the bridge that connects us to other people, despite the differences that separate us.", author: "Melinda Gates" },
  { quote: "Give whatever you are doing and whoever you are with the gift of your attention.", author: "Jim Rohn" },
  { quote: "Be the type of person you want to meet.", author: "Unknown" }
];

const funFacts = [
  { start: 'Did you know?', curiosity: 'Bananas are berries, but strawberries aren’t!' },
  { start: 'Fun Fact:', curiosity: 'Honey never spoils—it’s been found in ancient tombs still edible!' },
  { start: 'Surprise!', curiosity: "A group of flamingos is called a 'flamboyance.'" },
  { start: 'Today’s Tidbit:', curiosity: 'Octopuses have three hearts and blue blood!' },
  { start: 'Fun to Know:', curiosity: 'There are more stars in the universe than grains of sand on all Earth’s beaches.' },
  { start: 'Did You Know?', curiosity: 'Cows have best friends and can get stressed when they’re separated.' },
  { start: 'Surprising Fact:', curiosity: 'Avocados are fruit, and they’re technically a berry!' },
  { start: 'Random Knowledge:', curiosity: 'The Eiffel Tower can grow up to six inches taller in summer due to heat expansion.' },
  { start: 'Today’s Fun Fact:', curiosity: "An ostrich's eye is bigger than its brain." },
  { start: 'Surprising Tidbit:', curiosity: 'Sea otters hold hands while sleeping to avoid drifting apart.' },
  { start: 'Did you know?', curiosity: 'Slugs have four noses.' },
  { start: 'Fun Fact:', curiosity: 'You can’t hum while holding your nose closed!' },
  { start: 'Surprise!', curiosity: 'Sharks existed before trees.' },
  { start: 'Today’s Tidbit:', curiosity: 'The heart of a shrimp is located in its head.' },
  { start: 'Fun to Know:', curiosity: 'A day on Venus is longer than a year on Venus.' },
  { start: 'Did You Know?', curiosity: 'Tigers have striped skin, not just striped fur.' },
  { start: 'Surprising Fact:', curiosity: 'A jiffy is an actual unit of time, equal to 1/100th of a second.' },
  { start: 'Random Knowledge:', curiosity: 'Rabbits can’t vomit.' },
  { start: 'Today’s Fun Fact:', curiosity: "A blue whale's heart can be as big as a small car." },
  { start: 'Surprising Tidbit:', curiosity: 'Bats are the only mammals that can fly.' },
  { start: 'Did you know?', curiosity: 'Apples float in water because they are 25% air.' },
  { start: 'Fun Fact:', curiosity: 'Bubble wrap was originally intended to be wallpaper.' },
  { start: 'Surprise!', curiosity: 'A snail can sleep for three years.' },
  { start: 'Today’s Tidbit:', curiosity: 'The longest recorded flight of a chicken was 13 seconds.' },
  { start: 'Fun to Know:', curiosity: 'A bolt of lightning is five times hotter than the sun.' },
  { start: 'Did You Know?', curiosity: "A group of jellyfish is called a 'smack.'" },
  { start: 'Surprising Fact:', curiosity: "Dogs’ sense of smell is about 100,000 times stronger than humans'." },
  { start: 'Random Knowledge:', curiosity: 'Some cats are allergic to humans.' },
  { start: 'Today’s Fun Fact:', curiosity: 'A duel between three people is actually called a truel.' },
  { start: 'Surprising Tidbit:', curiosity: 'Wombat poop is cube-shaped.' }
];

export default function DashboardScreen() {
  console.log('[DashboardScreen] rendering...');
  let ipParams: any = null;
  try {
    ipParams = useLocalSearchParams<{ ip: string }>();
    console.log('[DashboardScreen] useLocalSearchParams returned:', ipParams);
  } catch (err: any) {
    console.error('[DashboardScreen] useLocalSearchParams threw error:', err.message);
    throw err;
  }
  const { ip } = ipParams || { ip: '' };

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });

  // Consolidated dashboard data
  const [habits, setHabits] = useState<Habit[]>([]);
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [bucketListItems, setBucketListItems] = useState<BucketListItem[]>([]);
  const [location, setLocation] = useState<{ city: string; region: string; country: string } | null>(null);
  const [weather, setWeather] = useState<any>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [funFactImageNum, setFunFactImageNum] = useState(1);
  const [openShutters, setOpenShutters] = useState<{ [key: string]: boolean }>({});

  // Add Habit form
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitStart, setNewHabitStart] = useState(new Date().toISOString().split('T')[0]);
  const [newHabitGoal, setNewHabitGoal] = useState('');

  // Edit Habit form
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editHabitName, setEditHabitName] = useState('');
  const [editHabitStart, setEditHabitStart] = useState('');
  const [editHabitGoal, setEditHabitGoal] = useState('');

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

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      router.replace('/');
    } catch (e) {
      console.error(e);
      router.replace('/');
    }
  };

  const fetchDashboardData = async (activeToken?: string | null) => {
    const currentToken = activeToken !== undefined ? activeToken : token;
    if (!currentToken) return;

    setLoading(true);
    try {
      const baseUrl = getBaseUrl(ip);
      const url = `${baseUrl}/api/mobile/dashboard`;
      console.log(`Fetching dashboard from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHabits(data.habits || []);
      setVisionBoardItems(data.visionBoardItems || []);
      setShortcuts(data.shortcuts || []);
      setBucketListItems(data.bucketListItems || []);
      setLocation(data.location);
      setWeather(data.weather);
    } catch (e: any) {
      console.error('Failed to fetch dashboard data:', e);
      Alert.alert('Sync Error', 'Could not sync dashboard data with server.');
    } finally {
      setLoading(false);
    }
  };

  // Load auth state
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

        // Select random quote
        const randomIdx = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIdx]);

        // Select random fun fact
        setFunFactIndex(Math.floor(Math.random() * funFacts.length));
        setFunFactImageNum(Math.floor(Math.random() * 20) + 1);

        // Fetch user data
        fetchDashboardData(storedToken);
      } catch (e) {
        console.error('Failed to load session token:', e);
        router.replace('/');
      }
    }
    loadAuth();
  }, [ip]);

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  const handleNextFunFact = () => {
    setFunFactIndex(Math.floor(Math.random() * funFacts.length));
    setFunFactImageNum(Math.floor(Math.random() * 20) + 1);
  };

  const toggleShutter = (habitId: string) => {
    setOpenShutters(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }));
  };

  // Habits Operations
  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) {
      Alert.alert('Error', 'Please specify a habit designation name.');
      return;
    }

    try {
      const baseUrl = getBaseUrl(ip);
      const url = `${baseUrl}/api/mobile/habits`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'createHabit',
          name: newHabitName.trim(),
          startDate: newHabitStart,
          targetDate: newHabitGoal || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create habit');
      }

      Alert.alert('Success', `Monitor "${newHabitName}" deployed successfully!`);
      setNewHabitName('');
      setNewHabitStart(new Date().toISOString().split('T')[0]);
      setNewHabitGoal('');
      setIsAddingHabit(false);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to deploy streak monitor.');
    }
  };

  const handleResetHabit = async (habitId: string, habitName: string) => {
    Alert.alert(
      'Confirm Reset',
      `Are you sure you want to reset the "${habitName}" monitor? This will reset the counter to zero.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Execute Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              const baseUrl = getBaseUrl(ip);
              const url = `${baseUrl}/api/mobile/habits`;
              
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  action: 'resetHabit',
                  habitId
                })
              });

              if (!response.ok) {
                throw new Error('Failed to reset habit');
              }

              Alert.alert('Reset Complete', 'Stay strong! Counter reset to zero.');
              fetchDashboardData();
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to reset counter.');
            }
          }
        }
      ]
    );
  };

  const handleUpdateHabit = async () => {
    if (!editHabitName.trim()) {
      Alert.alert('Error', 'Please enter a habit tag name.');
      return;
    }

    try {
      const baseUrl = getBaseUrl(ip);
      const url = `${baseUrl}/api/mobile/habits`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'updateHabit',
          habitId: editingHabitId,
          name: editHabitName.trim(),
          lastResetAt: editHabitStart,
          targetDate: editHabitGoal || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update habit');
      }

      Alert.alert('Success', 'Monitor configuration updated.');
      setEditingHabitId(null);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update configuration.');
    }
  };

  const handleDeleteHabit = async (habitId: string, habitName: string) => {
    Alert.alert(
      'Decommission Alert',
      `Are you absolutely sure you want to decommission the "${habitName}" monitor? This will permanently remove all tracking history.`,
      [
        { text: 'Keep Active', style: 'cancel' },
        { 
          text: 'Decommission', 
          style: 'destructive',
          onPress: async () => {
            try {
              const baseUrl = getBaseUrl(ip);
              const url = `${baseUrl}/api/mobile/habits`;
              
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  action: 'deleteHabit',
                  habitId
                })
              });

              if (!response.ok) {
                throw new Error('Failed to delete habit');
              }

              Alert.alert('Decommissioned', 'Streak monitor removed.');
              fetchDashboardData();
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to decommission monitor.');
            }
          }
        }
      ]
    );
  };

  const calculateStreak = (lastResetAt: string) => {
    const lastReset = new Date(lastResetAt);
    const now = new Date();
    
    let finalMonths = (now.getFullYear() - lastReset.getFullYear()) * 12 + now.getMonth() - lastReset.getMonth();
    let tempDate = new Date(lastReset);
    tempDate.setMonth(tempDate.getMonth() + finalMonths);
    if (tempDate > now) {
      finalMonths--;
      tempDate = new Date(lastReset);
      tempDate.setMonth(tempDate.getMonth() + finalMonths);
    }
    const diffTime = Math.max(0, now.getTime() - tempDate.getTime());
    const finalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return { months: finalMonths, days: finalDays };
  };

  const calculateGoalRemaining = (targetDateStr: string | null) => {
    if (!targetDateStr) return null;
    const targetDate = new Date(targetDateStr);
    const now = new Date();

    if (now >= targetDate) {
      return { completed: true };
    }

    let remainingMonths = (targetDate.getFullYear() - now.getFullYear()) * 12 + targetDate.getMonth() - now.getMonth();
    let rTempDate = new Date(now);
    rTempDate.setMonth(rTempDate.getMonth() + remainingMonths);
    if (rTempDate > targetDate) {
      remainingMonths--;
      rTempDate = new Date(now);
      rTempDate.setMonth(rTempDate.getMonth() + remainingMonths);
    }
    const rDiffTime = Math.max(0, targetDate.getTime() - rTempDate.getTime());
    const remainingDays = Math.ceil(rDiffTime / (1000 * 60 * 60 * 24));

    return { completed: false, months: remainingMonths, days: remainingDays };
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
      
      {/* Dynamic Header Quote Banner */}
      {currentQuote.quote ? (
        <View className="bg-[#DDF906] border-b-2 border-[#0F1739] px-4 py-2.5 flex-row justify-between items-center">
          <Text className="text-[#0F1739] font-bold text-xs flex-1 mr-2" numberOfLines={1}>
            "{currentQuote.quote}" — {currentQuote.author}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              const randomIdx = Math.floor(Math.random() * quotes.length);
              setCurrentQuote(quotes[randomIdx]);
            }}
            className="w-5 h-5 border border-[#0F1739] justify-center items-center rounded-none bg-white"
          >
            <Text className="text-[#0F1739] font-black text-[10px]">↻</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Top Navbar */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b-2 border-[#0F1739] bg-white">
        
        {/* Menu Burger Drawer Button */}
        <TouchableOpacity 
          className="w-10 h-9 border-2 border-[#0F1739] bg-white rounded-none justify-center items-center shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#0F1739]"
          onPress={() => setMenuOpen(true)}
        >
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
        </TouchableOpacity>

        {/* Greetings and Profile Avatar */}
        <View className="flex-row items-center">
          <Text className="text-[#0F1739] text-base font-black mr-3">
            Howdy {getFirstName()}! 🤠
          </Text>
          <TouchableOpacity 
            className="w-9 h-9 border-2 border-[#0F1739] rounded-none bg-slate-200 justify-center items-center shadow-[2px_2px_0px_0px_#0F1739] active:bg-rose-50"
            onPress={handleLogout}
          >
            {userData?.image ? (
              <Image source={{ uri: userData.image }} className="w-full h-full" />
            ) : (
              <Text className="text-sm">👤</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Main Content */}
      <ScrollView 
        className="flex-1 px-4 py-3" 
        style={{ marginBottom: BottomTabInset }} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Loader Status */}
        {loading && habits.length === 0 && (
          <ActivityIndicator size="large" color="#0F1739" className="my-8" />
        )}

        {/* 1. TOP CARDS (Hello Profile, Weather Widget, Fun Fact of the Day) */}
        <View className="gap-6 mb-8">
          
          {/* User profile block */}
          <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 shadow-[4px_4px_0px_0px_#0F1739]">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 border-2 border-[#0F1739] bg-slate-100 justify-center items-center rounded-none shadow-[2px_2px_0px_0px_#0F1739]">
                {userData?.image ? (
                  <Image source={{ uri: userData.image }} className="w-full h-full" />
                ) : (
                  <Text className="text-xl">👤</Text>
                )}
              </View>
              <View>
                <Text className="text-[#0F1739] font-black text-lg uppercase tracking-tight leading-none">
                  {userData?.name || 'Hub User'}
                </Text>
                <Text className="text-slate-500 font-bold text-xxs lowercase mt-1">
                  {userData?.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Weather Widget */}
          {weather && location ? (
            <View key="weather-active" className="bg-[#DDF906] border-2 border-[#0F1739] rounded-none p-5 shadow-[4px_4px_0px_0px_#0F1739]">
              <Text className="text-[#0F1739] font-black text-xxs uppercase tracking-wider mb-2">☁️ Weather Bulletin</Text>
              <View className="flex-row justify-between items-center flex-wrap gap-2">
                <View>
                  <Text className="text-[#0F1739] text-2xl font-black uppercase tracking-tight">
                    {location.city}
                  </Text>
                  <Text className="text-slate-700 text-xs font-bold capitalize">
                    {weather.weather?.[0]?.description || 'Clear Sky'}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-[#0F1739] text-3xl font-black tracking-tighter">
                    {weather.main?.temp ? `${Math.round(weather.main.temp)}°C` : 'N/A'}
                  </Text>
                  <Text className="text-slate-700 text-[9px] font-bold uppercase tracking-widest">
                    💨 Wind: {weather.wind?.speed || 0} m/s
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View key="weather-offline" className="bg-white border-2 border-[#0F1739] border-dashed rounded-none p-4 items-center justify-center">
              <Text className="text-slate-400 font-black text-xs uppercase tracking-widest text-center">
                ☁️ Weather Offline (out of reach) 👻
              </Text>
            </View>
          )}

          {/* Fun Fact Card */}
          <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 shadow-[4px_4px_0px_0px_#0F1739]">
            <View className="bg-slate-100 px-2 py-0.5 border border-slate-300 self-start mb-4">
              <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">💡 Wow Curiosity</Text>
            </View>

            <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wide mb-1">
              {funFacts[funFactIndex]?.start}
            </Text>
            <Text className="text-[#0F1739] text-base font-black leading-relaxed mb-4">
              {funFacts[funFactIndex]?.curiosity}
            </Text>

            <TouchableOpacity
              className="bg-white border-2 border-[#0F1739] py-2.5 px-4 rounded-none shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#0F1739] self-start"
              onPress={handleNextFunFact}
            >
              <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">Show Another Fun Fact</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* 2. HABIT TRACKER SECTION */}
        <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 mb-8 shadow-[4px_4px_0px_0px_#0F1739]">
          
          <View className="flex-row justify-between items-center mb-6 flex-wrap gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#0F1739] text-2xl font-black uppercase tracking-tighter">Habit Tracker</Text>
              <View className="bg-red-500 px-2 py-0.5 border border-[#0F1739]">
                <Text className="text-white font-bold text-[8px] uppercase tracking-wider">⚡ Live Monitors</Text>
              </View>
            </View>

            {!isAddingHabit && (
              <TouchableOpacity
                className="bg-white border border-[#0F1739] px-2.5 py-1.5 rounded-none active:bg-slate-100"
                onPress={() => setIsAddingHabit(true)}
              >
                <Text className="text-[#0F1739] font-black text-[10px] uppercase tracking-wider">+ New Monitor</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Add Habit inline form */}
          {isAddingHabit && (
            <View className="bg-slate-50 border-2 border-[#0F1739] p-4 rounded-none mb-6">
              <Text className="text-[#0F1739] font-black text-xs uppercase mb-3">Initialize Habit Monitor</Text>

              {/* Tag name */}
              <View className="mb-3">
                <Text className="text-[#0F1739] font-bold text-xxs uppercase mb-1">Habit Designation</Text>
                <TextInput
                  className="bg-white text-[#0F1739] font-bold rounded-none px-3 py-2 border-2 border-[#0F1739] text-xs h-10"
                  placeholder="e.g. Daily Meditation, No Sugar"
                  placeholderTextColor="#94a3b8"
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                />
              </View>

              {/* Start Date */}
              <View className="mb-3">
                <Text className="text-[#0F1739] font-bold text-xxs uppercase mb-1">Deployment Start (YYYY-MM-DD)</Text>
                <TextInput
                  className="bg-white text-[#0F1739] font-bold rounded-none px-3 py-2 border-2 border-[#0F1739] text-xs h-10"
                  placeholder="e.g. 2026-06-09"
                  placeholderTextColor="#94a3b8"
                  value={newHabitStart}
                  onChangeText={setNewHabitStart}
                />
              </View>

              {/* Goal Date */}
              <View className="mb-4">
                <Text className="text-[#0F1739] font-bold text-xxs uppercase mb-1">Target Milestone (Optional YYYY-MM-DD)</Text>
                <TextInput
                  className="bg-white text-[#0F1739] font-bold rounded-none px-3 py-2 border-2 border-[#0F1739] text-xs h-10"
                  placeholder="e.g. 2026-07-09"
                  placeholderTextColor="#94a3b8"
                  value={newHabitGoal}
                  onChangeText={setNewHabitGoal}
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-[#DDF906] py-2.5 rounded-none border-2 border-[#0F1739] shadow-[2px_2px_0px_0px_#0F1739] justify-center items-center"
                  onPress={handleCreateHabit}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">Deploy Monitor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-white py-2.5 rounded-none border-2 border-[#0F1739] shadow-[2px_2px_0px_0px_#0F1739] justify-center items-center"
                  onPress={() => setIsAddingHabit(false)}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* List of Habits with Security Shutters */}
          {habits.length === 0 ? (
            <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider text-center py-6">
              No active streak monitors found. ⚡
            </Text>
          ) : (
            <View className="gap-4">
              {habits.map((habit, idx) => {
                const isOpen = openShutters[habit.id];
                const streak = calculateStreak(habit.lastResetAt);
                const goal = calculateGoalRemaining(habit.targetDate);
                const isEditing = editingHabitId === habit.id;

                return (
                  <View key={habit.id} className="border-2 border-[#0F1739] rounded-none bg-white">
                    
                    {/* SECURITY SHUTTER (Closed Mode) */}
                    {!isOpen ? (
                      <TouchableOpacity
                        onPress={() => toggleShutter(habit.id)}
                        className="bg-zinc-900 p-4 flex-row justify-between items-center rounded-none"
                      >
                        <View className="flex-row items-center gap-3">
                          <Text className="text-amber-400 text-sm">🔒</Text>
                          <Text className="text-zinc-400 font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
                            MONITOR #{String(idx + 1).padStart(2, '0')}: {habit.name}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <View className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                          <Text className="text-zinc-500 font-bold text-[8px] uppercase tracking-wider">Privacy Active</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      
                      // OPENED STATE (Factory Sign Details)
                      <View className="p-4 bg-zinc-950">
                        
                        {/* Shutter controller row */}
                        <View className="flex-row justify-between items-center border-b border-zinc-800 pb-2.5 mb-3">
                          <Text className="text-zinc-400 font-bold text-[9px] uppercase tracking-wider">STREAK LOG</Text>
                          <TouchableOpacity 
                            onPress={() => toggleShutter(habit.id)}
                            className="bg-zinc-800 px-2 py-0.5 rounded-none border border-zinc-700"
                          >
                            <Text className="text-zinc-400 font-bold text-[8px] uppercase">Hide 🙈</Text>
                          </TouchableOpacity>
                        </View>

                        {/* RENDER INLINE EDIT FORM */}
                        {isEditing ? (
                          <View className="gap-3">
                            <View>
                              <Text className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Tag Name</Text>
                              <TextInput
                                className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 py-1.5 text-xs rounded-none"
                                value={editHabitName}
                                onChangeText={setEditHabitName}
                              />
                            </View>
                            <View>
                              <Text className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Start Date (YYYY-MM-DD)</Text>
                              <TextInput
                                className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 py-1.5 text-xs rounded-none"
                                value={editHabitStart}
                                onChangeText={setEditHabitStart}
                              />
                            </View>
                            <View>
                              <Text className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Goal Date (Optional YYYY-MM-DD)</Text>
                              <TextInput
                                className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 py-1.5 text-xs rounded-none"
                                value={editHabitGoal}
                                onChangeText={setEditHabitGoal}
                              />
                            </View>
                            
                            <View className="flex-row gap-2 mt-2">
                              <TouchableOpacity
                                className="flex-1 bg-emerald-600 py-2 rounded-none justify-center items-center"
                                onPress={handleUpdateHabit}
                              >
                                <Text className="text-white font-black text-xxs uppercase">Save</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="flex-1 bg-zinc-800 py-2 rounded-none justify-center items-center"
                                onPress={() => setEditingHabitId(null)}
                              >
                                <Text className="text-zinc-300 font-black text-xxs uppercase">Cancel</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          
                          // RENDER VIEW DETAILS MODE
                          <View>
                            <View className="mb-4">
                              <Text className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Monitor Name</Text>
                              <Text className="text-zinc-200 text-base font-black uppercase mt-0.5">{habit.name}</Text>
                            </View>

                            {/* Digital counter layout */}
                            <View className="flex-row gap-3 items-center mb-4">
                              {streak.months > 0 && (
                                <View className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 flex-row items-baseline">
                                  <Text className="text-2xl font-mono font-black text-red-500">{String(streak.months).padStart(2, '0')}</Text>
                                  <Text className="text-zinc-400 text-xs font-bold ml-1 uppercase">M</Text>
                                </View>
                              )}
                              <View className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 flex-row items-baseline">
                                <Text className="text-2xl font-mono font-black text-red-500">{String(streak.days).padStart(2, '0')}</Text>
                                <Text className="text-zinc-400 text-xs font-bold ml-1 uppercase">D</Text>
                              </View>
                              <Text className="text-zinc-400 font-bold text-xxs uppercase tracking-wider">Without Incident</Text>
                            </View>

                            {/* Goal tracking */}
                            {goal && (
                              <View className="bg-zinc-900 border border-zinc-800 p-2.5 mb-4">
                                {goal.completed ? (
                                  <Text className="text-emerald-500 font-black text-xxs uppercase tracking-wider text-center">🏆 MISSION COMPLETE 🏆</Text>
                                ) : (
                                  <View className="flex-row justify-between items-center">
                                    <Text className="text-zinc-400 font-black text-[9px] uppercase tracking-wider">Goal Timeline:</Text>
                                    <Text className="text-red-500 font-mono text-xs font-bold">
                                      {goal.months ? `${goal.months}M ` : ''}{goal.days}D REMAINING
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}

                            {/* Row Action triggers */}
                            <View className="flex-row justify-end items-center gap-4 mt-2">
                              <TouchableOpacity
                                onPress={() => handleResetHabit(habit.id, habit.name)}
                                className="bg-amber-600 px-2.5 py-1.5 rounded-none"
                              >
                                <Text className="text-white font-bold text-[9px] uppercase tracking-wider">↻ Reset Counter</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  setEditingHabitId(habit.id);
                                  setEditHabitName(habit.name);
                                  setEditHabitStart(new Date(habit.lastResetAt).toISOString().split('T')[0]);
                                  setEditHabitGoal(habit.targetDate ? new Date(habit.targetDate).toISOString().split('T')[0] : '');
                                }}
                                className="bg-zinc-800 px-2.5 py-1.5 rounded-none border border-zinc-700"
                              >
                                <Text className="text-zinc-300 font-bold text-[9px] uppercase">✏️ Edit</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => handleDeleteHabit(habit.id, habit.name)}
                                className="bg-rose-950 px-2.5 py-1.5 rounded-none border border-rose-900"
                              >
                                <Text className="text-rose-400 font-bold text-[9px] uppercase">🗑️ Delete</Text>
                              </TouchableOpacity>
                            </View>

                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

        </View>

        {/* 3. WIDGETS PREVIEWS (Vision Board, Shortcuts, Bucket List) */}
        <View className="gap-6 mb-8">
          
          {/* Vision Board preview widget */}
          <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 shadow-[4px_4px_0px_0px_#0F1739]">
            <Text className="text-[#0F1739] text-xl font-black uppercase tracking-tight mb-2">Vision Board</Text>
            {visionBoardItems.length > 0 ? (
              <View className="gap-3">
                <Text className="text-slate-500 font-semibold text-xxs uppercase">Latest Goals Added:</Text>
                {visionBoardItems.slice(0, 3).map((vItem) => (
                  <View key={vItem.id} className="flex-row items-center gap-3 bg-slate-50 border border-slate-200 p-2.5">
                    {vItem.imageUrl ? (
                      <Image source={{ uri: vItem.imageUrl }} className="w-8 h-8 rounded-none border border-slate-300" />
                    ) : (
                      <View className="w-8 h-8 bg-slate-200 justify-center items-center"><Text className="text-xs">🖼️</Text></View>
                    )}
                    <Text className="text-[#0F1739] text-xs font-bold flex-1" numberOfLines={1}>{vItem.title}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/vision-board', params: { ip } })}
                  className="bg-white border border-[#0F1739] p-2.5 justify-center items-center mt-2"
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">Open Vision Board ➔</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-slate-400 font-bold text-xs text-center mb-4 leading-normal">
                  Add goals to your Vision Board, and see them shine here!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/vision-board', params: { ip } })}
                  className="bg-[#DDF906] border-2 border-[#0F1739] py-2 px-4 shadow-[2px_2px_0px_0px_#0f1739]"
                >
                  <Text className="text-[#0F1739] font-black text-xxs uppercase tracking-wider">Create My Vision Board</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Shortcuts widget preview */}
          <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 shadow-[4px_4px_0px_0px_#0F1739]">
            <Text className="text-[#0F1739] text-xl font-black uppercase tracking-tight mb-2">Shortcuts</Text>
            {shortcuts.length > 0 ? (
              <View className="gap-3">
                <View className="flex-row flex-wrap gap-2">
                  {shortcuts.slice(0, 6).map((sItem) => (
                    <TouchableOpacity
                      key={sItem.id}
                      className="bg-sky-50 border border-sky-400 px-3 py-1.5 shadow-[1px_1px_0px_0px_#0284c7]"
                      onPress={() => {
                        if (sItem.url) {
                          Linking.openURL(sItem.url).catch(() => Alert.alert('Error', 'Invalid link URL'));
                        }
                      }}
                    >
                      <Text className="text-sky-800 text-[10px] font-bold uppercase">{sItem.shortcut}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/shortcuts', params: { ip } })}
                  className="bg-white border border-[#0F1739] p-2.5 justify-center items-center mt-2"
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">Open Shortcuts ➔</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-slate-400 font-bold text-xs text-center mb-4 leading-normal">
                  No shortcuts saved yet? Add your top links here!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/shortcuts', params: { ip } })}
                  className="bg-[#DDF906] border-2 border-[#0F1739] py-2 px-4 shadow-[2px_2px_0px_0px_#0f1739]"
                >
                  <Text className="text-[#0F1739] font-black text-xxs uppercase tracking-wider">Create My First Shortcut</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bucket List widget preview */}
          <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 shadow-[4px_4px_0px_0px_#0F1739]">
            <Text className="text-[#0F1739] text-xl font-black uppercase tracking-tight mb-2">Bucket List</Text>
            {bucketListItems.length > 0 ? (
              <View className="gap-3">
                <Text className="text-slate-500 font-semibold text-xxs uppercase">Upcoming Adventures:</Text>
                {bucketListItems.slice(0, 3).map((bItem) => (
                  <View key={bItem.id} className="flex-row items-center gap-2.5 bg-slate-50 border border-slate-200 p-2.5">
                    <Text className="text-slate-400 text-xs">{bItem.done ? '✅' : '⏳'}</Text>
                    <Text className={`text-[#0F1739] text-xs font-bold flex-1 ${bItem.done ? 'line-through text-slate-400' : ''}`} numberOfLines={1}>
                      {bItem.item}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/bucket-list', params: { ip } })}
                  className="bg-white border border-[#0F1739] p-2.5 justify-center items-center mt-2"
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">Open Bucket List ➔</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-slate-400 font-bold text-xs text-center mb-4 leading-normal">
                  Add adventures to your Bucket List and watch them show up here!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/bucket-list', params: { ip } })}
                  className="bg-[#DDF906] border-2 border-[#0F1739] py-2 px-4 shadow-[2px_2px_0px_0px_#0f1739]"
                >
                  <Text className="text-[#0F1739] font-black text-xxs uppercase tracking-wider">Build My Bucket List</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>

        {/* 4. FEATURE HIGHLIGHTS */}
        <View className="gap-5 mb-12">
          <Text className="text-[#0F1739] font-black text-sm uppercase tracking-wider mb-1">More Features</Text>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/decision-helper', params: { ip } })}
            className="bg-white border-2 border-[#0F1739] p-4 rounded-none shadow-[3px_3px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739]"
          >
            <Text className="text-[#0F1739] font-black text-sm uppercase">🤔 Decision Helper</Text>
            <Text className="text-slate-500 text-xxs font-bold mt-1">
              Can't make up your mind? Spin the decision wheel to pick your next path!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/stoic-support', params: { ip } })}
            className="bg-white border-2 border-[#0F1739] p-4 rounded-none shadow-[3px_3px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739]"
          >
            <Text className="text-[#0F1739] font-black text-sm uppercase">🧠 Stoic Support</Text>
            <Text className="text-slate-500 text-xxs font-bold mt-1">
              Navigate life's daily challenges using direct, ancient wisdom from Marcus Aurelius, Seneca and Epictetus.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/random-question', params: { ip } })}
            className="bg-white border-2 border-[#0F1739] p-4 rounded-none shadow-[3px_3px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739]"
          >
            <Text className="text-[#0F1739] font-black text-sm uppercase">❓ Random Questions</Text>
            <Text className="text-slate-500 text-xxs font-bold mt-1">
              Practice and boost your English speaking skills with timer-guided conversational prompts.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/wins', params: { ip } })}
            className="bg-white border-2 border-[#0F1739] p-4 rounded-none shadow-[3px_3px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739]"
          >
            <Text className="text-[#0F1739] font-black text-sm uppercase">🏆 Weekly Wins</Text>
            <Text className="text-slate-500 text-xxs font-bold mt-1">
              Log your personal, physical, professional, and spiritual highlights of the week!
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Dim Menu Overlay / Navigation Drawer */}
      {menuOpen && (
        <View className="absolute inset-0 bg-black/60 z-50 flex-row">
          <View className="w-4/5 max-w-[280px] bg-white h-full p-5 justify-between">
            <View>
              {/* Drawer Header */}
              <View className="flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <View className="flex-row items-center">
                  <Image 
                    source={require('../../assets/images/HandyForMe_Cog200x200.png')} 
                    className="w-8 h-8 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-[#0F1739] font-black text-sm uppercase">Handyfor.me</Text>
                </View>
                <TouchableOpacity 
                  className="w-8 h-8 border border-slate-300 items-center justify-center rounded-none"
                  onPress={() => setMenuOpen(false)}
                >
                  <Text className="text-[#0F1739] font-black text-xs">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <View className="gap-3">
                <TouchableOpacity
                  className="py-3 px-4 bg-[#DDF906] border-2 border-[#0F1739] rounded-none flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/dashboard', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🏠 Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/wins', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🏆 Weekly Wins</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/decision-helper', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🤔 Decision Helper</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/bucket-list', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🪣 Bucket List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/vision-board', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🖼️ Vision Board</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/shortcuts', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">⚡ Shortcuts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/random-question', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">❓ Random Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/stoic-support', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🧠 Stoic Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom logout block */}
            <TouchableOpacity
              className="py-3 px-4 bg-rose-50 border-2 border-rose-500 rounded-none active:bg-rose-100 flex-row justify-center items-center"
              onPress={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              <Text className="text-rose-600 font-black text-xs uppercase tracking-wider">Sign Out</Text>
            </TouchableOpacity>
          </View>
          
          {/* Clickable dim background area to dismiss */}
          <TouchableOpacity 
            className="flex-1 h-full" 
            activeOpacity={1} 
            onPress={() => setMenuOpen(false)} 
          />
        </View>
      )}

    </SafeAreaView>
  );
}

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
import { NeobrutalistCard } from '@/components/neobrutalist-card';

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
  const [activeTab, setActiveTab] = useState<'user' | 'weather' | 'fun-fact'>('user');

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

  const showDashboardHelp = () => {
    Alert.alert(
      "About Dashboard",
      "The Dashboard is your personalized snapshot of everything important! It offers quick access to highlights from your Bucket List, Vision Board, and Shortcuts.\n\nPlus, enjoy daily weather updates, inspirational quotes, and fun facts to keep things light and entertaining."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
      
      {/* Dynamic Header Quote Banner */}
      {currentQuote.quote ? (
        <View className="bg-primary px-6 py-2 items-center justify-center">
          <Text className="text-white text-center uppercase font-semibold text-[10px] tracking-wider leading-relaxed">
            "{currentQuote.quote}" — {currentQuote.author}
          </Text>
        </View>
      ) : null}

      {/* Top Navbar */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-slate-200 bg-white">
        
        {/* Menu Burger Drawer Button */}
        <TouchableOpacity 
          className="w-10 h-9 border border-primary bg-white justify-center items-center shadow-[1.5px_1.5px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px]"
          onPress={() => setMenuOpen(true)}
        >
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
        </TouchableOpacity>

        {/* Greetings and Profile Avatar */}
        <View className="flex-row items-center">
          <Text className="text-[#0F1739] text-base font-semibold mr-3">
            Hi {getFirstName()}! 👋
          </Text>
          <TouchableOpacity 
            className="w-9 h-9 border border-primary bg-slate-200 justify-center items-center shadow-[1.5px_1.5px_0px_0px_#0F1739] active:bg-rose-50"
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
        className="flex-1 px-4 py-6" 
        style={{ marginBottom: BottomTabInset }} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Loader Status */}
        {loading && habits.length === 0 && (
          <ActivityIndicator size="large" color="#0F1739" className="my-8" />
        )}

        {/* Dashboard Title block */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-primary text-3xl font-bold uppercase tracking-tight">
              Dashboard
            </Text>
            {/* Help circle ? button */}
            <TouchableOpacity 
              className="w-7 h-7 border border-primary rounded-full justify-center items-center bg-white"
              onPress={showDashboardHelp}
            >
              <Text className="text-primary text-sm font-semibold">?</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-slate-500 text-sm font-normal">
            Everything you need, right at your fingertips.
          </Text>
        </View>

        {/* 1. TOP TABS SWITCHER */}
        <View className="bg-slate-100 p-1 rounded-lg flex-row justify-between mb-6">
          <TouchableOpacity 
            onPress={() => setActiveTab('user')}
            className={`flex-1 py-2 px-3 rounded-md items-center justify-center ${activeTab === 'user' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-xs ${activeTab === 'user' ? 'text-primary font-semibold' : 'text-slate-505 font-medium'}`}>
              Hello!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('weather')}
            className={`flex-1 py-2 px-3 rounded-md items-center justify-center ${activeTab === 'weather' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-xs ${activeTab === 'weather' ? 'text-primary font-semibold' : 'text-slate-505 font-medium'}`}>
              Weather
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('fun-fact')}
            className={`flex-1 py-2 px-3 rounded-md items-center justify-center ${activeTab === 'fun-fact' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-xs ${activeTab === 'fun-fact' ? 'text-primary font-semibold' : 'text-slate-505 font-medium'}`}>
              Fun Fact
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Tab Content */}
        {activeTab === 'user' && (
          <View className="flex-col items-center justify-center py-6 mb-6">
            <View className="w-[100px] h-[100px] rounded-full overflow-hidden mb-4 border border-slate-200">
              {userData?.image ? (
                <Image source={{ uri: userData.image }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full bg-slate-200 justify-center items-center">
                  <Text className="text-3xl">👤</Text>
                </View>
              )}
            </View>
            <Text className="text-2xl font-bold text-primary text-center">
              Hi,{" "}
              <Text className="text-red-500 text-4xl">
                {getFirstName()}
              </Text>
              {" :)"}
            </Text>
            <Text className="text-sm font-normal text-slate-600 mt-2 text-center">
              Welcome to an Easier Life!
            </Text>
          </View>
        )}

        {activeTab === 'weather' && (
          <View className="relative border border-slate-300 border-dashed p-6 pt-8 bg-slate-50/50 rounded-none mb-6">
            
            {/* Absolute tag badge */}
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Weather
              </Text>
            </View>

            {weather && location ? (
              <View className="flex-col gap-4">
                
                {/* Top row: City Name & Description, Temp */}
                <View className="flex-row justify-between items-center pb-4 border-b border-slate-200">
                  <View>
                    <Text className="text-primary text-xl font-bold uppercase tracking-tight">
                      {location.city}
                    </Text>
                    <Text className="text-slate-500 text-xs font-medium capitalize mt-0.5">
                      {weather.weather?.[0]?.description || 'Clear Sky'}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-primary text-3xl font-black tracking-tighter">
                      {weather.main?.temp ? `${Math.round(weather.main.temp)}°C` : 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Weather specs details */}
                <View className="flex-row justify-between flex-wrap gap-y-3 pt-2">
                  <View className="w-[45%]">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">Wind</Text>
                    <Text className="text-primary text-sm font-semibold mt-0.5">
                      {weather.wind?.speed || 0} m/s
                    </Text>
                  </View>
                  <View className="w-[45%]">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">Humidity</Text>
                    <Text className="text-primary text-sm font-semibold mt-0.5">
                      {weather.main?.humidity || 0}%
                    </Text>
                  </View>
                  <View className="w-[45%]">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">Feels Like</Text>
                    <Text className="text-primary text-sm font-semibold mt-0.5">
                      {weather.main?.feels_like ? `${Math.round(weather.main.feels_like)}°C` : 'N/A'}
                    </Text>
                  </View>
                  <View className="w-[45%]">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">City / Country</Text>
                    <Text className="text-primary text-sm font-semibold mt-0.5 truncate" numberOfLines={1}>
                      {location.city}, {location.country}
                    </Text>
                  </View>
                </View>

              </View>
            ) : (
              <View className="items-center justify-center py-6">
                <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest text-center">
                  ☁️ Weather Offline (out of reach) 👻
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'fun-fact' && (
          <View className="relative border border-slate-300 border-dashed p-6 pt-8 bg-slate-50/50 rounded-none mb-6">
            
            {/* Absolute tag badge */}
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Fun Fact
              </Text>
            </View>

            <View className="flex-col gap-4">
              <View className="flex-col items-start gap-1">
                <Text className="text-slate-500 text-xs font-semibold">
                  {funFacts[funFactIndex]?.start}
                </Text>
                <Text className="text-primary text-lg font-bold leading-normal">
                  {funFacts[funFactIndex]?.curiosity}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleNextFunFact}
                className="border border-primary bg-white py-2 px-4 rounded-none self-start"
              >
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">
                  Show Another Fun Fact
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. HABIT TRACKER SECTION */}
        <View className="mb-8">
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary text-xl font-bold">
              Habit <Text className="text-red-500">Tracker</Text>
            </Text>

            {!isAddingHabit && (
              <TouchableOpacity
                className="flex-row items-center gap-1 bg-white border border-primary px-2.5 py-1.5 rounded-none"
                onPress={() => setIsAddingHabit(true)}
              >
                <Text className="text-primary font-bold text-[10px] uppercase tracking-wider">+ New Monitor</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Add Habit inline form */}
          {isAddingHabit && (
            <View className="bg-slate-50 border border-slate-300 p-4 rounded-none mb-6">
              <Text className="text-primary font-bold text-xs uppercase mb-3">Initialize Habit Monitor</Text>

              {/* Tag name */}
              <View className="mb-3">
                <Text className="text-slate-500 font-bold text-xxs uppercase mb-1">Habit Designation</Text>
                <TextInput
                  className="bg-white text-primary font-semibold rounded-none px-3 py-2 border border-slate-300 text-xs h-10"
                  placeholder="e.g. Daily Meditation, No Sugar"
                  placeholderTextColor="#94a3b8"
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                />
              </View>

              {/* Start Date */}
              <View className="mb-3">
                <Text className="text-slate-500 font-bold text-xxs uppercase mb-1">Deployment Start (YYYY-MM-DD)</Text>
                <TextInput
                  className="bg-white text-primary font-semibold rounded-none px-3 py-2 border border-slate-300 text-xs h-10"
                  placeholder="e.g. 2026-06-09"
                  placeholderTextColor="#94a3b8"
                  value={newHabitStart}
                  onChangeText={setNewHabitStart}
                />
              </View>

              {/* Goal Date */}
              <View className="mb-4">
                <Text className="text-slate-500 font-bold text-xxs uppercase mb-1">Target Milestone (Optional YYYY-MM-DD)</Text>
                <TextInput
                  className="bg-white text-primary font-semibold rounded-none px-3 py-2 border border-slate-300 text-xs h-10"
                  placeholder="e.g. 2026-07-09"
                  placeholderTextColor="#94a3b8"
                  value={newHabitGoal}
                  onChangeText={setNewHabitGoal}
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-primary py-2.5 rounded-none justify-center items-center"
                  onPress={handleCreateHabit}
                >
                  <Text className="text-white font-bold text-xs uppercase tracking-wider">Deploy Monitor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-white py-2.5 rounded-none border border-slate-300 justify-center items-center"
                  onPress={() => setIsAddingHabit(false)}
                >
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">Cancel</Text>
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
            <View className="gap-3">
              {habits.map((habit, idx) => {
                const isOpen = openShutters[habit.id];
                const streak = calculateStreak(habit.lastResetAt);
                const goal = calculateGoalRemaining(habit.targetDate);
                const isEditing = editingHabitId === habit.id;

                return (
                  <View key={habit.id} className="border border-slate-200 rounded-none bg-white">
                    
                    {/* SECURITY SHUTTER (Closed Mode) */}
                    {!isOpen ? (
                      <TouchableOpacity
                        onPress={() => toggleShutter(habit.id)}
                        className="bg-zinc-900 p-3 flex-row justify-between items-center rounded-none"
                      >
                        <View className="flex-row items-center gap-3">
                          <Text className="text-amber-400 text-sm">🔒</Text>
                          <Text className="text-zinc-400 font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
                            MONITOR #{String(idx + 1).padStart(2, '0')}: {habit.name}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <View className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                          <Text className="text-zinc-500 font-bold text-[8px] uppercase tracking-wider">Privacy Active</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      
                      // OPENED STATE (Factory Sign Details)
                      <View className="p-4 bg-zinc-950">
                        {/* Shutter controller row */}
                        <View className="flex-row justify-between items-center border-b border-zinc-800 pb-2 mb-3">
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
                                <Text className="text-white font-bold text-xxs uppercase">Save</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="flex-1 bg-zinc-800 py-2 rounded-none justify-center items-center"
                                onPress={() => setEditingHabitId(null)}
                              >
                                <Text className="text-zinc-300 font-bold text-xxs uppercase">Cancel</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          
                          // RENDER VIEW DETAILS MODE
                          <View>
                            <View className="mb-3">
                              <Text className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider">Monitor Name</Text>
                              <Text className="text-zinc-200 text-base font-bold uppercase mt-0.5">{habit.name}</Text>
                            </View>

                            {/* Digital counter layout */}
                            <View className="flex-row gap-3 items-center mb-3">
                              {streak.months > 0 && (
                                <View className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 flex-row items-baseline">
                                  <Text className="text-2xl font-mono font-bold text-red-500">{String(streak.months).padStart(2, '0')}</Text>
                                  <Text className="text-zinc-400 text-xs font-bold ml-1 uppercase">M</Text>
                                </View>
                              )}
                              <View className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 flex-row items-baseline">
                                <Text className="text-2xl font-mono font-bold text-red-500">{String(streak.days).padStart(2, '0')}</Text>
                                <Text className="text-zinc-400 text-xs font-bold ml-1 uppercase">D</Text>
                              </View>
                              <Text className="text-zinc-400 font-bold text-xxs uppercase tracking-wider">Without Incident</Text>
                            </View>

                            {/* Goal tracking */}
                            {goal && (
                              <View className="bg-zinc-900 border border-zinc-800 p-2 mb-3">
                                {goal.completed ? (
                                  <Text className="text-emerald-500 font-bold text-xxs uppercase tracking-wider text-center">🏆 MISSION COMPLETE 🏆</Text>
                                ) : (
                                  <View className="flex-row justify-between items-center">
                                    <Text className="text-zinc-400 font-bold text-[9px] uppercase tracking-wider">Goal Timeline:</Text>
                                    <Text className="text-red-500 font-mono text-xs font-bold">
                                      {goal.months ? `${goal.months}M ` : ''}{goal.days}D REMAINING
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}

                            {/* Row Action triggers */}
                            <View className="flex-row justify-end items-center gap-3 mt-2">
                              <TouchableOpacity
                                onPress={() => handleResetHabit(habit.id, habit.name)}
                                className="bg-amber-600 px-2.5 py-1.5 rounded-none"
                              >
                                <Text className="text-white font-bold text-[9px] uppercase tracking-wider">↻ Reset</Text>
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
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Vision Board
              </Text>
            </View>

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
                    <Text className="text-primary text-xs font-bold flex-1" numberOfLines={1}>{vItem.title}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/vision-board', params: { ip } })}
                  className="bg-white border border-primary p-2 justify-center items-center mt-2"
                >
                  <Text className="text-primary font-bold text-xs uppercase tracking-wider">Open Vision Board ➔</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-slate-400 font-bold text-xs text-center mb-4 leading-normal">
                  Add goals to your Vision Board, and see them shine here!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/vision-board', params: { ip } })}
                  className="bg-accent border border-primary py-2 px-4 shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                >
                  <Text className="text-primary font-bold text-xxs uppercase tracking-wider">Create My Vision Board</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Shortcuts widget preview */}
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Shortcuts
              </Text>
            </View>

            {shortcuts.length > 0 ? (
              <View className="gap-3">
                <View className="flex-row flex-wrap gap-2">
                  {shortcuts.slice(0, 8).map((sItem) => (
                    <TouchableOpacity
                      key={sItem.id}
                      className="bg-slate-50 border border-slate-200 px-3 py-1.5"
                      onPress={() => {
                        if (sItem.url) {
                          Linking.openURL(sItem.url).catch(() => Alert.alert('Error', 'Invalid link URL'));
                        }
                      }}
                    >
                      <Text className="text-primary text-[10px] font-bold uppercase">{sItem.shortcut}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/shortcuts', params: { ip } })}
                  className="bg-white border border-primary p-2 justify-center items-center mt-2"
                >
                  <Text className="text-primary font-bold text-xs uppercase tracking-wider">Open Shortcuts ➔</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-slate-400 font-bold text-xs text-center mb-4 leading-normal">
                  No shortcuts saved yet? Add your top links here!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/shortcuts', params: { ip } })}
                  className="bg-accent border border-primary py-2 px-4 shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                >
                  <Text className="text-primary font-bold text-xxs uppercase tracking-wider">Create My First Shortcut</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bucket List widget preview */}
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Bucket List
              </Text>
            </View>

            {bucketListItems.length > 0 ? (
              <View className="gap-3">
                <Text className="text-slate-500 font-semibold text-xxs uppercase">Upcoming Adventures:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {bucketListItems.filter(item => !item.done).slice(0, 6).map((bItem) => (
                    <View key={bItem.id} className="bg-slate-50 border border-slate-200 px-3 py-1.5 flex-row items-center gap-1.5">
                      <Text className="text-primary text-[10px] font-bold uppercase">{bItem.item}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/bucket-list', params: { ip } })}
                  className="bg-white border border-primary p-2 justify-center items-center mt-2"
                >
                  <Text className="text-primary font-bold text-xs uppercase tracking-wider">Open Bucket List ➔</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-slate-400 font-bold text-xs text-center mb-4 leading-normal">
                  Add adventures to your Bucket List and watch them show up here!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/bucket-list', params: { ip } })}
                  className="bg-accent border border-primary py-2 px-4 shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                >
                  <Text className="text-primary font-bold text-xxs uppercase tracking-wider">Build My Bucket List</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>

        {/* 4. FEATURE HIGHLIGHTS */}
        <View className="gap-6 mb-12">
          <Text className="text-primary font-bold text-sm uppercase tracking-wider">More Features</Text>

          {/* Decision Helper Highlight */}
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Decision Helper
              </Text>
            </View>
            <View className="items-center gap-3">
              <Text className="text-primary font-bold text-base uppercase text-center">Decisions Made Fun!</Text>
              <Text className="text-slate-500 text-xs text-center leading-normal px-2">
                Let fate decide! Perfect for quick choices, big or small. Spin the wheel and see where it lands.
              </Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/decision-helper', params: { ip } })}
                className="border border-primary px-4 py-2 bg-white"
              >
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Spin to Decide</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stoic Support Highlight */}
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Stoic Support
              </Text>
            </View>
            <View className="items-center gap-3">
              <Text className="text-primary font-bold text-base uppercase text-center">Find Calm in the Chaos</Text>
              <Text className="text-slate-500 text-xs text-center leading-normal px-2">
                Life’s challenges meet ancient wisdom. Discover tailored Stoic insights to help you tackle everyday issues with resilience.
              </Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/stoic-support', params: { ip } })}
                className="border border-primary px-4 py-2 bg-white"
              >
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Show me Stoic Insights</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Random Questions Highlight */}
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Random Questions
              </Text>
            </View>
            <View className="items-center gap-3">
              <Text className="text-primary font-bold text-base uppercase text-center">Surprise Yourself!</Text>
              <Text className="text-slate-500 text-xs text-center leading-normal px-2">
                Break the routine with unexpected questions to spark thought and conversation. Perfect for reflection or fun interactions!
              </Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/random-question', params: { ip } })}
                className="border border-primary px-4 py-2 bg-white"
              >
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Get a Random Question</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Wins Highlight */}
          <View className="relative border border-slate-300 border-dashed p-5 pt-8 bg-white rounded-none mb-2">
            <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 z-10">
              <Text className="text-white text-[10px] font-semibold uppercase tracking-wider">
                Weekly Wins
              </Text>
            </View>
            <View className="items-center gap-3">
              <Text className="text-primary font-bold text-base uppercase text-center">Log Your Highlights</Text>
              <Text className="text-slate-500 text-xs text-center leading-normal px-2">
                Log your personal, physical, professional, and spiritual highlights of the week! Keep a visual track of your growth.
              </Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/wins', params: { ip } })}
                className="border border-primary px-4 py-2 bg-white"
              >
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Log Weekly Wins</Text>
              </TouchableOpacity>
            </View>
          </View>

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
                  <Text className="text-[#0F1739] font-bold text-sm uppercase">Handyfor.me</Text>
                </View>
                <TouchableOpacity 
                  className="w-8 h-8 border border-slate-300 items-center justify-center rounded-none"
                  onPress={() => setMenuOpen(false)}
                >
                  <Text className="text-[#0F1739] font-bold text-xs">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <View className="gap-3">
                <TouchableOpacity
                  className="py-3 px-4 bg-primary border border-primary rounded-none flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/dashboard', params: { ip } });
                  }}
                >
                  <Text className="text-white font-bold text-xs uppercase tracking-wider">🏠 Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/wins', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">🏆 Weekly Wins</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/decision-helper', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">🤔 Decision Helper</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/bucket-list', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">🪣 Bucket List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/vision-board', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">🖼️ Vision Board</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/shortcuts', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">⚡ Shortcuts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/random-question', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">❓ Random Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[1.5px_1.5px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/stoic-support', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-bold text-xs uppercase tracking-wider">🧠 Stoic Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom logout block */}
            <TouchableOpacity
              className="py-3 px-4 bg-rose-50 border border-rose-500 rounded-none active:bg-rose-100 flex-row justify-center items-center"
              onPress={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              <Text className="text-rose-600 font-bold text-xs uppercase tracking-wider">Sign Out</Text>
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

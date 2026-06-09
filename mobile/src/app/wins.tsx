import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Image
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
  { quote: "Be the type of person you want to meet.", author: "Unknown" },
  { quote: "Give me six hours to chop down a tree and i will spend the first four sharpening the axe.", author: "Unknown" },
  { quote: "To attain knowledge add things every day. to attain wisdom subtract things every day.", author: "Lao-Tzu" },
  { quote: "Not having the best situation, but seeing the best in your situation is the key to happiness.", author: "Marie Forleo" },
  { quote: "People may hear your words, but they feel your attitude.", author: "John C. Maxwell" },
  { quote: "Experience is simply the name we give our mistakes.", author: "Oscar Wilde" },
  { quote: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { quote: "What you seek is seeking you.", author: "Romi" },
  { quote: "I have had lots of troubles in my life, most of which never happened.", author: "Mark Twain" },
  { quote: "Nothing is so fatiguing as the eternal hanging on of an uncompleted task.", author: "William James" },
  { quote: "Tension is who you think you should be. Relaxation is who you are.", author: "Unknown" },
  { quote: "The past is done. The future has plenty of room for change.", author: "Unknown" },
  { quote: "A positive attitude causes a chain reaction of positive thoughts, events, and outcomes.", author: "Wade Boggs" },
  { quote: "Bravery is the solution to regret.", author: "Robin Sharma" },
  { quote: "Do or do not, there is no try.", author: "Yoda" },
  { quote: "Don't let a bad day make you feel like you have a bad life.", author: "Unknown" },
  { quote: "Life is a series of building, testing, changing and iterating.", author: "Lauren Mosenthal" },
  { quote: "Victory is always possible for the person who refuses to stop fighting.", author: "Napoleon Hill" },
  { quote: "All great achievements require time.", author: "Maya Angelou" },
  { quote: "Do a little more of what you want to do every day, until your idea becomes what's real.", author: "Unknown" },
  { quote: "Never give up, for that is just the place and time that the tide will turn.", author: "Harriet Stowe" },
  { quote: "It's kind of fun to do the impossible.", author: "Walt Disney" },
  { quote: "A goal without a plan is only a wish.", author: "Antoine de Saint-Exupéry" }
];

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
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIdx]);
  }, []);

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

  const getHeaderColor = (type: 'Easy' | 'Moderate' | 'Challenging') => {
    switch (type) {
      case 'Easy': return 'bg-[#22c55e]'; // bg-green-500
      case 'Moderate': return 'bg-[#eab308]'; // bg-yellow-500
      case 'Challenging': return 'bg-[#ef4444]'; // bg-red-500
    }
  };

  const getDoneColor = (type: 'Easy' | 'Moderate' | 'Challenging') => {
    switch (type) {
      case 'Easy': return 'bg-[#bbf7d0]'; // bg-green-200
      case 'Moderate': return 'bg-[#fef9c3]'; // bg-yellow-100
      case 'Challenging': return 'bg-[#fecaca]'; // bg-red-200
    }
  };

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  const renderWinSection = (type: 'Easy' | 'Moderate' | 'Challenging', sectionWins: WeeklyWin[], headerBg: string) => {
    if (sectionWins.length === 0) return null;

    return (
      <View className="mb-6">
        <View className={`rounded-none px-4 py-3 ${headerBg} mb-2`}>
          <Text className="text-white font-black text-xs uppercase tracking-wider">
            {type}
          </Text>
        </View>
        {sectionWins.map(win => {
          const itemBg = win.done ? getDoneColor(win.type) : 'bg-white';
          return (
            <View 
              key={win.id} 
              className={`flex-row justify-between items-center ${itemBg} border border-[#0F1739] p-3.5 mt-2 rounded-none`}
            >
              <Text className={`text-[#0F1739] text-xs font-black uppercase tracking-tight flex-1 ${
                win.done ? 'line-through text-slate-400 font-bold' : ''
              }`}>
                {win.goal}
              </Text>

              <View className="flex-row items-center gap-1">
                <TouchableOpacity 
                  className="p-2 active:bg-slate-100"
                  onPress={() => handleToggleDone(win)}
                >
                  <Text className="text-black text-sm font-black">✓</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="p-2 active:bg-rose-100"
                  onPress={() => handleDeleteWin(win.id)}
                >
                  <Text className="text-black text-sm">🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#f8fafc]">
      
      {/* Quote Banner (Exact Web Quote bar layout) */}
      {currentQuote.quote ? (
        <SafeAreaView edges={['top']} className="bg-[#0F1739]">
          <View className="px-6 py-2.5 justify-center items-center">
            <Text className="text-white text-[9.5px] font-black text-center uppercase tracking-widest leading-tight">
              "{currentQuote.quote.toUpperCase()}"  —  {currentQuote.author.toUpperCase()}
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      {/* Header Container (Exact Web Header Layout) */}
      <View className="flex-row justify-between items-center bg-white border-b-2 border-[#0F1739] px-5 py-3.5">
        {/* Drawer menu button */}
        <TouchableOpacity 
          className="w-10 h-10 bg-white border-2 border-[#0F1739] rounded-none items-center justify-center shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#0F1739]"
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

      {/* Scrollable Main Layout */}
      <ScrollView className="flex-1 px-4 py-3" style={{ marginBottom: BottomTabInset }} showsVerticalScrollIndicator={false}>
        
        {/* Main Neobrutalist Dashboard Card */}
        <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 mb-8 shadow-[4px_4px_0px_0px_#0f1739]">
          
          {/* Weekly Wins Header Row */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#0F1739] text-3xl font-black uppercase tracking-tighter">Weekly Wins</Text>
            <View className="w-7 h-7 rounded-full border-2 border-[#0F1739] justify-center items-center">
              <Text className="text-[#0F1739] font-black text-xs">?</Text>
            </View>
          </View>
          
          <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
            Stay focused, track progress, and celebrate your wins each week!
          </Text>

          {/* ADD Goal Form */}
          <View className="mb-6">
            {/* Goal Input */}
            <View className="mb-4">
              <TextInput
                className="bg-white text-[#0F1739] font-bold rounded-none px-3.5 py-2.5 border-2 border-[#0F1739] text-sm h-12"
                placeholder="Goal"
                placeholderTextColor="#94a3b8"
                value={newGoal}
                onChangeText={setNewGoal}
              />
              <Text className="text-slate-400 text-xxs mt-1 uppercase font-semibold">Name your goal</Text>
            </View>

            {/* Type Dropdown Picker */}
            <View className="mb-4 relative z-50">
              <TouchableOpacity
                className="bg-white border-2 border-[#0F1739] px-3.5 py-2.5 flex-row justify-between items-center rounded-none h-12"
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Text className="text-[#0F1739] font-bold text-sm">
                  {newType}
                </Text>
                <Text className="text-[#0F1739] font-bold text-xs">▼</Text>
              </TouchableOpacity>
              <Text className="text-slate-400 text-xxs mt-1 uppercase font-semibold">Choose your goal level</Text>

              {dropdownOpen && (
                <View className="absolute top-[50px] left-0 right-0 bg-white border-2 border-[#0F1739] rounded-none z-50 shadow-[3px_3px_0px_0px_#0F1739]">
                  {(['Easy', 'Moderate', 'Challenging'] as const).map(option => (
                    <TouchableOpacity
                      key={option}
                      className="p-3 border-b border-slate-100 last:border-b-0 active:bg-slate-50"
                      onPress={() => {
                        setNewType(option);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text className="text-[#0F1739] font-bold text-sm">{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* ADD Button */}
            <TouchableOpacity
               className="bg-[#0F1739] px-6 py-3.5 rounded-none border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0F1739] self-start active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px]"
              onPress={handleAddWin}
            >
              <Text className="text-white font-black text-xs uppercase tracking-widest">ADD</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="h-0.5 bg-slate-100 mb-6" />

          {/* Wins lists */}
          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color="#0F1739" size="large" />
              <Text className="text-slate-500 text-xs mt-2 font-mono font-semibold">Syncing database...</Text>
            </View>
          ) : wins.length === 0 ? (
            <View className="py-12 items-center justify-center bg-slate-50 border-2 border-dashed border-[#0F1739] rounded-none">
              <Text className="text-[#0F1739] text-center font-black text-sm mb-1 uppercase">Weekly Wins Not Found 👻</Text>
              <Text className="text-slate-400 text-center text-xs font-semibold px-8 leading-relaxed">
                Looks like your week is wide open! Add a goal above and let's get those wins.
              </Text>
            </View>
          ) : (
            <View>
              {renderWinSection('Challenging', challengingWins, getHeaderColor('Challenging'))}
              {renderWinSection('Moderate', moderateWins, getHeaderColor('Moderate'))}
              {renderWinSection('Easy', easyWins, getHeaderColor('Easy'))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Drawer Navigation Overlay */}
      {menuOpen && (
        <View className="absolute inset-0 bg-black/60 z-50 flex-row">
          <View className="w-[260px] h-full bg-[#f8fafc] border-r-2 border-[#0F1739] p-5 justify-between">
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

    </View>
  );
}

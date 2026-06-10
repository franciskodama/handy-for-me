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
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';
import { NeobrutalistCard } from '@/components/neobrutalist-card';

interface VisualBoardItem {
  id: string;
  item: string;
  url: string;
  done: boolean;
  uid: string;
  createdAt: string;
}

interface UserData {
  email: string;
  name?: string;
  image?: string;
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

const shuffleBoard = (visualBoard: VisualBoardItem[]) => {
  const shuffled = [...visualBoard];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 42) / 2; // two-column grid on mobile

export default function VisionBoardScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [boardItems, setBoardItems] = useState<VisualBoardItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });

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

  // Fetch Vision Board Items
  const fetchVisionBoard = async (activeToken?: string | null) => {
    const currentToken = activeToken !== undefined ? activeToken : token;
    if (!currentToken) return;

    try {
      const response = await fetch(`${baseUrl}/api/mobile/vision-board`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please sign in again.');
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      const items = data.items || [];
      // Shuffle board items on load to match webapp behavior
      setBoardItems(shuffleBoard(items));
    } catch (error) {
      console.error('Error fetching vision board:', error);
    }
  };

  // Sign out user
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      router.replace('/');
    } catch (e) {
      console.error(e);
      router.replace('/');
    }
  };

  // Load auth state on mount
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

        setLoading(true);
        await fetchVisionBoard(storedToken);
        setLoading(false);

        // Select random banner quote
        const randomIdx = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIdx]);
      } catch (e) {
        console.error('Failed to load session token:', e);
        router.replace('/');
      }
    }
    loadAuth();
  }, [ip]);

  // Add a new goal
  const handleAddGoal = async () => {
    if (!token) return;
    if (!newGoal.trim()) {
      Alert.alert('Warning', 'Goal is required!');
      return;
    }
    if (newGoal.trim().length > 10) {
      Alert.alert('Warning', 'Goal name should be at most 10 characters.');
      return;
    }
    if (!newUrl.trim()) {
      Alert.alert('Warning', 'URL is required!');
      return;
    }
    const cleanUrl = newUrl.trim();
    if (!cleanUrl.includes('unsplash') && !cleanUrl.includes('fkodama')) {
      Alert.alert('Warning', 'Image URL should be sourced from Unsplash.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/mobile/vision-board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'create',
          item: newGoal.trim(),
          url: cleanUrl,
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add vision item');
      }

      const added = await response.json();
      setBoardItems(prev => [added, ...prev]);
      setNewGoal('');
      setNewUrl('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add goal.');
    }
  };

  // Toggle goal check state
  const handleToggleDone = async (item: VisualBoardItem) => {
    if (!token) return;

    // Optimistic update
    setBoardItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, done: !i.done } : i))
    );

    try {
      const response = await fetch(`${baseUrl}/api/mobile/vision-board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'toggle',
          id: item.id,
          done: !item.done,
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error('Failed to update goal status');
    } catch (error) {
      console.error(error);
      // Restore on failure
      fetchVisionBoard();
    }
  };

  // Delete vision board item
  const handleDeleteItem = async (item: VisualBoardItem) => {
    if (!token) return;

    Alert.alert(
      'Delete Vision Goal',
      `Are you sure you want to permanently delete "${item.item}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Optimistic update
            setBoardItems(prev => prev.filter(i => i.id !== item.id));

            try {
              const response = await fetch(`${baseUrl}/api/mobile/vision-board?id=${item.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'ngrok-skip-browser-warning': 'true',
                },
              });

              if (response.status === 401) {
                handleLogout();
                return;
              }

              if (!response.ok) throw new Error('Failed to delete vision item');
            } catch (error) {
              console.error(error);
              // Restore on failure
              fetchVisionBoard();
            }
          },
        },
      ]
    );
  };

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  return (
    <View className="flex-1 bg-background">
      
      {/* Quote Banner */}
      {currentQuote.quote ? (
        <SafeAreaView edges={['top']} className="bg-primary">
          <View className="px-6 py-2.5 justify-center items-center">
            <Text className="text-white text-[9.5px] font-black text-center uppercase tracking-widest leading-tight">
              "{currentQuote.quote.toUpperCase()}"  —  {currentQuote.author.toUpperCase()}
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      {/* Header Container */}
      <View className="flex-row justify-between items-center bg-white border-b-2 border-primary px-5 py-3.5">
        {/* Drawer menu button */}
        <TouchableOpacity 
          className="w-10 h-10 bg-white border-2 border-primary rounded-none items-center justify-center shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#0F1739]"
          onPress={() => setMenuOpen(true)}
        >
          <View className="w-5 h-0.5 bg-primary my-0.5" />
          <View className="w-5 h-0.5 bg-primary my-0.5" />
          <View className="w-5 h-0.5 bg-primary my-0.5" />
        </TouchableOpacity>

        {/* Greetings and Profile Avatar */}
        <View className="flex-row items-center">
          <Text className="text-primary text-base font-black mr-3">
            Howdy {getFirstName()}! 🤠
          </Text>
          <TouchableOpacity 
            className="w-9 h-9 border-2 border-primary rounded-none bg-slate-200 justify-center items-center shadow-[2px_2px_0px_0px_#0F1739] active:bg-rose-50"
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
        <NeobrutalistCard containerClassName="mb-8" cardClassName="p-5" borderColor="border-primary" shadowColor="bg-primary">
          
          {/* Vision Board Header Row */}
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-primary text-3xl font-black uppercase tracking-tighter">Vision Board</Text>
              <View className="bg-slate-100 px-2 py-0.5 border border-slate-300">
                <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">🔒 Personal</Text>
              </View>
            </View>
            <View className="w-7 h-7 rounded-full border-2 border-primary justify-center items-center">
              <Text className="text-primary font-black text-xs">?</Text>
            </View>
          </View>
          
          <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
            Visualize your goals and turn desires into reality.
          </Text>

          {/* ADD Goal Form */}
          <View className="mb-6 gap-4">
            {/* Goal Input */}
            <View>
              <TextInput
                className="bg-white text-primary font-bold rounded-none px-3.5 py-2.5 border-2 border-primary text-sm h-12"
                placeholder="Goal"
                placeholderTextColor="#94a3b8"
                value={newGoal}
                onChangeText={setNewGoal}
              />
              <Text className="text-slate-400 text-xxs mt-1 uppercase font-semibold">Name your goal in one word (max 10 chars)</Text>
            </View>

            {/* URL Input */}
            <View>
              <TextInput
                className="bg-white text-primary font-bold rounded-none px-3.5 py-2.5 border-2 border-primary text-sm h-12"
                placeholder="Unsplash Image URL"
                placeholderTextColor="#94a3b8"
                value={newUrl}
                onChangeText={setNewUrl}
                autoCapitalize="none"
              />
              <Text className="text-slate-400 text-xxs mt-1 uppercase font-semibold">Add the URL of a picture from Unsplash</Text>
            </View>

            {/* ADD Button */}
            <TouchableOpacity
              className="bg-primary px-6 py-3.5 rounded-none border-2 border-primary shadow-[3px_3px_0px_0px_#0F1739] self-start active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px]"
              onPress={handleAddGoal}
            >
              <Text className="text-white font-black text-xs uppercase tracking-widest">ADD</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="h-0.5 bg-slate-100 mb-6" />

          {/* Vision Boards grid */}
          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color="#0F1739" size="large" />
              <Text className="text-slate-500 text-xs mt-2 font-mono font-semibold">Syncing database...</Text>
            </View>
          ) : boardItems.length === 0 ? (
            <View className="py-12 items-center justify-center bg-slate-50 border-2 border-dashed border-primary rounded-none mb-6">
              <Text className="text-primary text-center font-black text-sm mb-1 uppercase">Vision Not Found 👻</Text>
              <Text className="text-slate-400 text-center text-xs font-semibold px-8 leading-relaxed">
                An empty board is like an empty mind… Add your goals and bring your vision to life!
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2 justify-between mb-8">
              {boardItems.map(item => (
                <View 
                  key={item.id} 
                  style={{ width: cardSize, height: cardSize }}
                  className="border-2 border-primary rounded-none overflow-hidden relative mb-2"
                >
                  {/* Goal Image */}
                  <Image 
                    source={{ uri: item.url }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* Goal label tag overlay */}
                  <View className="absolute bottom-2 left-2 bg-white border border-primary px-2 py-1">
                    <Text className="text-primary font-black text-[9px] uppercase tracking-wide">
                      {item.item}
                    </Text>
                  </View>

                  {/* Completed visual mask & tag */}
                  {item.done && (
                    <View className="absolute inset-0 bg-primary/60 items-center justify-center">
                      <View className="bg-[#22c55e] border-2 border-primary rounded-none px-3 py-1.5 shadow-[2px_2px_0px_0px_#0F1739]">
                        <Text className="text-white font-black text-xs uppercase tracking-wider">DONE ✓</Text>
                      </View>
                    </View>
                  )}

                  {/* Top-right Trash button */}
                  <TouchableOpacity 
                    className="absolute top-1.5 right-1.5 w-6.5 h-6.5 bg-white border border-primary items-center justify-center active:bg-rose-50"
                    onPress={() => handleDeleteItem(item)}
                  >
                    <Text className="text-black text-xs font-bold">🗑️</Text>
                  </TouchableOpacity>

                  {/* Bottom-right Done toggle checkbox (only if not completed, or overlayed) */}
                  <TouchableOpacity 
                    className={`absolute bottom-1.5 right-1.5 w-6.5 h-6.5 border border-primary items-center justify-center ${
                      item.done ? 'bg-[#22c55e]' : 'bg-white'
                    }`}
                    onPress={() => handleToggleDone(item)}
                  >
                    <Text className="text-primary text-xxs font-black">
                      {item.done ? '✓' : '☐'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Neobrutalist Quote card block */}
          <View className="bg-primary p-4.5 border-2 border-primary rounded-none shadow-[3px_3px_0px_0px_#22c55e]">
            <Text className="text-white text-xs font-black uppercase tracking-wider leading-relaxed mb-2">
              “Whatever the mind can conceive and believe, it can achieve.”
            </Text>
            <Text className="text-[#22c55e] text-xxs font-black uppercase tracking-widest text-right">
              – Napoleon Hill
            </Text>
          </View>

        </NeobrutalistCard>

      </ScrollView>

      {/* Drawer Navigation Overlay */}
      {menuOpen && (
        <View className="absolute inset-0 bg-black/60 z-50 flex-row">
          <View className="w-[260px] h-full bg-background border-r-2 border-primary p-5 justify-between">
            <View>
              {/* Drawer Header */}
              <View className="flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <View className="flex-row items-center">
                  <Image 
                    source={require('../../assets/images/HandyForMe_Cog200x200.png')} 
                    className="w-8 h-8 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-primary font-black text-sm uppercase">Handyfor.me</Text>
                </View>
                <TouchableOpacity 
                  className="w-8 h-8 border border-slate-300 items-center justify-center rounded-none"
                  onPress={() => setMenuOpen(false)}
                >
                  <Text className="text-primary font-black text-xs">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <View className="gap-3">
                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/dashboard', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">🏠 Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/wins', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">🏆 Weekly Wins</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/decision-helper', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">🤔 Decision Helper</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/bucket-list', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">🪣 Bucket List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/vision-board', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">🖼️ Vision Board</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/shortcuts', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">⚡ Shortcuts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/random-question', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">❓ Random Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-primary rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/stoic-support', params: { ip } });
                  }}
                >
                  <Text className="text-primary font-black text-xs uppercase tracking-wider">🧠 Stoic Support</Text>
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

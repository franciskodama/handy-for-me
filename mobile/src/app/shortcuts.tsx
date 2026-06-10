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
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';
import { NeobrutalistCard } from '@/components/neobrutalist-card';

interface ShortcutCategory {
  id: string;
  category: string;
  color: string;
  createdAt: string;
  uid: string;
}

interface Shortcut {
  id: string;
  shortcut: string;
  url: string;
  description: string;
  categoryId: string;
  createdAt: string;
  uid: string;
  category?: ShortcutCategory;
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
  { quote: "Be the type of person you want to meet.", author: "Unknown" }
];

export const colorPalette = [
  { name: 'Blue', code: '#1E90FF', foreground: '#FFFFFF' },
  { name: 'Green', code: '#32CD32', foreground: '#FFFFFF' },
  { name: 'Red', code: '#FF4500', foreground: '#FFFFFF' },
  { name: 'Yellow', code: '#FFD700', foreground: '#000000' },
  { name: 'Purple', code: '#8A2BE2', foreground: '#FFFFFF' },
  { name: 'Orange', code: '#FFA500', foreground: '#000000' },
  { name: 'Pink', code: '#FF69B4', foreground: '#000000' },
  { name: 'Teal', code: '#20B2AA', foreground: '#FFFFFF' },
  { name: 'Gray', code: '#808080', foreground: '#FFFFFF' },
  { name: 'Brown', code: '#A52A2A', foreground: '#FFFFFF' },
  { name: 'Black', code: '#000000', foreground: '#FFFFFF' }
];

export default function ShortcutsScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [categories, setCategories] = useState<ShortcutCategory[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });

  // Add Category fields
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('Gray');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  // Add Shortcut fields
  const [newShortcutName, setNewShortcutName] = useState('');
  const [newShortcutUrl, setNewShortcutUrl] = useState('');
  const [newShortcutDesc, setNewShortcutDesc] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [shortcutCatDropdownOpen, setShortcutCatDropdownOpen] = useState(false);

  // Expanded descriptions tracker
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

  // Fetch Categories & Shortcuts
  const fetchShortcuts = async (activeToken?: string | null) => {
    const currentToken = activeToken !== undefined ? activeToken : token;
    if (!currentToken) return;

    try {
      const response = await fetch(`${baseUrl}/api/mobile/shortcuts`, {
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
      setCategories(data.categories || []);
      setShortcuts(data.shortcuts || []);

      if (data.categories?.length > 0 && !selectedCatId) {
        setSelectedCatId(data.categories[0].id);
      }
    } catch (error) {
      console.error('Error fetching shortcuts:', error);
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
        await fetchShortcuts(storedToken);
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

  // Create Category
  const handleCreateCategory = async () => {
    if (!token) return;
    if (!newCatName.trim()) {
      Alert.alert('Warning', 'Category name is required.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/mobile/shortcuts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'createCategory',
          category: newCatName.trim(),
          color: newCatColor,
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add category');
      }

      const added = await response.json();
      setCategories(prev => [...prev, added]);
      if (!selectedCatId) {
        setSelectedCatId(added.id);
      }
      setNewCatName('');
      setNewCatColor('Gray');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add category.');
    }
  };

  // Delete Category (cascades nested shortcuts)
  const handleDeleteCategory = async (cat: ShortcutCategory) => {
    if (!token) return;

    Alert.alert(
      'Delete Category',
      `Are you sure you want to permanently delete category "${cat.category}" and all its shortcut links?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Optimistic update
            setCategories(prev => prev.filter(c => c.id !== cat.id));
            setShortcuts(prev => prev.filter(s => s.categoryId !== cat.id));

            try {
              const response = await fetch(`${baseUrl}/api/mobile/shortcuts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                  action: 'deleteCategory',
                  categoryId: cat.id,
                }),
              });

              if (response.status === 401) {
                handleLogout();
                return;
              }

              if (!response.ok) throw new Error('Failed to delete category');
            } catch (error) {
              console.error(error);
              fetchShortcuts();
            }
          },
        },
      ]
    );
  };

  // Create Shortcut
  const handleCreateShortcut = async () => {
    if (!token) return;
    if (!newShortcutName.trim()) {
      Alert.alert('Warning', 'Shortcut name is required.');
      return;
    }
    if (!newShortcutUrl.trim()) {
      Alert.alert('Warning', 'URL is required.');
      return;
    }
    if (!selectedCatId) {
      Alert.alert('Warning', 'Please select a category first.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/mobile/shortcuts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'createShortcut',
          shortcut: newShortcutName.trim(),
          url: newShortcutUrl.trim(),
          description: newShortcutDesc.trim(),
          categoryId: selectedCatId,
        }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add shortcut');
      }

      const added = await response.json();
      setShortcuts(prev => [added, ...prev]);
      setNewShortcutName('');
      setNewShortcutUrl('');
      setNewShortcutDesc('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add shortcut.');
    }
  };

  // Delete individual shortcut
  const handleDeleteShortcut = async (shortcut: Shortcut) => {
    if (!token) return;

    Alert.alert(
      'Delete Shortcut',
      `Are you sure you want to permanently delete "${shortcut.shortcut}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Optimistic update
            setShortcuts(prev => prev.filter(s => s.id !== shortcut.id));

            try {
              const response = await fetch(`${baseUrl}/api/mobile/shortcuts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                  action: 'deleteShortcut',
                  shortcutId: shortcut.id,
                }),
              });

              if (response.status === 401) {
                handleLogout();
                return;
              }

              if (!response.ok) throw new Error('Failed to delete shortcut');
            } catch (error) {
              console.error(error);
              fetchShortcuts();
            }
          },
        },
      ]
    );
  };

  // Open link in browser
  const handleOpenLink = async (url: string) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    try {
      const supported = await Linking.canOpenURL(cleanUrl);
      if (supported) {
        await Linking.openURL(cleanUrl);
      } else {
        Alert.alert('Error', `Cannot open URL: ${cleanUrl}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while launching browser.');
    }
  };

  const toggleDescription = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  // Group shortcuts by Category
  const getOrganizedBoard = () => {
    const groups: Record<string, Shortcut[]> = {};
    shortcuts.forEach(s => {
      if (s.categoryId) {
        if (!groups[s.categoryId]) {
          groups[s.categoryId] = [];
        }
        groups[s.categoryId].push(s);
      }
    });
    return Object.values(groups);
  };

  const boardGroups = getOrganizedBoard();

  const getCategoryColorStyles = (colorName: string) => {
    // Standardize GRAY / GREY
    const key = colorName.toUpperCase() === 'GRAY' || colorName.toUpperCase() === 'GREY' ? 'GRAY' : colorName.toUpperCase();
    const found = colorPalette.find(c => c.name.toUpperCase() === key);
    return {
      bgColor: found?.code || '#808080',
      textColor: found?.foreground || '#FFFFFF',
    };
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
          
          {/* Shortcuts Header Row */}
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-primary text-3xl font-black uppercase tracking-tighter">Shortcuts</Text>
              <View className="bg-slate-100 px-2 py-0.5 border border-slate-300">
                <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">🔒 Personal</Text>
              </View>
            </View>
            <View className="w-7 h-7 rounded-full border-2 border-primary justify-center items-center">
              <Text className="text-primary font-black text-xs">?</Text>
            </View>
          </View>
          
          <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
            Your go-to place for quick access to your favorite sites.
          </Text>

          {/* Form Actions block */}
          <View className="gap-6 mb-6">
            
            {/* Create new category */}
            <View className="bg-slate-50 border border-slate-200 p-4 rounded-none">
              <Text className="text-primary font-black text-xs uppercase mb-3">Add a Category</Text>
              
              {/* Category Name */}
              <View className="mb-3">
                <TextInput
                  className="bg-white text-primary font-bold rounded-none px-3.5 py-2 border-2 border-primary text-sm h-10"
                  placeholder="Category Name"
                  placeholderTextColor="#94a3b8"
                  value={newCatName}
                  onChangeText={setNewCatName}
                />
              </View>

              {/* Color Dropdown */}
              <View className="mb-4 relative z-50">
                <TouchableOpacity
                  className="bg-white border-2 border-primary px-3.5 py-2 flex-row justify-between items-center rounded-none h-10"
                  onPress={() => setCatDropdownOpen(!catDropdownOpen)}
                >
                  <View className="flex-row items-center">
                    <View 
                      style={{ backgroundColor: getCategoryColorStyles(newCatColor).bgColor }}
                      className="w-3.5 h-3.5 border border-primary mr-2"
                    />
                    <Text className="text-primary font-bold text-sm">
                      {newCatColor}
                    </Text>
                  </View>
                  <Text className="text-primary font-bold text-xs">▼</Text>
                </TouchableOpacity>

                {catDropdownOpen && (
                  <View className="absolute top-[42px] left-0 right-0 bg-white border-2 border-primary rounded-none z-50 shadow-[3px_3px_0px_0px_#0F1739] max-h-[160px]">
                    <ScrollView nestedScrollEnabled={true}>
                      {colorPalette.map(color => (
                        <TouchableOpacity
                          key={color.name}
                          className="p-2.5 border-b border-slate-100 flex-row items-center active:bg-slate-50"
                          onPress={() => {
                            setNewCatColor(color.name);
                            setCatDropdownOpen(false);
                          }}
                        >
                          <View 
                            style={{ backgroundColor: color.code }}
                            className="w-3 h-3 border border-primary mr-2"
                          />
                          <Text className="text-primary font-bold text-sm">{color.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <TouchableOpacity
                className="bg-primary justify-center items-center py-2.5 px-4 rounded-none border-2 border-primary shadow-[2px_2px_0px_0px_#0F1739] self-start"
                onPress={handleCreateCategory}
              >
                <Text className="text-white font-black text-xs uppercase tracking-wider">Create Category</Text>
              </TouchableOpacity>
            </View>

            {/* Create new Shortcut */}
            {categories.length > 0 && (
              <View className="bg-slate-50 border border-slate-200 p-4 rounded-none">
                <Text className="text-primary font-black text-xs uppercase mb-3">Add a Shortcut</Text>

                {/* Shortcut Name */}
                <View className="mb-3">
                  <TextInput
                    className="bg-white text-primary font-bold rounded-none px-3.5 py-2 border-2 border-primary text-sm h-10"
                    placeholder="Shortcut Name"
                    placeholderTextColor="#94a3b8"
                    value={newShortcutName}
                    onChangeText={setNewShortcutName}
                  />
                </View>

                {/* URL */}
                <View className="mb-3">
                  <TextInput
                    className="bg-white text-primary font-bold rounded-none px-3.5 py-2 border-2 border-primary text-sm h-10"
                    placeholder="URL (e.g. google.com)"
                    placeholderTextColor="#94a3b8"
                    value={newShortcutUrl}
                    onChangeText={setNewShortcutUrl}
                    autoCapitalize="none"
                  />
                </View>

                {/* Description */}
                <View className="mb-3">
                  <TextInput
                    className="bg-white text-primary font-bold rounded-none px-3.5 py-2 border-2 border-primary text-sm h-10"
                    placeholder="Description (Optional)"
                    placeholderTextColor="#94a3b8"
                    value={newShortcutDesc}
                    onChangeText={setNewShortcutDesc}
                  />
                </View>

                {/* Category Picker */}
                <View className="mb-4 relative z-50">
                  <TouchableOpacity
                    className="bg-white border-2 border-primary px-3.5 py-2 flex-row justify-between items-center rounded-none h-10"
                    onPress={() => setShortcutCatDropdownOpen(!shortcutCatDropdownOpen)}
                  >
                    <Text className="text-primary font-black text-sm uppercase">
                      {categories.find(c => c.id === selectedCatId)?.category || 'Select Category'}
                    </Text>
                    <Text className="text-primary font-bold text-xs">▼</Text>
                  </TouchableOpacity>

                  {shortcutCatDropdownOpen && (
                    <View className="absolute top-[42px] left-0 right-0 bg-white border-2 border-primary rounded-none z-50 shadow-[3px_3px_0px_0px_#0F1739] max-h-[160px]">
                      <ScrollView nestedScrollEnabled={true}>
                        {categories.map(cat => (
                          <TouchableOpacity
                            key={cat.id}
                            className="p-2.5 border-b border-slate-100 active:bg-slate-50"
                            onPress={() => {
                              setSelectedCatId(cat.id);
                              setShortcutCatDropdownOpen(false);
                            }}
                          >
                            <Text className="text-primary font-bold text-sm uppercase">{cat.category}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  className="bg-primary justify-center items-center py-2.5 px-4 rounded-none border-2 border-primary shadow-[2px_2px_0px_0px_#0F1739] self-start"
                  onPress={handleCreateShortcut}
                >
                  <Text className="text-white font-black text-xs uppercase tracking-wider">Add Shortcut</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

          {/* Divider */}
          <View className="h-0.5 bg-slate-100 mb-6" />

          {/* Shortcuts board list */}
          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color="#0F1739" size="large" />
              <Text className="text-slate-500 text-xs mt-2 font-mono font-semibold">Syncing database...</Text>
            </View>
          ) : boardGroups.length === 0 ? (
            <View className="py-12 items-center justify-center bg-slate-50 border-2 border-dashed border-primary rounded-none">
              <Text className="text-primary text-center font-black text-sm mb-1 uppercase">Shortcut Not Found 👻</Text>
              <Text className="text-slate-400 text-center text-xs font-semibold px-8 leading-relaxed">
                Start by adding a category for easy organization, then save your first shortcut here. Get ready to access your favorites in a click!
              </Text>
            </View>
          ) : (
            <View>
              {boardGroups.map(group => {
                const category = group[0].category;
                if (!category) return null;
                const colors = getCategoryColorStyles(category.color);

                return (
                  <View key={category.id} className="mb-6">
                    {/* Category Header Bar */}
                    <View 
                      style={{ backgroundColor: colors.bgColor }}
                      className="flex-row justify-between items-center rounded-none px-4 py-3 mb-2 border border-primary"
                    >
                      <Text 
                        style={{ color: colors.textColor }}
                        className="font-black text-xs uppercase tracking-wider"
                      >
                        {category.category}
                      </Text>
                      <TouchableOpacity 
                        className="w-5 h-5 bg-white border border-primary items-center justify-center rounded-none active:bg-rose-50"
                        onPress={() => handleDeleteCategory(category)}
                      >
                        <Text className="text-black text-[9px]">🗑️</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Shortcuts inside this category */}
                    {group.map(shortcut => {
                      const expanded = expandedIds.has(shortcut.id);
                      return (
                        <View key={shortcut.id} className="mb-2">
                          <View className="flex-row justify-between items-center border border-primary p-3.5 bg-white rounded-none">
                            <TouchableOpacity 
                              className="flex-1 mr-4 active:opacity-60"
                              onPress={() => handleOpenLink(shortcut.url)}
                            >
                              <Text className="text-primary text-xs font-black uppercase tracking-tight">
                                {shortcut.shortcut}
                              </Text>
                            </TouchableOpacity>

                            <View className="flex-row items-center gap-1">
                              {/* Details Toggle Arrow */}
                              <TouchableOpacity 
                                className="p-2 active:bg-slate-100"
                                onPress={() => toggleDescription(shortcut.id)}
                              >
                                <Text className="text-black text-xs font-black">
                                  {expanded ? '▲' : '▼'}
                                </Text>
                              </TouchableOpacity>

                              {/* Delete button */}
                              <TouchableOpacity 
                                className="p-2 active:bg-rose-100"
                                onPress={() => handleDeleteShortcut(shortcut)}
                              >
                                <Text className="text-black text-sm">🗑️</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Collapsible description panel */}
                          {expanded && (
                            <View className="bg-primary border-x border-b border-primary p-3 rounded-none">
                              <Text className="text-white text-xxs font-black uppercase tracking-wide leading-relaxed">
                                {shortcut.description || 'No description available.'}
                              </Text>
                              <Text className="text-slate-400 text-[8px] font-mono mt-1 select-all">
                                URL: {shortcut.url}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          )}

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

import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';

interface DecisionHelperList {
  id: string;
  list: string;
  createdAt: string;
  uid: string;
}

interface DecisionHelperItem {
  id: string;
  listId: string;
  item: string;
  selected: boolean;
  uid: string;
  createdAt: string;
}

interface UserData {
  email: string;
  name?: string;
  image?: string;
}

// Base64 decoder for JWT token
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

const titleAlerts = [
  'Your Decision is Made!',
  'Here’s Your Choice!',
  'Here’s Your Decision!',
  'The Decision is In!',
  'Here’s Your Pick!',
  'Decision Unlocked!',
  'Your Choice Awaits!',
  'Decision Made Easy!'
];

export default function DecisionHelperScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [lists, setLists] = useState<DecisionHelperList[]>([]);
  const [allItems, setAllItems] = useState<DecisionHelperItem[]>([]);
  const [householdDetails, setHouseholdDetails] = useState<any>(null);
  
  const [listId, setListId] = useState<string>('');
  const [listInput, setListInput] = useState<string>('');
  const [itemInput, setItemInput] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });

  // Spin Animation setup
  const spinValue = useRef(new Animated.Value(0)).current;

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

  // Fetch all lists, items, and household details
  const fetchData = async (activeToken?: string | null) => {
    const currentToken = activeToken !== undefined ? activeToken : token;
    if (!currentToken) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/mobile/decision-helper`, {
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
      setLists(data.lists || []);
      setAllItems(data.items || []);
      setHouseholdDetails(data.householdDetails || null);

      // Default select the first list if we have lists and no selection is active
      if (data.lists?.length > 0 && !listId) {
        setListId(data.lists[0].id);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not load Decision Helper data.');
    } finally {
      setLoading(false);
    }
  };

  // Create new List
  const handleCreateList = async () => {
    if (!token) return;
    if (!listInput.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/api/mobile/decision-helper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'createList',
          listName: listInput.trim()
        })
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error('Failed to create list');

      const created = await response.json();
      setLists(prev => [...prev, created]);
      setListInput('');
      
      // Auto select the new list
      setListId(created.id);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create list.');
    }
  };

  // Create new Item
  const handleCreateItem = async () => {
    if (!token || !listId) return;
    if (!itemInput.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/api/mobile/decision-helper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'createItem',
          listId,
          itemName: itemInput.trim()
        })
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error('Failed to add item');

      const created = await response.json();
      setAllItems(prev => [...prev, created]);
      setItemInput('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add item.');
    }
  };

  // Toggle item selected state
  const handleItemSelection = async (itemId: string) => {
    if (!token) return;

    // Optimistic local state update
    setAllItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));

    try {
      const response = await fetch(`${baseUrl}/api/mobile/decision-helper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          action: 'toggleSelection',
          itemId
        })
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error('Failed to toggle selection');
    } catch (error) {
      console.error(error);
      // Revert state on failure
      fetchData();
    }
  };

  // Delete List
  const handleDeleteList = async (id: string, name: string) => {
    if (!token) return;

    Alert.alert(
      'Delete List',
      `Are you sure you want to permanently delete list "${name}" and all its contents?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}/api/mobile/decision-helper?listId=${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'ngrok-skip-browser-warning': 'true',
                }
              });

              if (response.status === 401) {
                handleLogout();
                return;
              }

              if (!response.ok) throw new Error('Failed to delete list');

              setLists(prev => prev.filter(l => l.id !== id));
              setAllItems(prev => prev.filter(item => item.listId !== id));

              // If deleted the current active list, switch to the first remaining list
              if (listId === id) {
                const remaining = lists.filter(l => l.id !== id);
                setListId(remaining.length > 0 ? remaining[0].id : '');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete list.');
            }
          }
        }
      ]
    );
  };

  // Delete individual item
  const handleDeleteItem = async (itemId: string) => {
    if (!token) return;

    // Optimistic local state update
    setAllItems(prev => prev.filter(item => item.id !== itemId));

    try {
      const response = await fetch(`${baseUrl}/api/mobile/decision-helper?itemId=${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error('Failed to delete item');
    } catch (error) {
      console.error(error);
      // Restore states on failure
      fetchData();
    }
  };

  // Trigger spin selection animation
  const handleSpin = () => {
    if (itemsSelected.length === 0) {
      Alert.alert('Warning', 'Please select at least one item first.');
      return;
    }

    setResult('');
    setSpinning(true);

    // Spin animation configuration
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bezier(0.1, 0.8, 0.3, 1),
      useNativeDriver: true,
    }).start();

    // Select randomly after spin completes
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * itemsSelected.length);
      setResult(itemsSelected[randomIndex].item);
      setSpinning(false);
    }, 2000);
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

        // Fetch initial data
        fetchData(storedToken);

        // Select a random banner quote
        const randomIdx = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIdx]);
      } catch (e) {
        console.error('Failed to load session token:', e);
        router.replace('/');
      }
    }
    loadAuth();
  }, [ip]);

  // Derived state values
  const activeList = lists.find(l => l.id === listId);
  const items = allItems.filter(item => item.listId === listId);
  const itemsSelected = items.filter(item => item.selected);

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  // Map animated spin interpolator
  const spinRotation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1440deg']
  });

  return (
    <View className="flex-1 bg-[#f8fafc]">
      
      {/* Quote Banner */}
      {currentQuote.quote ? (
        <SafeAreaView edges={['top']} className="bg-[#0F1739]">
          <View className="px-6 py-2.5 justify-center items-center">
            <Text className="text-white text-[9.5px] font-black text-center uppercase tracking-widest leading-tight">
              "{currentQuote.quote.toUpperCase()}"  —  {currentQuote.author.toUpperCase()}
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      {/* Header Container */}
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

      {/* Main Content scroll window */}
      <ScrollView className="flex-1 px-4 py-3" style={{ marginBottom: BottomTabInset }} showsVerticalScrollIndicator={false}>
        
        {/* Neobrutalist main Card */}
        <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 mb-8 shadow-[4px_4px_0px_0px_#0f1739]">
          
          {/* Main Title Row */}
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#0F1739] text-3xl font-black uppercase tracking-tighter">Decision Helper</Text>
              
              {householdDetails?.inHousehold && householdDetails?.userSettings?.shareDecisionHelper ? (
                <View className="bg-violet-600 px-2 py-0.5 border border-[#0F1739]">
                  <Text className="text-white font-bold text-[9px] uppercase tracking-wider">👥 Household</Text>
                </View>
              ) : (
                <View className="bg-slate-100 px-2 py-0.5 border border-slate-300">
                  <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">🔒 Personal</Text>
                </View>
              )}
            </View>
            <View className="w-7 h-7 rounded-full border-2 border-[#0F1739] justify-center items-center">
              <Text className="text-[#0F1739] font-black text-xs">?</Text>
            </View>
          </View>

          <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
            A fun, random decision-maker that spins the wheel to pick your next adventure!
          </Text>

          {/* Form Actions block */}
          <View className="gap-6 mb-6">
            
            {/* Create new list input */}
            <View>
              <Text className="text-[#0F1739] font-black text-xs uppercase mb-1.5">Do you want to start a new list?</Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 bg-white text-[#0F1739] font-bold rounded-none px-3.5 py-2.5 border-2 border-[#0F1739] text-sm h-12"
                  placeholder="List's Name"
                  placeholderTextColor="#94a3b8"
                  value={listInput}
                  onChangeText={setListInput}
                />
                <TouchableOpacity
                  className="bg-[#0F1739] justify-center items-center px-4 rounded-none border-2 border-[#0F1739] shadow-[2px_2px_0px_0px_#0F1739] disabled:opacity-50"
                  onPress={handleCreateList}
                  disabled={!listInput.trim()}
                >
                  <Text className="text-white font-black text-xs uppercase tracking-wider">Create</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-center gap-2 py-1">
              <View className="flex-1 h-0.5 bg-slate-100" />
              <Text className="text-slate-400 font-bold text-xxs uppercase">OR</Text>
              <View className="flex-1 h-0.5 bg-slate-100" />
            </View>

            {/* List Selection trigger dropdown */}
            {lists.length > 0 && (
              <View className="relative z-50">
                <Text className="text-[#0F1739] font-black text-xs uppercase mb-1.5">Choose a List</Text>
                <TouchableOpacity
                  className="bg-white border-2 border-[#0F1739] px-3.5 py-2.5 flex-row justify-between items-center rounded-none h-12"
                  onPress={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Text className="text-[#0F1739] font-black text-sm uppercase">
                    {activeList ? activeList.list : 'Select a List'}
                  </Text>
                  <Text className="text-[#0F1739] font-bold text-xs">▼</Text>
                </TouchableOpacity>

                {dropdownOpen && (
                  <View className="absolute top-[70px] left-0 right-0 bg-white border-2 border-[#0F1739] rounded-none z-50 shadow-[3px_3px_0px_0px_#0F1739] max-h-[220px]">
                    <ScrollView nestedScrollEnabled={true}>
                      {lists.map(el => (
                        <View key={el.id} className="flex-row items-center justify-between border-b border-slate-100 last:border-b-0">
                          <TouchableOpacity
                            className="flex-1 p-3.5"
                            onPress={() => {
                              setListId(el.id);
                              setDropdownOpen(false);
                              setResult('');
                            }}
                          >
                            <Text className="text-[#0F1739] font-black text-sm uppercase">{el.list}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="p-3.5 active:bg-rose-50"
                            onPress={() => {
                              setDropdownOpen(false);
                              handleDeleteList(el.id, el.list);
                            }}
                          >
                            <Text className="text-rose-600 text-xs font-bold uppercase">🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            {/* Add item to list input */}
            {listId ? (
              <View>
                <Text className="text-[#0F1739] font-black text-xs uppercase mb-1.5">Enter a new Item for list</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 bg-white text-[#0F1739] font-bold rounded-none px-3.5 py-2.5 border-2 border-[#0F1739] text-sm h-12"
                    placeholder="New Item Name"
                    placeholderTextColor="#94a3b8"
                    value={itemInput}
                    onChangeText={setItemInput}
                  />
                  <TouchableOpacity
                    className="bg-[#0F1739] justify-center items-center px-6 rounded-none border-2 border-[#0F1739] shadow-[2px_2px_0px_0px_#0F1739] disabled:opacity-50"
                    onPress={handleCreateItem}
                    disabled={!itemInput.trim()}
                  >
                    <Text className="text-white font-black text-xs uppercase tracking-wider">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

          </View>

          {/* Divider */}
          <View className="h-0.5 bg-slate-100 mb-6" />

          {/* SPIN THE WHEEL Visual Banner */}
          {items.length > 0 ? (
            <View className="items-center justify-center p-8 bg-white border-2 border-[#0F1739] border-dashed rounded-none mb-6">
              <Text className="text-[#0F1739] font-black text-sm uppercase tracking-widest mb-4">
                {spinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
              </Text>
              
              <Animated.View style={{ transform: [{ rotate: spinRotation }] }}>
                <TouchableOpacity
                  className="w-24 h-24 bg-white border-2 border-[#0F1739] justify-center items-center rounded-full shadow-[3px_3px_0px_0px_#0F1739]"
                  onPress={handleSpin}
                  disabled={spinning}
                >
                  <Text className="text-2xl">🔄</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View className="py-8 items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-none mb-6">
              <Text className="text-slate-400 font-bold text-xs uppercase tracking-wide">Waiting for items...</Text>
            </View>
          )}

          {/* Items checklist rows */}
          {items.length > 0 && (
            <View className="mb-6">
              <Text className="text-[#0F1739] font-black text-xs uppercase mb-3">Items ({items.length})</Text>
              
              {items.map(el => (
                <View 
                  key={el.id} 
                  className={`flex-row justify-between items-center bg-white border border-[#0F1739] p-3 mt-2 rounded-none`}
                >
                  <Text className="text-[#0F1739] text-xs font-black uppercase tracking-tight flex-1">
                    {el.item}
                  </Text>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity 
                      className={`w-6 h-6 border-2 border-[#0F1739] items-center justify-center rounded-none ${el.selected ? 'bg-[#DDF906]' : 'bg-white'}`}
                      onPress={() => handleItemSelection(el.id)}
                    >
                      {el.selected && <Text className="text-[#0F1739] text-xs font-black">✓</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="p-1 active:bg-rose-50"
                      onPress={() => handleDeleteItem(el.id)}
                    >
                      <Text className="text-[#0F1739] text-sm font-bold uppercase">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
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

      {/* Choice Modal Pop-up Alert when result lands */}
      <Modal
        visible={!!result}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 items-center justify-center bg-black/60 p-6">
          <View className="bg-white border-2 border-[#0F1739] rounded-none p-6 w-full max-w-sm shadow-[6px_6px_0px_0px_#0F1739]">
            
            <Text className="text-[#0F1739] font-black text-center text-sm uppercase tracking-widest mb-4 animate-bounce">
              {titleAlerts[Math.floor(Math.random() * titleAlerts.length)]} 🎉
            </Text>

            <View className="bg-slate-50 border-2 border-[#0F1739] rounded-none p-5 mb-6">
              <Text className="text-[#0F1739] font-black text-2xl text-center uppercase tracking-tight leading-normal">
                {result}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-[#DDF906] py-3.5 rounded-none border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0f1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739]"
              onPress={() => setResult('')}
            >
              <Text className="text-[#0F1739] font-black text-xs text-center uppercase tracking-widest">
                Done! Back to Choices
              </Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

    </View>
  );
}

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
import { BottomTabInset } from '@/constants/theme';

interface WeeklyWin {
  id: string;
  goal: string;
  type: 'Easy' | 'Moderate' | 'Challenging';
  done: boolean;
  uid: string;
  createdAt: string;
}

export default function WeeklyWinsScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();
  
  // State variables
  const [email, setEmail] = useState('franciskodama@gmail.com'); // default or simulated email
  const [wins, setWins] = useState<WeeklyWin[]>([]);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newType, setNewType] = useState<'Easy' | 'Moderate' | 'Challenging'>('Easy');

  const baseUrl = `http://${ip || 'localhost'}:3000`;

  // Fetch weekly wins for the current email
  const fetchWins = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/mobile/weekly-wins?uid=${encodeURIComponent(email)}`);
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
    try {
      const response = await fetch(`${baseUrl}/api/mobile/weekly-wins`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: win.id,
          done: !win.done,
        }),
      });

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
              });

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
    if (!newGoal.trim()) {
      Alert.alert('Warning', 'Please enter a goal description.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/mobile/weekly-wins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: email,
          goal: newGoal.trim(),
          type: newType,
        }),
      });

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

  // Fetch when email or ip changes
  useEffect(() => {
    fetchWins();
  }, [email, ip]);

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
        <Text className={`text-white font-extrabold text-sm uppercase px-3 py-1.5 rounded-md self-start ${colorClass} mb-2`}>
          {title} ({sectionWins.length})
        </Text>
        {sectionWins.map(win => (
          <View 
            key={win.id} 
            className={`flex-row justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4 mb-2 shadow-sm ${
              win.done ? 'opacity-65 border-dashed border-slate-700' : ''
            }`}
          >
            <TouchableOpacity 
              className="flex-1 flex-row items-center mr-4"
              onPress={() => handleToggleDone(win)}
            >
              <View className={`w-6 h-6 rounded-md items-center justify-center border-2 mr-3 ${
                win.done ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-slate-600'
              }`}>
                {win.done && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text className={`text-slate-100 text-sm font-semibold flex-1 ${
                win.done ? 'line-through text-slate-500' : ''
              }`}>
                {win.goal}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-8 h-8 rounded-full items-center justify-center bg-slate-950 border border-slate-800 active:bg-rose-950"
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
    <SafeAreaView className="flex-1 bg-slate-950 p-5" style={{ paddingBottom: BottomTabInset }}>
      
      {/* Header Block */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity 
          className="bg-slate-900 px-4 py-2 border border-slate-800 rounded-lg active:bg-slate-800"
          onPress={() => router.back()}
        >
          <Text className="text-slate-300 text-xs font-semibold">◀ Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Weekly Wins</Text>
        <TouchableOpacity 
          className="bg-slate-900 w-8 h-8 items-center justify-center border border-slate-800 rounded-lg active:bg-slate-800"
          onPress={fetchWins}
        >
          <Text className="text-slate-300 text-sm">🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Simulated Auth Bar */}
      <View className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex-row items-center">
        <Text className="text-slate-400 text-xs font-bold mr-2 uppercase">User:</Text>
        <TextInput
          className="flex-1 text-white text-xs font-mono py-1 px-2 bg-slate-950 rounded border border-slate-800"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
      </View>

      {/* Progress Card */}
      {totalCount > 0 && (
        <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-slate-300 text-xs font-bold uppercase">Weekly Progress</Text>
            <Text className="text-white text-sm font-extrabold">{completedCount} of {totalCount} Wins</Text>
          </View>
          <View className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <View 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${progressPercent}%` }} 
            />
          </View>
          <Text className="text-slate-500 text-xxs mt-1.5 text-right font-mono">{progressPercent}% Completed</Text>
        </View>
      )}

      {/* Add Win Form */}
      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
        <Text className="text-white font-bold text-sm mb-2">Add New Win</Text>
        <TextInput
          className="bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-800 text-xs mb-3"
          placeholder="What will you conquer this week?"
          placeholderTextColor="#64748b"
          value={newGoal}
          onChangeText={setNewGoal}
        />
        
        <View className="flex-row justify-between items-center">
          {/* Difficulty Levels selector */}
          <View className="flex-row bg-slate-950 rounded-lg p-1 border border-slate-800 gap-1">
            {(['Easy', 'Moderate', 'Challenging'] as const).map(type => (
              <TouchableOpacity
                key={type}
                className={`px-3 py-1 rounded-md ${
                  newType === type 
                    ? type === 'Easy' ? 'bg-emerald-500/20 border border-emerald-500/40' :
                      type === 'Moderate' ? 'bg-amber-500/20 border border-amber-500/40' :
                      'bg-rose-500/20 border border-rose-500/40'
                    : 'border border-transparent'
                }`}
                onPress={() => setNewType(type)}
              >
                <Text className={`text-xxs font-bold ${
                  newType === type
                    ? type === 'Easy' ? 'text-emerald-400' :
                      type === 'Moderate' ? 'text-amber-400' :
                      'text-rose-400'
                    : 'text-slate-500'
                }`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-lg active:opacity-85"
            onPress={handleAddWin}
          >
            <Text className="text-white font-bold text-xs">＋ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wins Lists */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator color="#ef4444" size="large" />
            <Text className="text-slate-500 text-xs mt-2 font-mono">Syncing database...</Text>
          </View>
        ) : wins.length === 0 ? (
          <View className="py-12 items-center justify-center bg-slate-900/40 border border-slate-900 border-dashed rounded-2xl">
            <Text className="text-slate-400 text-center font-bold text-sm mb-1">Weekly Wins Not Found 👻</Text>
            <Text className="text-slate-500 text-center text-xs px-8">
              Looks like your week is wide open! Add a goal or two above to get started.
            </Text>
          </View>
        ) : (
          <View>
            {renderWinSection('Challenging Goals 🔥', challengingWins, 'bg-rose-500/20 border border-rose-500/40 text-rose-400')}
            {renderWinSection('Moderate Goals ⚡', moderateWins, 'bg-amber-500/20 border border-amber-500/40 text-amber-400')}
            {renderWinSection('Easy Goals 🟢', easyWins, 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400')}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  const [email, setEmail] = useState('franciskodama@gmail.com');
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
        <View className={`border-2 border-[#0F1739] rounded-lg self-start px-3 py-1.5 ${colorClass} shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] mb-3`}>
          <Text className="text-[#0F1739] font-black text-xs uppercase">
            {title} ({sectionWins.length})
          </Text>
        </View>
        {sectionWins.map(win => (
          <View 
            key={win.id} 
            className={`flex-row justify-between items-center bg-white border-2 border-[#0F1739] rounded-xl p-4 mb-2.5 shadow-[3px_3px_0px_0px_rgba(15,23,57,1)] ${
              win.done ? 'opacity-70 bg-slate-50' : ''
            }`}
          >
            <TouchableOpacity 
              className="flex-1 flex-row items-center mr-4"
              onPress={() => handleToggleDone(win)}
            >
              <View className={`w-6 h-6 rounded-md items-center justify-center border-2 mr-3 ${
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
              className="w-8 h-8 rounded-lg items-center justify-center bg-slate-50 border-2 border-[#0F1739] shadow-[1px_1px_0px_0px_rgba(15,23,57,1)] active:bg-rose-100"
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
    <SafeAreaView className="flex-1 bg-white p-5" style={{ paddingBottom: BottomTabInset }}>
      
      {/* Header Block */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity 
          className="bg-slate-50 px-4 py-2 border-2 border-[#0F1739] rounded-lg shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] active:bg-slate-100"
          onPress={() => router.back()}
        >
          <Text className="text-[#0F1739] text-xs font-black">◀ Back</Text>
        </TouchableOpacity>
        <Text className="text-[#0F1739] text-2xl font-black uppercase tracking-tight">Weekly Wins</Text>
        <TouchableOpacity 
          className="bg-slate-50 w-8 h-8 items-center justify-center border-2 border-[#0F1739] rounded-lg shadow-[2px_2px_0px_0px_rgba(15,23,57,1)] active:bg-slate-100"
          onPress={fetchWins}
        >
          <Text className="text-[#0F1739] text-sm font-bold">🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Simulated Auth Bar */}
      <View className="bg-slate-50 border-2 border-[#0F1739] rounded-xl p-3 mb-4 flex-row items-center shadow-[3px_3px_0px_0px_rgba(15,23,57,1)]">
        <Text className="text-[#0F1739] text-xs font-black mr-2 uppercase">User Email:</Text>
        <TextInput
          className="flex-1 text-[#0F1739] text-xs font-mono py-1 px-2 bg-white rounded border-2 border-[#0F1739]"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
      </View>

      {/* Progress Card */}
      {totalCount > 0 && (
        <View className="bg-white border-2 border-[#0F1739] rounded-2xl p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(15,23,57,1)]">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#0F1739] text-xs font-extrabold uppercase">Weekly Progress</Text>
            <Text className="text-[#0F1739] text-sm font-black">{completedCount} of {totalCount} Wins</Text>
          </View>
          <View className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border-2 border-[#0F1739]">
            <View 
              className="bg-[#DDF906] h-full rounded-full border-r border-[#0F1739]" 
              style={{ width: `${progressPercent}%` }} 
            />
          </View>
          <Text className="text-slate-500 text-xxs mt-1.5 text-right font-mono font-bold">{progressPercent}% Completed</Text>
        </View>
      )}

      {/* Add Win Form */}
      <View className="bg-white border-2 border-[#0F1739] rounded-2xl p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(15,23,57,1)]">
        <Text className="text-[#0F1739] font-black text-sm mb-2 uppercase">Add New Goal</Text>
        <TextInput
          className="bg-slate-50 text-[#0F1739] font-bold rounded-lg px-3 py-2 border-2 border-[#0F1739] text-xs mb-3"
          placeholder="What will you conquer this week?"
          placeholderTextColor="#94a3b8"
          value={newGoal}
          onChangeText={setNewGoal}
        />
        
        <View className="flex-row justify-between items-center">
          {/* Difficulty Levels selector */}
          <View className="flex-row bg-slate-50 rounded-lg p-1 border-2 border-[#0F1739] gap-1">
            {(['Easy', 'Moderate', 'Challenging'] as const).map(type => (
              <TouchableOpacity
                key={type}
                className={`px-3 py-1 rounded-md border ${
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
            className="bg-[#0F1739] px-5 py-2 rounded-lg active:opacity-85 border-2 border-[#0F1739]"
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
          <View className="py-12 items-center justify-center bg-slate-50 border-2 border-dashed border-slate-350 rounded-2xl">
            <Text className="text-slate-600 text-center font-black text-sm mb-1">Weekly Wins Not Found 👻</Text>
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

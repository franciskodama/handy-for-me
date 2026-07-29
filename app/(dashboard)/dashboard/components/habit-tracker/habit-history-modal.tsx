'use client';

import { Habit, HabitHistory } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Trophy, Zap, BarChart2, AlertTriangle, Calendar, Trash2, MessageSquare } from 'lucide-react';
import { deleteHabitHistoryItem } from '@/lib/actions/habits';
import { toast } from 'sonner';
import { useState } from 'react';

interface HabitHistoryModalProps {
  habit: Habit;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HabitHistoryModal({
  habit,
  isOpen,
  onOpenChange
}: HabitHistoryModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const historyList = habit.history || [];
  const lastReset = new Date(habit.lastResetAt);
  const now = new Date();

  // Current active streak in days
  const currentDiffMs = Math.max(0, now.getTime() - lastReset.getTime());
  const currentStreakDays = Math.floor(currentDiffMs / (1000 * 60 * 60 * 24));

  // Past completed streaks metrics
  const pastStreaks = historyList.map((item) => {
    const start = new Date(item.startedAt);
    const end = new Date(item.endedAt);
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return {
      ...item,
      start,
      end,
      days
    };
  });

  const allStreakDays = [currentStreakDays, ...pastStreaks.map((s) => s.days)];
  const longestStreak = Math.max(...allStreakDays);

  const totalStreaksCount = allStreakDays.length;
  const avgStreakDays = Math.round(
    allStreakDays.reduce((acc, curr) => acc + curr, 0) / (totalStreaksCount || 1)
  );

  const handleDeleteHistory = async (historyId: string) => {
    setDeletingId(historyId);
    try {
      const res = await deleteHabitHistoryItem(historyId);
      if (res.success) {
        toast.success('History log removed.');
      } else {
        toast.error('Failed to remove history log.');
      }
    } catch {
      toast.error('Error removing log entry.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-2 border-zinc-800 text-zinc-100 max-w-lg w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl">
        <DialogHeader className="border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-950/60 px-2 py-0.5 border border-red-900/50 rounded">
              Habit Telemetry
            </span>
            <DialogTitle className="uppercase tracking-widest font-black text-sm text-zinc-100">
              {habit.name} Log
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-500 text-xs mt-1">
            Historical records, accident timestamps, and streak analysis.
          </DialogDescription>
        </DialogHeader>

        {/* Top Analytics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2">
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded flex flex-col items-center justify-center text-center">
            <Trophy className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[10px] uppercase font-bold text-zinc-400">Personal Best</span>
            <span className="text-lg font-mono font-bold text-amber-400">{longestStreak}d</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded flex flex-col items-center justify-center text-center">
            <Zap className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[10px] uppercase font-bold text-zinc-400">Current</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{currentStreakDays}d</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded flex flex-col items-center justify-center text-center">
            <BarChart2 className="w-4 h-4 text-blue-500 mb-1" />
            <span className="text-[10px] uppercase font-bold text-zinc-400">Avg Streak</span>
            <span className="text-lg font-mono font-bold text-blue-400">{avgStreakDays}d</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
            <span className="text-[10px] uppercase font-bold text-zinc-400">Accidents</span>
            <span className="text-lg font-mono font-bold text-red-400">{historyList.length}</span>
          </div>
        </div>

        {/* Timeline Log Section */}
        <div className="mt-4">
          <h4 className="text-[11px] uppercase font-black text-zinc-400 tracking-wider mb-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            Streak Timeline & Incidents
          </h4>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
            {/* Active Current Streak */}
            <div className="relative pl-8 bg-zinc-900/40 border border-emerald-900/40 p-3 rounded group">
              <div className="absolute left-2.5 top-3.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-zinc-950" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Active Streak
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {currentStreakDays} {currentStreakDays === 1 ? 'day' : 'days'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Started {formatDate(lastReset)} – Present
              </p>
            </div>

            {/* Past Relapses / Resets */}
            {pastStreaks.map((item, index) => (
              <div
                key={item.id}
                className="relative pl-8 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 p-3 rounded transition-all group"
              >
                <div className="absolute left-2.5 top-3.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-zinc-950" />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                      Streak #{pastStreaks.length - index} (Reset)
                    </span>
                    <p className="text-xs text-zinc-300 font-medium mt-0.5">
                      {formatDate(item.start)} → {formatDate(item.end)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {item.days} {item.days === 1 ? 'day' : 'days'}
                    </span>
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      disabled={deletingId === item.id}
                      className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete this history entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.note && (
                  <div className="mt-2 text-xs text-zinc-400 italic bg-zinc-950/70 p-2 rounded border border-zinc-800/60 flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />
                    <span>"{item.note}"</span>
                  </div>
                )}
              </div>
            ))}

            {pastStreaks.length === 0 && (
              <p className="text-xs text-zinc-600 italic pl-8 py-2">
                No past accidents recorded yet. Keep up the streak!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

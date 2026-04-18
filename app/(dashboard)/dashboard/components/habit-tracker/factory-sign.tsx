'use client';

import { Habit } from '@/lib/types';
import { resetHabit, updateHabit } from '@/lib/actions/habits';
import { toast } from 'sonner';
import { RefreshCcw, Settings, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function FactorySign({
  habit,
  onDelete
}: {
  habit: Habit;
  onDelete: (id: string) => void;
}) {
  const [isResetting, setIsResetting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDate, setEditDate] = useState(
    new Date(habit.lastResetAt).toISOString().split('T')[0]
  );

  const lastReset = new Date(habit.lastResetAt);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - lastReset.getTime());
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const handleReset = async () => {
    if (confirm(`Are you sure you want to reset "${habit.name}" to 0?`)) {
      setIsResetting(true);
      const res = await resetHabit(habit.id);
      if (res.success) {
        toast.success(`${habit.name} has been reset. Stay strong!`);
      } else {
        toast.error('Failed to reset habit.');
      }
      setIsResetting(false);
    }
  };

  const handleUpdate = async () => {
    const res = await updateHabit(habit.id, editName, new Date(editDate));
    if (res.success) {
      toast.success('Monitor configuration updated.');
      setIsEditing(false);
    } else {
      toast.error('Update failed.');
    }
  };

  if (isEditing) {
    return (
      <div className="relative bg-zinc-950 px-8 py-4 border-2 border-red-900/50 shadow-2xl h-full flex items-center gap-4 group animate-in fade-in zoom-in duration-300">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1 text-xs text-zinc-200 focus:border-red-500 outline-none"
          />
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 px-3 py-1 text-xs text-zinc-400 focus:border-red-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdate}
            className="p-2 text-green-500 hover:bg-green-500/10 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-zinc-500 hover:bg-zinc-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative caution stripes for edit mode */}
        <div className="absolute top-0 left-0 h-full w-1 bg-red-600/50" />
      </div>
    );
  }

  return (
    <div className="relative bg-zinc-950 px-8 py-4 border-2 border-zinc-800 shadow-2xl overflow-hidden h-full flex items-center justify-between group">
      {/* Hazard Stripes Left & Right */}
      <div className="absolute top-0 left-0 h-full w-2 bg-[repeating-linear-gradient(0deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)] opacity-50" />
      <div className="absolute top-0 right-0 h-full w-2 bg-[repeating-linear-gradient(0deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)] opacity-50" />

      {/* Left: Habit Name */}
      <div className="flex-1 flex items-center gap-4">
        <h3 className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">
          Monitor Tag: <span className="text-zinc-300 ml-2">{habit.name}</span>
        </h3>
      </div>

      {/* Center: Digital Counter */}
      <div className="flex-[2] flex justify-center items-center gap-4">
        <div className="relative bg-zinc-900 rounded border border-zinc-800 px-6 py-1 inline-block">
          <span className="text-4xl font-mono font-bold text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            {String(days).padStart(3, '0')}
          </span>
        </div>
        <p className="text-zinc-500 uppercase tracking-tighter text-[10px] font-black leading-tight max-w-[80px]">
          Days Without An Accident
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex-1 flex justify-end items-center gap-4">
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-2 text-[9px] uppercase font-bold text-zinc-700 hover:text-red-500 transition-colors group/btn"
        >
          <RefreshCcw
            className={`w-3 h-3 ${isResetting ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`}
          />
          Reset
        </button>

        <div className="h-4 w-[1px] bg-zinc-800 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-zinc-700 hover:text-zinc-300 transition-colors"
            title="Edit Monitor"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1.5 text-zinc-900 hover:text-red-900 transition-colors"
            title="Decommission"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Decorative Screws */}
      <div className="absolute top-1 left-4 w-1 h-1 rounded-full bg-zinc-800 opacity-30" />
      <div className="absolute top-1 right-4 w-1 h-1 rounded-full bg-zinc-800 opacity-30" />
      <div className="absolute bottom-1 left-4 w-1 h-1 rounded-full bg-zinc-800 opacity-30" />
      <div className="absolute bottom-1 right-4 w-1 h-1 rounded-full bg-zinc-800 opacity-30" />
    </div>
  );
}

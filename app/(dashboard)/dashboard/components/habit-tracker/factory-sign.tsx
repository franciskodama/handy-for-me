'use client';

import { Habit } from '@/lib/types';
import { resetHabit } from '@/lib/actions/habits';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function FactorySign({ habit }: { habit: Habit }) {
  const [isResetting, setIsResetting] = useState(false);
  
  // Calculate days using native JS Math
  const lastReset = new Date(habit.lastResetAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastReset.getTime());
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

  return (
    <div className="relative bg-zinc-950 p-6 rounded-lg border-2 border-zinc-800 shadow-2xl overflow-hidden min-h-[220px] flex flex-col justify-between group">
      {/* Hazard Stripes Top */}
      <div className="absolute top-0 left-0 w-full h-3 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)] opacity-80" />
      
      <div className="mt-4 text-center">
        <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">
          {habit.name}
        </h3>
        
        <div className="flex items-center justify-center gap-1">
          {/* Digital Counter Background */}
          <div className="relative bg-zinc-900 rounded-md p-4 border border-zinc-800 inline-block min-w-[120px]">
            <span className="text-6xl sm:text-7xl font-mono font-bold text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              {days}
            </span>
          </div>
        </div>
        
        <p className="text-zinc-400 uppercase tracking-tighter text-sm mt-4 font-black">
          Days Without An Accident
        </p>
      </div>

      {/* Footer / Reset Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-600 hover:text-red-500 transition-colors"
        >
          <RefreshCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
          Reset Counter
        </button>
      </div>

      {/* Decorative Screws */}
      <div className="absolute top-5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
      <div className="absolute top-5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
    </div>
  );
}

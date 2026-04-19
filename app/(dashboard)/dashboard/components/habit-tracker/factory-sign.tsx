'use client';

import { Habit } from '@/lib/types';
import { resetHabit, updateHabit } from '@/lib/actions/habits';
import { toast } from 'sonner';
import { RefreshCcw, Settings, Trash2, X, Check } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
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
  const [editTargetDate, setEditTargetDate] = useState(
    habit.targetDate
      ? new Date(habit.targetDate).toISOString().split('T')[0]
      : ''
  );

  const lastReset = new Date(habit.lastResetAt);
  const now = new Date();

  let finalMonths =
    (now.getFullYear() - lastReset.getFullYear()) * 12 +
    now.getMonth() -
    lastReset.getMonth();
  let tempDate = new Date(lastReset);
  tempDate.setMonth(tempDate.getMonth() + finalMonths);

  if (tempDate > now) {
    finalMonths--;
    tempDate = new Date(lastReset);
    tempDate.setMonth(tempDate.getMonth() + finalMonths);
  }

  const diffTime = Math.max(0, now.getTime() - tempDate.getTime());
  const finalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Goal calculation
  const targetDate = habit.targetDate ? new Date(habit.targetDate) : null;
  let remainingMonths = 0;
  let remainingDays = 0;
  let hasReachedGoal = false;

  if (targetDate) {
    if (now >= targetDate) {
      hasReachedGoal = true;
    } else {
      remainingMonths =
        (targetDate.getFullYear() - now.getFullYear()) * 12 +
        targetDate.getMonth() -
        now.getMonth();
      let rTempDate = new Date(now);
      rTempDate.setMonth(rTempDate.getMonth() + remainingMonths);

      if (rTempDate > targetDate) {
        remainingMonths--;
        rTempDate = new Date(now);
        rTempDate.setMonth(rTempDate.getMonth() + remainingMonths);
      }

      const rDiffTime = Math.max(0, targetDate.getTime() - rTempDate.getTime());
      remainingDays = Math.ceil(rDiffTime / (1000 * 60 * 60 * 24));
    }
  }

  const onResetConfirm = async () => {
    setIsResetting(true);
    const res = await resetHabit(habit.id);
    if (res.success) {
      toast.success(`${habit.name} has been reset. Stay strong!`);
    } else {
      toast.error('Failed to reset habit.');
    }
    setIsResetting(false);
  };

  const handleUpdate = async () => {
    const res = await updateHabit(
      habit.id,
      editName,
      new Date(editDate),
      editTargetDate ? new Date(editTargetDate) : null
    );
    if (res.success) {
      toast.success('Monitor configuration updated.');
      setIsEditing(false);
    } else {
      toast.error('Update failed.');
    }
  };

  if (isEditing) {
    return (
      <div className="relative bg-zinc-950 px-8 py-1 border-2 border-red-900/50 shadow-2xl h-full flex items-center gap-4 group animate-in fade-in zoom-in duration-300">
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
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="bg-zinc-900 border border-zinc-700 px-3 py-1 text-[10px] text-zinc-400 focus:border-red-500 outline-none w-28 cursor-pointer"
            title="Start Date"
          />
          <input
            type="date"
            value={editTargetDate}
            onChange={(e) => setEditTargetDate(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="bg-zinc-900 border border-zinc-700 px-3 py-1 text-[10px] text-zinc-400 focus:border-red-500 outline-none w-28 cursor-pointer"
            placeholder="Goal Date"
            title="Goal Date (Optional)"
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
    <div className="relative bg-zinc-950 px-8 py-0.5 border-2 border-zinc-800 shadow-2xl overflow-hidden h-full flex items-center justify-between group">
      {/* Hazard Stripes Left & Right */}
      <div className="absolute top-0 left-0 h-full w-2 bg-[repeating-linear-gradient(0deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)] opacity-50" />
      <div className="absolute top-0 right-0 h-full w-2 bg-[repeating-linear-gradient(0deg,#fbbf24,#fbbf24_10px,#000_10px,#000_20px)] opacity-50" />

      {/* Left: Habit Name */}
      <div className="flex-1 flex items-center gap-4">
        <h3 className="text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-bold">
          Monitor Tag: <span className="text-zinc-300 ml-2">{habit.name}</span>
        </h3>
      </div>

      {/* Center: Digital Counter */}
      <div className="flex-[2] flex justify-center items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="bg-zinc-900 rounded border border-zinc-800 px-2 py-0 flex items-baseline">
            <span className="text-xl font-mono font-bold text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              {String(finalMonths).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold ml-1 uppercase tracking-tighter">
              m
            </span>
          </div>
          <div className="bg-zinc-900 rounded border border-zinc-800 px-2 py-0 flex items-baseline">
            <span className="text-xl font-mono font-bold text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              {String(finalDays).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold ml-1 uppercase tracking-tighter">
              d
            </span>
          </div>
        </div>
        {targetDate ? (
          <div className="flex">
            <p className="text-zinc-400 uppercase tracking-wider text-sm font-black leading-none mb-1">
              {hasReachedGoal ? 'Goal Status' : 'Time to Goal'}
            </p>
            <p
              className={`ml-8 uppercase tracking-wider text-sm font-black leading-none ${hasReachedGoal ? 'text-green-500' : 'text-zinc-400'}`}
            >
              {hasReachedGoal
                ? 'MISSION COMPLETE'
                : `${remainingMonths}M ${remainingDays}D REMAINING`}
            </p>
          </div>
        ) : (
          <p className="text-zinc-400 w-[20ch] uppercase tracking-wider text-xs font-black leading-none">
            Without an accident
          </p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex-1 flex justify-end items-center gap-3 mr-12">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isResetting}
              className="flex items-center gap-2 text-xs uppercase font-bold text-zinc-400 hover:text-red-500 transition-colors group/btn"
              title="Reset Monitor"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isResetting ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`}
              />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="uppercase tracking-widest font-black text-sm">
                Confirm Reset
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500 text-xs">
                Are you sure you want to reset the{' '}
                <span className="text-red-500 font-bold uppercase">
                  "{habit.name}"
                </span>{' '}
                monitor? This will reset the counter to zero.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 uppercase text-[10px] font-bold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onResetConfirm}
                className="bg-red-600 hover:bg-red-500 text-white uppercase text-[10px] font-black"
              >
                Execute Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-zinc-400 hover:text-zinc-300 transition-colors"
            title="Edit Monitor"
          >
            <Settings className="w-4 h-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-1.5 text-zinc-400 hover:text-red-900 transition-colors"
                title="Decommission"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="uppercase tracking-widest font-black text-sm">
                  Decommission Alert
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-500 text-xs">
                  Are you absolutely sure you want to decommission the{' '}
                  <span className="text-red-500 font-bold uppercase">
                    "{habit.name}"
                  </span>{' '}
                  monitor? This action will permanently remove all tracking
                  history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 uppercase text-[10px] font-bold">
                  Keep Active
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(habit.id)}
                  className="bg-red-600 hover:bg-red-500 text-white uppercase text-[10px] font-black"
                >
                  Decommission
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

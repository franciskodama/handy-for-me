'use client';

import { Habit } from '@/lib/types';
import SecurityShutter from './security-shutter';
import FactorySign from './factory-sign';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createHabit, deleteHabit } from '@/lib/actions/habits';
import { toast } from 'sonner';
import { tagClass } from '../cards/cards';
import { Button } from '@/components/ui/button';

export default function HabitTrackerSection({
  habits,
  uid
}: {
  habits: Habit[];
  uid: string;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [targetDate, setTargetDate] = useState('');
  const [periodStr, setPeriodStr] = useState('');

  const updatePeriod = (startStr: string, targetStr: string) => {
    if (!startStr || !targetStr) {
      setPeriodStr('');
      return;
    }
    const start = new Date(startStr);
    const target = new Date(targetStr);
    if (target <= start) {
      setPeriodStr('');
      return;
    }

    let months =
      (target.getFullYear() - start.getFullYear()) * 12 +
      target.getMonth() -
      start.getMonth();
    let tempDate = new Date(start);
    tempDate.setMonth(tempDate.getMonth() + months);

    if (tempDate > target) {
      months--;
      tempDate = new Date(start);
      tempDate.setMonth(tempDate.getMonth() + months);
    }

    const diffTime = Math.max(0, target.getTime() - tempDate.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setPeriodStr(`${months}m ${days}d`);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const res = await createHabit(
      uid,
      newHabitName,
      new Date(startDate),
      targetDate ? new Date(targetDate) : undefined
    );
    if (res.success) {
      toast.success('Habit tracker deployment successful!');
      setNewHabitName('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setTargetDate('');
      setIsAdding(false);
    } else {
      toast.error('Deployment failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Decommission this tracker? All history will be lost.')) {
      const res = await deleteHabit(id);
      if (res.success) {
        toast.success('Tracker decommissioned.');
      }
    }
  };

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-2">
        {/* <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400"> */}
        <h2 className="p-1 px-2 text-primary text-xs font-semibold">
          Habit <span className="text-red-500">Tracker</span>
        </h2>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 px-2 text-xs text-primary font-semibold flex items-center gap-2 hover:text-red-500 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Monitor
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="mb-8 max-w-5xl">
          <div className="flex flex-col lg:flex-row items-end gap-3 p-0 rounded-lg">
            <div className="flex-[2] w-full group">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1.5 block group-focus-within:text-red-500 transition-colors">
                Habit Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Daily Meditation, No Sugar..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-500"
                autoFocus
              />
            </div>

            <div className="flex-1 w-full lg:w-auto">
              <label className="text-[10px] text-zinc-400 capitalize tracking-widest font-black mb-1.5 block">
                Deployment Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  updatePeriod(e.target.value, targetDate);
                }}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2 text-sm focus:outline-none focus:border-red-600/50 text-zinc-200 cursor-pointer hover:bg-zinc-900 transition-all"
              />
            </div>

            <div className="flex-1 w-full lg:w-auto">
              <label className="text-[10px] text-zinc-400 capitalize tracking-widest font-black mb-1.5 block">
                Target Milestone
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  updatePeriod(startDate, e.target.value);
                }}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2 text-sm focus:outline-none focus:border-red-600/50 text-zinc-200 cursor-pointer hover:bg-zinc-900 transition-all"
              />
            </div>

            <div className="flex gap-2 w-full lg:w-[360px] lg:shrink-0 mt-2 lg:mt-0 items-center">
              <Button type="submit" variant="outline">
                Initialize Monitor
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-xs font-black uppercase px-8 h-[38px] transition-all"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              {periodStr && (
                <div className="flex items-center gap-2 px-3 border-l border-zinc-800 h-[38px] animate-in fade-in slide-in-from-left-1 duration-300">
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none whitespace-nowrap">
                    Goal <br />
                    <span className="text-zinc-500 text-xs">{periodStr}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {habits.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 bg-zinc-900/10">
          <p className="text-zinc-600 uppercase text-xs font-bold tracking-widest">
            No Active Monitors
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 text-red-500/50 hover:text-red-500 text-xs uppercase font-black transition-colors"
          >
            Initialize First Tracker
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map((habit, index) => (
            <div key={habit.id} className="relative w-full">
              <SecurityShutter
                label={`STREAK MONITOR #${String(index + 1).padStart(2, '0')}`}
              >
                <FactorySign habit={habit} onDelete={handleDelete} />
              </SecurityShutter>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

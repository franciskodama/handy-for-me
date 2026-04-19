'use client';

import { Habit } from '@/lib/types';
import SecurityShutter from './security-shutter';
import FactorySign from './factory-sign';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createHabit, deleteHabit } from '@/lib/actions/habits';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      toast.error('Please specify a habit designation.');
      return;
    }

    setIsPending(true);
    try {
      const res = await createHabit(
        uid,
        newHabitName,
        new Date(startDate),
        targetDate ? new Date(targetDate) : undefined
      );
      if (res.success) {
        toast.success(`Monitor "${newHabitName}" deployed successfully!`);
        setNewHabitName('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setTargetDate('');
        setIsAdding(false);
        router.refresh();
      } else {
        toast.error('Deployment failed: System error.');
      }
    } catch (err) {
      toast.error('Critical failure in deployment sequence.');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteHabit(id);
    if (res.success) {
      toast.success('Tracker decommissioned.');
    }
  };

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-4 relative">
        <h2 className="text-primary text-sm font-semibold">
          Habit <span className="text-red-500">Tracker</span>
        </h2>

        {habits.length === 0 && !isAdding && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <p className="text-zinc-600 uppercase text-[10px] font-bold tracking-widest opacity-50">
              No active monitors
            </p>
          </div>
        )}

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-1 text-xs text-primary font-semibold flex items-center gap-2 hover:text-red-500 transition-colors"
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
              <label className="text-xs text-zinc-400 capitalize mb-1.5 block">
                Habit Designation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Daily Meditation, No Sugar..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-600"
                autoFocus
              />
            </div>

            <div className="flex-1 w-full lg:w-auto">
              <label className="text-xs text-zinc-400 capitalize mb-1.5 block">
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
              <label className="text-xs text-zinc-400 capitalize mb-1.5 block">
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
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                className="flex-1 lg:flex-none border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white uppercase font-black text-xs h-[38px] transition-all"
              >
                {isPending ? 'Deploying...' : 'Initialize'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                className="text-xs font-black uppercase px-8 h-[38px] transition-all text-zinc-500 hover:text-red-500"
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
    </div>
  );
}

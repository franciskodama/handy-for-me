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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const res = await createHabit(uid, newHabitName, new Date(startDate));
    if (res.success) {
      toast.success('Habit tracker deployment successful!');
      setNewHabitName('');
      setStartDate(new Date().toISOString().split('T')[0]);
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
          Streak <span className="text-red-500">Monitors</span>
        </h2>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 px-2 text-xs text-primary font-semibold flex items-center gap-2"
        >
          <Plus className="w-3 h-3" />
          {isAdding ? 'Cancel' : 'New Monitor'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="mb-8 px-2 max-w-lg">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. Sugar, Social Media, ..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 px-4 py-2 text-sm focus:outline-none focus:border-red-500"
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-4 py-2 text-sm focus:outline-none focus:border-red-500 text-zinc-400"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase px-6 py-2 transition-colors"
              >
                Deploy
              </button>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-tight">
            Set start date (default is today)
          </p>
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
        <div className="flex flex-col gap-4">
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

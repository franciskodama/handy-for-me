'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { YearPromise } from '@/lib/types';
import {
  addYearPromise,
  updateYearPromiseQuarter,
  updateYearPromiseProgress,
  deleteYearPromise
} from '@/lib/actions/promises';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import Help from '@/components/common/Help';
import ExplanationPromises from './explanation-promises';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { QuarterColumn } from './quarter-column';
import { PromiseCard } from './promise-card';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export default function PromisesView({
  uid,
  initialPromises
}: {
  uid: string;
  initialPromises: YearPromise[];
}) {
  const [promises, setPromises] = useState<YearPromise[]>(initialPromises);
  const [openAction, setOpenAction] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [quarterInput, setQuarterInput] = useState<string>('Q1');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleAddPromise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const result = await addYearPromise(uid, titleInput, quarterInput);
    if (result) {
      setPromises([result as YearPromise, ...promises]);
      setTitleInput('');
      toast({
        title: 'Promise Created! ✨',
        description: `"${titleInput}" has been added to ${quarterInput}.`,
        variant: 'success'
      });
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const overQuarter = QUARTERS.find((q) => q === overId);

    // Find active promise
    const activePromise = promises.find((p) => p.id === activeId);
    if (!activePromise) return;

    // If dragging over a quarter column
    if (overQuarter && activePromise.quarter !== overQuarter) {
      setPromises((prev) =>
        prev.map((p) =>
          p.id === activeId ? { ...p, quarter: overQuarter } : p
        )
      );
    }

    // If dragging over another promise
    const overPromise = promises.find((p) => p.id === overId);
    if (overPromise && activePromise.quarter !== overPromise.quarter) {
      setPromises((prev) =>
        prev.map((p) =>
          p.id === activeId ? { ...p, quarter: overPromise.quarter } : p
        )
      );
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activePromise = promises.find((p) => p.id === activeId);
    if (!activePromise) return;

    // Persist to DB
    await updateYearPromiseQuarter(activeId, activePromise.quarter);

    if (activeId !== overId) {
      setPromises((items) => {
        const oldIndex = items.findIndex((i) => i.id === activeId);
        const newIndex = items.findIndex((i) => i.id === overId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateProgress = async (id: string, newProgress: number) => {
    const oldPromise = promises.find((p) => p.id === id);
    if (!oldPromise) return;

    // Optimistic update
    setPromises((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, progress: newProgress, done: newProgress === 100 }
          : p
      )
    );

    const result = await updateYearPromiseProgress(id, newProgress);

    if (newProgress === 100 && oldPromise.progress < 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: 'Achievement Unlocked! 🏆',
        description: `Congratulations! You've fulfilled your promise.`,
        variant: 'success'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteYearPromise(id);
    if (success) {
      setPromises((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: 'Promise deleted',
        description: 'Your promise has been removed from the roadmap.'
      });
    }
  };

  const activePromise = activeId
    ? promises.find((p) => p.id === activeId)
    : null;

  return (
    <Card className="min-h-[80vh]">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between items-start mb-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p>Promises for the Year</p>
              <div className="block sm:hidden">
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">M</span>ap your journey, quarter by
              quarter.
            </p>
          </div>

          <form
            onSubmit={handleAddPromise}
            className={`${barlow.className} font-normal flex flex-col sm:flex-row gap-4 mt-6 sm:mt-0 w-full sm:w-auto`}
          >
            <Input
              placeholder="What's your promise?"
              className="sm:w-[300px]"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              maxLength={50}
            />
            <Select value={quarterInput} onValueChange={setQuarterInput}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent>
                {QUARTERS.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Add</Button>
          </form>

          <div className="hidden sm:block">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {openAction && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <ExplanationPromises setOpenAction={setOpenAction} />
            </motion.div>
          )}
        </AnimatePresence>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {QUARTERS.map((quarter) => (
              <QuarterColumn
                key={quarter}
                id={quarter}
                title={quarter}
                promises={promises.filter((p) => p.quarter === quarter)}
                updateProgress={updateProgress}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activePromise ? (
              <PromiseCard promise={activePromise} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  );
}

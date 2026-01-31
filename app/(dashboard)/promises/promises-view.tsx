'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
import { Printer } from 'lucide-react';

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
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [promises, setPromises] = useState<YearPromise[]>(initialPromises);
  const [openAction, setOpenAction] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [quarterInput, setQuarterInput] = useState<string>('Q1');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!boardRef.current) return;

    try {
      const canvas = await html2canvas(boardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const header = clonedDoc.getElementById('pdf-header');
          if (header) header.style.display = 'block';

          const board = clonedDoc.getElementById('promises-board');
          if (board) {
            board.style.padding = '40px';
            board.style.background = 'white';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Yearly-Promises-${selectedYear}.pdf`);

      toast({
        title: 'PDF Generated! 📄',
        description: 'Your roadmap is ready to print.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Generation Failed 🚨',
        description: 'Could not create PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2
  ];

  const filteredPromises = promises.filter((p) => p.year === selectedYear);

  const yearProgress =
    filteredPromises.length > 0
      ? Math.round(
          filteredPromises.reduce((acc, p) => acc + p.progress, 0) /
            filteredPromises.length
        )
      : 0;

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
    if (!titleInput.trim() || isAdding) return;

    setIsAdding(true);
    try {
      console.log('Adding promise:', {
        titleInput,
        quarterInput,
        selectedYear
      });
      const result = await addYearPromise(
        uid,
        titleInput,
        quarterInput,
        selectedYear
      );

      if (result) {
        console.log('Promise added successfully:', result);
        setPromises((prev) => [result as YearPromise, ...prev]);
        setTitleInput('');
        toast({
          title: 'Promise Created! ✨',
          description: `"${titleInput}" has been added to ${quarterInput} ${selectedYear}.`,
          variant: 'success'
        });
      } else {
        console.error('Failed to add promise: Server returned null');
        toast({
          title: 'Failed to create promise',
          description:
            'The server could not save your promise. Please check the logs.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error in handleAddPromise:', error);
      toast({
        title: 'Unexpected Error',
        description: 'An error occurred while adding your promise.',
        variant: 'destructive'
      });
    } finally {
      setIsAdding(false);
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
              <p>Yearly Promises</p>
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

          <div
            className={`${barlow.className} flex gap-4 capitalize mt-8 sm:mt-0`}
          >
            <form
              onSubmit={handleAddPromise}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-2 font-normal"
            >
              <div className="flex flex-col gap-1 w-full sm:w-[30ch]">
                <Input
                  placeholder="What's your promise?"
                  className="w-full"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">P</span>romise for {selectedYear}
                </p>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-[15ch]">
                <Select value={quarterInput} onValueChange={setQuarterInput}>
                  <SelectTrigger className="w-full">
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
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">W</span>hen will you start?
                </p>
              </div>

              <Button type="submit" className="ml-2" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </form>
          </div>

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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          {/* Progress Bar Side */}
          <div className="flex flex-col w-full sm:w-[45%] gap-1.5">
            <div className="flex justify-between items-end">
              <p
                className={`${barlow.className} text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground`}
              >
                Yearly Momentum
              </p>
              <p
                className={`${kumbh_sans.className} text-xl font-bold leading-none`}
              >
                {yearProgress}%
              </p>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${yearProgress}%` }}
                className="h-full bg-primary"
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <p
              className={`${barlow.className} text-xs text-muted-foreground lowercase`}
            >
              Showing results for
            </p>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
            >
              <SelectTrigger className="w-[120px] h-9 font-bold bg-muted/50 border-none shadow-none focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="h-9 px-3 text-xs font-semibold gap-2 border-primary/20 hover:bg-primary hover:text-white transition-all ml-2"
            >
              <Printer size={14} />
              Download PDF
            </Button>
          </div>
        </div>

        <div id="promises-board" ref={boardRef} className="">
          <div
            id="pdf-header"
            style={{ display: 'none' }}
            className="mb-8 text-center"
          >
            <h1
              className={`${kumbh_sans.className} text-4xl font-bold uppercase tracking-tighter text-primary`}
            >
              Yearly Promises — {selectedYear}
            </h1>
            <p className={`${barlow.className} text-muted-foreground mt-2`}>
              Strategic roadmap with {yearProgress}% completion — A year of
              growth and achievement.
            </p>
          </div>
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
                  promises={filteredPromises.filter(
                    (p) => p.quarter === quarter
                  )}
                  updateProgress={updateProgress}
                  onDelete={handleDelete}
                  isCurrentYear={selectedYear === currentYear}
                />
              ))}
            </div>

            <DragOverlay>
              {activePromise ? (
                <PromiseCard promise={activePromise} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  );
}

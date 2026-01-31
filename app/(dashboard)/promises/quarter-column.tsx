'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { YearPromise } from '@/lib/types';
import { PromiseCard } from './promise-card';
import { kumbh_sans } from '@/app/ui/fonts';

export function QuarterColumn({
  id,
  title,
  promises,
  updateProgress,
  onDelete,
  isCurrentYear
}: {
  id: string;
  title: string;
  promises: YearPromise[];
  updateProgress?: (id: string, progress: number) => void;
  onDelete?: (id: string) => void;
  isCurrentYear?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id
  });

  const getActiveQuarter = () => {
    const month = new Date().getMonth(); // 0-11
    if (month < 3) return 'Q1';
    if (month < 6) return 'Q2';
    if (month < 9) return 'Q3';
    return 'Q4';
  };

  const isActive = isCurrentYear && title === getActiveQuarter();

  return (
    <div
      className={`flex flex-col gap-4 p-4 bg-muted/30 border-2 transition-colors ${isActive ? 'border-primary/50 bg-primary/5' : 'border-transparent'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`${kumbh_sans.className} font-bold text-lg uppercase`}>
          {title}
          {isActive && (
            <span className="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 lowercase font-normal">
              Current
            </span>
          )}
        </h3>
        <span className="text-xs text-muted-foreground">
          {promises.length} items
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 min-h-[200px] flex flex-col gap-3"
      >
        <SortableContext
          items={promises.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {promises.map((promise) => (
            <PromiseCard
              key={promise.id}
              promise={promise}
              updateProgress={updateProgress}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

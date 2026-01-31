'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, CheckCircle2 } from 'lucide-react';
import { YearPromise } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

export function PromiseCard({
  promise,
  isOverlay,
  updateProgress,
  onDelete
}: {
  promise: YearPromise;
  isOverlay?: boolean;
  updateProgress?: (id: string, progress: number) => void;
  onDelete?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: promise.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const segments = [25, 50, 75, 100];

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[100px] bg-muted/20 border-2 border-dashed border-primary/20"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-background border p-4 shadow-sm transition-all hover:shadow-md',
        promise.done && 'border-green-500/50 bg-green-50/5',
        isOverlay && 'shadow-xl border-primary z-50 cursor-grabbing'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <p
            className={cn(
              'text-sm font-semibold uppercase leading-tight',
              promise.done && 'line-through text-muted-foreground'
            )}
          >
            {promise.title}
          </p>

          <div className="flex items-center gap-1 mt-2">
            {segments.map((val) => (
              <button
                key={val}
                onClick={() => {
                  if (val === 25 && promise.progress === 25) {
                    updateProgress?.(promise.id, 0);
                  } else {
                    updateProgress?.(promise.id, val);
                  }
                }}
                className={cn(
                  'h-2 flex-1 transition-all duration-300',
                  val <= promise.progress
                    ? promise.done
                      ? 'bg-green-500'
                      : 'bg-primary'
                    : 'bg-muted hover:bg-muted-foreground/30'
                )}
                title={`${val}%`}
              />
            ))}
            <span className="text-[10px] ml-2 font-mono text-muted-foreground min-w-[30px]">
              {promise.progress}%
            </span>
          </div>
        </div>

        {!isOverlay && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this promise?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove "{promise.title}" from your
                  roadmap.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete?.(promise.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {promise.done && !isOverlay && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-green-600">
          <CheckCircle2 size={12} className="animate-in zoom-in duration-300" />
          <span className="text-[9px] font-bold uppercase">Done</span>
        </div>
      )}
    </div>
  );
}

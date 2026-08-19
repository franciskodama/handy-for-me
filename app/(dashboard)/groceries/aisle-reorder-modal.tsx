'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Check,
  Footprints,
  Info,
  ThermometerSnowflake
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DEFAULT_CATEGORY_ORDER,
  saveCategoryOrder,
  GROCERY_CATEGORIES,
  GroceryCategory
} from '@/lib/groceries.utils';
import { GroceryItem } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface SortableAisleItemProps {
  id: string;
  index: number;
  category: GroceryCategory;
  itemCount: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SortableAisleItem({
  id,
  index,
  category,
  itemCount,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown
}: SortableAisleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const isFrozen = category.name === 'Frozen';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        isDragging
          ? 'bg-primary/10 border-primary shadow-lg z-20 opacity-95 scale-[1.02]'
          : 'bg-card hover:bg-muted/40 border-border'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
          title="Drag to reorder aisle"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Aisle Number Badge */}
        <span
          className="w-16 flex-shrink-0 text-xs font-bold px-2 py-1 rounded text-center border"
          style={{
            backgroundColor: category.bgColor,
            color: category.textColor,
            borderColor: category.borderColor
          }}
        >
          Aisle {index + 1}
        </span>

        {/* Department Name & Details */}
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-sm text-foreground truncate">
            {category.label}
          </span>
          {isFrozen && (
            <span title="Suggested near checkout">
              <ThermometerSnowflake className="h-3.5 w-3.5 text-cyan-500" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        {itemCount > 0 ? (
          <Badge variant="secondary" className="text-[11px] font-bold px-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Badge>
        ) : (
          <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">
            Empty
          </span>
        )}

        {/* Up / Down Arrow Controls for quick mobile taps */}
        <div className="flex items-center ml-1 bg-muted/60 rounded border border-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
            title="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
            title="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AisleReorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uid?: string;
  categoryOrder: string[];
  activeItems: GroceryItem[];
  onOrderSaved: (newOrder: string[]) => void;
}

export default function AisleReorderModal({
  open,
  onOpenChange,
  uid,
  categoryOrder,
  activeItems,
  onOrderSaved
}: AisleReorderModalProps) {
  const [localOrder, setLocalOrder] = useState<string[]>(categoryOrder);

  useEffect(() => {
    setLocalOrder(categoryOrder);
  }, [categoryOrder, open]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localOrder.length) return;
    setLocalOrder((items) => arrayMove(items, index, targetIndex));
  };

  const handleResetDefault = () => {
    setLocalOrder(DEFAULT_CATEGORY_ORDER);
    toast({
      title: 'Reset to Standard Supermarket Layout',
      description: 'Produce at entrance, Frozen & Care near checkout.',
      variant: 'default'
    });
  };

  const handleSave = () => {
    saveCategoryOrder(localOrder, uid);
    onOrderSaved(localOrder);
    onOpenChange(false);
    toast({
      title: 'Supermarket Route Updated! 🛒✨',
      description: 'Your grocery aisles are now arranged for your walk.',
      variant: 'success'
    });
  };

  // Count items per category
  const itemCountsByCat = activeItems.reduce(
    (acc, item) => {
      const cat = item.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Footprints className="h-5 w-5 text-primary" />
            Arrange Your Supermarket Route
          </DialogTitle>
          <DialogDescription className="text-xs">
            Drag aisles or use the arrows to match the exact order you walk
            through your supermarket. In-Store Mode will follow this route.
          </DialogDescription>
        </DialogHeader>

        {/* Tip Banner */}
        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300 flex items-start gap-2">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
          <span>
            <strong>Pro Tip:</strong> Keep <strong>Frozen</strong> &amp;{' '}
            <strong>Dairy</strong> near the end so cold items stay chilled until
            you reach checkout!
          </span>
        </div>

        {/* Sortable List Area */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 flex flex-col gap-2 min-h-[300px]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localOrder}
              strategy={verticalListSortingStrategy}
            >
              {localOrder.map((catName, index) => {
                const categoryObj =
                  GROCERY_CATEGORIES.find((c) => c.name === catName) || {
                    name: catName,
                    label: `🛒 ${catName}`,
                    color: '#6b7280',
                    bgColor: '#f9fafb',
                    borderColor: '#e5e7eb',
                    textColor: '#374151',
                    order: index + 1
                  };
                const count = itemCountsByCat[catName] || 0;

                return (
                  <SortableAisleItem
                    key={catName}
                    id={catName}
                    index={index}
                    category={categoryObj}
                    itemCount={count}
                    isFirst={index === 0}
                    isLast={index === localOrder.length - 1}
                    onMoveUp={() => moveItem(index, 'up')}
                    onMoveDown={() => moveItem(index, 'down')}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t pt-3 mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetDefault}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-9"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Standard
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="text-xs font-semibold gap-1.5 h-9 bg-primary text-primary-foreground"
            >
              <Check className="h-4 w-4" />
              Save Route
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

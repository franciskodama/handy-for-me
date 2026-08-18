'use client';

import React from 'react';
import { Check, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GROCERY_CATEGORIES, GroceryCategory } from '@/lib/groceries.utils';
import { GroceryItem } from '@/lib/types';

interface AisleQuickNavProps {
  groupedDepartments: {
    category: GroceryCategory;
    items: GroceryItem[];
  }[];
  onOpenReorderModal: () => void;
}

export default function AisleQuickNav({
  groupedDepartments,
  onOpenReorderModal
}: AisleQuickNavProps) {
  if (groupedDepartments.length <= 1) return null;

  const scrollToAisle = (categoryName: string) => {
    const id = `aisle-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-2 z-20 w-full bg-background/90 backdrop-blur-md p-2 rounded-xl border border-border/80 shadow-md">
      <div className="flex items-center justify-between gap-2">
        {/* Horizontal Scrollable Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth flex-1 mask-fade-edges">
          {groupedDepartments.map(({ category, items }, index) => {
            const remainingCount = items.filter((i) => !i.inCart).length;
            const isCompleted = remainingCount === 0;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => scrollToAisle(category.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80 opacity-75'
                    : 'bg-card hover:bg-accent/60 text-foreground border-border shadow-xs hover:scale-105 active:scale-95'
                }`}
                title={`Jump to Aisle ${index + 1}: ${category.name}`}
              >
                <span className="text-xs">{category.label.split(' ')[0]}</span>
                <span className="truncate max-w-[90px]">{category.name}</span>

                {isCompleted ? (
                  <span className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                ) : (
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 py-0 text-[10px] font-bold bg-muted-foreground/15 text-foreground rounded-full"
                  >
                    {remainingCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Rearrange Trigger Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenReorderModal}
          className="h-8 px-2.5 text-xs font-semibold gap-1.5 shrink-0 bg-card hover:bg-muted/80 border-border"
          title="Rearrange walking order of aisles"
        >
          <Footprints className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Aisle Route</span>
        </Button>
      </div>
    </div>
  );
}

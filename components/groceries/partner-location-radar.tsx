'use client';

import React from 'react';
import {
  MapPin,
  ShoppingCart,
  UserCheck,
  Compass,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { GroceryItem } from '@/lib/types';
import { GROCERY_CATEGORIES, GroceryCategory } from '@/lib/groceries.utils';
import {
  getPartnerLocationsFromItems,
  PartnerLocationInfo
} from '@/lib/location-tracker.utils';

interface PartnerLocationRadarProps {
  activeItems: GroceryItem[];
  currentUserName: string;
  currentUserImage?: string | null;
  householdMembers?: Array<{ id?: string; uid?: string; name?: string | null; avatar?: string | null }>;
  parkedCartCategory: string | null;
  onSetParkedCartCategoryAction: (categoryName: string | null) => void;
  categories: GroceryCategory[];
}

function PartnerAvatar({
  userName,
  isSelf,
  categoryColor,
  currentUserImage,
  householdMembers
}: {
  userName: string;
  isSelf: boolean;
  categoryColor: string;
  currentUserImage?: string | null;
  householdMembers?: Array<{ id?: string; uid?: string; name?: string | null; avatar?: string | null }>;
}) {
  const [hasError, setHasError] = React.useState(false);

  let avatarUrl: string | null | undefined = null;

  if (isSelf && currentUserImage) {
    avatarUrl = currentUserImage;
  }

  if (!avatarUrl && householdMembers && householdMembers.length > 0) {
    const member = householdMembers.find(
      (m) =>
        (m.name && m.name.toLowerCase() === userName.toLowerCase()) ||
        (m.uid && m.uid.toLowerCase() === userName.toLowerCase()) ||
        (isSelf && m.name && m.name.toLowerCase().includes(userName.toLowerCase()))
    );
    if (member?.avatar) {
      avatarUrl = member.avatar;
    }
  }

  if (avatarUrl && !hasError) {
    return (
      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 shadow-xs ring-2 ring-emerald-500/40">
        <img
          src={avatarUrl}
          alt={userName}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ring-1 ring-white/20"
      style={{ backgroundColor: categoryColor }}
    >
      {userName.charAt(0).toUpperCase()}
    </div>
  );
}

export default function PartnerLocationRadar({
  activeItems,
  currentUserName,
  currentUserImage,
  householdMembers,
  parkedCartCategory,
  onSetParkedCartCategoryAction,
  categories
}: PartnerLocationRadarProps) {
  const partnerLocations = getPartnerLocationsFromItems(
    activeItems,
    currentUserName
  );

  const scrollToAisle = (categoryName: string) => {
    const id = `aisle-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentCartCategoryObj = categories.find(
    (c) => c.name.toLowerCase() === parkedCartCategory?.toLowerCase()
  );

  return (
    <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/5 shadow-md overflow-hidden">
      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Compass className="h-4 w-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                Live Store Location Radar
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-medium">
                  Implicit Item Sync
                </Badge>
              </h3>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Auto-updates partner position as items are picked into the cart
              </p>
            </div>
          </div>

          {/* Cart Anchor Pin Selector */}
          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-[11px] font-semibold gap-1.5 bg-background/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-500/30"
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {currentCartCategoryObj ? (
                    <span className="truncate max-w-[110px]">
                      Cart: {currentCartCategoryObj.name}
                    </span>
                  ) : (
                    <span>Park Cart Here...</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => onSetParkedCartCategoryAction(null)}
                  className="text-xs text-muted-foreground"
                >
                  Clear Cart Anchor Pin
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.name}
                    onClick={() => onSetParkedCartCategoryAction(cat.name)}
                    className="text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>{cat.label.split(' ')[0]}</span>
                    <span className="font-medium">{cat.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Live Partner Activity Grid */}
        {partnerLocations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {partnerLocations.map((loc) => {
              const isSelf =
                loc.userName.toLowerCase() === currentUserName.toLowerCase();

              return (
                <div
                  key={loc.userName}
                  onClick={() => scrollToAisle(loc.categoryName)}
                  className="group flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/80 hover:bg-emerald-500/5 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <PartnerAvatar
                      userName={loc.userName}
                      isSelf={isSelf}
                      categoryColor={loc.categoryColor}
                      currentUserImage={currentUserImage}
                      householdMembers={householdMembers}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {isSelf ? 'You' : loc.userName}
                        </span>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 truncate">
                        {loc.categoryLabel}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        Picked <span className="italic font-medium">{loc.lastItemName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {loc.timeAgoFormatted}
                    </span>
                    <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5 mt-1 group-hover:translate-x-0.5 transition-transform">
                      Jump <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center p-3 rounded-lg border border-dashed border-border/80 bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              As you or your partner pick items in the store, your live aisle locations will automatically pop up here!
            </p>
          </div>
        )}

        {/* Current Cart Anchor Indicator if set */}
        {currentCartCategoryObj && (
          <div className="flex items-center justify-between p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Main cart is parked at{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {currentCartCategoryObj.label}
                </strong>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToAisle(currentCartCategoryObj.name)}
              className="h-6 px-2 text-[10px] font-bold text-emerald-700 hover:bg-emerald-500/20"
            >
              View Aisle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

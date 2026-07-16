'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { NavItem } from '@/components/NavItem';
import CardDivulgationHelp from '@/app/(dashboard)/dashboard/components/cards/card-divulgation-help';
import { cn } from '@/lib/utils';
import { menuGroups, NavMenuItem } from '@/lib/menu';

function groupItems(items: NavMenuItem[]) {
  const grouped: { key: string; label: string | null; items: NavMenuItem[] }[] =
    [];

  for (const group of menuGroups) {
    const groupItems = items.filter((item) => item.group === group.key);
    if (groupItems.length > 0) {
      grouped.push({ key: group.key, label: group.label, items: groupItems });
    }
  }

  // Catch any items with groups not in menuGroups (safety net)
  const knownKeys = new Set(menuGroups.map((g) => g.key));
  const ungrouped = items.filter((item) => !knownKeys.has(item.group));
  if (ungrouped.length > 0) {
    grouped.push({ key: '_other', label: 'Other', items: ungrouped });
  }

  return grouped;
}

function CollapsibleGroup({
  label,
  children,
  defaultOpen
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors"
      >
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={cn(
            'transition-transform duration-200',
            isOpen ? 'rotate-0' : '-rotate-90'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function MobileNav({ items }: { items: NavMenuItem[] }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const grouped = React.useMemo(() => groupItems(items), [items]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 text-lg font-medium">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 text-lg font-semibold md:text-base"
          >
            <Image
              src="/logos/HandyForMe_Cog200x200.png"
              alt="HandyFor.Me Logo"
              width={200}
              height={200}
              priority
            />
            <span className="sr-only">HandyFor.me</span>
          </Link>

          {grouped.map((group) => {
            // "main" group (Dashboard) — render directly, no header
            if (group.key === 'main') {
              return group.items.map((item) => (
                <SheetClose asChild key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-4 px-2.5 text-left text-muted-foreground hover:text-foreground transition-colors',
                      pathname === item.href && 'text-foreground font-semibold'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SheetClose>
              ));
            }

            // Named groups — collapsible sections
            const hasActiveItem = group.items.some(
              (item) => pathname === item.href
            );

            return (
              <CollapsibleGroup
                key={group.key}
                label={group.label!}
                defaultOpen={hasActiveItem || true}
              >
                {group.items.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-4 px-2.5 pl-4 text-left text-muted-foreground hover:text-foreground transition-colors',
                        pathname === item.href &&
                          'text-foreground font-semibold'
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </CollapsibleGroup>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function DesktopNav({ items }: { items: NavMenuItem[] }) {
  const grouped = React.useMemo(() => groupItems(items), [items]);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image
            src="/logos/HandyForMe_Cog200x200.png"
            alt="HandyFor.Me Logo"
            width={200}
            height={200}
            priority
          />
        </Link>
        {grouped.map((group, groupIndex) => (
          <React.Fragment key={group.key}>
            {/* Divider between groups (skip before the first group) */}
            {groupIndex > 0 && (
              <div className="w-8 border-t border-border/50" />
            )}
            {group.items.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label}>
                {item.icon}
              </NavItem>
            ))}
          </React.Fragment>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 cursor-pointer">
              <CardDivulgationHelp />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Need a hand?</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

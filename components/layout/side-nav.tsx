'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

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

interface NavMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  restricted?: boolean;
}

export function MobileNav({ items }: { items: NavMenuItem[] }) {
  const [open, setOpen] = React.useState(false);

  // Use useEffect to handle mounting state if needed, 
  // but standard Radix Sheet should work.
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
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
          {items.map((item) => (
            <SheetClose asChild key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-left text-muted-foreground hover:text-foreground"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function DesktopNav({ items }: { items: NavMenuItem[] }) {
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
        {items.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label}>
            {item.icon}
          </NavItem>
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

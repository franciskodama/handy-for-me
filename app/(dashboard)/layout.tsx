import Link from 'next/link';
import Image from 'next/image';
import { Analytics } from '@vercel/analytics/react';

import {
  BookA,
  Grid3x3,
  Home,
  LineChart,
  ListMinus,
  MessageCircleQuestion,
  Package,
  Package2,
  PanelLeft,
  RefreshCw,
  ShoppingCart,
  Users2,
  WholeWord
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from './header/user';
import Providers from './providers';
import PencilBanner from './header/pencil-banner';
import { DesktopNav } from './nav/nav-desktop';
import { DashboardBreadcrumb } from './header/breadcrumb';
import { SearchInput } from './header/search';
import { MobileNav } from './nav/nav-mobile';
import Greeting from './header/greeting';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex flex-col min-h-screen w-full">
        <PencilBanner />
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div>
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              {/* Wrong Mobile Nav because we want to have a separed file for it. */}
              <WrongMobileNav />
              <DashboardBreadcrumb />
              {/* <SearchInput /> */}
              <div className="flex items-center gap-8">
                <Greeting />
                <User />
              </div>
            </header>
          </div>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
            {children}
            <Toaster />
          </main>
        </div>
        {/* <Analytics /> */}
      </main>
    </Providers>
  );
}

function WrongMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Image
              src="/logos/HandyForMe_Cog200x200.png"
              alt="HandyFor.Me Logo"
              width={200}
              height={200}
            />
          </Link>
          <Link
            href="/in"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/vision-board"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Grid3x3 className="h-5 w-5" />
            Vision Board
          </Link>
          <Link
            href="/bucket-list"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <ListMinus className="h-5 w-5" />
            Bucket List
          </Link>
          <Link
            href="/spin"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-5 w-5" />
            Spin Magic
          </Link>
          <Link
            href="/my-words"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <WholeWord className="h-5 w-5" />
            My Words
          </Link>
          <Link
            href="/random-question"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <MessageCircleQuestion className="h-5 w-5" />
            Random Questions
          </Link>
          <Link
            href="/letter-leap"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BookA className="h-5 w-5" />
            Letter Leap
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

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
  Package2,
  PanelLeft,
  RefreshCw,
  Settings,
  WholeWord
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from './header/user';
import Providers from './providers';
import PencilBanner from './header/pencil-banner';
import { DashboardBreadcrumb } from './header/breadcrumb';
import { SearchInput } from './header/search';
import Greeting from './header/greeting';
import { Toaster } from '@/components/ui/toaster';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { NavItem } from './nav/nav-item';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    // <Providers>
    //   <main className="flex min-h-screen w-full flex-col bg-muted/40">
    //     <DesktopNav />
    //     <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
    //       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
    //         <MobileNav />
    //         <DashboardBreadcrumb />
    //         <SearchInput />
    //         <User />
    //       </header>
    //       <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
    //         {children}
    //       </main>
    //     </div>
    //     <Analytics />
    //   </main>
    // </Providers>
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <PencilBanner />
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div>
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <MobileNav />
              <DashboardBreadcrumb />
              {/* <SearchInput /> */}
              <div className="flex items-center gap-8">
                <Greeting />
                <User />
              </div>
            </header>
          </div>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
            <Toaster />
          </main>
        </div>
        {/* <Analytics /> */}
      </main>
    </Providers>
  );
}

function MobileNav() {
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
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">HandyFor.me</span>
          </Link>

          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="bg-primary group flex h-9 w-9 shrink-0 items-center justify-center gap-2 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <p className="text-[10px] skew-y-[-12deg]">Juvoo</p>
        </Link>
        {/* <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image
            src="/logos/HandyForMe_Cog200x200.png"
            alt="HandyFor.Me Logo"
            width={200}
            height={200}
          />
        </Link> */}

        {menuItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label}>
            {item.icon}
          </NavItem>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

const menuItems = [
  { label: 'Dashboard', href: '/in', icon: <Home className="h-5 w-5" /> },
  {
    label: 'Vision Board',
    href: '/vision-board',
    icon: <Grid3x3 className="h-5 w-5" />
  },
  {
    label: 'Bucket List',
    href: '/bucket-list',
    icon: <ListMinus className="h-5 w-5" />
  },
  {
    label: 'Spin Magic',
    href: '/spin',
    icon: <RefreshCw className="h-5 w-5" />
  },
  {
    label: 'My Words',
    href: '/my-words',
    icon: <WholeWord className="h-5 w-5" />
  },
  {
    label: 'Random Questions',
    href: '/random-question',
    icon: <MessageCircleQuestion className="h-5 w-5" />
  },
  {
    label: 'Letter Leap',
    href: '/letter-leap',
    icon: <BookA className="h-5 w-5" />
  }
  // { label: 'Artificial Intelligence', href: '/ai', icon: Bot },
  // { label: 'Products', href: '/products', icon: Ghost },
];

import Link from 'next/link';
import Image from 'next/image';

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
import { User } from '@/components/layout/header/user';
import Providers from './providers';
import PencilBanner from '@/components/layout/header/pencil-banner';
import { DashboardBreadcrumb } from '@/components/layout/header/breadcrumb';
import Greeting from '@/components/layout/header/greeting';
import { Toaster } from '@/components/ui/toaster';
import { SearchInput } from '@/components/layout/header/search';
import Footer from '@/components/layout/Footer';
import { auth } from '@/lib/auth';
import { menuItems } from '@/lib/menu';
import { MobileNav, DesktopNav } from '@/components/layout/side-nav';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const myUid = process.env.MY_UID;

  const filteredMenuItems = menuItems.filter((item: any) => {
    if (item.restricted) {
      return session?.user?.email === myUid;
    }
    return true;
  });

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <PencilBanner />
        <DesktopNav items={filteredMenuItems} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div>
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <MobileNav items={filteredMenuItems} />
              <DashboardBreadcrumb />
              {/* <SearchInput /> */}
              <div className="flex items-center gap-4 sm:gap-8">
                <Greeting />
                <User />
              </div>
            </header>
          </div>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
            <Toaster />
            <Footer />
          </main>
        </div>
      </main>
    </Providers>
  );
}

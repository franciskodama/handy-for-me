import Link from 'next/link';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@radix-ui/react-tooltip';
import { NavItem } from './nav-item';
import {
  Home,
  Dices,
  Grid3x3,
  Bot,
  Settings,
  MessageCircleQuestion,
  RefreshCw,
  BookA,
  Ghost
} from 'lucide-react';
import Image from 'next/image';

export function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[3.4em] flex-col border-r bg-background sm:flex">
      <div className="bg-primary py-[4px] border-0">.</div>
      <nav className="flex flex-col items-center gap-4 px-[5px] sm:py-5">
        <Link
          href="/"
          // className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image
            src="/logos/HandyForMe_Square200x200.png"
            alt="HandyFor.Me Logo"
            width={200}
            height={200}
          />
        </Link>

        <NavItem href="/" label="Dashboard">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/spin" label="Spin Magic">
          <RefreshCw className="h-5 w-5" />
        </NavItem>

        <NavItem href="/random-question" label="Random Questions">
          <MessageCircleQuestion className="h-5 w-5" />
        </NavItem>

        <NavItem href="/letter-leap" label="Letter Leap">
          <BookA className="h-5 w-5" />
        </NavItem>

        <NavItem href="/affirmation" label="Affirmation">
          <Grid3x3 className="h-5 w-5" />
        </NavItem>

        <NavItem href="/ai" label="Artificial Intelligence">
          <Bot className="h-5 w-5" />
        </NavItem>

        {/* <NavItem href="/products" label="Products">
          <Ghost className="h-5 w-5" />
        </NavItem> */}
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

import {
  BookA,
  Grid3x3,
  Home,
  ExternalLink,
  MessageCircleQuestion,
  Trophy,
  HandHeart,
  Flag,
  Briefcase,
  Scale,
  ListOrdered,
  Map,
  Trello
} from 'lucide-react';

export interface NavMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  group: string;
  restricted?: boolean;
}

export const menuGroups = [
  { key: 'main', label: null },
  { key: 'Productivity', label: 'Productivity' },
  { key: 'Goals & Growth', label: 'Goals & Growth' },
  { key: 'Mindset', label: 'Mindset' },
  { key: 'Fun', label: 'Fun' }
];

export const menuItems: NavMenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
    group: 'main'
  },
  {
    label: 'Kanban Board',
    href: '/kanban',
    icon: <Trello className="h-5 w-5" />,
    group: 'Productivity'
  },
  {
    label: 'Decision Helper',
    href: '/decision-helper',
    icon: <Scale className="h-5 w-5" />,
    group: 'Productivity'
  },
  {
    label: 'Shortcuts',
    href: '/shortcuts',
    icon: <ExternalLink className="h-5 w-5" />,
    group: 'Productivity'
  },
  {
    label: 'Bucket List',
    href: '/bucket-list',
    icon: <ListOrdered className="h-5 w-5" />,
    group: 'Goals & Growth'
  },
  {
    label: 'Vision Board',
    href: '/vision-board',
    icon: <Grid3x3 className="h-5 w-5" />,
    group: 'Goals & Growth'
  },
  {
    label: 'Yearly Promises',
    href: '/promises',
    icon: <Flag className="h-5 w-5" />,
    group: 'Goals & Growth'
  },
  {
    label: 'Weekly Wins',
    href: '/weekly-wins',
    icon: <Trophy className="h-5 w-5" />,
    group: 'Goals & Growth'
  },
  {
    label: 'Stoic Support',
    href: '/stoic-support',
    icon: <HandHeart className="h-5 w-5" />,
    group: 'Mindset'
  },
  {
    label: 'Random Questions',
    href: '/random-question',
    icon: <MessageCircleQuestion className="h-5 w-5" />,
    group: 'Fun'
  },
  {
    label: 'Letter Leap',
    href: '/letter-leap',
    icon: <BookA className="h-5 w-5" />,
    group: 'Fun'
  },
  {
    label: 'Atlas',
    href: '/atlas',
    icon: <Map className="h-5 w-5" />,
    group: 'Fun'
  },
  {
    label: 'Interview Practice',
    href: '/interview-practice',
    icon: <Briefcase className="h-5 w-5" />,
    group: 'Productivity',
    restricted: true
  }
  // { label: 'Artificial Intelligence', href: '/ai', icon: Bot },
];

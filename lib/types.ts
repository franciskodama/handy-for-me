import { shortcut_color_enum } from '@prisma/client';

export type UserNameEmailImage = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// export type User = {
//   id: string;
//   uid: string;
//   name?: string;
//   avatar?: string;
//   hashedPassword?: string;
//   createdAt: Date;
// };

export type DecisionHelperList = {
  uid: string;
  id: string;
  list: string;
  createdAt: Date;
  items: DecisionHelperItem[];
};

export type DecisionHelperItem = {
  uid: string;
  id: string;
  createdAt: Date;
  listId: string;
  item: string;
  selected: boolean;
};

export type DecisionHelperSubject = {
  id: string;
  createdAt: Date;
  uid: string;
  subject: string;
  items: DecisionHelperProsConsItem[];
  householdId: string | null;
};

export type DecisionHelperProsConsItem = {
  id: string;
  createdAt: Date;
  uid: string;
  content: string;
  isPro: boolean;
  weight: number;
  subjectId: string;
};

export type VisualBoardItem = {
  id: string;
  createdAt: Date;
  uid: string;
  item?: string;
  url: string;
  done: boolean;
};

export type BucketListItem = {
  id: string;
  createdAt: Date;
  uid: string;
  item: string;
  category: string;
  done: boolean;
};

export type ShortcutCategory = {
  id: string;
  createdAt: Date;
  uid: string;
  category: string;
  color: shortcut_color_enum;
  shortcuts?: Shortcut[];
};

export type Shortcut = {
  id: string;
  createdAt: Date;
  uid: string;
  shortcut: string;
  url: string;
  description: string;
  categoryId: string;
  category?: ShortcutCategory;
};

export type AddShortcutParams = {
  uid: string;
  shortcut: string;
  url: string;
  description: string;
  categoryId: string;
};

export type LocationProps = {
  city: string;
  region: string;
  country: string;
};

export type WeeklyWin = {
  id: string;
  createdAt: Date;
  uid: string;
  goal: string;
  type: string;
  done: boolean;
};

export type YearPromise = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  uid: string;
  title: string;
  year: number;
  quarter: string;
  progress: number;
  done: boolean;
};

export type HabitHistory = {
  id: string;
  createdAt: Date;
  habitId: string;
  startedAt: Date;
  endedAt: Date;
  note?: string | null;
};

export type Habit = {
  id: string;
  createdAt: Date;
  uid: string;
  name: string;
  lastResetAt: Date;
  color: string | null;
  targetDate: Date | null;
  history?: HabitHistory[];
};

export type GroceryItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  uid: string;
  householdId: string | null;
  name: string;
  category: string;
  quantity?: string | null;
  notes?: string | null;
  inCart: boolean;
  pickedByUid?: string | null;
  isStaple: boolean;
  archived: boolean;
};

export type GroceryCategoryInfo = {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon?: string;
  order: number;
};



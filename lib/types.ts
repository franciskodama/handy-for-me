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
  weekDays: weekDays;
};

export type weekDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

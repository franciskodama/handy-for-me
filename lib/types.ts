export type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type SpinList = {
  uid: string;
  id: string;
  name: string;
  createdAt: Date;
  items: SpinItem[];
};

export type SpinItem = {
  uid: string;
  id: string;
  createdAt: Date;
  listId: string;
  name: string;
  selected: boolean;
};

export type VisualBoardItem = {
  id: string;
  createdAt: Date;
  uid: string;
  name?: string;
  url: string;
  done: boolean;
};

export type BucketListItem = {
  id: string;
  createdAt: Date;
  uid: string;
  name: string;
  category: string;
  done: boolean;
};

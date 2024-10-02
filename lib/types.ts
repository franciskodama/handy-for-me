export type SpinList = {
  id: string;
  uid: string;
  name: string;
  createdAt: Date;
  items: SpinListItem[];
};

export type SpinListItem = {
  id: string;
  uid: string;
  createdAt: Date;
  listId: string;
  name: string;
  selected: boolean;
};

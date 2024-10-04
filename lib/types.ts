export type SpinList = {
  id: string;
  uid: string;
  name: string;
  createdAt: Date;
  items: SpinItem[];
};

export type SpinItem = {
  id: string;
  uid: string;
  createdAt: Date;
  listId: string;
  name: string;
  selected: boolean;
};

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

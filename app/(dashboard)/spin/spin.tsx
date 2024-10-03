'use client';

import { LoaderPinwheelIcon } from 'lucide-react';
import { use, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SpinList, SpinListItem } from '@/lib/types';
import { addSpinItem, addSpinList, getSpinItemsFromList } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Spin({
  uid,
  lists
}: {
  uid: string;
  lists: SpinList[];
}) {
  const [newList, setNewList] = useState<string>('');
  const [selectedListName, setSelectedListName] = useState<string>('');
  const [itemList, setItemList] = useState<string>('');
  const [pendingNewList, setPendingNewList] = useState<boolean>(false);
  const [pendingNewItem, setPendingNewItem] = useState<boolean>(false);

  const selectedList = lists.find((list) => list.name === selectedListName);
  const listId = selectedList?.id;

  const handleCreateNewList = async () => {
    setPendingNewList(true);
    const success = await addSpinList(uid, newList);
    if (success) {
      setPendingNewList(false);
      setNewList('');
    }
  };

  const handleCreateNewItemList = async () => {
    setPendingNewItem(true);
    const success = listId && (await addSpinItem(uid, listId, itemList));
    if (success) {
      setPendingNewItem(false);
      setItemList('');
    }
  };

  const itemsObjects = listId && use(getSpinItemsFromList(uid, listId) || []);
  console.log('---  🚀 ---> | itemsObjects:', itemsObjects);
  // const itemsOfSelectedList: string[] = itemsObjects?.data?.reduce(
  //   (acc: any[], item: any) => {
  //     if (!acc.includes(item.name) {
  //       acc.push(item.name);
  //     }
  //     return acc;
  //   }
  // );

  // console.log('---  🚀 ---> | itemsOfSelectedList:', itemsOfSelectedList);

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2">Spin Magic</CardTitle>
        <CardDescription>
          A fun, random decision-maker that spins the wheel to pick your next
          adventure!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-8 mb-4 w-full">
          <div className="flex w-1/2 flex-col">
            <div className="flex flex-col w-[25em] gap-2">
              <Select onValueChange={(value) => setSelectedListName(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a List" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((item: SpinList) => (
                    <div key={item.id}>
                      {item.name && (
                        <SelectItem value={item.name}>{item.name}</SelectItem>
                      )}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full gap-2">
                <Input
                  className="w-full"
                  placeholder="Enter a new Item for this list"
                  value={itemList}
                  onChange={(e) => setItemList(e.target.value)}
                />
                <Button
                  className="w-[10ch]"
                  onClick={handleCreateNewItemList}
                  disabled={pendingNewItem || itemList.trim() === ''}
                >
                  {pendingNewList ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[25em]">
            <p className="text-sm h-10 py-2">
              Do you want to start a new list?
            </p>
            <div className="flex items-center gap-2">
              <Input
                placeholder="List's Name"
                value={newList}
                onChange={(e) => setNewList(e.target.value)}
              />
              <Button
                className={pendingNewList ? 'bg-orange-500' : ''}
                onClick={handleCreateNewList}
                disabled={pendingNewList || newList.trim() === ''}
              >
                {pendingNewList ? 'Creating...' : 'Create a New List'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Items:</p>
          {/* {itemsOfSelectedList &&
            itemsOfSelectedList.map((item: string) => (
              <p key={item} className="text-sm w-[18ch]">
                {item}
              </p>
            ))} */}
        </div>
      </CardContent>
    </Card>
  );
}

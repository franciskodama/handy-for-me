'use client';

import { useState } from 'react';

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
import { SpinList, SpinItem } from '@/lib/types';
import { addSpinItem, addSpinList } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderPinwheel, SplineIcon } from 'lucide-react';

export default function Spin({
  uid,
  initialLists,
  initialItems
}: {
  uid: string;
  initialLists: SpinList[];
  initialItems: SpinItem[];
}) {
  const [lists, setLists] = useState<SpinList[]>(initialLists);
  const [items, setItems] = useState<SpinItem[]>(initialItems);
  const [listId, setListId] = useState<string>('');
  const [listInput, setListInput] = useState<string>('');
  const [itemInput, setItemInput] = useState<string>('');
  const [pendingNewList, setPendingNewList] = useState<boolean>(false);
  const [pendingNewItem, setPendingNewItem] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<boolean>(false);

  const handleCreateList = async () => {
    setPendingNewList(true);
    const list = await addSpinList(uid, listInput);
    if (list) {
      setLists([...lists, list as SpinList]);
      setPendingNewList(false);
      setListInput('');
    }
  };

  const handleCreateItem = async () => {
    setPendingNewItem(true);
    const item = await addSpinItem(uid, listId, itemInput);
    if (item) {
      setItems([...items, item as SpinItem]);
      setPendingNewItem(false);
      setItemInput('');
    }
  };
  const itemsOfSelectedList = items.filter((item) => item.listId === listId);
  const itemsStrings = itemsOfSelectedList.reduce<string[]>(
    (acc, item: SpinItem) => {
      acc.push(item.name);
      return acc;
    },
    []
  );

  const handleSpin = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * itemsStrings.length);
    const randomItem = itemsStrings[randomIndex];
    setTimeout(() => {
      setResult(randomItem);
    }, 2000);
    setSpinning(false);
  };

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
              <Select onValueChange={(value) => setListId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a List" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((item: SpinList) => (
                    <div key={item.id}>
                      {item.name && (
                        <SelectItem value={item.id}>{item.name}</SelectItem>
                      )}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full gap-2">
                <Input
                  className="w-full"
                  placeholder="Enter a new Item for this list"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                />
                <Button
                  className={`w-[10ch] ${pendingNewItem ? 'bg-orange-500' : ''}`}
                  onClick={handleCreateItem}
                  disabled={pendingNewItem || itemInput.trim() === ''}
                >
                  {pendingNewItem ? 'Adding...' : 'Add'}
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
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
              />
              <Button
                className={pendingNewList ? 'bg-orange-500' : ''}
                onClick={handleCreateList}
                disabled={pendingNewList || listInput.trim() === ''}
              >
                {pendingNewList ? 'Creating...' : 'Create a New List'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-[25em]">
          <p className="text-sm font-semibold mt-4">Items:</p>
          {itemsStrings &&
            itemsStrings.map((item: string) => (
              <p key={item} className="text-sm w-full border p-2">
                {item}
              </p>
            ))}
          <Button
            onClick={handleSpin}
            // disabled={Boolean(listId)}
          >
            {spinning ? 'Spinning...' : 'Spin Magic'}
            <LoaderPinwheel
              className={`w-4 h-4 ml-2 ${spinning ? 'animate-spin' : null}`}
            />
          </Button>
        </div>
        {result && (
          <>
            <p className="text-5xl text-white p-4 text-center border bg-orange-500 animate-pulse w-full mt-8">
              {result}
            </p>
            <Button variant="ghost" onClick={() => setResult(false)}>
              clear
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

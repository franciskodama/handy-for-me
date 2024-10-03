'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellRing,
  CircleHelp,
  LoaderPinwheel,
  MessageCircleQuestion,
  SplineIcon
} from 'lucide-react';

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SpinList, SpinItem } from '@/lib/types';
import { addSpinItem, addSpinList } from '@/lib/actions';
import Explanation from '@/components/Explanation';

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
  const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);

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
        <CardTitle className="flex justify-between items-center gap-2">
          <h1>Spin Magic</h1>

          {!openAction ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        className="text-sm"
                        variant="link"
                        onClick={() => {
                          setOpenAction(true);
                        }}
                      >
                        <CircleHelp className="h-6 w-6" strokeWidth={1.6} />
                      </Button>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-primary ml-2 lowercase font-light">
                      learn more
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <div />
          )}
        </CardTitle>
        <CardDescription>
          A fun, random decision-maker that spins the wheel to pick your next
          adventure!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {openAction ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="mb-12">
                <Explanation setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {/* ----------------------- First Column ----------------------- */}
        <div className="flex justify-between gap-8 mb-4 w-full">
          <div className="flex w-1/3 flex-col">
            <div className="flex flex-col gap-2">
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

            {/* ----------------------- Second Column ----------------------- */}

            {itemsStrings.length > 0 && (
              <div className="flex flex-col gap-2 w-[25em]">
                <p className="text-sm font-semibold mt-4">Items:</p>
                {itemsStrings.map((item: string) => (
                  <p key={item} className="text-sm w-full border p-2">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* ----------------------- Third Column ----------------------- */}

          <div className="flex flex-col w-1/3 border h-[10em]">
            {itemsStrings.length > 0 && (
              <Button
                onClick={handleSpin}
                // disabled={Boolean(listId)}
              >
                {spinning ? 'Spinning...' : 'Spin Magic'}
                <LoaderPinwheel
                  className={`w-4 h-4 ml-2 ${spinning ? 'animate-spin' : null}`}
                />
              </Button>
            )}

            {result && (
              <>
                <p className="text-5xl text-white p-4 text-center border bg-orange-500 animate-pulse w-full mt-8">
                  {result}
                </p>
                <Button variant="ghost" onClick={() => setResult('')}>
                  clear
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-col w-1/3">
            <div className="w-[25em]">
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
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp, RefreshCw, Trash2 } from 'lucide-react';

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
import {
  addSpinItem,
  addSpinList,
  deleteSpinItem,
  selectionSpinItem
} from '@/lib/actions';
import ExplanationBox from '@/components/ExplanationBox';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [allItems, setAllItems] = useState<SpinItem[]>(initialItems);
  const [listId, setListId] = useState<string>('');
  const [listInput, setListInput] = useState<string>('');
  const [itemInput, setItemInput] = useState<string>('');
  const [pendingNewList, setPendingNewList] = useState<boolean>(false);
  const [pendingNewItem, setPendingNewItem] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);

  const items = allItems.filter((item) => item.listId === listId);
  const itemsSelected = items.filter((item) => item.selected === true);

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
      setAllItems([...allItems, item as SpinItem]);
      setPendingNewItem(false);
      setItemInput('');
    }
  };

  const handleItemSelection = async (id: string) => {
    const success = await selectionSpinItem(id);
    if (success) {
      setAllItems(
        allItems.map((item) => {
          if (item.id === id) {
            return { ...item, selected: !item.selected };
          }
          return item;
        })
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deleteSpinItem(id);
    if (success) {
      setAllItems(allItems.filter((item) => item.id !== id));
    }
  };

  const handleSpin = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * itemsSelected.length);
    const randomItem = itemsSelected[randomIndex].name;
    setTimeout(() => {
      setResult(randomItem);
      setSpinning(false);
    }, 5000);
  };

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Spin Magic</p>
          {!openAction ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    className="text-sm"
                    onClick={() => {
                      setOpenAction(true);
                    }}
                  >
                    <CircleHelp size={22} strokeWidth={1.6} />
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
                <ExplanationBox setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ----------------------- First Column ----------------------- */}

        <div className="flex justify-between gap-8 mb-4 w-full">
          <div className="flex w-1/3 flex-col">
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  setResult('');
                  setListId(value);
                }}
              >
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
            {items.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold mt-4">Items:</p>
                {items.map((item: SpinItem) => (
                  <div
                    key={item.id}
                    className="flex gap-2 items-center justify-between text-sm w-full border px-2"
                  >
                    <p>{item.name}</p>
                    <div className="flex items-center gap-4 pr-2">
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={() => handleItemSelection(item.id)}
                      />
                      <Button
                        variant={'link'}
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 size={18} strokeWidth={1.6} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ----------------------- Second Column ----------------------- */}

          <div
            className="flex flex-col w-1/3 items-center p-12"
            style={{
              borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
              borderStyle: 'solid',
              borderWidth: '1em'
            }}
          >
            {items.length > 0 ? (
              <>
                <div className="flex flex-col">
                  <p className="text-3xl mb-8">
                    {spinning ? 'Spinning...' : 'Spin the Wheel!'}
                  </p>
                  {/* <div className="relative">
                    <svg
                      viewBox="0 0 500 500"
                      className="border absolute top-0 "
                    >
                      <path
                        id="curve"
                        fill="transparent"
                        d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
                      />
                      <text width="500">
                        <textPath
                          className="text-6xl font-normal"
                          xlinkHref="#curve"
                        >
                          {spinning ? 'Spinning...' : 'Spin the Wheel!'}
                        </textPath>
                      </text>
                    </svg>
                  </div> */}
                  <Button
                    className="rounded-full w-[15em] h-[15em] p-0"
                    onClick={handleSpin}
                    variant={'outline'}
                  >
                    <RefreshCw
                      color={'black'}
                      size={150}
                      strokeWidth={0.25}
                      className={`${spinning ? 'animate-spin' : null}`}
                    />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-3xl text-slate-300 p-4 text-center animate-pulse w-full">
                  waiting for items...
                </p>
              </>
            )}

            {result && (
              <>
                <p className="text-5xl text-white p-4 text-center bg-primary animate-pulse w-full my-8">
                  {result}
                </p>
                <Button variant="link" onClick={() => setResult('')}>
                  clear
                </Button>
              </>
            )}
          </div>

          {/* ----------------------- Third Column ----------------------- */}

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
                  className={pendingNewList ? 'bg-primary' : ''}
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

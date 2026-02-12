'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Foldit } from 'next/font/google';
import {
  Bomb,
  CornerLeftUp,
  CornerRightDown,
  PartyPopper,
  RefreshCw,
  SquareX,
  Trash,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DecisionHelperItem, DecisionHelperList } from '@/lib/types';
import {
  addDecisionHelperItem,
  addDecisionHelperList,
  deleteDecisionHelperItem,
  deleteDecisionHelperList,
  selectionDecisionHelperItem
} from '@/lib/actions/decision-helper';
import { Checkbox } from '@/components/ui/checkbox';
import { kumbh_sans } from '@/app/ui/fonts';
import Help from '@/components/common/Help';
import ExplanationDecisionHelper from './explanation-decision-helper';

export const foldit = Foldit({
  weight: ['700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap'
});

export default function DecisionHelper({
  uid,
  initialLists,
  initialItems
}: {
  uid: string;
  initialLists: DecisionHelperList[];
  initialItems: DecisionHelperItem[];
}) {
  const [lists, setLists] = useState<DecisionHelperList[]>(initialLists);
  const [allItems, setAllItems] = useState<DecisionHelperItem[]>(initialItems);
  const [listId, setListId] = useState<string>(
    initialLists.length > 0 ? initialLists[0].id : ''
  );
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
    const list = await addDecisionHelperList(uid, listInput);
    if (list) {
      setLists([...lists, list as DecisionHelperList]);
      setPendingNewList(false);
      setListInput('');
    }
  };

  const handleCreateItem = async () => {
    setPendingNewItem(true);
    const newItem = await addDecisionHelperItem(uid, listId, itemInput);
    setPendingNewItem(false);

    if (newItem) {
      setAllItems([...allItems, newItem as DecisionHelperItem]);
      setItemInput('');
    } else {
      toast({
        title: 'Error Adding Item! 🚨',
        description:
          'Something went wrong while adding the item. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleItemSelection = async (id: string) => {
    const success = await selectionDecisionHelperItem(id);
    if (success) {
      setAllItems(
        allItems.map((el) => {
          if (el.id === id) {
            return { ...el, selected: !el.selected };
          }
          return el;
        })
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deleteDecisionHelperItem(id);
    if (success) {
      setAllItems(allItems.filter((item) => item.id !== id));
    }
  };

  const handleDeleteList = async (id: string) => {
    const success = await deleteDecisionHelperList(id);
    if (success) {
      setLists(lists.filter((list) => list.id !== id));
      toast({
        title: 'List gone! 🎉',
        description: 'Your list has been successfully deleted.',
        variant: 'success'
      });
    } else {
      toast({
        title: 'Error deleting List! 🚨',
        description:
          'Please remove all items from the list first, then try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSpin = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * itemsSelected.length);
    const randomItem = itemsSelected[randomIndex].item;
    setTimeout(() => {
      setResult(randomItem);
      setSpinning(false);
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      setTimeout(() => confetti.reset(), 3000); // Reset confetti after 3 seconds
    }, 2000);
  };

  return (
    <Card className="min-h-[75vh]">
      <CardHeader className="mb-4">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Decision Helper</p>
          {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
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
                <ExplanationDecisionHelper setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-start gap-8 mb-4 w-full">
          <div className="flex flex-col gap-4 sm:w-1/2">
            <div className="flex flex-col items-start w-full">
              <p className="text-sm mb-2">Do you want to start a new list?</p>
              <div className="flex gap-2 w-full">
                <Input
                  placeholder="List's Name"
                  value={listInput}
                  onChange={(e) => setListInput(e.target.value)}
                />
                <Button
                  className={pendingNewList ? 'ml-1 bg-primary' : 'ml-1'}
                  onClick={handleCreateList}
                  disabled={pendingNewList || listInput.trim() === ''}
                >
                  {pendingNewList ? 'Creating...' : 'Create a New List'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CornerLeftUp size={18} strokeWidth={1.4} />
                <p className="text-sm">or</p>
                <CornerRightDown size={18} strokeWidth={1.4} />
              </div>
            </div>
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
                  {lists.map((el: DecisionHelperList) => (
                    <div key={el.id}>
                      {el.list && (
                        <div className="flex items-center justify-between">
                          <SelectItem value={el.id}>{el.list}</SelectItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost">
                                <Trash
                                  className="text-primary"
                                  size={18}
                                  strokeWidth={1.4}
                                />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[calc(100%-35px)]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <Bomb size={24} strokeWidth={1.8} />
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="py-4 text-base text-primary">
                                  This will permanently delete the list
                                  <span className="font-bold mx-1">
                                    {el.list}
                                  </span>
                                  all its contents.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => {
                                    toast({
                                      title: 'Operation Cancelled! ❌',
                                      description: `Phew! 😮‍💨 Crisis averted. You successfully cancelled the operation.`,
                                      variant: 'destructive'
                                    });
                                  }}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteList(el.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full gap-2">
                <Input
                  className="w-full"
                  placeholder={
                    listId
                      ? 'Enter a new Item for this list'
                      : 'Select a list first'
                  }
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  disabled={!listId}
                />
                <Button
                  className={`ml-1 w-[10ch] ${pendingNewItem ? 'bg-orange-500' : ''}`}
                  onClick={handleCreateItem}
                  disabled={
                    pendingNewItem || itemInput.trim() === '' || !listId
                  }
                >
                  {pendingNewItem ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold mt-4">Items:</p>
                {items.map((el: DecisionHelperItem) => (
                  <div
                    key={el.id}
                    className="flex gap-2 items-center justify-between text-sm w-full border px-2"
                  >
                    <p>{el.item}</p>
                    <div className="flex items-center gap-4 pr-2">
                      <Checkbox
                        checked={el.selected}
                        onCheckedChange={() => handleItemSelection(el.id)}
                      />
                      <Button
                        variant={'link'}
                        onClick={() => handleDeleteItem(el.id)}
                      >
                        <Trash2 size={18} strokeWidth={1.6} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stripe-border flex flex-col items-center sm:w-1/2 justify-center p-12 mt-8 mb-8">
            {items.length > 0 ? (
              <>
                <div className="flex flex-col">
                  <p
                    className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none text-center mb-8`}
                  >
                    {spinning ? 'Spinning...' : 'Spin the Wheel'}
                  </p>
                  <Button
                    className="rounded-full w-[12em] h-[12em] sm:w-[15em] sm:h-[15em] p-0"
                    onClick={handleSpin}
                    variant={'outline'}
                  >
                    <RefreshCw
                      color={'black'}
                      size={120}
                      strokeWidth={0.25}
                      className={`${spinning ? 'animate-spin' : null}`}
                    />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-3xl text-slate-300 p-4 text-center animate-pulse w-full">
                  Waiting for items...
                </p>
              </>
            )}

            {result && (
              <>
                <AlertDialog open={result.length > 0}>
                  <AlertDialogContent className="w-[calc(100%-35px)]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 justify-center animate-pulse">
                        <p>
                          {
                            titleAlert[
                              Math.floor(Math.random() * titleAlert.length)
                            ]
                          }
                        </p>
                        <PartyPopper size={24} strokeWidth={1.8} />
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <p
                          className={`${kumbh_sans.className} ${result.length > 8 ? 'text-lg sm:text-4xl' : 'text-3xl sm:text-7xl'} text-primary uppercase font-bold leading-none text-center w-full my-8`}
                        >
                          {result}
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center w-full">
                      <AlertDialogCancel
                        onClick={() => setResult('')}
                        className="mx-auto"
                      >
                        Done! Back to Choices.
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="link" onClick={() => setResult('')}>
                  <SquareX
                    size={18}
                    strokeWidth={1.6}
                    onClick={() => setResult('')}
                  />
                  <p className="ml-2 text-xs">Clear</p>
                </Button>
              </>
            )}
          </div>

          {/* ----------------------- Third Column ----------------------- */}

          {/*handle deleteDecisionHelperList(id) */}

          {/* 
            <div className="w-[25em] mt-8">
              <p className="text-sm h-10 py-2">Do you want to delete a list?</p>
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
            </div> */}
        </div>
      </CardContent>
    </Card>
  );
}

const titleAlert = [
  'Your Decision is Made!',
  'Here’s Your Choice!',
  'Here’s Your Decision!',
  'The Decision is In!',
  'Here’s Your Pick!',
  'Decision Unlocked!',
  'Your Choice Awaits!',
  'Decision Made Easy!'
];

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { AffirmationProps } from '@/lib/types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp, RefreshCw, SquareX, Trash2 } from 'lucide-react';
import ExplanationAffirmation from './explanation-affirmation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Affirmation() {
  //   {
  //   affirmations
  // }: {
  //   affirmations: AffirmationProps[];
  // }
  // const [lists, setLists] = useState<SpinList[]>(initialLists);
  // const [allItems, setAllItems] = useState<SpinItem[]>(initialItems);
  // const [listId, setListId] = useState<string>('');
  // const [listInput, setListInput] = useState<string>('');
  // const [itemInput, setItemInput] = useState<string>('');
  // const [pendingNewList, setPendingNewList] = useState<boolean>(false);
  // const [pendingNewItem, setPendingNewItem] = useState<boolean>(false);
  // const [spinning, setSpinning] = useState<boolean>(false);
  // const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);
  // console.log('---  🚀 ---> | affirmations:', affirmations);

  // https://www.youtube.com/watch?v=-aBKrvK5Vn8&list=WL&index=73&t=6s

  //   const handleCreateList = async () => {
  //     setPendingNewList(true);
  //     const list = await addSpinList(uid, listInput);
  //     if (list) {
  //       setLists([...lists, list as SpinList]);
  //       setPendingNewList(false);
  //       setListInput('');
  //     }
  //   };

  //   const handleCreateItem = async () => {
  //     setPendingNewItem(true);
  //     const item = await addSpinItem(uid, listId, itemInput);
  //     if (item) {
  //       setAllItems([...allItems, item as SpinItem]);
  //       setPendingNewItem(false);
  //       setItemInput('');
  //     }
  //   };

  //   const handleDeleteItem = async (id: string) => {
  //     const success = await deleteAffirmations(id);
  //     if (success) {
  //       setAllItems(allItems.filter((item) => item.id !== id));
  //     }
  //   };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Affirmation
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
                    <p className="text-primary ml-2 capitalize font-light">
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
          You are the captain of your soul and the master of your fate.
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
                <ExplanationAffirmation setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {/* ----------------------- First Column ----------------------- */}
        <div className="flex justify-between gap-8 mb-4 w-full">
          <div className="flex flex-col w-1/3">
            <div className="w-[25em]">
              <p className="text-sm h-10 py-2">
                Do you want to start a new list?
              </p>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="List's Name"
                  // value={listInput}
                  // onChange={(e) => setListInput(e.target.value)}
                />
                <Button
                // className={pendingNewList ? 'bg-primary' : ''}
                // onClick={handleCreateList}
                // disabled={pendingNewList || listInput.trim() === ''}
                >
                  {/* {pendingNewList ? 'Creating...' : 'Create a New List'} */}
                </Button>
              </div>
            </div>
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
        </div>
        The conscious mind is like the navigator or captain at the bridge of a
        ship. He directs the ship and signals orders to men in the engine room,
        who in turn control all the boilers, instruments, gauges, etc. The men
        in the engine room do not know where they are going; they follow orders.
        They would go on the rocks if the man on the bridge issued faulty or
        wrong instructions based on his findings with the compass, sextant, or
        other instruments. The men in the engine room obey him because he is in
        charge and issues orders, which are automatically obeyed. Members of the
        crew do not talk back to the captain; they simply carry out orders. The
        captain is the master of his ship, and his decrees are carried out.
        Likewise, your conscious mind is the captain and the master of your
        ship, which represents your body, environment, and all your affairs.
        Your subconscious mind takes the orders you give it based upon what your
        conscious mind believes and accepts as true.
      </CardContent>
    </Card>
  );
}

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
import { useActionState, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp, RefreshCw, SquareX, Trash2 } from 'lucide-react';
import ExplanationAffirmation from './explanation-affirmation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AffirmationProps } from '@/lib/types';
import { isEmptyBindingElement } from 'typescript';
import { Span } from 'next/dist/trace';
import { addAffirmation } from '@/lib/actions';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const uid = formData.get('uid') as string;
  console.log('---  🚀 ---> | uid:', uid);
  console.log('---  🚀 ---> | name:', name);
  console.log('---  🚀 ---> | url:', url);

  if (!url) {
    return { error: 'Url is required' };
  }

  const affirmation = await addAffirmation(uid, name, url);
  console.log('---  🚀 ---> | affirmation:', affirmation);

  if (!affirmation) {
    return { error: 'Something got wrong. Try again.' };
  }
  return { message: 'Affirmation added successfully' };
};

export default function Affirmation({
  firstName,
  uid,
  affirmations
}: {
  firstName: string;
  uid: string;
  affirmations: AffirmationProps[];
}) {
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
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  console.log('---  🚀 ---> | affirmations:', affirmations);

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
        <CardTitle className="flex justify-between items-center gap-2">
          Vision Board
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
                    <CircleHelp size={32} strokeWidth={1.4} />
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
          Visualize your goals and turn desires into reality.
          {/* You are the captain of your soul and the master of your fate. */}
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
          <div className="flex flex-col w-1/3 gap-4">
            <form className="w-full" action={action}>
              <p className="text-lg font-semibold">
                {/* {`${firstName}, enter the name of your goal and a picture to make it real.`}
                {`${firstName}, enter the name of your goal and a picture to make it real.`} */}
                “Whatever the mind can conceive and believe, it can achieve.” –
                Napoleon Hill
              </p>
              <div className="flex items-center gap-2">
                <Input placeholder="Affirmation's Name" id="name" name="name" />
                <Input placeholder="Url" id="url" name="url" />
                <Input
                  id="uid"
                  name="uid"
                  value={uid}
                  readOnly
                  className="hidden"
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add Your Desire'}
                </Button>
                {data?.error && (
                  <span className="text-white bg-red-500 px-2 py-1">
                    {data?.error}
                  </span>
                )}
                {data?.message && (
                  <span className="text-white bg-green-500 px-2 py-1">
                    {data?.message}
                  </span>
                )}
              </div>
            </form>
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

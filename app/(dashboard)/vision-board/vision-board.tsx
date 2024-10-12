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
import { use, useActionState, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleHelp, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VisualBoardItem } from '@/lib/types';
import {
  addVisualBoardItem,
  deleteVisualBoardItem,
  getVisualBoardItems
} from '@/lib/actions';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import Link from 'next/link';
import Image from 'next/image';
import ExplanationVisionBoard from './explanation-vision-board';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const uid = formData.get('uid') as string;
  if (!url) {
    return { error: 'Url is required.' };
  }

  if (!url.includes('unsplash' || 'fkodama')) {
    return { error: 'Image URL should be sourced from Unsplash.' };
  }

  const visualBoardItem = await addVisualBoardItem(uid, name, url);
  if (!visualBoardItem) {
    return { error: 'Something got wrong. 🚨 Try again.' };
  }

  const newVisualBoardItem = await getVisualBoardItems(uid);
  return {
    message: 'Added 🎉',
    newVisualBoardItem
  };
};

export default function VisionBoard({
  uid,
  visualBoard
}: {
  uid: string;
  visualBoard: VisualBoardItem[];
}) {
  const [openAction, setOpenAction] = useState(false);
  const [board, setBoard] = useState<VisualBoardItem[]>(visualBoard);
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  useEffect(() => {
    if (data?.newVisualBoardItem && Array.isArray(data.newVisualBoardItem)) {
      setBoard(data.newVisualBoardItem as VisualBoardItem[]);
    }
  }, [data]);

  const handleDeleteItem = (id: string) => {
    const success = use(deleteVisualBoardItem(id));
    if (success) {
      setBoard(board.filter((item) => item.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start mb-0">
          <div className="flex flex-col">
            Vision Board
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">V</span>isualize your goals and turn
              desires into reality.
            </p>
          </div>
          <div className={`${barlow.className} flex gap-4 capitalize w-3/5`}>
            <form className="w-full" action={action}>
              <div className="flex items-start gap-2 font-normal">
                <div className="flex flex-col w-full gap-1">
                  <Input placeholder="Goal" id="name" name="name" />
                  <p className="text-xs ml-4 lowercase">
                    <span className="uppercase">N</span>ame your goal in one
                    word (optional).
                  </p>
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Input placeholder="Url" id="url" name="url" />
                  <p className="text-xs ml-4 lowercase">
                    <span className="uppercase">A</span>dd the URL of a picture
                    from
                    <Link
                      href="https://unsplash.com/"
                      target="_blank"
                      className="mx-1 font-bold underline"
                    >
                      <span className="uppercase">U</span>nsplash
                    </Link>
                    that reflects your vision. *
                  </p>
                </div>
                <Input
                  id="uid"
                  name="uid"
                  value={uid}
                  readOnly
                  className="hidden"
                />
                <Button variant={'outline'} type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add'}
                </Button>
                {data?.error && (
                  <span className="text-white text-sm font-semibold bg-red-500 px-1 py-2 text-center w-[32ch]">
                    {data?.error}
                  </span>
                )}
                {data?.message && (
                  <span className="text-white text-sm font-semibold bg-green-500 px-2 py-2 text-center w-[32ch]">
                    {data?.message}
                  </span>
                )}
              </div>
            </form>
          </div>
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
        <CardDescription></CardDescription>
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
                <ExplanationVisionBoard setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* -------------------------------------------------------------- */}

        <div className="flex flex-wrap relative">
          {board.map((item: VisualBoardItem) => (
            <div key={item.id}>
              <div className="relative group">
                <Image
                  src={item.url}
                  width={150}
                  height={150}
                  alt={`Picture of ${item.name}`}
                  className="object-cover h-60 w-60 group-hover:opacity-100"
                />
                <p
                  // className={`${kumbh_sans.className} text-white text-center uppercase font-bold text-md leading-none absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg`}
                  className={`${kumbh_sans.className} bg-white text-center uppercase text-md leading-none absolute bottom-0 left-2 px-2 py-1`}
                >
                  {item.name}
                </p>
                <Button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                  variant={'link'}
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 size={18} strokeWidth={1.8} color="#fff" />
                </Button>
                <Button
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100"
                  variant={'link'}
                  // onClick={() => selectAffirmations(affirmation.id)}
                >
                  <Check size={18} strokeWidth={1.8} color="#fff" />
                </Button>
              </div>
            </div>
          ))}
          <div>
            <div className="flex flex-col gap-1 absolute text-left bottom-10 left-10 text-lg">
              <p className=" bg-white px-2 py-1">
                “Whatever the mind can conceive and believe, it can achieve.”
              </p>
              <p className="text-sm font-bold bg-white px-2 py-1 w-28">
                – Napoleon Hill
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// shadow-[0_0px_0px_0px_inset,#000_-5px_5px]

// The conscious mind is like the navigator or captain at the bridge of a
// ship. He directs the ship and signals orders to men in the engine room,
// who in turn control all the boilers, instruments, gauges, etc. The men
// in the engine room do not know where they are going; they follow orders.
// They would go on the rocks if the man on the bridge issued faulty or
// wrong instructions based on his findings with the compass, sextant, or
// other instruments. The men in the engine room obey him because he is in
// charge and issues orders, which are automatically obeyed. Members of the
// crew do not talk back to the captain; they simply carry out orders. The
// captain is the master of his ship, and his decrees are carried out.
// Likewise, your conscious mind is the captain and the master of your
// ship, which represents your body, environment, and all your affairs.
// Your subconscious mind takes the orders you give it based upon what your
// conscious mind believes and accepts as true.

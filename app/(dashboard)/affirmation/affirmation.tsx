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
import { addAffirmation, deleteAffirmations } from '@/lib/actions';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import Link from 'next/link';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const uid = formData.get('uid') as string;
  if (!url) {
    return { error: 'Url is required.' };
  }
  const affirmation = await addAffirmation(uid, name, url);
  if (!affirmation) {
    return { error: 'Something got wrong. 🚨 Try again.' };
  }
  return { message: 'Added 🎉' };
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
  const [openAction, setOpenAction] = useState(false);
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  //   const handleDeleteItem = async (id: string) => {
  //     const success = await deleteAffirmations(id);
  //     if (success) {
  //       setAllItems(allItems.filter((item) => item.id !== id));
  //     }
  //   };

  //   <div>
  //   <p className="text-lg font-semibold w-[30ch]">
  //     {/* {`${firstName}, enter the name of your goal and a picture to make it real.`}
  //     {`${firstName}, enter the name of your goal and a picture to make it real.`} */}
  //     {/* “Whatever the mind can conceive and believe, it can achieve.” –
  //     Napoleon Hill */}
  //     Set Your Goal and Visualize
  //   </p>
  // </div>

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
                <ExplanationAffirmation setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {/* ----------------------- First Column ----------------------- */}
        <div className="flex justify-between gap-8 mb-4 w-full">
          {/* <div className="flex flex-col w-1/3 gap-4">
            <p className="text-lg font-semibold">
              Set Your Goal and Visualize
            </p>
            <form className="w-full" action={action}>
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
          </div> */}
        </div>

        <div className="flex flex-wrap">
          {affirmations?.map((affirmation) => (
            <div key={affirmation.id}>
              <div className="relative group">
                <Image
                  src={affirmation.url}
                  width={150}
                  height={150}
                  alt={`Picture of ${affirmation.name}`}
                  className="object-cover h-64 w-64 group-hover:opacity-100"
                />
                {/* <p className="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold bg-white px-4 border -skew-x-6 shadow-[0_0px_0px_0px_inset,#000_-5px_5px_0_-1px,#000_-5px_5px]"> */}
                <p
                  className={`${kumbh_sans.className} text-white uppercase font-bold text-md leading-none absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                >
                  {affirmation.name}
                </p>
                <Button
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100"
                  variant={'link'}
                  onClick={() => deleteAffirmations(affirmation.id)}
                >
                  <Trash2 size={32} strokeWidth={1.4} color="#fff" />
                </Button>
              </div>
            </div>
          ))}
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

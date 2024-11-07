'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bomb, Check, Grid2x2X, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActionState, useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { VisualBoardItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  addVisualBoardItem,
  deleteVisualBoardItem,
  getVisualBoardItems,
  setVisualBoardItemDone
} from '@/lib/actions';
import Help from '@/components/Help';
import { toast } from '@/hooks/use-toast';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import ExplanationVisionBoard from './explanation-vision-board';
import MessageEmpty from '@/components/MessageEmpty';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const item = formData.get('item') as string;
  const url = formData.get('url') as string;
  const uid = formData.get('uid') as string;

  if (!item) {
    toast({
      title: 'Goal is required!',
      description: 'What do you want to achieve?',
      variant: 'destructive'
    });
    return;
  }

  if (item.length > 10) {
    toast({
      title: 'Maximum 10 characters!',
      description: 'The name should be at most 10 characters.',
      variant: 'destructive'
    });
    return;
  }

  if (!url) {
    toast({
      title: 'URL is required!',
      description: 'And the image URL should be sourced from Unsplash, ok?',
      variant: 'destructive'
    });
  }

  if (!url.includes('unsplash') && !url.includes('fkodama')) {
    toast({
      title: 'URL not valid!',
      description: 'Image URL should be sourced from Unsplash.',
      variant: 'destructive'
    });
    return;
  }

  const visualBoardItem = await addVisualBoardItem(uid, item, url);
  if (!visualBoardItem) {
    toast({
      title: 'Ops...',
      description: 'Something got wrong. 🚨 Try again.',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'URL added successfully! 🎉',
      description: 'You have one more vision board item to conquer.',
      variant: 'success'
    });
  }
  const newVisualBoardItem = await getVisualBoardItems(uid);

  return {
    newVisualBoardItem
  };
};

const randomSortVisualBoard = (visualBoard: VisualBoardItem[]) => {
  const shuffledBoard = [...visualBoard];
  for (let i = shuffledBoard.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBoard[i], shuffledBoard[j]] = [shuffledBoard[j], shuffledBoard[i]];
  }
  return shuffledBoard;
};

export default function VisionBoard({
  uid,
  visualBoard
}: {
  uid: string;
  visualBoard: VisualBoardItem[];
}) {
  const [openAction, setOpenAction] = useState(false);
  const [board, setBoard] = useState<VisualBoardItem[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(
    visualBoard.length === 0 ? 'item-1' : ''
  );
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  useEffect(() => {
    if (visualBoard) {
      setBoard(randomSortVisualBoard(visualBoard));
    }
  }, []);

  useEffect(() => {
    if (data?.newVisualBoardItem && Array.isArray(data.newVisualBoardItem)) {
      setBoard(data.newVisualBoardItem as VisualBoardItem[]);
    }
  }, [data]);

  const handleDeleteItem = async (el: VisualBoardItem) => {
    try {
      const success = await deleteVisualBoardItem(el.id);
      if (success) {
        setBoard(board.filter((element) => element.id !== el.id));
      }
      toast({
        title: 'Vision Board Item gone!',
        description: `The ${el.item} has been successfully deleted.`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error deleting Item! 🚨',
        description: 'Something went wrong while deleting the Item.',
        variant: 'destructive'
      });
    }
  };

  const handleCheck = async (el: VisualBoardItem) => {
    try {
      const success = await setVisualBoardItemDone(el.id, !el.done);
      if (success) {
        setBoard((prevBoard) =>
          prevBoard.map((boardItem) =>
            boardItem.id === el.id
              ? { ...boardItem, done: !boardItem.done }
              : boardItem
          )
        );
      }
      toast({
        title: 'Vision Progress Updated! 🌟',
        description: `"${el.item}" has been marked as ${el.done ? 'incomplete' : 'achieved'}. Keep pushing towards your dreams!`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error changing Status! 🚨',
        description:
          'Something went wrong while changing the Status of this Item.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between items-start mb-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p>Vision Board</p>
              <div className="block sm:hidden">
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">V</span>isualize your goals and turn
              desires into reality.
            </p>
          </div>

          <div className="hidden sm:block">
            <FormVisionBoard
              action={action}
              setOpenAction={setOpenAction}
              isPending={isPending}
              uid={uid}
              openAction={openAction}
            />
          </div>
          <div className="hidden sm:block">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative sm:p-10 pb-40">
        <Accordion
          type="single"
          collapsible
          className="w-full sm:hidden mb-4"
          value={isAccordionOpen}
          onValueChange={(value) => setIsAccordionOpen(value)}
        >
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="w-full text-xs underline">
              Add a new Goal
            </AccordionTrigger>
            <AccordionContent>
              <FormVisionBoard
                action={action}
                setOpenAction={setOpenAction}
                isPending={isPending}
                uid={uid}
                openAction={openAction}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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

        {board.length < 1 && (
          <div className="sm:mt-8">
            <MessageEmpty
              image={'/brucelee-emptymind.webp'}
              objectPosition={'50% 50%'}
              alt={'Bruce Lee Empty your mind'}
              icon={<Grid2x2X size={32} strokeWidth={1.6} />}
              titleOne={'Oops...'}
              titleTwo={'Vision Not Found'}
              subtitle={
                'An empty board is like an empty mind… Add your goals and bring your vision to life!'
              }
              setOpenAction={setOpenAction}
              buttonCopy={'How it works?'}
              hasButton={true}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-[1px] justify-center my-4 sm:my-0">
          {board.map((el: VisualBoardItem) => (
            <div key={el.id}>
              <div className="relative group">
                <Image
                  src={el.url}
                  width={150}
                  height={150}
                  alt={`Picture of ${el.item}`}
                  className="object-cover w-20 h-20 sm:w-48 sm:h-48 group-hover:opacity-100"
                />
                <p
                  className={`${kumbh_sans.className} bg-white text-left uppercase text-[8px] sm:text-sm leading-none absolute bottom-0 left-0 sm:left-2 px-2 py-1`}
                >
                  {el.item}
                </p>

                {el.done ? (
                  <>
                    <div className="absolute bottom-0 left-0 opacity-70 h-60 w-60 bg-primary" />

                    <Check
                      size={18}
                      strokeWidth={1.8}
                      className="absolute bottom-0 right-2 h-6 w-6 bg-green-500 text-white p-1 z-200"
                    />
                  </>
                ) : null}

                <AlertDialog>
                  <AlertDialogTrigger className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 bg-white p-1">
                    <Trash2 size={18} strokeWidth={1.8} color="#000" />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[calc(100%-35px)]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Bomb size={24} strokeWidth={1.8} />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="py-4">
                        This will permanently delete the vision
                        <span className="font-bold mx-1">{el.item}</span>
                        from our servers.
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
                      <AlertDialogAction onClick={() => handleDeleteItem(el)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 h-6 bg-white p-1"
                  onClick={() => handleCheck(el)}
                  variant={'link'}
                >
                  <Check size={18} strokeWidth={1.8} color="#000" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 items-end text-center absolute bottom-10 right-10 ml-6 text-sm sm:text-xl text-white">
          <p className="bg-primary px-4 py-1">
            “Whatever the mind can conceive and believe, it can achieve.”
          </p>
          <p className="text-sm sm:text-base font-bold bg-primary px-2 py-1 w-32">
            – Napoleon Hill
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FormVisionBoard({
  action,
  setOpenAction,
  isPending,
  uid,
  openAction
}: {
  action: (payload: FormData) => void;
  setOpenAction: (value: boolean) => void;
  isPending: boolean;
  uid: string;
  openAction: boolean;
}) {
  return (
    <>
      <div
        className={`${barlow.className} flex gap-4 capitalize mt-4 mb-12 sm:mb-0 sm:mt-0`}
      >
        <form
          className="flex flex-col sm:flex-row items-start gap-4 sm:gap-2 font-normal"
          action={action}
        >
          <div className="flex flex-col gap-1 w-full sm:w-2/5">
            <Input placeholder="Goal" id="item" name="item" />
            <p className="text-xs ml-4 lowercase">
              <span className="uppercase">N</span>ame your goal in one word
              (optional).
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-2/5">
            <Input placeholder="Url" id="url" name="url" />
            <p className="text-xs ml-4 lowercase">
              <span className="uppercase">A</span>dd the URL of a picture from
              <Link
                className="mx-1 font-bold underline"
                href="https://unsplash.com/"
                target="_blank"
              >
                <span className="uppercase">U</span>nsplash
              </Link>
              that reflects your vision. *
            </p>
          </div>
          <Input id="uid" name="uid" value={uid} readOnly className="hidden" />
          <Button type="submit" disabled={isPending} className="ml-2">
            {isPending ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </div>
    </>
  );
}

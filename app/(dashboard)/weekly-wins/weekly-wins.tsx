'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Bomb,
  Ghost,
  MessageCircleX,
  Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import { Shortcut, ShortcutCategory, WeeklyWin } from '@/lib/types';
import Help from '@/components/Help';
import { toast } from '@/hooks/use-toast';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { Button } from '@/components/ui/button';
import {
  addWeeklyWin,
  deleteShortcut,
  deleteWeeklyWin,
  getWeeklyWins,
  setWeeklyWinDone
} from '@/lib/actions';
import { getColorCode } from '@/lib/utils';
import MessageEmpty from '@/components/MessageEmpty';
import { Input } from '@/components/ui/input';
import ExplanationWeeklyWins from './explanation-weekly-wins';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const task = formData.get('task') as string;
  const type = formData.get('type') as string;
  const uid = formData.get('uid') as string;

  if (task.length > 10) {
    toast({
      title: 'Maximum 10 characters!',
      description: 'The task name should be at most 10 characters.',
      variant: 'destructive'
    });
    return;
  }

  // if (!type) {
  //   toast({
  //     title: 'Type is required!',
  //     description: 'And the image URL should be sourced from Unsplash, ok?',
  //     variant: 'destructive'
  //   });
  // }

  const weeklyWin = await addWeeklyWin(uid, task, type);
  if (!weeklyWin) {
    toast({
      title: 'Ops...',
      description: 'Something got wrong. 🚨 Try again.',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Weekly Win added successfully! 🎉',
      description: 'You have one more goal to conquer.',
      variant: 'success'
    });
  }
  const newWeeklyWin = await getWeeklyWins(uid);

  return {
    newWeeklyWin
  };
};

export default function WeeklyWins({
  uid,
  weeklyWins
}: {
  uid: string;
  weeklyWins: WeeklyWin[];
}) {
  const [openAction, setOpenAction] = useState(false);
  // const [board, setBoard] = useState<WeeklyWin[]>([]);

  const [currentWeeklyWins, setCurrentWeeklyWins] =
    useState<WeeklyWin[]>(weeklyWins);
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  const board: WeeklyWin[][] = Object.values(
    currentWeeklyWins.reduce(
      (acc: Record<string, WeeklyWin[]>, curr: WeeklyWin) => {
        if (acc[curr.type]) {
          acc[curr.type].push(curr);
        } else {
          acc[curr.type] = [curr];
        }
        return acc;
      },
      {}
    )
  );

  useEffect(() => {
    if (data?.newWeeklyWin && Array.isArray(data.newWeeklyWin)) {
      setBoard(data.newWeeklyWin as WeeklyWin[]);
    }
  }, [data]);

  const handleDeleteItem = async (weeklyWin: WeeklyWin) => {
    try {
      const success = await deleteWeeklyWin(weeklyWin.id);
      if (success) {
        setCurrentWeeklyWins(
          currentWeeklyWins.filter((el) => el.id !== weeklyWin.id)
        );
      }
      toast({
        title: 'Weekly Wins Task gone!',
        description: `Deleted task: ${weeklyWin.task}!`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error deleting Task! 🚨',
        description: 'Something went wrong while deleting this Task.',
        variant: 'destructive'
      });
    }
  };

  // const handleCheck = async (weeklyWin: WeeklyWin) => {
  //   try {
  //     const success = await setWeeklyWinDone(weeklyWin.id, !weeklyWin.done);
  //     if (success) {
  //       setBoard((prevBoard) =>
  //         prevBoard.map((boardItem) =>
  //           boardItem.id === weeklyWin.id
  //             ? { ...boardItem, done: !boardItem.done }
  //             : boardItem
  //         )
  //       );
  //     }
  //     toast({
  //       title: 'Weekly Win Progress Updated! 🌟',
  //       description: `"${weeklyWin.task}" has been marked as ${weeklyWin.done ? 'incomplete' : 'achieved'}. Keep up the good work!`,
  //       variant: 'success'
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     toast({
  //       title: 'Error changing Status! 🚨',
  //       description:
  //         'Something went wrong while changing the Status of this Item.',
  //       variant: 'destructive'
  //     });
  //   }
  // };

  const toggleDescription = (shortcutId: string) => {
    // setOpenDescriptions((prevOpen) => {
    //   const newOpen = new Set(prevOpen);
    //   if (newOpen.has(shortcutId)) {
    //     newOpen.delete(shortcutId);
    //   } else {
    //     newOpen.add(shortcutId);
    //   }
    //   return newOpen;
    // });
  };

  const weeklyWinsTypes = ['Easy', 'Moderate', 'Challenging'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between items-start mb-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p>Weekly Wins</p>
              <div className="block sm:hidden">
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">S</span>tay focused, track progress,
              and celebrate your wins each week!
            </p>
          </div>

          <div
            className={`${barlow.className} flex gap-4 capitalize mt-8 sm:mt-0`}
          >
            <form
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-2 font-normal"
              action={action}
            >
              <div className="flex flex-col gap-1 w-full sm:w-2/5">
                <Input placeholder="Goal" id="task" name="task" />
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">N</span>ame your Goal
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-2/5">
                <Select name="type">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" id="type" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeklyWinsTypes.map((type: string) => (
                      <div key={type}>
                        <SelectItem value={type}>{type}</SelectItem>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">C</span>
                  hoose your task level
                </p>
              </div>
              <Input
                id="uid"
                name="uid"
                value={uid}
                readOnly
                className="hidden"
              />
              <Button type="submit" disabled={isPending} className="ml-2">
                {isPending ? 'Adding...' : 'Add'}
              </Button>
            </form>
          </div>

          {/* <div className="hidden sm:block">
            <FormWeeklyWins
              action={action}
              setOpenAction={setOpenAction}
              isPending={isPending}
              uid={uid}
              openAction={openAction}
            />
          </div> */}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <AnimatePresence>
          {openAction ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="mb-12">
                <ExplanationWeeklyWins setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {board.length < 1 && (
          <div className="mt-8">
            <MessageEmpty
              image={'/weekly-wins-empty.webp'}
              objectPosition={'50% 10%'}
              alt={'Looking for something'}
              icon={<Ghost size={32} strokeWidth={1.6} />}
              titleOne={'Oops...'}
              titleTwo={'Weekly Wins Not Found'}
              subtitle={
                'Looks like your week is wide open! Ready to tackle some wins? Add a task or two and let’s get that progress bar moving!'
              }
              setOpenAction={setOpenAction}
              buttonCopy={'How do I start?'}
              hasButton={true}
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row w-full gap-8">
          {board.map((groupOfWins: WeeklyWin[]) => (
            <div key={groupOfWins[0].type} className="sm:w-1/5">
              <h3
                className={`${kumbh_sans.className} text-left text-sm font-semibold text-primary px-4 py-3 my-2 uppercase leading-none`}
                // style={getColorCode(
                //   groupOfShortcuts[0].category?.color ?? 'grey'
                // )}
              >
                {groupOfWins[0].type}
              </h3>

              {groupOfWins.map((win: WeeklyWin) => (
                <>
                  <div key={win.id} className="flex border border-primary mt-2">
                    <div className="w-full px-4 py-3">
                      {/* <Link
                        href={win.url}
                        target="_blank"
                        className="w-full"
                      > */}
                      <p className="text-left uppercase text-sm leading-none">
                        {win.task}
                      </p>
                      {/* </Link> */}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        toggleDescription(win.id);
                      }}
                    >
                      {/* {openDescriptions.has(win.id) ? (
                        <ArrowUpWideNarrow
                          size={18}
                          strokeWidth={1.8}
                          color="#000"
                        />
                      ) : (
                        <ArrowDownWideNarrow
                          size={18}
                          strokeWidth={1.8}
                          color="#000"
                        />
                      )} */}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger className="px-2 py-1 mr-4">
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
                            <span className="font-bold mx-1">{win.task}</span>
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
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(win)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* <AnimatePresence>
                    {openDescriptions.has(win.id) ? (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 0, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.5,
                          transition: { duration: 0.1 }
                        }}
                      >
                        <div className="px-4 py-2 bg-primary text-white text-xs font-semibold">
                          {shortcut.description ? (
                            shortcut.description
                          ) : (
                            <div className="flex items-center ml-1">
                              <MessageCircleX
                                size={18}
                                strokeWidth={1.8}
                                color="#fff"
                              />
                              <p className="ml-2">No description available.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence> */}
                </>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// function FormWeeklyWins({
//   action,
//   setOpenAction,
//   isPending,
//   uid,
//   openAction
// }: {
//   action: (payload: FormData) => void;
//   setOpenAction: (value: boolean) => void;
//   isPending: boolean;
//   uid: string;
//   openAction: boolean;
// }) {
//   return (
//     <>
//       <div
//         className={`${barlow.className} flex gap-4 capitalize mt-4 mb-12 sm:mb-0 sm:mt-0`}
//       >
//         <form
//           className="flex flex-col sm:flex-row items-start gap-4 sm:gap-2 font-normal"
//           action={action}
//         >
//           <div className="flex flex-col gap-1 w-full sm:w-2/5">
//             <Input placeholder="Goal" id="task" name="task" />
//             <p className="text-xs ml-4 lowercase">
//               <span className="uppercase">N</span>ame your Weekly Win
//             </p>
//           </div>
//           <div className="flex flex-col gap-1 w-full sm:w-2/5">
//             <Input placeholder="Type" id="url" name="url" />
//             <p className="text-xs ml-4 lowercase">
//               <span className="uppercase">A</span>dd the URL of a picture from
//               <Link
//                 className="mx-1 font-bold underline"
//                 href="https://unsplash.com/"
//                 target="_blank"
//               >
//                 <span className="uppercase">U</span>nsplash
//               </Link>
//               that reflects your vision. *
//             </p>
//           </div>
//           <Input id="uid" name="uid" value={uid} readOnly className="hidden" />
//           <Button type="submit" disabled={isPending} className="ml-2">
//             {isPending ? 'Adding...' : 'Add'}
//           </Button>
//         </form>
//       </div>
//     </>
//   );
// }

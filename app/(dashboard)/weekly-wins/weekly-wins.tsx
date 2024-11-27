'use client';

import { useActionState, useEffect, useState } from 'react';
import { Bomb, Check, Ghost, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 } from 'uuid';

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
import { WeeklyWin } from '@/lib/types';
import Help from '@/components/Help';
import { toast } from '@/hooks/use-toast';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { Button } from '@/components/ui/button';
import {
  addWeeklyWin,
  deleteWeeklyWin,
  getWeeklyWins,
  setWeeklyWinDone
} from '@/lib/actions';
import MessageEmpty from '@/components/MessageEmpty';
import { Input } from '@/components/ui/input';
import ExplanationWeeklyWins from './explanation-weekly-wins';

type WeeklyWinsTypes = 'Easy' | 'Moderate' | 'Challenging';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const goal = formData.get('goal') as string;
  const type = formData.get('type') as string;
  const uid = formData.get('uid') as string;

  if (!goal) {
    toast({
      title: 'Goal is required!',
      description: 'What do you want to achieve in 7 days?',
      variant: 'destructive'
    });
    return;
  }

  if (!type) {
    toast({
      title: 'Type is required!',
      description: 'Is it an easy, moderate, or challenging goal?',
      variant: 'destructive'
    });
  }

  const weeklyWin = await addWeeklyWin(uid, goal, type);
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
  const [currentWeeklyWins, setCurrentWeeklyWins] =
    useState<WeeklyWin[]>(weeklyWins);
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  const weeklyWinsTypes: WeeklyWinsTypes[] = [
    'Easy',
    'Moderate',
    'Challenging'
  ];

  const weeklyWinsTypesColors: Record<WeeklyWinsTypes, string> = {
    Easy: 'bg-green-500',
    Moderate: 'bg-yellow-500',
    Challenging: 'bg-red-500'
  };

  const weeklyWinsTypesColorsDone: Record<string, string> = {
    Easy: 'bg-green-200',
    Moderate: 'bg-yellow-100',
    Challenging: 'bg-red-200'
  };

  const board: WeeklyWin[][] = weeklyWinsTypes
    .map((type) => currentWeeklyWins.filter((el) => el.type === type))
    .filter((group) => group.length > 0);

  useEffect(() => {
    if (data?.newWeeklyWin && Array.isArray(data.newWeeklyWin)) {
      ``;
      setCurrentWeeklyWins(data.newWeeklyWin as WeeklyWin[]);
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
        title: 'Weekly Wins Goal gone!',
        description: `Deleted Goal: ${weeklyWin.goal}!`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error deleting Goal! 🚨',
        description: 'Something went wrong while deleting this Goal.',
        variant: 'destructive'
      });
    }
  };

  const handleCheck = async (weeklyWin: WeeklyWin) => {
    try {
      const success = await setWeeklyWinDone(weeklyWin.id, !weeklyWin.done);
      if (success) {
        setCurrentWeeklyWins((prevBoard) =>
          prevBoard.map((boardItem) =>
            boardItem.id === weeklyWin.id
              ? { ...boardItem, done: !boardItem.done }
              : boardItem
          )
        );
      }
      toast({
        title: 'Weekly Win Progress Updated! 🌟',
        description: `"${weeklyWin.goal}" has been marked as ${weeklyWin.done ? 'incomplete' : 'achieved'}. Keep up the good work!`,
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
          <div className="flex flex-col w-full">
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
            className={`${barlow.className} flex gap-4 capitalize mt-8 sm:mt-0 w-full`}
          >
            <form
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-2 font-normal w-full"
              action={action}
            >
              <div className="flex flex-col gap-1 w-full sm:w-[15ch]">
                <Input placeholder="Goal" id="goal" name="goal" />
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">N</span>ame your Goal
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-[15ch]">
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
                  hoose your goal level
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
          <div className="hidden sm:block">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
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
                'Looks like your week is wide open! Ready to tackle some wins? Add a Goal or two and let’s get that progress bar moving!'
              }
              setOpenAction={setOpenAction}
              buttonCopy={'How do I start?'}
              hasButton={true}
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row w-full justify-center gap-8 mb-12">
          {board.map((groupOfWins: WeeklyWin[]) => (
            <div key={v4()} className="sm:w-1/3 mt-4">
              <h3
                className={`${kumbh_sans.className} ${weeklyWinsTypesColors[groupOfWins[0].type as WeeklyWinsTypes]} text-white text-left text-sm font-semibold text-primary px-4 py-3 my-2 uppercase leading-none`}
              >
                {groupOfWins[0].type}
              </h3>
              {groupOfWins.map((el: WeeklyWin) => (
                <div
                  key={el.id}
                  className={`${el.done && weeklyWinsTypesColorsDone[el.type]} flex border border-primary mt-2`}
                >
                  <div className="w-full px-4 py-3">
                    <p
                      className={`${el.done && 'line-through'} text-left uppercase text-sm leading-none`}
                    >
                      {el.goal}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => handleCheck(el)}>
                    <Check
                      size={18}
                      strokeWidth={1.8}
                      color="#000"
                      // color={win.done ? '#FFF' : '#000'}
                    />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger className="px-2 py-1 mr-4">
                      <Trash2
                        size={18}
                        strokeWidth={1.8}
                        color="#000"
                        // color={win.done ? '#FFF' : '#000'}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[calc(100%-35px)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <Bomb size={24} strokeWidth={1.8} />
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="py-4">
                          This will permanently delete the vision
                          <span className="font-bold mx-1">{el.goal}</span>
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
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

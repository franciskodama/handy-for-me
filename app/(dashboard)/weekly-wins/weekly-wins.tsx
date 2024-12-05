'use client';

import { useEffect, useState } from 'react';
import { Bomb, Check, Ghost, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 } from 'uuid';

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
import { weekDays, WeeklyWin } from '@/lib/types';
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
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';

type WeeklyWinsTypes = 'Easy' | 'Moderate' | 'Challenging';

type Inputs = {
  goal: string;
  type: string;
  uid: string;
  done: boolean;
  weekDays: weekDays;
};

export default function WeeklyWins({
  uid,
  weeklyWins
}: {
  uid: string;
  weeklyWins: WeeklyWin[];
}) {
  const [openAction, setOpenAction] = useState(false);
  const [board, setBoard] = useState<WeeklyWin[][]>([]);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

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

  const {
    register,
    handleSubmit: handleSubmitAddGoal,
    control: controlAddGoal,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>();

  const {
    handleSubmit: handleSubmitAccomplishedDays,
    control: controlAccomplishedDays
  } = useForm<weekDays>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { goal, type, uid, weekDays } = data;

    try {
      await addWeeklyWin(uid, goal, type, weekDays);
      const fetchedWeeklyWins = await getWeeklyWins(uid);
      fetchedWeeklyWins &&
        setBoard(organizeBoardByType(fetchedWeeklyWins as WeeklyWin[]));
      toast({
        title: 'Goal Added!',
        description: `"${data.goal}" has been added to Weekly Wins Board.`,
        variant: 'success'
      });

      reset({
        goal: '',
        type: ''
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Adding Goal!',
        description: 'Something went wrong while adding your Goal.',
        variant: 'destructive'
      });
    }
  };

  const organizeBoardByType = (weeklyWins: WeeklyWin[]) => {
    const boardByType: WeeklyWin[][] = weeklyWinsTypes
      .map((type) => weeklyWins.filter((el) => el.type === type))
      .filter((group) => group.length > 0);
    return boardByType;
  };

  const boardByType = organizeBoardByType(weeklyWins);

  useEffect(() => {
    if (boardByType) {
      setBoard(boardByType);
    }
  }, []);

  const handleDeleteItem = async (weeklyWin: WeeklyWin) => {
    try {
      const success = await deleteWeeklyWin(weeklyWin.id);
      if (success) {
        setBoard((prevBoard) =>
          prevBoard
            .map((typeArray) =>
              typeArray[0].type === weeklyWin.type
                ? typeArray.filter((item) => item.id !== weeklyWin.id)
                : typeArray
            )
            .filter((categoryArray) => categoryArray.length > 0)
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
        setBoard((prevBoard) =>
          prevBoard.map((typeArray) =>
            typeArray[0].type === weeklyWin.type
              ? typeArray.map((boardItem) =>
                  boardItem.id === weeklyWin.id
                    ? { ...boardItem, done: !boardItem.done }
                    : boardItem
                )
              : typeArray
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
          </div>

          <div className="hidden sm:block">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
        </CardTitle>

        <CardDescription>
          Stay focused, track progress, and celebrate your wins each week!
        </CardDescription>
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

        <form
          className="flex flex-col sm:flex-row items-start justify-center gap-8 sm:gap-2 font-normal w-full my-8 sm:mt-0"
          onSubmit={handleSubmitAddGoal(onSubmit)}
        >
          <div className="flex flex-col gap-1 w-full sm:w-[35ch]">
            <Input
              placeholder="Goal"
              {...register('goal', {
                required: 'Goal name is required',
                maxLength: {
                  value: 50,
                  message: 'Goal name must be 50 characters or less'
                }
              })}
            />
            {errors.goal && (
              <span className="bg-red-500 text-white text-xs text-center font-semibold w-full py-1 my-1">
                {errors.goal.message}
              </span>
            )}
            <p className="text-xs ml-4">Name your Goal</p>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-[35ch]">
            <Controller
              name="type"
              control={controlAddGoal}
              rules={{ required: 'Type is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeklyWinsTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <span className="bg-red-500 text-white text-xs text-center font-semibold w-full py-1 my-1">
                {errors.type.message}
              </span>
            )}
            <p className="text-xs ml-4">Choose your Goal level</p>
          </div>
          <Input {...register('uid')} value={uid} readOnly className="hidden" />

          <div className="flex-col items-center justify-items-center sm:mx-12 w-full sm:w-[14em]">
            <div className="flex justify-between w-full px-4 sm:gap-4">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">M</p>
                <Controller
                  name="weekDays.monday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">T</p>
                <Controller
                  name="weekDays.tuesday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">W</p>
                <Controller
                  name="weekDays.wednesday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">T</p>
                <Controller
                  name="weekDays.thursday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">F</p>
                <Controller
                  name="weekDays.friday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">S</p>
                <Controller
                  name="weekDays.saturday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs">S</p>
                <Controller
                  name="weekDays.sunday"
                  control={controlAddGoal}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) => onChange(checked)}
                    />
                  )}
                />
              </div>
            </div>
            <p className="text-xs mt-2">
              Weekdays you want to work on this Goal
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto mb-4 ml-2"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </form>

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
        <div
          className="flex justify-between my-12 text-lg font-semibold px-24 py-2 border border-primary bg-background shadow-[0_0px_0px_0px_inset,#FFF_-3px_3px_0_-1px,#0F1739_-3px_3px]
        
        "
        >
          <div>
            <span className="mr-2 text-red-500 text-xl font-semibold uppercase">
              {today}:
            </span>
            {dailyPhrases[today]}
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex">
              <div className="h-3 w-8 bg-white"></div>
              <div className="h-3 w-32 bg-red-500s"></div>
            </div>
            <p>{progressPhrases[today]}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full justify-center gap-8 mb-12">
          {board.map((groupOfWins: WeeklyWin[]) => (
            <div key={v4()} className="sm:w-1/3 max-w-96 mt-4">
              <h3
                className={`${kumbh_sans.className} ${weeklyWinsTypesColors[groupOfWins[0].type as WeeklyWinsTypes]} text-white text-left text-sm font-semibold text-primary px-4 py-3 my-2 uppercase leading-none`}
              >
                {groupOfWins[0].type}
              </h3>
              {groupOfWins.map((el: WeeklyWin) => (
                <div key={v4()}>
                  <div
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
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(el)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const dailyPhrases: Record<string, string> = {
  Monday: 'Monday: Fresh Start, New Goals! 🏁 Let’s tackle this week head-on!',
  Tuesday: 'Tuesday: Momentum! 🚀 Keep building on yesterday’s wins!',
  Wednesday: 'Wednesday: Midweek Magic! 🪄 You’re halfway to greatness!',
  Thursday: 'Thursday: Thrives—just a little more to go! 💪🏻',
  Friday: 'Friday: Finish Strong! Wrap up the week with a win! 👏🏻👏🏻👏🏻',
  Saturday: 'Saturday: Supercharged Saturday—enjoy and stay productive! 🔋',
  Sunday: 'Reflect & Recharge—prepare for a bright week ahead! 🧘🏻 '
};

const progressPhrases: Record<string, string> = {
  Monday: '10% in, keep the energy flowing this Monday!',
  Tuesday: '10% complete, the journey continues this Tuesday!',
  Wednesday: "10% done, you're on your way this Wednesday!",
  Thursday: '10% achieved, keep climbing higher this Thursday!',
  Friday: '10% progress—momentum is building this Friday!',
  Saturday: '10% of the way there—enjoy the weekend grind this Saturday!',
  Sunday: '10% down, greatness is ahead this Sunday!'
};

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bomb, Check, FlagOff, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { BucketListItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  addBucketListItem,
  deleteBucketListItem,
  getBucketListItems,
  setBucketListItemDone
} from '@/lib/actions';
import { barlow } from '@/app/ui/fonts';
import { toast } from '@/hooks/use-toast';
import ExplanationBucketList from './explanation-bucket-list';
import Help from '@/components/Help';
import MessageEmpty from '@/components/MessageEmpty';

type Category = {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
};

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const uid = formData.get('uid') as string;
  const item = formData.get('item') as string;
  const category = formData.get('category') as string;

  if (item.length < 3) {
    toast({
      title: 'The name is too short!',
      description: `The name should be at least 3 characters.`,
      variant: 'destructive'
    });
    return;
  }

  if (!item) {
    toast({
      title: 'Name is required!',
      description: `No Adventure's name, no bucket list item.`,
      variant: 'destructive'
    });
    return;
  }

  if (!category) {
    toast({
      title: 'Category is required!',
      description:
        'The categories will give a nice overview of the Bucket List. Trust me! :)',
      variant: 'destructive'
    });
    return;
  }

  const BucketListItem = await addBucketListItem(uid, item, category);
  if (!BucketListItem) {
    toast({
      title: 'Ops...',
      description: 'Something got wrong. 🚨 Try again.',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Category added successfully! 🎉',
      description: 'You have one more item to conquer!',
      variant: 'success'
    });
  }
  const newBucketListItem = await getBucketListItems(uid);

  return {
    newBucketListItem
  };
};

const sortBucketList = (bucketList: BucketListItem[]) => {
  const sortedBucketList = bucketList.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return 0;
  });
  return sortedBucketList;
};

export default function BucketList({
  uid,
  bucketList
}: {
  uid: string;
  bucketList: BucketListItem[];
}) {
  const [openAction, setOpenAction] = useState(false);
  const [board, setBoard] = useState<BucketListItem[]>([]);
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  useEffect(() => {
    if (bucketList) {
      setBoard(sortBucketList(bucketList));
    }
  }, []);

  useEffect(() => {
    if (data?.newBucketListItem && Array.isArray(data.newBucketListItem)) {
      setBoard(data.newBucketListItem as BucketListItem[]);
    }
  }, [data]);

  const handleDeleteItem = async (el: BucketListItem) => {
    try {
      const success = await deleteBucketListItem(el.id);
      if (success) {
        setBoard(board.filter((element) => element.id !== el.id));
      }
      toast({
        title: 'Item gone!',
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

  const handleCheck = async (el: BucketListItem) => {
    try {
      const success = await setBucketListItemDone(el.id, !el.done);
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

  function getColorCodes(category: string) {
    const foundCategory = bucketListCategories.find(
      (el: any) => el.name === category
    );
    const bgColorCode = foundCategory?.bgColor || '#000000';
    const textColorCode = foundCategory?.textColor || '#FFF';

    return { color: textColorCode, backgroundColor: bgColorCode };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between items-start mb-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p>Bucket List</p>
              <div className="block sm:hidden">
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">A</span>
              dd, explore, and cross off your next adventure.
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
                <Input placeholder="Adventure" id="item" name="item" />
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">N</span>ame your adventure in one
                  word.
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-2/5">
                <Select name="category">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" id="category" />
                  </SelectTrigger>
                  <SelectContent>
                    {bucketListCategories.map((el: Category) => (
                      <div key={el.name}>
                        <SelectItem value={el.name}>{el.name}</SelectItem>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">C</span>
                  hoose a category that best describes your adventure.
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
                <ExplanationBucketList setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {board.length < 1 && (
          <div className="mt-8">
            <MessageEmpty
              image={'/superman-where.webp'}
              objectPosition={'50% 10%'}
              alt={'Looking for something'}
              icon={<FlagOff size={32} strokeWidth={1.6} />}
              titleOne={'Oops...'}
              titleTwo={'Adventures Missing'}
              subtitle={
                'Every hero needs epic adventures! Start adding yours now and get ready for action!'
              }
              setOpenAction={setOpenAction}
              buttonCopy={`Tell me more about it`}
              hasButton={true}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 my-12">
          {board.map((el: BucketListItem) => (
            <div key={el.id}>
              <div className="relative group">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p
                        className="text-center text-sm sm:text-xl px-4 py-1 font-semibold"
                        style={getColorCodes(el.category)}
                      >
                        {el.item}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-primary ml-2 capitalize font-light">
                        {el.category}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {el.done ? (
                  <>
                    <div
                      className="absolute bottom-1/2 translate-y-[calc(50%+2px)] left-0 opacity-70 h-[2px] w-full"
                      style={{
                        backgroundColor: getColorCodes(el.category).color
                      }}
                    />
                  </>
                ) : null}

                <AlertDialog>
                  <AlertDialogTrigger
                    className="absolute bottom-full right-0 translate-y-0 opacity-0 group-hover:opacity-100 p-1 z-200"
                    style={getColorCodes(el.category)}
                  >
                    <Trash2
                      size={18}
                      strokeWidth={1.8}
                      color={getColorCodes(el.category).color}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[calc(100%-35px)]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Bomb size={24} strokeWidth={1.8} />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="py-4">
                        This will permanently delete the adventure
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
                  className="absolute bottom-full left-0 -translate-y-0 opacity-0 group-hover:opacity-100 h-6 bg-white p-1 z-200"
                  style={getColorCodes(el.category)}
                  onClick={() => handleCheck(el)}
                  variant={'link'}
                >
                  <Check
                    size={18}
                    strokeWidth={1.8}
                    color={getColorCodes(el.category).color}
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const bucketListCategories = [
  {
    name: 'Adventure',
    color: 'red',
    bgColor: '#FF0000',
    textColor: '#FFFF00'
  },
  { name: 'Bar', color: 'orange', bgColor: '#FF7F00', textColor: '#FFFFFF' },
  {
    name: 'Cultural',
    color: 'yellow',
    bgColor: '#FFFF00',
    textColor: '#FF7F00'
  },
  {
    name: 'Destinations',
    color: 'green',
    bgColor: '#00FF00',
    textColor: '#8B00FF'
  },
  {
    name: 'Educational',
    color: 'blue',
    bgColor: '#0000FF',
    textColor: '#FFFF00'
  },
  {
    name: 'Entertainment',
    color: 'indigo',
    bgColor: '#8B00FF',
    textColor: '#FFFFFF'
  },
  { name: 'Event', color: 'violet', bgColor: '#EE82EE', textColor: '#8B00FF' },
  {
    name: 'Festival',
    color: 'red',
    bgColor: '#FF0000',
    textColor: '#FFFFFF'
  },
  {
    name: 'Historical',
    color: 'orange',
    bgColor: '#FF7F00',
    textColor: '#FFFFFF'
  },
  {
    name: 'Landmark',
    color: 'yellow',
    bgColor: '#FFFF00',
    textColor: '#FF7F00'
  },
  { name: 'Nature', color: 'green', bgColor: '#00FF00', textColor: '#8B00FF' },
  {
    name: 'Nightlife',
    color: 'blue',
    bgColor: '#0000FF',
    textColor: '#FFFF00'
  },
  {
    name: 'Outdoor Activity',
    color: 'blue',
    bgColor: '#0000FF',
    textColor: '#FFFFFF'
  },
  {
    name: 'Restaurant',
    color: 'indigo',
    bgColor: '#8B00FF',
    textColor: '#FFFFFF'
  },
  {
    name: 'Romantic',
    color: 'violet',
    bgColor: '#EE82EE',
    textColor: '#8B00FF'
  },
  {
    name: 'Shopping',
    color: 'red',
    bgColor: '#FF0000',
    textColor: '#FFFF00'
  },
  { name: 'Sport', color: 'orange', bgColor: '#FF7F00', textColor: '#FFFFFF' },
  {
    name: 'Wellness',
    color: 'yellow',
    bgColor: '#FFFF00',
    textColor: '#FF7F00'
  }
];

function createRainbowCategories(categories: string[]) {
  // Sort the categories alphabetically
  categories.sort();

  // Calculate the number of categories
  const numCategories = categories.length;

  // Determine the color step for the rainbow effect
  const colorStep = 360 / numCategories;

  // Create an array to store the formatted categories
  const rainbowCategories = [];

  // Iterate over each category and create a formatted object
  for (let i = 0; i < numCategories; i++) {
    const categoryName = categories[i];
    const hue = i * colorStep;
    const saturation = 100;
    const lightness = 50;

    // Convert HSL color to RGB
    const rgb = hslToRgb(hue, saturation, lightness);
    const colorCode = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;

    rainbowCategories.push({
      name: categoryName,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      colorCode: colorCode
    });
  }

  return rainbowCategories;
}

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

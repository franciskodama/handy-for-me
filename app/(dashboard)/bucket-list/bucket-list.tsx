'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bomb, Check, CircleHelp, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

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

type Category = {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
};

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const uid = formData.get('uid') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;

  if (name.length < 3) {
    toast({
      title: 'The name is too short!',
      description: `The name should be at least 3 characters.`,
      variant: 'destructive'
    });
    return;
  }

  if (!name) {
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

  const BucketListItem = await addBucketListItem(uid, name, category);
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

  const handleDeleteItem = async (item: BucketListItem) => {
    try {
      const success = await deleteBucketListItem(item.id);
      if (success) {
        setBoard(board.filter((el) => el.id !== item.id));
      }
      toast({
        title: 'Item gone!',
        description: `The ${item.name} has been successfully deleted.`,
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

  const handleCheck = async (item: BucketListItem) => {
    try {
      const success = await setBucketListItemDone(item.id, !item.done);
      if (success) {
        setBoard((prevBoard) =>
          prevBoard.map((boardItem) =>
            boardItem.id === item.id
              ? { ...boardItem, done: !boardItem.done }
              : boardItem
          )
        );
      }
      toast({
        title: 'Vision Progress Updated! 🌟',
        description: `"${item.name}" has been marked as ${item.done ? 'incomplete' : 'achieved'}. Keep pushing towards your dreams!`,
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
    const foundCategory = categories.find(
      (item: any) => item.name === category
    );
    const bgColorCode = foundCategory?.bgColor || '#000000';
    const textColorCode = foundCategory?.textColor || '#FFF';

    return { color: textColorCode, backgroundColor: bgColorCode };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start mb-0">
          <div className="flex flex-col">
            Bucket List
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">A</span>
              dd, explore, and cross off your next adventure.
            </p>
          </div>
          <div className={`${barlow.className} flex gap-4 capitalize w-3/5`}>
            <form className="w-full" action={action}>
              <div className="flex items-start gap-2 font-normal">
                <div className="flex flex-col w-full gap-1">
                  <Input placeholder="Adventure" id="name" name="name" />
                  <p className="text-xs ml-4 lowercase">
                    <span className="uppercase">N</span>ame your adventure in
                    one word.
                  </p>
                </div>
                <div className="flex flex-col w-full gap-1">
                  <Select name="category">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" id="category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: Category) => (
                        <div key={category.name}>
                          <SelectItem value={category.name}>
                            {category.name}
                          </SelectItem>
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
                <Button variant={'outline'} type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add'}
                </Button>
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

        <div className="flex flex-wrap gap-2 mt-12">
          {board.map((item: BucketListItem) => (
            <div key={item.id}>
              <div className="relative group">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p
                        className="text-center text-xl px-4 py-1 font-semibold"
                        style={getColorCodes(item.category)}
                      >
                        {item.name}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-primary ml-2 capitalize font-light">
                        {item.category}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {item.done ? (
                  <>
                    <div
                      className="absolute bottom-1/2 translate-y-[calc(50%+2px)] left-0 opacity-70 h-[2px] bg-primary w-full"
                      style={{
                        backgroundColor: getColorCodes(item.category).color
                      }}
                    />
                  </>
                ) : null}

                <AlertDialog>
                  <AlertDialogTrigger
                    className="absolute bottom-full right-0 translate-y-0 opacity-0 group-hover:opacity-100 p-1 z-200"
                    style={getColorCodes(item.category)}
                  >
                    <Trash2
                      size={18}
                      strokeWidth={1.8}
                      color={getColorCodes(item.category).color}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Bomb size={24} strokeWidth={1.8} />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="py-4">
                        This will permanently delete the adventure
                        <span className="font-bold mx-1">{item.name}</span>
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
                      <AlertDialogAction onClick={() => handleDeleteItem(item)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="absolute bottom-full left-0 -translate-y-0 opacity-0 group-hover:opacity-100 h-6 bg-white p-1 z-200"
                  style={getColorCodes(item.category)}
                  onClick={() => handleCheck(item)}
                  variant={'link'}
                >
                  <Check
                    size={18}
                    strokeWidth={1.8}
                    color={getColorCodes(item.category).color}
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

const categories = [
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

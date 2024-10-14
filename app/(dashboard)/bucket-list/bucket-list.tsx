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
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { toast } from '@/hooks/use-toast';
import ExplanationBucketList from './explanation-bucket-list';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const uid = formData.get('uid') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;

  if (!name) {
    toast({
      title: 'Name is required!',
      description: `No Adventure's name, no bucket list item.`,
      variant: 'destructive'
    });
  }

  if (!category) {
    toast({
      title: 'Category is required!',
      description:
        'The categories will give a nice overview of the Bucket List. Trust me! :)',
      variant: 'destructive'
    });
  }

  const BucketListItem = await addBucketListItem(uid, name, category);
  console.log('---  🚀 ---> | BucketListItem:', BucketListItem);
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

const randomSortBucketList = (bucketList: BucketListItem[]) => {
  const shuffledBucket = [...bucketList];
  for (let i = shuffledBucket.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBucket[i], shuffledBucket[j]] = [
      shuffledBucket[j],
      shuffledBucket[i]
    ];
  }
  return shuffledBucket;
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
      setBoard(randomSortBucketList(bucketList));
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

  const rainbowCategories = createRainbowCategories(categories);
  console.log('---  🚀 ---> | rainbowCategories:', rainbowCategories);

  function getColorCode(category: string) {
    const colorCode = rainbowCategories.find(
      (item) => item.name === category
    )?.colorCode;
    console.log('---  🚀 ---> | colorCode:', colorCode);
    return colorCode;
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
                  <Input placeholder="Category" id="category" name="category" />
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
        {/* <CardDescription></CardDescription> */}
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
                {/* <p className="text-center text-xl text-white bg-primary px-4 py-1"> */}
                {/* <p className="text-center text-xl text-white bg-[#ff5a00] px-4 py-1"> */}
                <p
                  className={`bg-[${getColorCode(item.category)}] text-center text-xl text-black px-4 py-1`}
                >
                  {item.name}
                </p>

                {item.done ? (
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
                  <AlertDialogTrigger className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 bg-white p-1">
                    <Trash2 size={18} strokeWidth={1.8} color="#000" />
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
                  className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 h-6 bg-white p-1"
                  onClick={() => handleCheck(item)}
                  variant={'link'}
                >
                  <Check size={18} strokeWidth={1.8} color="#000" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// include cities, states/provinces, or countries
// put in a object with the name of the color and the code of the color
const categories = [
  'Cultural',
  'Restaurant',
  'Bar',
  'Nature',
  'Adventure',
  'Historical',
  'Shopping',
  'Entertainment',
  'Event',
  'Landmark',
  'Outdoor Activity',
  'Wellness',
  'Festival',
  'Sport',
  'Educational',
  'Romantic',
  'Nightlife'
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
function hslToRgb(h, s, l) {
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

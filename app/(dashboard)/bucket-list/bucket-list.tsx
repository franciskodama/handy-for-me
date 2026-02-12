'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bomb,
  FlagOff,
  Shuffle,
  Square,
  SquareCheckBig,
  Trash2,
  Printer
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
import { BucketListItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  addBucketListItem,
  deleteBucketListItem,
  getBucketListItems,
  setBucketListItemDone
} from '@/lib/actions/bucket-list';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { toast } from '@/hooks/use-toast';
import ExplanationBucketList from './explanation-bucket-list';
import Help from '@/components/common/Help';
import MessageEmpty from '@/components/MessageEmpty';

type Category = {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
};

type BucketListCategory = {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
};

type Inputs = {
  item: string;
  category: string;
  uid: string;
};

export default function BucketList({
  uid,
  bucketList
}: {
  uid: string;
  bucketList: BucketListItem[];
}) {
  const [openAction, setOpenAction] = useState(false);
  const [showShuffleInfo, setShowShuffleInfo] = useState(false);
  const [board, setBoard] = useState<BucketListItem[][]>([]);
  const [filter, setFilter] = useState<'all' | 'done' | 'not-done'>('all');
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!boardRef.current) return;

    try {
      const canvas = await html2canvas(boardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const header = clonedDoc.getElementById('pdf-header');
          if (header) header.style.display = 'block';

          const board = clonedDoc.getElementById('bucket-list-board');
          if (board) {
            board.style.padding = '40px';
            board.style.background = 'white';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Bucket-List-${new Date().getFullYear()}.pdf`);

      toast({
        title: 'PDF Generated! 📄',
        description: 'Your bucket list is ready to print.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Generation Failed 🚨',
        description: 'Could not create PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { item, category } = data;

    try {
      const result = await addBucketListItem(uid, item, category);

      if (result) {
        const newBucketLists = await getBucketListItems(uid);
        newBucketLists && setBoard(organizeBoardByCategory(newBucketLists));
        toast({
          title: 'Adventure Added!',
          description: `"${data.item}" has been added to your bucket list.`,
          variant: 'success'
        });

        reset({
          item: '',
          category: ''
        });
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Adding Adventure',
        description: 'Something went wrong while adding your adventure.',
        variant: 'destructive'
      });
    }
  };

  const organizeBoardByCategory = (bucketList: BucketListItem[]) => {
    const filteredList = bucketList.filter((item) => {
      if (filter === 'done') return item.done;
      if (filter === 'not-done') return !item.done;
      return true;
    });

    const organizedBoard: BucketListItem[][] = Object.values(
      filteredList.reduce(
        (acc: Record<string, BucketListItem[]>, curr: BucketListItem) => {
          if (acc[curr.category]) {
            acc[curr.category].push(curr);
          } else {
            acc[curr.category] = [curr];
          }
          return acc;
        },
        {}
      )
    )
      .sort((a, b) => {
        const sizeComparison = b.length - a.length;
        // If categories have the same number of items, sort alphabetically
        if (sizeComparison === 0) {
          return a[0].category.localeCompare(b[0].category);
        }

        return sizeComparison;
      })
      .map((categoryArray) =>
        categoryArray.sort((a, b) => a.item.localeCompare(b.item))
      );
    return organizedBoard;
  };

  const boardByCategory = organizeBoardByCategory(bucketList);

  useEffect(() => {
    // We need to re-organize the board whenever the filter changes
    // or when the initial bucketList is loaded.
    setBoard(organizeBoardByCategory(bucketList));
  }, [filter, bucketList]);

  const handleDeleteItem = async (el: BucketListItem) => {
    try {
      const success = await deleteBucketListItem(el.id);
      if (success) {
        setBoard((prevBoard) =>
          prevBoard
            .map((categoryArray) =>
              categoryArray[0].category === el.category
                ? categoryArray.filter((item) => item.id !== el.id)
                : categoryArray
            )
            .filter((categoryArray) => categoryArray.length > 0)
        );
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
          prevBoard.map((categoryArray) =>
            categoryArray[0].category === el.category
              ? categoryArray.map((boardItem) =>
                  boardItem.id === el.id
                    ? { ...boardItem, done: !boardItem.done }
                    : boardItem
                )
              : categoryArray
          )
        );
      }
      toast({
        title: 'Bucket List Updated! 🌟',
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

  const getColorCodes = (category: string) => {
    const foundCategory = bucketListCategories.find(
      (el: BucketListCategory) => el.name === category
    );
    const bgColorCode = foundCategory?.bgColor || '#000000';
    const textColorCode = foundCategory?.textColor || '#FFF';

    return { color: textColorCode, backgroundColor: bgColorCode };
  };

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
              className={`${barlow.className} text-sm font-normal lowercase mt-4`}
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
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-1 w-full sm:w-2/5">
                <Input
                  placeholder="Adventure"
                  {...register('item', {
                    required: 'Adventure name is required',
                    maxLength: {
                      value: 50,
                      message: 'Adventure name must be 50 characters or less'
                    }
                  })}
                />
                {errors.item && (
                  <span className="bg-red-500 text-white text-xs text-center font-semibold w-full py-1 my-1">
                    {errors.item.message}
                  </span>
                )}

                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">N</span>ame your adventure in one
                  word.
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-2/5">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {bucketListCategories.map((el: Category) => (
                          <SelectItem key={el.name} value={el.name}>
                            {el.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <span className="bg-red-500 text-white text-xs text-center font-semibold w-full py-1 my-1">
                    {errors.category.message}
                  </span>
                )}
                <p className="text-xs ml-4 lowercase">
                  <span className="uppercase">C</span>
                  hoose a category that best describes your adventure.
                </p>
              </div>
              <Input value={uid} className="hidden" {...register('uid')} />
              <Button type="submit" className="ml-2" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add'}
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

        <div className="flex justify-end items-center gap-3 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-3 py-1 font-bold border transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('not-done')}
              className={`text-xs px-3 py-1 border transition-colors ${
                filter === 'not-done'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`text-xs px-3 py-1 border transition-colors ${
                filter === 'done'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
              }`}
            >
              Done
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="h-9 px-3 text-xs font-semibold gap-2 border-primary/20 hover:bg-primary hover:text-white transition-all ml-2"
          >
            <Printer size={14} />
            Download PDF
          </Button>
        </div>

        <div
          id="bucket-list-board"
          ref={boardRef}
          className="flex flex-col items-center"
        >
          <div
            id="pdf-header"
            style={{ display: 'none' }}
            className="mb-12 text-center"
          >
            <h1
              className={`${kumbh_sans.className} text-4xl font-bold uppercase tracking-tighter text-primary`}
            >
              My Bucket List — {new Date().getFullYear()}
            </h1>
            <p className={`${barlow.className} text-muted-foreground mt-2`}>
              Every hero needs epic adventures!
            </p>
          </div>

          <div className="flex flex-wrap justify-center w-full gap-8 mt-4 mb-12">
            {board.map((categoryArray: BucketListItem[]) => (
              <div
                key={categoryArray[0].category}
                className="w-full sm:w-[30ch]"
              >
                <h3
                  className={`${kumbh_sans.className} text-left text-sm font-semibold text-primary px-4 py-3 my-2 uppercase leading-none`}
                  style={getColorCodes(categoryArray[0].category ?? 'grey')}
                >
                  {categoryArray[0].category}
                </h3>

                {categoryArray.map((el: BucketListItem) => (
                  <div
                    key={el.id}
                    className={`flex items-center border border-primary mt-2 ${el.done ? 'bg-muted shadow-inner' : ''}`}
                  >
                    <div className="w-full px-4 py-3">
                      <p
                        className={`${el.done ? 'line-through text-muted-foreground' : ''} text-left uppercase text-sm leading-5`}
                      >
                        {el.item}
                      </p>
                    </div>

                    <Button
                      className="px-0 mx-0"
                      onClick={() => handleCheck(el)}
                      variant={'link'}
                      data-html2canvas-ignore
                    >
                      {el.done ? (
                        <SquareCheckBig size={18} strokeWidth={1.8} />
                      ) : (
                        <Square size={18} strokeWidth={1.8} />
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        className="px-2 py-1 mr-2"
                        data-html2canvas-ignore
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
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
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(el)}
                          >
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
        </div>
      </CardContent>
    </Card>
  );
}

export const bucketListCategories = [
  {
    name: 'Adventure',
    color: 'bright turquoise',
    bgColor: '#00D9FF',
    textColor: '#004A60'
  },
  {
    name: 'Bar',
    color: 'bright orange',
    bgColor: '#FF8C42',
    textColor: '#5D2A02'
  },
  {
    name: 'Cultural',
    color: 'sunshine yellow',
    bgColor: '#FFD700',
    textColor: '#664400'
  },
  {
    name: 'Destinations',
    color: 'ocean green',
    bgColor: '#00CC99',
    textColor: '#004F3D'
  },
  {
    name: 'Educational',
    color: 'electric blue',
    bgColor: '#3399FF',
    textColor: '#FFFFFF'
  },
  {
    name: 'Entertainment',
    color: 'lavender purple',
    bgColor: '#C266FF',
    textColor: '#330066'
  },
  {
    name: 'Event',
    color: 'fiery red',
    bgColor: '#FF5555',
    textColor: '#660000'
  },
  {
    name: 'Festival',
    color: 'spring green',
    bgColor: '#6DFF66',
    textColor: '#335B33'
  },
  {
    name: 'Historical',
    color: 'stone gray',
    bgColor: '#9A9A9A',
    textColor: '#FFFFFF'
  },
  {
    name: 'Landmark',
    color: 'tangerine',
    bgColor: '#FFAA33',
    textColor: '#4D2A00'
  },
  {
    name: 'Nature',
    color: 'leaf green',
    bgColor: '#33D133',
    textColor: '#004D00'
  },
  {
    name: 'Nightlife',
    color: 'vivid violet',
    bgColor: '#AA33FF',
    textColor: '#FFFFFF'
  },
  {
    name: 'Outdoor Activity',
    color: 'sky blue',
    bgColor: '#00BFFF',
    textColor: '#003366'
  },
  {
    name: 'Restaurant',
    color: 'deep plum',
    bgColor: '#9900CC',
    textColor: '#3D003D'
  },
  {
    name: 'Romantic',
    color: 'blush rose',
    bgColor: '#FF5E9F',
    textColor: '#5C1A3A'
  },
  {
    name: 'Shopping',
    color: 'neon pink',
    bgColor: '#FF3B8F',
    textColor: '#500030'
  },
  {
    name: 'Sport',
    color: 'flaming orange',
    bgColor: '#FF7733',
    textColor: '#4D2600'
  },
  {
    name: 'Wellness',
    color: 'mint green',
    bgColor: '#33FF99',
    textColor: '#006642'
  }
];

export const bucketListCategoriesPastel = [
  {
    name: 'Adventure',
    color: 'teal',
    bgColor: '#5CDB95',
    textColor: '#05396B'
  },
  {
    name: 'Bar',
    color: 'coral',
    bgColor: '#FF6F61',
    textColor: '#FFFFFF'
  },
  {
    name: 'Cultural',
    color: 'ochre',
    bgColor: '#FFAA5C',
    textColor: '#553C1C'
  },
  {
    name: 'Destinations',
    color: 'ocean blue',
    bgColor: '#2A9D8F',
    textColor: '#FFFFFF'
  },
  {
    name: 'Educational',
    color: 'slate blue',
    bgColor: '#779ECB',
    textColor: '#05396B'
  },
  {
    name: 'Entertainment',
    color: 'lavender',
    bgColor: '#B39BC8',
    textColor: '#553C1C'
  },
  {
    name: 'Event',
    color: 'deep rose',
    bgColor: '#C94C4C',
    textColor: '#FFFFFF'
  },
  {
    name: 'Festival',
    color: 'bright green',
    bgColor: '#8BC34A',
    textColor: '#05396B'
  },
  {
    name: 'Historical',
    color: 'warm gray',
    bgColor: '#9E9E9E',
    textColor: '#FFFFFF'
  },
  {
    name: 'Landmark',
    color: 'sandy yellow',
    bgColor: '#FFD166',
    textColor: '#553C1C'
  },
  {
    name: 'Nature',
    color: 'forest green',
    bgColor: '#4CAF50',
    textColor: '#FFFFFF'
  },
  {
    name: 'Nightlife',
    color: 'electric purple',
    bgColor: '#9C27B0',
    textColor: '#FFFFFF'
  },
  {
    name: 'Outdoor Activity',
    color: 'sea blue',
    bgColor: '#4C98D9',
    textColor: '#FFFFFF'
  },
  {
    name: 'Restaurant',
    color: 'deep plum',
    bgColor: '#673AB7',
    textColor: '#FFFFFF'
  },
  {
    name: 'Romantic',
    color: 'blush pink',
    bgColor: '#E57373',
    textColor: '#FFFFFF'
  },
  {
    name: 'Shopping',
    color: 'vivid pink',
    bgColor: '#F06292',
    textColor: '#FFFFFF'
  },
  {
    name: 'Sport',
    color: 'burnt orange',
    bgColor: '#FF7043',
    textColor: '#FFFFFF'
  },
  {
    name: 'Wellness',
    color: 'light mint',
    bgColor: '#81C784',
    textColor: '#05396B'
  }
];

export const bucketListCategoriesBlackWhite = [
  {
    name: 'Adventure',
    color: 'charcoal',
    bgColor: '#333333',
    textColor: '#E6E6E6'
  },
  {
    name: 'Bar',
    color: 'dark gray',
    bgColor: '#4D4D4D',
    textColor: '#FFFFFF'
  },
  {
    name: 'Cultural',
    color: 'slate gray',
    bgColor: '#666666',
    textColor: '#FFFFFF'
  },
  {
    name: 'Destinations',
    color: 'dim gray',
    bgColor: '#808080',
    textColor: '#FFFFFF'
  },
  {
    name: 'Educational',
    color: 'light slate gray',
    bgColor: '#999999',
    textColor: '#FFFFFF'
  },
  {
    name: 'Entertainment',
    color: 'gray',
    bgColor: '#B3B3B3',
    textColor: '#333333'
  },
  {
    name: 'Event',
    color: 'light gray',
    bgColor: '#CCCCCC',
    textColor: '#333333'
  },
  {
    name: 'Festival',
    color: 'silver',
    bgColor: '#E6E6E6',
    textColor: '#333333'
  },
  {
    name: 'Historical',
    color: 'gainsboro',
    bgColor: '#F2F2F2',
    textColor: '#4D4D4D'
  },
  {
    name: 'Landmark',
    color: 'whisper gray',
    bgColor: '#FAFAFA',
    textColor: '#333333'
  },
  {
    name: 'Nature',
    color: 'ash gray',
    bgColor: '#F5F5F5',
    textColor: '#333333'
  },
  {
    name: 'Nightlife',
    color: 'frost gray',
    bgColor: '#E8E8E8',
    textColor: '#4D4D4D'
  },
  {
    name: 'Outdoor Activity',
    color: 'smoke gray',
    bgColor: '#D1D1D1',
    textColor: '#333333'
  },
  {
    name: 'Restaurant',
    color: 'light steel gray',
    bgColor: '#BBBBBB',
    textColor: '#333333'
  },
  {
    name: 'Romantic',
    color: 'pearl gray',
    bgColor: '#F0F0F0',
    textColor: '#333333'
  },
  {
    name: 'Shopping',
    color: 'mist gray',
    bgColor: '#E0E0E0',
    textColor: '#333333'
  },
  {
    name: 'Sport',
    color: 'platinum',
    bgColor: '#D9D9D9',
    textColor: '#333333'
  },
  {
    name: 'Wellness',
    color: 'ivory',
    bgColor: '#FBFBFB',
    textColor: '#333333'
  }
];

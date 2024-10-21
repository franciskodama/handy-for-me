'use client';

import Link from 'next/link';
import { Bomb, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

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
import { Shortcut, ShortcutCategory, VisualBoardItem } from '@/lib/types';
import Help from '@/components/Help';
import { toast } from '@/hooks/use-toast';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import ExplanationShortcuts from './explanation-shortcuts';
import { AddShortcut } from './add-shortcut';
import { AddCategory } from './add-category';

export type CategoryInput = {
  name: string;
  color: string;
};

export default function Shortcuts({
  uid,
  categories,
  shortcuts
}: {
  uid: string;
  categories: ShortcutCategory[];
  shortcuts: Shortcut[];
}) {
  const [openAction, setOpenAction] = useState(false);

  const [board, setBoard] = useState<VisualBoardItem[]>([]);

  //   useEffect(() => {
  //     if (data?.newVisualBoardItem && Array.isArray(data.newVisualBoardItem)) {
  //       setBoard(data.newVisualBoardItem as VisualBoardItem[]);
  //     }
  //   }, [data]);

  //   const handleDeleteItem = async (shortcut: Shortcut) => {
  //     try {
  //       const success = await deleteVisualBoardItem(shortcut.id);
  //       if (success) {
  //         setBoard(board.filter((el) => el.id !== shortcut.id));
  //       }
  //       toast({
  //         title: 'Vision Board Item gone!',
  //         description: `The ${shortcut.name} has been successfully deleted.`,
  //         variant: 'success'
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       toast({
  //         title: 'Error deleting Shortcut! 🚨',
  //         description: 'Something went wrong while deleting the Shortcut.',
  //         variant: 'destructive'
  //       });
  //     }
  //   };

  //   const handleCheck = async (item: VisualBoardItem) => {
  //     try {
  //       const success = await setVisualBoardItemDone(item.id, !item.done);
  //       if (success) {
  //         setBoard((prevBoard) =>
  //           prevBoard.map((boardItem) =>
  //             boardItem.id === item.id
  //               ? { ...boardItem, done: !boardItem.done }
  //               : boardItem
  //           )
  //         );
  //       }
  //       toast({
  //         title: 'Vision Progress Updated! 🌟',
  //         description: `"${item.name}" has been marked as ${item.done ? 'incomplete' : 'achieved'}. Keep pushing towards your dreams!`,
  //         variant: 'success'
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       toast({
  //         title: 'Error changing Status! 🚨',
  //         description:
  //           'Something went wrong while changing the Status of this Item.',
  //         variant: 'destructive'
  //       });
  //     }
  //   };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between items-start mb-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p>Shorcuts</p>
              <div className="block sm:hidden">
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">Y</span>our go-to place for quick
              access to your favorite sites.
            </p>
          </div>
          <div
            className={`${barlow.className} flex gap-4 capitalize mt-8 sm:mt-0`}
          >
            <div className="flex gap-4">
              <AddCategory uid={uid} categories={categories} />
              <AddShortcut
                uid={uid}
                categories={categories}
                shortcuts={shortcuts}
              />
            </div>
          </div>
          <div className="hidden sm:block">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-10 pb-40">
        <AnimatePresence>
          {openAction ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="mb-12">
                <ExplanationShortcuts setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap gap-[1px] justify-center">
          {shortcuts.map((shortcut: Shortcut) => (
            <div key={shortcut.id}>
              <div className="relative group">
                <p
                  className={`${kumbh_sans.className} border text-left px-2 py-1 uppercase text-[8px] sm:text-sm leading-none absolute bottom-0 left-0 sm:left-2`}
                >
                  {shortcut.name}
                </p>

                <AlertDialog>
                  <AlertDialogTrigger className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 bg-white p-1">
                    <Trash2 size={18} strokeWidth={1.8} color="#000" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Bomb size={24} strokeWidth={1.8} />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="py-4">
                        This will permanently delete the vision
                        <span className="font-bold mx-1">{shortcut.name}</span>
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
                      // onClick={() => handleDeleteItem(shortcut)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* <Button
                  className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 h-6 bg-white p-1"
                  onClick={() => handleCheck(item)}
                  variant={'link'}
                >
                  <Check size={18} strokeWidth={1.8} color="#000" />
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

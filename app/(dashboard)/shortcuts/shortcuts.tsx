'use client';

import Link from 'next/link';
import { Bomb, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
import { Button } from '@/components/ui/button';
import { deleteShortcut } from '@/lib/actions';

export type CategoryInput = {
  name: string;
  color: string;
};

type ColorType = 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'grey';

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
  const [currentShortcuts, setCurrentShortcutsAction] =
    useState<Shortcut[]>(shortcuts);

  const board: Shortcut[][] = Object.values(
    currentShortcuts.reduce(
      (acc: Record<string, Shortcut[]>, curr: Shortcut) => {
        if (acc[curr.categoryId]) {
          acc[curr.categoryId].push(curr);
        } else {
          acc[curr.categoryId] = [curr];
        }
        return acc;
      },
      {}
    )
  );

  const colorMap: Record<ColorType, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    grey: 'bg-gray-500'
  };

  // export const colors = [
  //   { name: 'Blue', code: '#1E90FF' },
  //   { name: 'Green', code: '#32CD32' },
  //   { name: 'Red', code: '#FF4500' },
  //   { name: 'Yellow', code: '#FFD700' },
  //   { name: 'Purple', code: '#8A2BE2' },
  //   { name: 'Orange', code: '#FFA500' },
  //   { name: 'Pink', code: '#FF69B4' },
  //   { name: 'Teal', code: '#20B2AA' },
  //   { name: 'Gray', code: '#808080' },
  //   { name: 'Brown', code: '#A52A2A' }
  // ];

  //   getShortcutsCategories

  //   useEffect(() => {
  //     if (data?.newVisualBoardItem && Array.isArray(data.newVisualBoardItem)) {
  //       setBoard(data.newVisualBoardItem as VisualBoardItem[]);
  //     }
  //   }, [data]);

  const handleDeleteItem = async (shortcut: Shortcut) => {
    try {
      const success = await deleteShortcut(shortcut.id);
      if (success) {
        setCurrentShortcutsAction(
          currentShortcuts.filter((el) => el.id !== shortcut.id)
        );
      }
      toast({
        title: 'Shortcut gone!',
        description: `The ${shortcut.name} has been successfully deleted.`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error deleting Shortcut! 🚨',
        description: 'Something went wrong while deleting the Shortcut.',
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
            className={`${barlow.className} flex gap-4 capitalize mt-8 sm:mt-0 w-full sm:w-[18ch]`}
          >
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <AddCategory uid={uid} categories={categories} />
              </div>
              <div className="w-1/2">
                <AddShortcut
                  uid={uid}
                  categories={categories}
                  setCurrentShortcutsAction={setCurrentShortcutsAction}
                />
              </div>
            </div>
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
                <ExplanationShortcuts setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-wrap gap-8 justify-center">
          {board.map((groupOfShortcuts: Shortcut[]) => (
            <div key={groupOfShortcuts[0].categoryId}>
              <h3
                className={`${kumbh_sans.className} 
                   ${
                     colorMap[
                       (groupOfShortcuts[0].category?.color?.toLowerCase() ??
                         'grey') as ColorType
                     ]
                   } 
                  text-left text-sm font-semibold text-primary px-4 py-3 my-2 uppercase leading-none`}
              >
                {groupOfShortcuts[0].category?.name}
              </h3>

              {groupOfShortcuts.map((shortcut: Shortcut) => (
                <div
                  key={shortcut.id}
                  className="flex border border-primary my-2"
                >
                  <div className="w-full px-4 py-3">
                    <Link
                      href={shortcut.url}
                      target="_blank"
                      className="w-full"
                    >
                      <p className="text-left uppercase text-sm leading-none">
                        {shortcut.name}
                      </p>
                    </Link>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger className="px-2 py-1">
                      <Trash2 size={18} strokeWidth={1.8} color="#000" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-4/5">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <Bomb size={24} strokeWidth={1.8} />
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="py-4">
                          This will permanently delete the vision
                          <span className="font-bold mx-1">
                            {shortcut.name}
                          </span>
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
                          onClick={() => handleDeleteItem(shortcut)}
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
      </CardContent>
    </Card>
  );
}

'use client';

import { AnimatePresence, motion } from 'framer-motion';

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
import { Button } from '@/components/ui/button';
import ExplanationIn from './explanation-in';
import { useState } from 'react';
import { ChevronsUpDown, CircleHelp, UnfoldVertical } from 'lucide-react';
import UserCard from './user';
import { User } from '@/lib/types';
import { kumbh_sans } from '@/app/ui/fonts';

export default function In({ user }: { user: User | undefined }) {
  // { user }: { user: UserProps }
  // const [listId, setListId] = useState<string>('');
  // const [listInput, setListInput] = useState<string>('');
  // const [itemInput, setItemInput] = useState<string>('');
  // const [pendingNewList, setPendingNewList] = useState<boolean>(false);
  // const [pendingNewItem, setPendingNewItem] = useState<boolean>(false);
  // const [spinning, setSpinning] = useState<boolean>(false);
  // const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);

  return (
    <Card>
      <CardHeader className="mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Dashboard</p>
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
                    <CircleHelp size={22} strokeWidth={1.6} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-primary ml-2 capitalize font-light">
                      Learn More
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <div />
          )}
        </CardTitle>
        <CardDescription>
          Everything you need, right at your fingertips.
        </CardDescription>
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
                <ExplanationIn setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ----------------------- Main Container ----------------------- */}
        <div className="flex flex-col gap-4">
          {/* ----------------------- First Row ----------------------- */}

          <div className="flex w-full justify-between gap-8 mb-12">
            <div className="w-1/3">
              <UserCard user={user} />
            </div>
            <div className="w-1/3 border border-dashed border-slate-300 p-4"></div>
            <div className="w-1/3 border border-dashed border-slate-300 p-4"></div>
          </div>

          {/* ----------------------- Second Row ----------------------- */}
          <div className="flex w-full justify-between gap-8">
            <div className="flex items-center justify-between w-1/3 border border-dashed border-slate-300 p-4">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Affirmation
              </h3>
              <p className="">Happy, Loved, and Rich</p>
              <ChevronsUpDown size={24} strokeWidth={1.8} />
            </div>
            <div className="flex items-center justify-between w-1/3 border border-dashed border-slate-300 p-4">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Affirmation
              </h3>
              <p className="">Happy, Loved, and Rich</p>
              <ChevronsUpDown size={24} strokeWidth={1.8} />
            </div>
            <div className="flex items-center justify-between w-1/3 border border-dashed border-slate-300 p-4">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Affirmation
              </h3>
              <p className="">Happy, Loved, and Rich</p>
              <ChevronsUpDown size={24} strokeWidth={1.8} />
            </div>
          </div>
          {/* ----------------------- Third Row ----------------------- */}

          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            Title
          </p>
          <div className="flex w-full justify-between gap-8">
            <div
              className={`flex flex-col w-1/3 items-center h-[10em] p-4`}
              style={{
                borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
                borderStyle: 'solid',
                borderWidth: '1em'
              }}
            >
              <p>Box</p>
            </div>
            <div
              className={`flex flex-col w-1/3 items-center h-[10em] p-4`}
              style={{
                borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
                borderStyle: 'solid',
                borderWidth: '1em'
              }}
            >
              <p>Box</p>
            </div>
            <div
              className={`flex flex-col w-1/3 items-center h-[10em] p-4`}
              style={{
                borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
                borderStyle: 'solid',
                borderWidth: '1em'
              }}
            >
              <p>Box</p>
            </div>
          </div>

          {/* ----------------------- Fourth Row ----------------------- */}
          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            Title
          </p>
          <div className="flex w-full justify-between gap-8">
            <div className="flex items-start justify-between w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
          </div>

          {/* ----------------------- Fiveth Row ----------------------- */}
          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            Title
          </p>
          <div className="flex w-full justify-between gap-8">
            <div className="flex items-start justify-between w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
          </div>

          {/* ----------------------- Sixth Row ----------------------- */}

          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            Title
          </p>
          <div className="flex w-full justify-between gap-8">
            <div
              className={`flex flex-col w-1/3 items-center h-[10em] p-4`}
              style={{
                borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
                borderStyle: 'solid',
                borderWidth: '1em'
              }}
            >
              <p>Box</p>
            </div>
            <div
              className={`flex flex-col w-1/3 items-center h-[10em] p-4`}
              style={{
                borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
                borderStyle: 'solid',
                borderWidth: '1em'
              }}
            >
              <p>Box</p>
            </div>
            <div
              className={`flex flex-col w-1/3 items-center h-[10em] p-4`}
              style={{
                borderImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2.5px,
                  black 3px,
                  black 3px,
                  transparent 3px,
                  transparent 3px
                ) 15 / 0.75rem`,
                borderStyle: 'solid',
                borderWidth: '1em'
              }}
            >
              <p>Box</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

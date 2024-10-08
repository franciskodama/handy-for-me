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
import { CircleHelp } from 'lucide-react';

export default function In({ name }: { name: string }) {
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

        {/* ----------------------- First Column ----------------------- */}

        <div className="flex justify-between gap-8 mb-4 w-full">
          <div className="flex w-1/5 flex-col gap-4">
            <p className="text-lg font-semibold">
              {`${name.split(' ')[0]}, let's get started! 👋 `}
            </p>
            <div className="flex flex-col gap-2"></div>
            <Button className="capitalize">Hello World!</Button>
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-xs mb-2">or</p>
              <Button className="capitalize w-full" variant="outline">
                {`I'm feeling lucky!`}
              </Button>
              <p className="text-xs">
                Let fate decide your next topic and question
              </p>
            </div>
          </div>

          {/* ----------------------- Second Column ----------------------- */}

          <div
            className={`flex flex-col w-3/5 items-center h-[30em]`}
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
            <p>Set the timer, choose a topic, spin, and answer.</p>
          </div>

          {/* ----------------------- Third Column ----------------------- */}

          <div className="flex flex-col w-1/5">
            <p>Set the timer, choose a topic, spin, and answer.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

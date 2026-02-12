'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp, SquareX } from 'lucide-react';
import { Foldit } from 'next/font/google';

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
import { Button } from '@/components/ui/button';
import ExplanationMyWords from './explanation-my-words';

export default function MyWords({
  uid,
  myWords
}: {
  uid: string;
  myWords: string[];
}) {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);
  const [showInspirations, setShowInspirations] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setShowInspirations(false);
    // const randomIndex = Math.floor(Math.random() * alphabet.length);
    // const randomLetter = alphabet[randomIndex];
    // setTimeout(() => {
    //   setResult(randomLetter);
    //   setSpinning(false);
    // }, 1000);
  };

  const handleShowInspirations = () => {
    setShowInspirations(!showInspirations);
  };

  return (
    <Card className="min-h-[75vh]">
      <CardHeader className="mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>My Words</p>
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
        <CardDescription>
          Master conversations, one letter at a time!
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
                <ExplanationMyWords setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ----------------------- First Column ----------------------- */}

        <div className="flex justify-between gap-8 mb-4 w-full">
          <div className="flex w-1/5 flex-col gap-4">
            <p className="text-lg font-semibold">
              Let the letter lead your thoughts. 🎯
            </p>
            <Button className="capitalize" onClick={handleSpin}>
              Spin!
            </Button>
          </div>

          {/* ----------------------- Second Column ----------------------- */}

          <div className="stripe-border flex flex-col w-3/5 items-center h-[40em]">
            {result ? (
              <>
                <p
                  className={`text-[20rem] uppercase p-8 text-center w-full font-bold`}
                >
                  {result}
                </p>
                <p className={`text-xl lowercase text-center`}>({result})</p>
              </>
            ) : (
              <>
                <div className="flex flex-col text-xl text-primary leading-tight p-4 text-center w-full mt-[10em] gap-4">
                  <p className="font-semibold text-2xl">
                    Ready to spin and spark your creativity? 🍀
                  </p>
                  <p>Let’s see where your next letter takes you!</p>
                </div>
              </>
            )}
          </div>

          {/* ----------------------- Third Column ----------------------- */}

          <div className="flex flex-col w-1/5">
            <p className="text-lg font-semibold mb-2">Out of ideas?</p>
            <p className="mb-4">Hit only in case of brain block!</p>
            <Button
              variant={'outline'}
              className="capitalize mb-2"
              onClick={handleShowInspirations}
            >
              Emergency Helper
            </Button>
            <div className="">
              Hello!
              {/* {result &&
                showInspirations &&
                startWords[result.toUpperCase() as keyof typeof startWords].map(
                  (word: string) => (
                    <p
                      key={word}
                      className="border text-center w-full mt-1 py-2 text-base"
                    >
                      {word}
                    </p>
                  )
                )} */}
              {result && showInspirations && (
                <div>
                  <Button
                    variant={'link'}
                    className="flex items-center w-full text-center mt-4"
                    onClick={handleShowInspirations}
                  >
                    <SquareX
                      size={18}
                      strokeWidth={1.6}
                      onClick={handleShowInspirations}
                    />
                    <p className="ml-2 text-xs">Close</p>
                  </Button>
                </div>
              )}
              {!result && showInspirations && (
                <p className="bg-red-500 text-white w-full py-2 text-base font-semibold text-center">
                  C'mon! At least, Spin First...
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

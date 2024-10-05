'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ExplanationRandomQuestion from './explanation-random-question';
import { topicsRandomQuestions, getQuestions } from './questions';
import Image from 'next/image';

type Topic = {
  id: string;
  name: string;
};

export default function RandomQuestion({ name }: { name: string }) {
  const [topic, setTopic] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);

  useEffect(() => {
    const arrayOfQuestions = getQuestions(topic);
    setQuestions(arrayOfQuestions);
  }, [topic]);

  const handleSpin = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomItem = questions[randomIndex];
    setTimeout(() => {
      setResult(randomItem);
      setSpinning(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Random Questions</p>
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
                    <p className="text-primary ml-2 lowercase font-light">
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
          Boost your English with fun, random prompts!
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
                <ExplanationRandomQuestion setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ----------------------- First Column ----------------------- */}

        <div className="flex justify-between gap-8 mb-4 w-full">
          <div className="flex w-1/3 flex-col gap-4">
            <p className="text-lg font-semibold">
              {' '}
              {`${name.split(' ')[0]}, let's get started! 👋 `}
            </p>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  setResult('');
                  setTopic(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a Topic, Start the Fun!" />
                </SelectTrigger>
                <SelectContent>
                  {topicsRandomQuestions.map((topic: Topic) => (
                    <div key={topic.id}>
                      {topic && (
                        <SelectItem value={topic.id} className="capitalize">
                          {topic.name}
                        </SelectItem>
                      )}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="capitalize"
              onClick={handleSpin}
              disabled={topic.trim() === ''}
            >
              {!topic ? 'Waiting for topic...' : 'Spin!'}
            </Button>
          </div>

          {/* ----------------------- Second Column ----------------------- */}

          <div
            className={`flex flex-col w-1/3 items-center ${!result ? 'gap-12' : ''}`}
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
            {result ? (
              <>
                <p className="text-5xl text-primary leading-tight p-4 text-center animate-pulse w-full my-8">
                  {result}
                </p>
                <Button variant="link" onClick={() => setResult('')}>
                  clear
                </Button>
              </>
            ) : (
              <>
                <Image
                  src={'/waiting.webp'}
                  alt="logo"
                  width={800}
                  height={800}
                />
                {/* <p className="text-5xl text-primary leading-tight p-4 text-center animate-pulse w-full my-8">
                  Waiting...
                </p> */}
              </>
            )}
          </div>

          {/* ----------------------- Third Column ----------------------- */}

          <div className="flex flex-col w-1/3">
            <div className="w-[25em]">
              <p className="text-sm h-10 py-2">
                Do you want to start a new list?
              </p>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="List's Name"
                  //   value={listInput}
                  //   onChange={(e) => setListInput(e.target.value)}
                />
                <Button
                //   className={pendingNewList ? 'bg-primary' : ''}
                //   onClick={handleCreateList}
                //   disabled={pendingNewList || listInput.trim() === ''}
                >
                  {/* {pendingNewList ? 'Creating...' : 'Create a New List'} */}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

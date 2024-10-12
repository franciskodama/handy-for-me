'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp, SquareX } from 'lucide-react';
import { Foldit } from 'next/font/google';

export const foldit = Foldit({
  weight: ['700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap'
});

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
import ExplanationLetterLeap from './explanation-letter-leap';

export default function LetterLeap({ name }: { name: string }) {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);
  const [showInspirations, setShowInspirations] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setShowInspirations(false);
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex];
    setTimeout(() => {
      setResult(randomLetter);
      setSpinning(false);
    }, 1000);
  };

  const handleShowInspirations = () => {
    setShowInspirations(!showInspirations);
  };

  return (
    <Card>
      <CardHeader className="mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Letter Leap</p>
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
                <ExplanationLetterLeap setOpenAction={setOpenAction} />
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

          <div
            className={`flex flex-col w-3/5 items-center h-[40em]`}
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
                <p
                  className={`${foldit.className} text-[20rem] uppercase p-8 text-center w-full font-bold`}
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
            <p className="text-lg font-semibold mb-2">
              {`${name.split(' ')[0]}, Out of ideas? 🚨`}
            </p>
            <p className="mb-4">Hit only in case of brain block!</p>
            <Button
              variant={'outline'}
              className="capitalize mb-2"
              onClick={handleShowInspirations}
            >
              Emergency Helper
            </Button>
            <div className="">
              {result &&
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
                )}
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

const startWords = {
  A: [
    'Although',
    'After',
    'As',
    'Also',
    'Anyone',
    'Anything',
    'Around',
    'Always',
    'Another',
    'All'
  ],
  B: [
    'Besides',
    'Before',
    'Because',
    'Between',
    'Beyond',
    'By',
    'Both',
    'But',
    'Better',
    'Being'
  ],
  C: [
    'Considering',
    'Currently',
    'Certainly',
    'Consequently',
    'Clearly',
    'Could',
    'Can',
    'Coming',
    'Closer',
    'Creating'
  ],
  D: [
    'Despite',
    'During',
    'Due',
    'Definitely',
    'Doing',
    'Driving',
    'Directly',
    'Don’t',
    'Does',
    'Doubtfully'
  ],
  E: [
    'Even',
    'Especially',
    'Each',
    'Every',
    'Ever',
    'Eventually',
    'Everyone',
    'Everything',
    'Entering',
    'Enjoying'
  ],
  F: [
    'Following',
    'For',
    'Finally',
    'From',
    'Furthermore',
    'Facing',
    'Finding',
    'Focusing',
    'Frequently',
    'Feeling'
  ],
  G: [
    'Generally',
    'Gradually',
    'Getting',
    'Given',
    'Going',
    'Gaining',
    'Giving',
    'Guiding',
    'Goodbye',
    'Good'
  ],
  H: [
    'Hopefully',
    'However',
    'Having',
    'How',
    'Here',
    'Hearing',
    'Holly (Cow!)',
    'Holding',
    'Helping',
    'Hang (on)'
  ],
  I: [
    'Initially',
    'Interestingly',
    'Instead',
    'In (Addition)',
    'If',
    'Including',
    'It’s',
    'I’ve',
    'Itself',
    'Imagine'
  ],
  J: [
    'Just',
    'Judging',
    'Joining',
    'Jumping',
    'Juggling',
    'Journeying',
    'Joyfully',
    'Jokingly',
    'Jzus',
    'Join (the club)'
  ],
  K: [
    'Knowing',
    'Keeping',
    'Kindly',
    'Knocking',
    'Keenly',
    'Kick (the bucket)',
    'Knock (on wood)',
    'Keep (calm)',
    'Knock (it out)',
    'Keep (going)'
  ],
  L: [
    'Likewise',
    'Luckily',
    'Later',
    'Largely',
    'Looking',
    'Learning',
    'Letting',
    'Living',
    'Leading',
    'Let’s'
  ],
  M: [
    'Meanwhile',
    'Moreover',
    'Mostly',
    'Mentioning',
    'Must',
    'May',
    'Making',
    'Moving',
    'Managing',
    'My'
  ],
  N: [
    'Nevertheless',
    'Naturally',
    'Next',
    'Noticing',
    'Never',
    'Nothing',
    'Not',
    'Now',
    'Nice',
    'Notably'
  ],
  O: [
    'Once',
    'Obviously',
    'Only',
    'Often',
    'Over',
    'Outside',
    'Otherwise',
    'On (one hand)',
    'Off (the hook)',
    'Out (of the blue)'
  ],
  P: [
    'Perhaps',
    'Particularly',
    'Possibly',
    'Putting',
    'Prior',
    'Providing',
    'Pursuing',
    'Personally',
    'Pretty (nice)',
    'Point (taken)'
  ],
  Q: [
    'Quite',
    'Quickly',
    'Questioning',
    'Quietly',
    'Quoting',
    'Qualifying',
    'Questionably',
    'Quaintly',
    'Quiet (as a mouse)',
    'Quite (the opposite)'
  ],
  R: [
    'Rather',
    'Regarding',
    'Recently',
    'Reaching',
    'Realizing',
    'Relating',
    'Right',
    'Returning',
    'Reading',
    'Referring'
  ],
  S: [
    'Since',
    'So',
    'Specifically',
    'Still',
    'Starting',
    'Sometimes',
    'Seeing',
    'Showing',
    'Suggesting',
    'Speaking'
  ],
  T: [
    'Therefore',
    'Thus',
    'Taking',
    'Trying',
    'Thinking',
    'Talking',
    'Telling',
    'Take (it easy)',
    'To (be honest)',
    'Though'
  ],
  U: [
    'Usually',
    'Under',
    'Unless',
    'Until',
    'Ultimately',
    'Understanding',
    'Using',
    'Up',
    'Urging',
    'Upon'
  ],
  V: [
    'Very',
    'Various',
    'Viewing',
    'Visiting',
    'Valuing',
    'Verifying',
    'Virtually',
    'Venturing',
    'Vacating',
    'Voicing'
  ],
  W: [
    'While',
    'When',
    'With',
    'Where',
    'Which',
    'Whenever',
    'Whether',
    'Willing',
    'What’s up',
    'We’re'
  ],
  X: [
    'Xenophobically',
    'Xeroxing',
    'X-raying',
    'X-rayed',
    'X-treme',
    'X-factors',
    'Xylitol'
  ],
  Y: [
    'Yes',
    'Yet',
    'You’re',
    'Your',
    'Yearning',
    'You (bet)',
    'You (better)',
    'Yours',
    'Yelling',
    'Yielding'
  ],
  Z: [
    'Zooming',
    'Zealously',
    'Zipping',
    'Zillion-dollar',
    'Zeroing',
    'Zestfully',
    'Zigzagging',
    'Zipping',
    'Zookeeping',
    'Zapping'
  ]
};

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

'use client';

import {
  AArrowUp,
  Laugh,
  LifeBuoy,
  Lightbulb,
  LucideTextCursor,
  MapPin,
  Settings,
  Snail,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ExplanationMyWords({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  return (
    <div className="relative">
      <Alert className="stripe-border">
        <AlertDescription className="relative text-sm flex items-start justify-between p-2 leading-relaxed">
          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <AArrowUp size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">
                Let the letter lead your thoughts.
              </p>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <p>
                The Letter Leap will help you think on your feet, improve
                sentence structure, and expand your vocabulary — all while
                having fun!
              </p>
              <p className="mt-4">
                <span className="underline underline-offset-4 mr-2">
                  Great for Solo or Group Practice:
                </span>
                You can play this game alone or with friends for a fun and
                interactive learning experience.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">How to use</p>
            </div>
            <ul className="flex flex-col gap-4">
              <li>
                - Click the
                <span className="border border-primary py-1 px-2 mx-2">
                  Spin & Start
                </span>
                to randomly generate a letter.
              </li>
              <li>
                - Start a sentence or phrase with this letter — the more
                creative, the better! For example, if the letter is “B,” you
                could say: “Before the sun rises…”
              </li>
              <li>
                <span className="font-semibold mr-2">- Stuck for ideas?</span>
                Hit the
                <span className="border border-primary py-1 px-2 mx-2">
                  Emergency Helper
                </span>
                button for a boost! But only in case of emergency! It’s better
                to try on your own to grow your vocabulary!
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Laugh size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">Benefits</p>
            </div>
            <ul className="flex flex-wrap gap-4">
              <li>
                <span className="font-semibold mr-1">
                  - Boost Your Fluency:
                </span>
                By thinking of phrases quickly, you improve your conversational
                speed and natural fluency.
              </li>

              <li>
                <span className="font-semibold mr-1">- Get Creative:</span>
                This is a playful way to push your imagination and make language
                learning more enjoyable.
              </li>
              <li>
                <span className="font-semibold mr-1">
                  - Expand Your Vocabulary:
                </span>
                Use the helper button to discover new words, and challenge
                yourself to use them in conversation.
              </li>
            </ul>
            <Button
              variant={'outline'}
              className="capitalize mt-6 w-[26ch]"
              onClick={() => setOpenAction(false)}
            >
              Start spinning now!
            </Button>
          </div>
          <button
            className="absolute right-2 top-2"
            onClick={() => setOpenAction(false)}
          >
            <X size={24} color="black" strokeWidth={1.8} />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

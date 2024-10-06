'use client';

import { Lightbulb, Settings, Snail, Trash2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function ExplanationSpin({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  return (
    <div className="relative">
      <Alert
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
        <AlertDescription className="relative text-sm flex items-start justify-between p-2">
          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Snail size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">
                Tired of wasting time on decisions?
              </p>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <p>
                With Spin Magic, you can turn any list into a fun, random
                selection!
              </p>
              <p>
                Whether it’s picking a family activity, deciding on what to cook
                for dinner, or choosing the next movie for movie night — Spin
                Magic has you covered.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">How to use</p>
            </div>
            <div className="flex flex-col gap-4">
              <p>
                Create lists. Then, simply add your favorite items to each list,
                and when it’s time to make a decision, spin the wheel for a
                surprise choice!
              </p>
              <p className="flex items-center gap-4">
                <Checkbox checked={true} />
                Easily manage items by unselecting them to skip the next draw
                without deleting them.
              </p>
              <p className="flex items-center gap-4">
                <Trash2 size={24} strokeWidth={1.6} />
                You can also permanently delete items whenever you no longer
                need them.
              </p>
              {/* <p>
                Make decisions easier and more exciting with Spin Magic—the tool
                you never knew you needed to simplify your life and add a touch
                of fun to every choice.{' '}
                <span className="font-bold"> Start spinning today!</span>
              </p> */}
            </div>
          </div>

          <div className="flex flex-col justify-between w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">Some Ideas:</p>
            </div>
            <ul className="flex flex-wrap gap-4">
              <li>
                - Family Activities:{' '}
                <span className="font-normal">
                  From board games to outdoor adventures.
                </span>
              </li>
              <li>
                - Date Night Ideas:{' '}
                <span className="font-normal">
                  Pick the perfect plan without the hassle.
                </span>
              </li>
              <li>
                - Weekly Chores:{' '}
                <span className="font-normal">
                  Make it fun by spinning for who does what!
                </span>
              </li>
              <li>
                - Fitness Challenges:{' '}
                <span className="font-normal">
                  Choose a workout at random to keep things exciting!
                </span>
              </li>
            </ul>
            <Button
              variant={'outline'}
              className="capitalize mt-6 w-[26ch]"
              onClick={() => setOpenAction(false)}
            >
              Start spinning today!
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

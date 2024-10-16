'use client';

import { Brain, Gem, Goal, Settings, Telescope, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExplanationBucketList({
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
              <Telescope size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">Explore & Achieve Your Goals </p>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <p>
                This feature lets you create a personalized list of places to
                visit or things to do—whether it’s local hotspots or bucket list
                adventures.
              </p>
              <p>
                Input the name of your goal (e.g., Notre-Dame Church, Japan,
                Finnigan's Pub) and choose its category (Cultural, Destination,
                Adventure, etc.).
              </p>
              <p>
                Each category is color-coded for easy distinction, and you can
                hover over any item to see its category.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">How to use</p>
            </div>
            <ul className="flex flex-col gap-4">
              <li>- Enter the name of the place or goal.</li>
              <li>- Choose a category to classify your entry</li>
              <li>- Hover over an item to view its category.</li>
              <li>
                - Cross off goals you’ve accomplished, or delete them if they’re
                no longer relevant.
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Gem size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">The Perks:</p>
            </div>
            <ul className="flex flex-wrap gap-4">
              <li>
                - Keep track of your dream destinations and goals in one place,
                ensuring you never forget them.
              </li>
              <li>
                - Add new goals anytime you remember or discover a place you
                want to visit.
              </li>
              <li>
                - Gain a sense of accomplishment by crossing off places you’ve
                visited, while keeping them for future reference.
              </li>

              <li>
                - Reflect on the memories and experiences you’ve achieved as
                your list grows over time.
              </li>
            </ul>
            <Button
              variant={'outline'}
              className="capitalize mt-12 w-[26ch]"
              onClick={() => setOpenAction(false)}
            >
              Start Your Journey!
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

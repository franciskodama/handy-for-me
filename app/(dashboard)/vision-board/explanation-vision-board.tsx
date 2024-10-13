'use client';

import { Brain, Goal, Settings, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExplanationVisionBoard({
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
              <Brain size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">What is the Vision Board?</p>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <p>
                The Vision Board is your personal space to visualize and focus
                on your biggest goals. Inspired by Think and Grow Rich by
                Napoleon Hill, it reinforces your desires through daily
                visualization.
              </p>
              <p>
                By regularly seeing your goals, you engage your subconscious
                mind, strengthening your mental and emotional connection to your
                dreams, keeping you motivated and on track.
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
                <span className="font-semibold mr-1">
                  1) Enter a goal name:
                </span>
                e.g., Job, House, Car, Health, etc.
              </li>
              <li>
                <span className="font-semibold mr-1">
                  2) Enter an Image Url:
                </span>
                Paste a URL from
                <Link
                  href="https://unsplash.com/"
                  target="_blank"
                  className="mx-1 underline"
                >
                  <span className="uppercase">U</span>nsplash
                </Link>
                that represents your vision
                <span className="text-xs italic ml-1">
                  (Only Unsplash images are accepted.)
                </span>
              </li>
              <li>
                <span className="font-semibold mr-1">3) Tap “Add”</span>
                to instantly see your goal’s image in the gallery.
              </li>
              <li className="font-semibold mr-1">
                4) Hover over an image:
                <div className="flex flex-col gap-1 mt-2 ml-4 font-normal">
                  <p>a) Check a goal when completed (can be unchecked).</p>
                  <p>b) Delete a goal if no longer relevant.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Goal size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">Benefits:</p>
            </div>
            <ul className="flex flex-wrap gap-4">
              <li className="font-semibold">
                - Clarify Your Desires:{' '}
                <span className="font-normal">
                  Clearly define your goals with visual support.
                </span>
              </li>
              <li className="font-semibold">
                - Daily Motivation:{' '}
                <span className="font-normal">
                  Constantly remind yourself of what you’re working toward.
                </span>
              </li>
              <li className="font-semibold">
                - Strengthen Focus:{' '}
                <span className="font-normal">
                  Visualization encourages belief and action, key to success
                  according to Napoleon Hill.
                </span>
              </li>
            </ul>
            <Button
              variant={'outline'}
              className="capitalize mt-12 w-[26ch]"
              onClick={() => setOpenAction(false)}
            >
              Add goals now!
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

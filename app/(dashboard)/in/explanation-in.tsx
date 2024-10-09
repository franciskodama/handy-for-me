'use client';

import {
  Lightbulb,
  PartyPopper,
  Settings,
  Snail,
  Trash2,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function ExplanationIn({
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
              <PartyPopper size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">Proin dignissim orci vel?</p>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                dignissim orci vel efficitur sodales.
              </p>
              <p>
                Quisque dictum nec nisl vitae semper. Vestibulum venenatis,
                turpis ac ultricies congue, nisi lorem euismod lectus, sed
                condimentum nisi nisl quis nibh.
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
                Pellentesque est ante, porttitor at enim vel, finibus dictum
                tellus. Donec sapien mi, fermentum et dignissim at, ultricies
                nec quam.
              </p>
              <p className="flex items-center gap-4">
                <Checkbox checked={true} />
                Donec sapien mi, fermentum et dignissim at
              </p>
              <p className="flex items-center gap-4">
                <Trash2 size={24} strokeWidth={1.6} />
                Pellentesque est ante, porttitor at enim vel, finibus dictum
                tellus.
              </p>
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
              Start Exploring Now!
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

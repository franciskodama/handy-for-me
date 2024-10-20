'use client';

import { X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExplanationBox({
  iconOne,
  titleOne,
  contentOne,
  iconTwo,
  titleTwo,
  contentTwo,
  iconThree,
  titleThree,
  contentThree,
  callToAction,
  setOpenAction
}: {
  iconOne: JSX.Element;
  titleOne: string;
  contentOne: JSX.Element;
  iconTwo: JSX.Element;
  titleTwo: string;
  contentTwo: JSX.Element;
  iconThree: JSX.Element;
  titleThree: string;
  contentThree: JSX.Element;
  callToAction: string;
  setOpenAction: (value: boolean) => void;
}) {
  return (
    <div className="relative mt-8 p-1">
      {/* no padding here? */}
      <Alert
        className="border-[0.5em] sm:border-[1em]"
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
          borderStyle: 'solid'
          // borderWidth: '1em'
        }}
      >
        <AlertDescription className="relative text-sm flex flex-col sm:flex-row items-start justify-between p-1">
          <div className="flex flex-col mb-6 sm:w-1/3 py-2 sm:px-12">
            <div className="flex items-center gap-2 mb-4">
              {iconOne}
              <p className="text-lg font-bold">{titleOne}</p>
            </div>
            <div className="flex flex-col gap-4 mb-4">{contentOne}</div>
          </div>

          <div className="flex flex-col mb-6 sm:w-1/3 py-2 sm:px-12">
            <div className="flex items-center gap-2 mb-4">
              {iconTwo}
              <p className="text-lg font-bold">{titleTwo}</p>
            </div>

            <div className="flex flex-col gap-4 mb-4">{contentTwo}</div>
          </div>

          <div className="flex flex-col justify-between sm:w-1/3 py-2 sm:px-12">
            <div className="flex items-center gap-2 mb-4">
              {iconThree}
              <p className="text-lg font-bold">{titleThree}</p>
            </div>
            <div className="flex flex-wrap gap-4">{contentThree}</div>
            <Button
              variant={'outline'}
              className="capitalize mt-12 mb-6 w-[26ch]"
              onClick={() => setOpenAction(false)}
            >
              {callToAction}
            </Button>
          </div>
          <button
            className="absolute -right-10 -top-10 sm:right-0 sm:top-0 sm:border-0 border border-primary bg-white p-1"
            onClick={() => setOpenAction(false)}
          >
            <X size={24} color="black" strokeWidth={1.8} />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

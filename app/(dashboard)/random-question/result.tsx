import { Flame, HelpingHand, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Result({
  result,
  handleResetAll
}: {
  result: string;
  handleResetAll: () => void;
}) {
  const [fontSize, setFontSize] = useState(50);

  return (
    <div className="relative stripe-border flex flex-col w-full items-center">
      {result ? (
        <>
          <div className="flex flex-col items-center mt-4">
            <div className="flex gap-4">
              <Button
                className="text-2xl"
                variant="ghost"
                onClick={() => {
                  setFontSize(fontSize + 8);
                }}
              >
                +
              </Button>
              <Button
                className="text-2xl"
                variant="ghost"
                onClick={() => {
                  setFontSize(fontSize - 8);
                }}
              >
                -
              </Button>
            </div>
            <p
              className="flex flex-col justify-center px-12 pb-12 pt-6 font-semibold text-primary sm:leading-normal text-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {result}
            </p>
            <Button
              variant="outline"
              className="capitalize mb-12 hidden sm:flex"
              onClick={handleResetAll}
            >
              Reset All
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col h-full justify-center items-center px-12 py-24 leading-tight text-center w-full gap-4">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-6xl sm:text-2xl">
                Ready for a challenge?
              </p>
              <Flame size={32} strokeWidth={1.6} />
            </div>
            <p className="text-sm sm:text-xl">
              Set the timer, choose a topic, spin, and answer.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Result({
  result,
  handleResetAll
}: {
  result: string;
  handleResetAll: () => void;
}) {
  // const resultFontSize = result.length > 100 ? 'text-2xl' : 'text-5xl';

  return (
    <div className="relative stripe-border flex flex-col w-full items-center">
      {result ? (
        <>
          <Button>+</Button>
          <Button>-</Button>
          <p className="flex flex-col justify-center p-12 text-2xl sm:text-5xl font-semibold text-primary sm:leading-normal text-center">
            {result}
          </p>
          <Button
            variant="outline"
            className="capitalize mb-12 hidden sm:flex"
            onClick={handleResetAll}
          >
            Reset All
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col h-full justify-center items-center px-12 py-24 leading-tight text-center w-full gap-4">
            <div className="flex items-center gap-2">
              {/* <p className="font-semibold text-6xl sm:text-2xl"> */}
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

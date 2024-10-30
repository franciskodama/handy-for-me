import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader
} from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';
import useIsMobile from '@/hooks/use-is-mobile';
import Result from './result';
import Countdown from './countdown';

export function MobileResultDialog({
  result,
  name,
  resetAll,
  startCountdown,
  setStartCountdown,
  handleResetAll,
  setResult
}: {
  result: string;
  name: string;
  resetAll: boolean;
  startCountdown: boolean;
  setStartCountdown: (value: boolean) => void;
  handleResetAll: () => void;
  setResult: (value: string) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <>
      <AlertDialog open={result.length > 0 && isMobile}>
        <AlertDialogContent className="w-4/5">
          <AlertDialogHeader>
            <AlertDialogDescription>
              <Result result={result} handleResetAll={handleResetAll} />
              <div className="flex flex-col mt-8">
                <Countdown
                  name={name}
                  resetAll={resetAll}
                  result={result}
                  setStartCountdown={setStartCountdown}
                  startCountdown={startCountdown}
                  handleResetAll={handleResetAll}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center w-full" />
          <button
            className="absolute -right-4 -top-4 sm:right-0 sm:top-0 sm:border-0 border border-primary bg-white p-1 z-50"
            onClick={() => setResult('')}
          >
            <X size={24} color="black" strokeWidth={1.8} />
          </button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

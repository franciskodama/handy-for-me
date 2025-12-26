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
import { Dispatch, SetStateAction } from 'react';

export function MobileResultDialog({
  result,
  name,
  resetAll,
  startCountdown,
  setStartCountdown,
  setSelectedValue,
  selectedValue,
  handleResetAll,
  setResult,
  setTimeRemaining,
  timeRemaining,
  setLastSelectedTime,
  lastSelectedTime,
  setIsPaused,
  isPaused,
  setResetAll
}: {
  result: string;
  name: string;
  resetAll: boolean;
  startCountdown: boolean;
  setStartCountdown: (value: boolean) => void;
  setSelectedValue: (value: string) => void;
  selectedValue: string;
  handleResetAll: () => void;
  setResult: (value: string) => void;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  timeRemaining: number;
  setLastSelectedTime: (value: number) => void;
  lastSelectedTime: number;
  setIsPaused: (value: boolean) => void;
  isPaused: boolean;
  setResetAll?: (value: boolean) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <>
      <AlertDialog open={result.length > 0 && isMobile}>
        <AlertDialogContent className="w-[calc(100%-35px)]">
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
                  setSelectedValue={setSelectedValue}
                  selectedValue={selectedValue}
                  handleResetAll={handleResetAll}
                  setTimeRemaining={setTimeRemaining}
                  timeRemaining={timeRemaining}
                  setLastSelectedTime={setLastSelectedTime}
                  lastSelectedTime={lastSelectedTime}
                  setIsPaused={setIsPaused}
                  isPaused={isPaused}
                  setResetAll={setResetAll}
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

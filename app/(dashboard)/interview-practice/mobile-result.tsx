// Mobile result dialog for interview practice
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
  handleNextQuestion,
  setResult,
  setTimeRemaining,
  timeRemaining,
  setLastSelectedTime,
  lastSelectedTime,
  setIsPaused,
  isPaused,
  setResetAll
}: {
  result: any;
  name: string;
  resetAll: boolean;
  startCountdown: boolean;
  setStartCountdown: (value: boolean) => void;
  setSelectedValue: (value: string) => void;
  selectedValue: string;
  handleResetAll: () => void;
  handleNextQuestion: () => void;
  setResult: (value: any) => void;
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
    <AlertDialog open={!!result && isMobile}>
      <AlertDialogContent className="w-[calc(100%-35px)] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogDescription>
            <Result
              result={result}
              handleResetAll={handleResetAll}
              handleNextQuestion={handleNextQuestion}
              timeRemaining={timeRemaining}
            />
            <div className="flex flex-col mt-8">
              <Countdown
                name={name}
                resetAll={resetAll}
                result={result?.question}
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
          className="absolute right-2 top-2 p-2 rounded-full hover:bg-muted"
          onClick={() => setResult(null)}
        >
          <X size={24} className="text-foreground" strokeWidth={1.8} />
        </button>
      </AlertDialogContent>
    </AlertDialog>
  );
}

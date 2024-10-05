import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

type intervalRef = {
  current: any | undefined;
};
export function Stopwatch({
  startStopwatch,
  setStartStopwatch,
  resetStopwatch,
  setResetStopwatch
}: {
  startStopwatch: boolean;
  setStartStopwatch: (value: boolean) => void;
  resetStopwatch: boolean;
  setResetStopwatch: (value: boolean) => void;
}) {
  const [currentState, setCurrentState] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef: intervalRef = useRef();

  useEffect(() => {
    if (startStopwatch) {
      onStart();
    } else {
      onStop();
    }
  }, [startStopwatch]);

  const onStart = () => {
    if (currentState === 'START') return;
    setCurrentState('START');
    intervalRef.current = setInterval(() => {
      setCurrentTime((currentTime) => currentTime + 50);
    }, 50);
  };

  const onStop = () => {
    if (currentState === 'STOP') return;
    setCurrentState('STOP');
    clearInterval(intervalRef.current);
    setStartStopwatch(false);
  };

  const onReset = () => {
    if (currentState === 'RESET') return;
    setCurrentTime(0);
    setStartStopwatch(false);
  };

  const sec = Math.floor(currentTime / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  //   const millis = (currentTime % 1000).toString().padStart(2, '0');
  const seconds = (sec % 60).toString().padStart(2, '0');
  const minutes = (min % 60).toString().padStart(2, '0');
  const hours = (hour % 24).toString().padStart(2, '0');

  return (
    <div className="flex flex-col gap-2">
      <div className="text-5xl my-2">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        {/* <span>{millis}</span> */}
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={onStart}>
          Start
        </Button>
        <Button variant="outline" onClick={onStop}>
          Stop
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

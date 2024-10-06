import React, { useState, useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function Countdown({
  result,
  startCountdown,
  setStartCountdown,
  resetCountdown,
  setResetCountdown
}: {
  result: string;
  startCountdown: boolean;
  setStartCountdown: (value: boolean) => void;
  resetCountdown: boolean;
  setResetCountdown: (value: boolean) => void;
}) {
  const initialTime = 60 * 3;
  const minutesOptions = [1, 2, 3, 4, 5];
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (startCountdown) {
      const timerInterval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerInterval);
            alert('Countdown complete!');
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [startCountdown]);

  useEffect(() => {
    if (resetCountdown) {
      setTimeRemaining(0);
    }
  }, [resetCountdown]);

  // Convert seconds to hours, minutes, and seconds
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const handleReset = () => {
    setTimeRemaining(0);
  };
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Select
            onValueChange={(value) => {
              setTimeRemaining(+value * 60);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Minutes to answer" />
            </SelectTrigger>
            <SelectContent>
              {minutesOptions.map((min: number) => (
                <div key={min}>
                  <SelectItem value={min.toString()}>{`${min} min`}</SelectItem>
                </div>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs mt-2">
            <Checkbox
              checked={true}
              // onCheckedChange={(value) => {
              // }}
            />
            <p>Starts after spinning</p>
          </div>
        </div>

        <div className="text-5xl my-2">
          <p>{`${minutes}m ${seconds}s`}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            // onClick={onStart}
          >
            Start
          </Button>
          <Button
            variant="outline"
            // onClick={onStop}
          >
            Stop
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

// type intervalRef = {
//   current: any | undefined;
// };
// export function Countdown({
//   startCountdown,
//   setStartCountdown,
//   resetCountdown,
//   setResetCountdown
// }: {
//   startCountdown: boolean;
//   setStartCountdown: (value: boolean) => void;
//   resetCountdown: boolean;
//   setResetCountdown: (value: boolean) => void;
// }) {
//   const [currentState, setCurrentState] = useState('');
//   const [currentTime, setCurrentTime] = useState(0);
//   const intervalRef: intervalRef = useRef();

//   // https://codepen.io/putraaryotama/embed/wgwqBB?

//   useEffect(() => {
//     if (startCountdown) {
//       onStart();
//     } else {
//       onStop();
//     }
//   }, [startCountdown]);

//   const onStart = () => {
//     if (currentState === 'START') return;
//     setCurrentState('START');
//     intervalRef.current = setInterval(() => {
//       setCurrentTime((currentTime) => currentTime + 50);
//     }, 50);
//   };

//   const onStop = () => {
//     if (currentState === 'STOP') return;
//     setCurrentState('STOP');
//     clearInterval(intervalRef.current);
//     setStartCountdown(false);
//   };

//   const onReset = () => {
//     if (currentState === 'RESET') return;
//     setCurrentTime(0);
//     setStartCountdown(false);
//   };

//   const sec = Math.floor(currentTime / 1000);
//   const min = Math.floor(sec / 60);
//   const hour = Math.floor(min / 60);
//   //   const millis = (currentTime % 1000).toString().padStart(2, '0');
//   const seconds = (sec % 60).toString().padStart(2, '0');
//   const minutes = (min % 60).toString().padStart(2, '0');
//   const hours = (hour % 24).toString().padStart(2, '0');

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="text-5xl my-2">
//         <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
//         {/* <span>{millis}</span> */}
//       </div>
//       <div className="flex gap-2 mt-4">
//         <Button variant="outline" onClick={onStart}>
//           Start
//         </Button>
//         <Button variant="outline" onClick={onStop}>
//           Stop
//         </Button>
//         <Button variant="outline" onClick={onReset}>
//           Reset
//         </Button>
//       </div>
//     </div>
//   );
// }

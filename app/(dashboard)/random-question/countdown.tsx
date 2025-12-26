import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { Timer } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export type CountdownProps = {
  name: string;
  resetAll: boolean;
  result: string;
  startCountdown: boolean;
  setStartCountdown: (value: boolean) => void;
  setSelectedValue: (value: string) => void;
  selectedValue: string;
  handleResetAll: () => void;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  timeRemaining: number;
  setLastSelectedTime: (value: number) => void;
  lastSelectedTime: number;
  setIsPaused: (value: boolean) => void;
  isPaused: boolean;
  setResetAll?: (value: boolean) => void;
};

export default function Countdown({
  name,
  resetAll,
  result,
  startCountdown,
  setStartCountdown,
  setSelectedValue,
  selectedValue,
  handleResetAll,
  setTimeRemaining,
  timeRemaining,
  setLastSelectedTime,
  lastSelectedTime,
  setIsPaused,
  isPaused,
  setResetAll
}: CountdownProps) {
  const minutesOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    handleValueChange('2');
  }, []);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    // Only countdown if: countdown is started, result exists, time is greater than 0, and not paused
    if (startCountdown && result && timeRemaining > 0 && !isPaused) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime: number) => {
          if (prevTime <= 1) {
            // Timer reached 0 - stop countdown and stay at 0
            clearInterval(timerInterval);
            setStartCountdown(false);
            confetti({
              particleCount: 150,
              spread: 180
            });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Cleanup: stop timer if conditions are no longer met
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [
    startCountdown,
    result,
    timeRemaining,
    isPaused,
    setStartCountdown,
    setTimeRemaining
  ]);

  useEffect(() => {
    if (resetAll) {
      handleRestartButton();
      // Reset the resetAll flag after processing
      if (setResetAll) {
        setResetAll(false);
      }
    }
  }, [resetAll, setResetAll]);

  // Start countdown when result changes - always reset timer to beginning
  useEffect(() => {
    if (result) {
      // Always reset timer to lastSelectedTime when a new question appears
      if (lastSelectedTime > 0) {
        setTimeRemaining(lastSelectedTime);
      } else {
        // If no time was selected, default to 2 minutes
        const defaultTime = 2 * 60;
        setTimeRemaining(defaultTime);
        setLastSelectedTime(defaultTime);
        setSelectedValue('2');
      }
      setStartCountdown(true);
      setIsPaused(false);
    }
  }, [
    result,
    setStartCountdown,
    lastSelectedTime,
    setTimeRemaining,
    setLastSelectedTime,
    setSelectedValue
  ]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleValueChange = (value: string) => {
    const timeInSeconds = +value * 60;
    setSelectedValue(value);
    setTimeRemaining(timeInSeconds);
    setLastSelectedTime(timeInSeconds);
  };

  const handleRestartButton = () => {
    if (lastSelectedTime > 0) {
      setTimeRemaining(lastSelectedTime);
      setStartCountdown(true);
      setIsPaused(false);
    } else {
      // Default to 2 minutes if no time was selected
      const defaultTime = 2 * 60;
      setTimeRemaining(defaultTime);
      setLastSelectedTime(defaultTime);
      setSelectedValue('2');
      setStartCountdown(true);
      setIsPaused(false);
    }
  };

  const handlePauseResumeButton = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setStartCountdown(true);
    }
  };

  return (
    <div className="text-primary">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-lg font-semibold">Answer Clock</p>
        <Timer size={24} strokeWidth={1.6} />
      </div>

      <p className="hidden sm:block text-sm my-2 text-left">
        Customize your countdown:
      </p>

      <div className="flex flex-col gap-2">
        <div className="hidden sm:flex">
          <Select value={selectedValue} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Minutes to answer" />
            </SelectTrigger>
            <SelectContent>
              {minutesOptions.map((min) => (
                <SelectItem key={min} value={min.toString()}>
                  {`${min} min`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-5xl text-left my-4">
          <p>{`${minutes.toString().padStart(2, '0')}m ${seconds
            .toString()
            .padStart(2, '0')}s`}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            className="w-[10ch] mb-2"
            onClick={handlePauseResumeButton}
            disabled={timeRemaining === 0 || (!startCountdown && !isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            className="w-[10ch] mx-2 mb-2"
            onClick={handleRestartButton}
            disabled={lastSelectedTime === 0}
          >
            Restart
          </Button>

          <div className="sm:hidden">
            <Button
              className="w-[10ch] mb-2"
              variant="outline"
              onClick={handleResetAll}
              disabled={lastSelectedTime === 0}
            >
              Reset All
            </Button>
          </div>
        </div>

        {timeRemaining === 0 && result && (
          <p className="text-xl text-white font-semibold text-center p-8 mt-8 animate-pulse bg-yellow-500">
            {getKudos(name.split(' ')[0])}
          </p>
        )}
      </div>
    </div>
  );
}

const kudos = [
  "You did it! You're a speaking superstar! ⭐️",
  "Wow, you're a verbal virtuoso! 👏",
  'Great job! Your tongue is a tornado of words! 🌪️',
  "Incredible! You're a wordsmith extraordinaire! 🖋️",
  'You’re a language ninja! 🥷 Your skills are sharp and impressive.',
  'Well done!Your eloquence is electrifying!⚡',
  "Fantastic job! You're a linguistic legend! 👑",
  "You've mastered the art of conversation! 🎨",
  "Amazing! You're a speaking sensation! 🔥",
  "Time's up! Your words are a symphony! 🎶"
];

const getKudos = (name: string) => {
  const chosen = Math.random();
  switch (true) {
    case chosen > 1 / 2:
      return `${name}, ${kudos[0]}`;
    case chosen > 1 / 4:
      return `${name}, ${kudos[1]}`;
    case chosen > 1 / 8:
      return `${name}, ${kudos[2]}`;
    case chosen > 1 / 16:
      return `${name}, ${kudos[3]}`;
    case chosen > 1 / 32:
      return `${name}, ${kudos[4]}`;
    case chosen > 1 / 64:
      return `${name}, ${kudos[5]}`;
    case chosen > 1 / 128:
      return `${name}, ${kudos[6]}`;
    case chosen > 1 / 256:
      return `${name}, ${kudos[7]}`;
    case chosen > 1 / 512:
      return `${name}, ${kudos[8]}`;
    default:
      return `${name}, ${kudos[9]}`;
  }
};

// import React, { useState, useEffect } from 'react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import confetti from 'canvas-confetti';
// import { Timer } from 'lucide-react';

// export default function Countdown({
//   name,
//   resetAll,
//   result,
//   startCountdown,
//   setStartCountdown,
//   setSelectedValue,
//   selectedValue,
//   handleResetAll,
//   setTimeRemaining,
//   timeRemaining,
//   setLastSelectedTime,
//   lastSelectedTime
// }: {
//   name: string;
//   resetAll: boolean;
//   result: string;
//   startCountdown: boolean;
//   setStartCountdown: (value: boolean) => void;
//   setSelectedValue: (value: string) => void;
//   selectedValue: string;
//   handleResetAll: () => void;
//   setTimeRemaining: (value: number) => void;
//   timeRemaining: number;
//   setLastSelectedTime: (value: number) => void;
//   lastSelectedTime: number;
// }) {

//   const minutesOptions = [0.1, 1, 2, 3, 4, 5];
//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     handleValueChange('2');
//   }, []);

//   useEffect(() => {
//     let timerInterval: NodeJS.Timeout;
//     if (startCountdown && result && timeRemaining > 0 && !isPaused) {
//       timerInterval = setInterval(() => {
//         setTimeRemaining((prevTime) => {
//           if (prevTime <= 1) {
//             clearInterval(timerInterval);
//             setStartCountdown(false);
//             confetti({
//               particleCount: 150,
//               spread: 180
//             });
//             return 0;
//           } else {
//             return prevTime - 1;
//           }
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timerInterval);
//   }, [startCountdown, result, timeRemaining, isPaused]);

//   useEffect(() => {
//     if (resetAll) {
//       handleRestartButton();
//     }
//   }, [resetAll]);

//   useEffect(() => {
//     if (result) {
//       setStartCountdown(true);
//     }
//   }, [result, setStartCountdown]);

//   const minutes = Math.floor(timeRemaining / 60);
//   const seconds = timeRemaining % 60;

//   const handleValueChange = (value: string) => {
//     const timeInSeconds = +value * 60;
//     setSelectedValue(value);
//     setTimeRemaining(timeInSeconds);
//     setLastSelectedTime(timeInSeconds);
//   };

//   const handleRestartButton = () => {
//     if (lastSelectedTime > 0) {
//       setTimeRemaining(lastSelectedTime);
//       setStartCountdown(true);
//       setIsPaused(false);
//     } else {
//       setSelectedValue('');
//       setTimeRemaining(0);
//       setStartCountdown(false);
//     }
//   };

//   const handlePauseResumeButton = () => {
//     setIsPaused(!isPaused);
//     if (isPaused) {
//       setStartCountdown(true);
//     }
//   };

//   return (
//     <div className="text-primary">
//       <div className="flex items-center gap-2 mb-2">
//         <p className="text-lg font-semibold">Answer Clock</p>
//         <Timer size={24} strokeWidth={1.6} />
//       </div>

//       <p className="text-sm my-2 text-left">Customize your countdown:</p>
//       <div className="flex flex-col gap-2">
//         <div className="flex flex-col gap-2">
//           <Select value={selectedValue} onValueChange={handleValueChange}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Minutes to answer" />
//             </SelectTrigger>
//             <SelectContent>
//               {minutesOptions.map((min: number) => (
//                 <SelectItem
//                   key={min}
//                   value={min.toString()}
//                 >{`${min} min`}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="text-5xl text-left my-2">
//           <p>{`${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`}</p>
//         </div>
//         <div className="flex flex-wrap gap-2 mt-4">
//           <Button
//             className="w-[10ch] mb-2"
//             onClick={handlePauseResumeButton}
//             disabled={timeRemaining === 0 || (!startCountdown && !isPaused)}
//           >
//             {isPaused ? 'Resume' : 'Pause'}
//           </Button>

//           <Button
//             className="w-[10ch] mx-2 mb-2"
//             onClick={handleRestartButton}
//             disabled={lastSelectedTime === 0}
//           >
//             Restart
//           </Button>

//           <div className="sm:hidden">
//             <Button
//               className="w-[10ch] mb-2"
//               variant="outline"
//               onClick={handleResetAll}
//               disabled={lastSelectedTime === 0}
//             >
//               Reset All
//             </Button>
//           </div>
//         </div>

//         {timeRemaining === 0 && result && (
//           <p className="text-xl text-white font-semibold text-center p-8 mt-8 animate-pulse bg-yellow-500">
//             {getKudos(name.split(' ')[0])}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// const kudos = [
//   "You did it! You're a speaking superstar! ⭐️",
//   "Wow, you're a verbal virtuoso! 👏",
//   'Great job! Your tongue is a tornado of words! 🌪️',
//   "Incredible! You're a wordsmith extraordinaire! 🖋️",
//   'You’re a language ninja! 🥷 Your skills are sharp and impressive.',
//   'Well done!Your eloquence is electrifying!⚡',
//   "Fantastic job! You're a linguistic legend! 👑",
//   "You've mastered the art of conversation! 🎨",
//   "Amazing! You're a speaking sensation! 🔥",
//   "Time's up! Your words are a symphony! 🎶"
// ];

// const getKudos = (name: string) => {
//   const chosen = Math.random();
//   switch (true) {
//     case chosen > 1 / 2:
//       return `${name}, ${kudos[0]}`;
//     case chosen > 1 / 4:
//       return `${name}, ${kudos[1]}`;
//     case chosen > 1 / 8:
//       return `${name}, ${kudos[2]}`;
//     case chosen > 1 / 16:
//       return `${name}, ${kudos[3]}`;
//     case chosen > 1 / 32:
//       return `${name}, ${kudos[4]}`;
//     case chosen > 1 / 64:
//       return `${name}, ${kudos[5]}`;
//     case chosen > 1 / 128:
//       return `${name}, ${kudos[6]}`;
//     case chosen > 1 / 256:
//       return `${name}, ${kudos[7]}`;
//     case chosen > 1 / 512:
//       return `${name}, ${kudos[8]}`;
//     default:
//       return `${name}, ${kudos[9]}`;
//   }
// };

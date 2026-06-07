'use client';
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
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
    let timerInterval: any;

    if (startCountdown && result && timeRemaining > 0 && !isPaused) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime: number) => {
          if (prevTime <= 1) {
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
      if (setResetAll) {
        setResetAll(false);
      }
    }
  }, [resetAll, setResetAll]);

  useEffect(() => {
    if (result) {
      if (lastSelectedTime > 0) {
        setTimeRemaining(lastSelectedTime);
      } else {
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

      <p className="hidden lg:block text-sm my-2 text-left">
        Set your practice time:
      </p>

      <div className="flex flex-col gap-2">
        <div className="hidden lg:flex">
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

        <div className="text-5xl text-left my-4 font-mono">
          <p>{`${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`}</p>
        </div>

        <div className="flex flex-wrap mt-4">
          <Button
            className="w-[10ch] mb-2 mr-2"
            onClick={handlePauseResumeButton}
            disabled={timeRemaining === 0 || (!startCountdown && !isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            className="w-[10ch] mb-2 mr-2"
            onClick={handleRestartButton}
            disabled={lastSelectedTime === 0}
          >
            Restart
          </Button>

          <div className="lg:hidden">
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
          <KudosMessage name={name.split(' ')[0]} />
        )}
      </div>
    </div>
  );
}

const kudos = [
  'Confidence is key! You nailed it! 🚀',
  'Great articulation of your thoughts! 🗣️',
  'Structured and clear. Well done! 📐',
  "You're thinking like a Lead PM! 🧠",
  'Excellent delivery! Keep it up! ✨',
  'Practice makes perfect! 🎯',
  "You've got this! Strong answer! 💪",
  'Strategic and insightful. Impressive! 📈',
  'Way to handle that curveball! ⚾',
  "Time's up! You did great! 🏁"
];

function KudosMessage({ name }: { name: string }) {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * kudos.length);
    setMessage(`${name}, ${kudos[randomIndex]}`);
  }, [name]);

  if (!message) return null;

  return (
    <p className="text-lg text-white font-semibold text-center p-4 mt-4 animate-pulse bg-green-600">
      {message}
    </p>
  );
}

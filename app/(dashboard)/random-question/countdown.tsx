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
  resetAll,
  result,
  startCountdown,
  setStartCountdown
}: {
  resetAll: boolean;
  result: string;
  startCountdown: boolean;
  setStartCountdown: (value: boolean) => void;
}) {
  const minutesOptions = [1, 2, 3, 4, 5];
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [lastSelectedTime, setLastSelectedTime] = useState(0);
  const [autoStartEnabled, setAutoStartEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (startCountdown && timeRemaining > 0 && !isPaused) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            setStartCountdown(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [startCountdown, timeRemaining, isPaused, setStartCountdown]);

  useEffect(() => {
    if (resetAll) {
      handleRestartButton();
    }
  }, [resetAll]);

  // This effect now only prepares the timer when a new result comes in
  useEffect(() => {
    if (result && lastSelectedTime > 0) {
      setTimeRemaining(lastSelectedTime);
      // Only start the countdown if auto-start is enabled
      if (autoStartEnabled) {
        setStartCountdown(true);
      }
    }
  }, [result, autoStartEnabled, lastSelectedTime, setStartCountdown]);

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
      setSelectedValue('');
      setTimeRemaining(0);
      setStartCountdown(false);
    }
  };

  const handlePauseResumeButton = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setStartCountdown(true);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Select value={selectedValue} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Minutes to answer" />
            </SelectTrigger>
            <SelectContent>
              {minutesOptions.map((min: number) => (
                <SelectItem
                  key={min}
                  value={min.toString()}
                >{`${min} min`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs mt-2">
            <Checkbox
              checked={autoStartEnabled}
              onCheckedChange={() => setAutoStartEnabled(!autoStartEnabled)}
            />
            <p>Starts automatically after spinning</p>
          </div>
        </div>

        <div className="text-5xl my-2">
          <p>{`${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            className="w-[10ch]"
            variant="outline"
            onClick={() => setStartCountdown(true)}
            disabled={timeRemaining === 0 || startCountdown || isPaused}
          >
            Start
          </Button>

          <Button
            className="w-[10ch]"
            variant="outline"
            onClick={handlePauseResumeButton}
            disabled={timeRemaining === 0 || (!startCountdown && !isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            className="w-[10ch]"
            variant="outline"
            onClick={handleRestartButton}
            disabled={lastSelectedTime === 0}
          >
            Restart
          </Button>
        </div>
        {timeRemaining === 0 && result && (
          <p className="text-5xl font-semibold text-white uppercase text-center bg-red-500 px-2 py-4 mt-8">
            Time over
          </p>
        )}
      </div>
    </div>
  );
}

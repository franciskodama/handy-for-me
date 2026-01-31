'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  topicsRandomQuestions,
  getQuestions,
  getLuckyChoice
} from './questions';
import { Button } from '@/components/ui/button';
import { MobileResultDialog } from './mobile-result';
import Help from '@/components/common/Help';
import ExplanationRandomQuestion from './explanation-random-question';
import Countdown from './countdown';
import Result from './result';
import { Search } from 'lucide-react';

export default function RandomQuestion({ name }: { name: string }) {
  const [openAction, setOpenAction] = useState(false);
  const [topic, setTopic] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [startCountdown, setStartCountdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [resetAll, setResetAll] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [lastSelectedTime, setLastSelectedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const arrayOfQuestions = getQuestions(topic);
    setQuestions(arrayOfQuestions);
  }, [topic]);

  const handleSpin = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomItem = questions[randomIndex];
    setTimeout(() => {
      setResult(randomItem);
      setStartCountdown(true);
    }, 1000);
  };

  const handleFeelingLucky = () => {
    const luckyChoice = getLuckyChoice();
    // Set the topic so the dropdown shows the selected topic
    setTopic(luckyChoice.topicId);
    setTimeout(() => {
      setResult(luckyChoice.question);
      setStartCountdown(true);
    }, 1000);
  };

  const handleResetAll = () => {
    setResetAll(true);
    setSelectedValue('');
    setResult('');
    setStartCountdown(false);
    setIsPaused(false);
    // Reset timer to last selected time (or default 2 minutes if none selected)
    if (lastSelectedTime > 0) {
      setTimeRemaining(lastSelectedTime);
    } else {
      // Default to 2 minutes (120 seconds) if no time was selected
      const defaultTime = 2 * 60;
      setTimeRemaining(defaultTime);
      setLastSelectedTime(defaultTime);
      setSelectedValue('2');
    }
  };

  const minutesOptions = [0.1, 1, 2, 3, 4, 5];
  const handleValueChange = (value: string) => {
    const timeInSeconds = +value * 60;
    setSelectedValue(value);
    setTimeRemaining(timeInSeconds);
    setLastSelectedTime(timeInSeconds);
  };
  return (
    <Card>
      <CardHeader className="mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Random Questions</p>
          {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
        </CardTitle>
        <CardDescription>
          Boost your English with fun, random prompts!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {openAction ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="mb-12">
                <ExplanationRandomQuestion setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between gap-8 w-full mb-12">
          <div className="flex flex-col sm:w-1/5 gap-4">
            <p className="sm:hidden text-lg font-semibold mb-4">
              Let's get started!
            </p>
            <div className="flex flex-col gap-2">
              <div className="sm:hidden flex flex-col gap-2">
                <p className="text-sm">Minutes to answer</p>
                <Select value={selectedValue} onValueChange={handleValueChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Time" />
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
              </div>

              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <p className="text-sm sm:text-lg sm:font-semibold">
                  Pick a Topic
                </p>
                <Search
                  size={24}
                  strokeWidth={1.6}
                  className="hidden sm:block"
                />
              </div>

              <Select
                value={topic}
                onValueChange={(value) => {
                  setResult('');
                  setTopic(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topicsRandomQuestions.map(
                    (topic: { id: string; name: string }) => (
                      <div key={topic.id}>
                        {topic && (
                          <SelectItem value={topic.id} className="capitalize">
                            {topic.name}
                          </SelectItem>
                        )}
                      </div>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="capitalize"
              onClick={handleSpin}
              disabled={topic.trim() === ''}
            >
              {!topic ? 'Waiting for topic...' : 'Spin!'}
            </Button>
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-xs mb-2">or</p>
              <Button
                className="capitalize w-full"
                variant="outline"
                onClick={handleFeelingLucky}
              >
                {`I'm feeling lucky!`}
              </Button>
              <p className="text-xs mb-8">
                Let fate decide your next topic and question
              </p>
            </div>
          </div>

          <div className="hidden sm:block sm:w-3/5 h-full">
            <Result result={result} handleResetAll={handleResetAll} />
          </div>

          <div className="hidden sm:flex flex-col mt-0 sm:w-1/5">
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

          <MobileResultDialog
            name={name}
            result={result}
            resetAll={resetAll}
            startCountdown={startCountdown}
            setStartCountdown={setStartCountdown}
            handleResetAll={handleResetAll}
            setSelectedValue={setSelectedValue}
            selectedValue={selectedValue}
            setResult={setResult}
            setTimeRemaining={setTimeRemaining}
            timeRemaining={timeRemaining}
            setLastSelectedTime={setLastSelectedTime}
            lastSelectedTime={lastSelectedTime}
            setIsPaused={setIsPaused}
            isPaused={isPaused}
            setResetAll={setResetAll}
          />
        </div>
      </CardContent>
    </Card>
  );
}

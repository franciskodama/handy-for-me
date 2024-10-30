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
import Help from '@/components/Help';
import ExplanationRandomQuestion from './explanation-random-question';
import Countdown from './countdown';
import Result from './result';

export default function RandomQuestion({ name }: { name: string }) {
  const [topic, setTopic] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [resetAll, setResetAll] = useState(false);

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
    setTimeout(() => {
      setResult(luckyChoice);
      setStartCountdown(true);
    }, 1000);
  };

  const handleResetAll = () => {
    setResetAll(true);
    setResult('');
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
      <CardContent className="h-screen">
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

        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-4 w-full">
          <div className="flex flex-col sm:w-1/5 gap-4">
            <p className="text-lg font-semibold">
              {`${name.split(' ')[0]}, let's get started! `}
            </p>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  setResult('');
                  setTopic(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a Topic" />
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

          <div className="hidden sm:flex flex-col mt-0 w-1/5">
            <Countdown
              name={name}
              resetAll={resetAll}
              result={result}
              setStartCountdown={setStartCountdown}
              startCountdown={startCountdown}
              handleResetAll={handleResetAll}
            />
          </div>

          <MobileResultDialog
            name={name}
            result={result}
            resetAll={resetAll}
            startCountdown={startCountdown}
            setStartCountdown={setStartCountdown}
            handleResetAll={handleResetAll}
            setResult={setResult}
          />
        </div>
      </CardContent>
    </Card>
  );
}

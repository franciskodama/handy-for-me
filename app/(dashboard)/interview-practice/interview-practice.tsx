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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  getCategories,
  getQuestionsByCategory,
  getLuckyChoice,
  pmFrameworks,
  pmInterviewQuestions
} from './questions';
import { Button } from '@/components/ui/button';
import { MobileResultDialog } from '@/app/(dashboard)/interview-practice/mobile-result';
import Help from '@/components/common/Help';
import Result from './result';
import { Search, Briefcase } from 'lucide-react';
import ExplanationInterviewPractice from './explanation-interview-practice';
import Countdown from './countdown';

export default function InterviewPractice({ name }: { name: string }) {
  const [openAction, setOpenAction] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [startCountdown, setStartCountdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [resetAll, setResetAll] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [lastSelectedTime, setLastSelectedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const categories = getCategories();

  useEffect(() => {
    if (category) {
      const filtered = getQuestionsByCategory(category);
      setQuestions(filtered);
    }
  }, [category]);

  const handleSpin = () => {
    if (questions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomItem = questions[randomIndex];

    // Smooth transition
    setResult(null);
    setTimeout(() => {
      setResult(randomItem);
      setStartCountdown(true);
    }, 1000);
  };

  const handleFeelingLucky = () => {
    const luckyChoice = getLuckyChoice();
    setCategory(luckyChoice.category);
    setResult(null);
    setTimeout(() => {
      setResult(luckyChoice);
      setStartCountdown(true);
    }, 1000);
  };

  const handleResetAll = () => {
    setResetAll(true);
    setSelectedValue('');
    setResult(null);
    setStartCountdown(false);
    setIsPaused(false);
    if (lastSelectedTime > 0) {
      setTimeRemaining(lastSelectedTime);
    } else {
      const defaultTime = 2 * 60;
      setTimeRemaining(defaultTime);
      setLastSelectedTime(defaultTime);
      setSelectedValue('2');
    }
  };

  return (
    <Card className="min-h-[75vh]">
      <CardHeader className="mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <p>Interview Practice</p>
          </div>
          {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
        </CardTitle>
        <CardDescription>
          Master your PM interviews with categorized questions and frameworks.
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
                <ExplanationInterviewPractice setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row justify-between gap-8 w-full mb-12">
          <Tabs defaultValue="category" className="w-full lg:w-1/4">
            <TabsList className="w-full">
              <TabsTrigger value="category" className="flex-1">
                Practice
              </TabsTrigger>
              <TabsTrigger value="frameworks" className="flex-1">
                Frameworks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="w-full">
              <div className="flex flex-col w-full gap-4 mt-8 px-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">Pick a Category</p>
                    <Search size={18} strokeWidth={1.6} />
                  </div>

                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setResult(null);
                      setCategory(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSpin}
                  disabled={!category}
                >
                  {!category ? 'Select a category' : 'Pick a Question!'}
                </Button>

                <div className="flex flex-col items-center gap-2 w-full mt-4">
                  <p className="text-xs text-muted-foreground">or</p>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleFeelingLucky}
                  >
                    I&apos;m feeling lucky!
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Random question from all categories
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="frameworks" className="w-full">
              <div className="flex flex-col w-full mt-4 px-2">
                {pmFrameworks.map((framework) => (
                  <Accordion
                    key={framework.category}
                    type="single"
                    collapsible
                    className="w-full"
                  >
                    <AccordionItem value={framework.category}>
                      <AccordionTrigger className="text-lg font-black uppercase tracking-wider">
                        {framework.category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-4 p-2">
                          {framework.items.map((item) => (
                            <div
                              key={item.name}
                              className="flex flex-col gap-1 border-b border-muted pb-2 last:border-0"
                            >
                              <p className="font-semibold text-base text-primary">
                                {item.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="hidden lg:block lg:w-1/2 h-full">
            <Result
              result={result}
              handleResetAll={handleResetAll}
              timeRemaining={timeRemaining}
            />
          </div>

          <div className="hidden lg:flex flex-col lg:w-1/4">
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

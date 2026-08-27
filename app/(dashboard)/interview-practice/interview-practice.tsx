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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { MobileResultDialog } from '@/app/(dashboard)/interview-practice/mobile-result';
import Help from '@/components/common/Help';
import Result from './result';
import ExplanationInterviewPractice from './explanation-interview-practice';
import Countdown from './countdown';
import { toast } from '@/hooks/use-toast';
import { AboutYouDialog } from './about-you-dialog';
import {
  Search,
  Briefcase,
  Linkedin,
  Github,
  Globe,
  Copy,
  Check,
  Bot,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const QUICK_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kodama',
    icon: Linkedin,
    type: 'copy' as const
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    url: 'https://www.fkodama.com',
    icon: Globe,
    type: 'copy' as const
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/franciskodama',
    icon: Github,
    type: 'copy' as const
  },
  {
    id: 'job-tracker',
    label: 'Job-Tracker',
    url: 'https://app.tealhq.com/job-tracker',
    icon: Briefcase,
    type: 'link' as const
  },
  {
    id: 'role-play',
    label: 'Role Play',
    url: 'https://www.linkedin.com/learning/role-play/scenarios/AQHCQTGmJCQseQAAAaAQXMZZD33M1ud72czE51DpU35H3unoi335gYYyug?previousSessionUrn=urn%3Ali%3Ala_rolePlaySession%3A8b941161-c4cd-4c68-a02f-d26bfde2b785',
    icon: Bot,
    type: 'link' as const
  }
];

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
  const [isLuckyMode, setIsLuckyMode] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openYouModal, setOpenYouModal] = useState(false);

  const categories = getCategories();

  const handleCopy = async (item: (typeof QUICK_LINKS)[number]) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      toast({
        title: 'Copied to clipboard!',
        description: `${item.label} URL copied: ${item.url}`,
        variant: 'success'
      });
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: 'Error copying link',
        description: 'Failed to copy URL to clipboard.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (category) {
      const filtered = getQuestionsByCategory(category);
      setQuestions(filtered);
    }
  }, [category]);

  const handleSpin = () => {
    if (questions.length === 0) return;
    setIsLuckyMode(false);
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
    setIsLuckyMode(true);
    const luckyChoice = getLuckyChoice();
    setCategory(luckyChoice.category);
    setResult(null);
    setTimeout(() => {
      setResult(luckyChoice);
      setStartCountdown(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (isLuckyMode) {
      handleFeelingLucky();
    } else {
      handleSpin();
    }
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
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <p>Interview Practice</p>
            <div className="block sm:hidden">
              {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              const isCopied = copiedId === item.id;
              return (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.type === 'link' ? (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold normal-case shadow-[0_0px_0px_0px_inset,#FFF_-2px_2px_0_-1px,#0F1739_-2px_2px] active:-translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="h-3.5 w-3.5 text-primary" />
                            <span>{item.label}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground ml-0.5 opacity-60" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(item)}
                          className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold normal-case shadow-[0_0px_0px_0px_inset,#FFF_-2px_2px_0_-1px,#0F1739_-2px_2px] active:-translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          )}
                          <span>{item.label}</span>
                          {isCopied ? (
                            <span className="text-[10px] font-bold text-green-600 ml-0.5">
                              Copied!
                            </span>
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground ml-0.5 opacity-60" />
                          )}
                        </Button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {item.type === 'link'
                          ? `Open in new tab: ${item.url}`
                          : `Click to copy: ${item.url}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenYouModal(true)}
                    className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold normal-case shadow-[0_0px_0px_0px_inset,#FFF_-2px_2px_0_-1px,#0F1739_-2px_2px] active:-translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span>You</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Practice &quot;Talk about yourself&quot; pitch</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="hidden sm:block">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
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
                              className="flex flex-col gap-1 border-b border-muted pb-4 last:border-0"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-base text-primary">
                                  {item.name}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-muted-foreground hover:text-primary"
                                  onClick={() => setSelectedFramework(item)}
                                >
                                  More
                                </Button>
                              </div>
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
              handleNextQuestion={handleNextQuestion}
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
            handleNextQuestion={handleNextQuestion}
          />
        </div>
      </CardContent>

      <AlertDialog
        open={!!selectedFramework}
        onOpenChange={() => setSelectedFramework(null)}
      >
        <AlertDialogContent className="w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-primary">
              {selectedFramework?.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground mt-4 whitespace-pre-wrap">
              {selectedFramework?.longDescription ||
                selectedFramework?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedFramework?.image && (
            <div className="relative w-full aspect-square mt-6 rounded-lg overflow-hidden border border-muted">
              <Image
                src={selectedFramework.image}
                alt={selectedFramework.name}
                fill
                className="object-contain p-4"
              />
            </div>
          )}

          <AlertDialogFooter className="mt-8">
            <AlertDialogAction onClick={() => setSelectedFramework(null)}>
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AboutYouDialog open={openYouModal} onOpenChangeAction={setOpenYouModal} />
    </Card>
  );
}

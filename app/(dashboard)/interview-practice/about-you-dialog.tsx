'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UserCheck,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface PitchTopic {
  id: number;
  title: string;
  badge: string;
  text: string;
  keywords: string[];
}

export const ABOUT_YOU_TOPICS: PitchTopic[] = [
  {
    id: 1,
    title: 'Positioning & Track Record',
    badge: 'Executive Summary',
    text: 'I am a Senior Product Leader with over 20 years of experience scaling digital platforms and leading cross-functional teams.',
    keywords: ['Senior Product Leader', '20 years of experience', 'scaling digital platforms']
  },
  {
    id: 2,
    title: 'Agency Leadership & Impact',
    badge: 'Entrepreneurship',
    text: 'Lately in my career, I co-founded and ran a digital agency that grew to 26 people, where I acted as the strategic partner for global brands like Walmart and Unilever, owning product vision, team leadership, and P&L.',
    keywords: ['co-founded and ran', 'grew to 26 people', 'Walmart and Unilever', 'P&L']
  },
  {
    id: 3,
    title: 'Technical Depth & Evolution',
    badge: 'Hybrid Pivot',
    text: 'I believe that what sets me apart today is my hybrid capability: Because to sharpen my technical depth, I transitioned into full-stack software development, building modern web platforms using Next.js, TypeScript, PostgreSQL, and AI APIs.',
    keywords: ['hybrid capability', 'full-stack software development', 'Next.js, TypeScript, PostgreSQL, and AI APIs']
  },
  {
    id: 4,
    title: 'Strategic & Technical Bridge',
    badge: 'Bilingual Advantage',
    text: "This gives me a unique 'bilingual' advantage. I can translate high-level business strategy for executives while discussing system architecture, database schemas, and trade-offs directly with senior engineers.",
    keywords: ["'bilingual' advantage", 'translate high-level business strategy', 'system architecture', 'database schemas', 'senior engineers']
  },
  {
    id: 5,
    title: 'Forward Looking & Goal',
    badge: 'Target Vision',
    text: 'Moving forward, I am looking to leverage this bridge between product vision and technical execution to lead impactful product teams here in Canada.',
    keywords: ['leverage this bridge', 'product vision and technical execution', 'lead impactful product teams', 'Canada']
  }
];

interface AboutYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutYouDialog({ open, onOpenChange }: AboutYouDialogProps) {
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const totalTopics = ABOUT_YOU_TOPICS.length;

  const handleShowNext = () => {
    if (revealedCount < totalTopics) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setRevealedCount(0);
    setShowAll(false);
  };

  const handleToggleShowAll = () => {
    if (showAll) {
      setShowAll(false);
    } else {
      setShowAll(true);
      setRevealedCount(totalTopics);
    }
  };

  const handleCopyPitch = async () => {
    const fullPitch = ABOUT_YOU_TOPICS.map((t) => `• ${t.text}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(fullPitch);
      setCopied(true);
      toast({
        title: 'Pitch copied!',
        description: 'Full pitch copied to clipboard.',
        variant: 'success'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive'
      });
    }
  };

  const isCompleted = revealedCount === totalTopics || showAll;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6 sm:p-7 gap-5 overflow-hidden">
        {/* Header */}
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  Talk About Yourself
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Pitch Practice
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Master your 90-second response using active recall progressive reveal.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleShowAll}
                className="h-8 text-xs gap-1.5"
              >
                {showAll ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Practice Mode
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Reveal All
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPitch}
                className="h-8 text-xs gap-1.5"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-1.5">
              <span>Progress: {showAll ? totalTopics : revealedCount} of {totalTopics} topics</span>
              <span>{Math.round(((showAll ? totalTopics : revealedCount) / totalTopics) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((showAll ? totalTopics : revealedCount) / totalTopics) * 100}%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </DialogHeader>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {ABOUT_YOU_TOPICS.map((topic, index) => {
            const isRevealed = showAll || index < revealedCount;
            const isNextToReveal = !showAll && index === revealedCount;

            return (
              <motion.div
                key={topic.id}
                initial={false}
                animate={{
                  opacity: isRevealed ? 1 : isNextToReveal ? 0.85 : 0.4,
                  scale: isRevealed ? 1 : 0.99
                }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isRevealed
                    ? 'border-primary/30 bg-card shadow-sm'
                    : isNextToReveal
                    ? 'border-dashed border-primary/40 bg-muted/30'
                    : 'border-muted bg-muted/10 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {topic.id}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {topic.title}
                    </h4>
                  </div>
                  <Badge
                    variant={isRevealed ? 'outline' : 'secondary'}
                    className="text-[10px] uppercase tracking-wider font-semibold"
                  >
                    {topic.badge}
                  </Badge>
                </div>

                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 text-sm text-foreground/90 leading-relaxed pl-8 border-l-2 border-primary/40"
                    >
                      <p>{topic.text}</p>
                    </motion.div>
                  ) : (
                    <div className="pl-8 pt-1 text-xs text-muted-foreground flex items-center gap-1.5 italic">
                      {isNextToReveal ? (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                          <span>Press <strong>Show</strong> to reveal this point...</span>
                        </>
                      ) : (
                        <span>Hidden topic #{topic.id}</span>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer with sticky action button */}
        <DialogFooter className="pt-3 border-t flex-row items-center justify-between sm:justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {isCompleted ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> All points revealed! Speak it aloud.
              </span>
            ) : (
              <span>Recall the topic, then click <strong>Show</strong>.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {revealedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9 px-3 text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            )}

            {!isCompleted ? (
              <Button
                onClick={handleShowNext}
                size="sm"
                className="h-9 px-4 text-xs font-semibold gap-2 shadow-[0_0px_0px_0px_inset,#FFF_-2px_2px_0_-1px,#0F1739_-2px_2px] active:-translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
              >
                <span>{revealedCount === 0 ? 'Show' : 'Show Next'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                size="sm"
                className="h-9 px-4 text-xs font-semibold gap-2 shadow-[0_0px_0px_0px_inset,#FFF_-2px_2px_0_-1px,#0F1739_-2px_2px] active:-translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Practice Again</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

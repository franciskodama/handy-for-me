'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Bomb,
  Ghost,
  MessageCircleX,
  Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import Help from '@/components/Help';
import { toast } from '@/hooks/use-toast';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { Button } from '@/components/ui/button';
import { getColorCode } from '@/lib/utils';
import MessageEmpty from '@/components/MessageEmpty';
import ExplanationStoicSupport from './explanation-stoic-support';

type Topic = {
  topic: string;
  quote: string;
  author: string;
  explanation: string;
};

type Category = {
  category: string;
  topics: Topic[];
};

export default function StoicSupport({ uid }: { uid: string }) {
  const [openAction, setOpenAction] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between items-start mb-0">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <p>Stoic Support</p>
              <div>
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
            <p
              className={`${barlow.className} text-sm font-normal lowercase mt-2`}
            >
              <span className="uppercase">T</span>urn life’s challenges into
              growth with timeless wisdom.
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <AnimatePresence>
          {openAction ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="mb-12">
                <ExplanationStoicSupport setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div>
          {stoicResponses.map((el: Category) => (
            <div key={el.category}>
              <Accordion type="single" collapsible className="w-full mb-4">
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="w-full text-xs underline">
                    {el.category}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2 px-4">
                    {el.topics.map((topic: Topic) => (
                      <div key={topic.topic}>
                        <AlertDialog>
                          <AlertDialogTrigger className="px-2 py-1 mr-4 w-full">
                            {/* <Button variant={'outline'} className="w-full"> */}
                            {topic.topic}
                            {/* </Button> */}
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[calc(100%-35px)]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                {topic.topic}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="py-4">
                                <div>
                                  <p>{topic.quote}</p>
                                  <p>{topic.author}</p>
                                </div>
                                <p className="font-bold mx-1">
                                  {topic.explanation}
                                </p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Close</AlertDialogCancel>
                              <AlertDialogAction
                              // onClick={() => handleDeleteItem(shortcut)}
                              >
                                Copy to Clipboard
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const stoicResponses = [
  {
    category: 'Finding Purpose & Meaning',
    topics: [
      {
        topic: 'I feel like I lack a sense of purpose.',
        quote:
          'At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work – as a human being.',
        author: 'Marcus Aurelius',
        explanation:
          'Purpose can be found in the simple act of fulfilling your role as a human. Aligning actions with values creates meaning in small, daily efforts.'
      },
      {
        topic: 'I’m unsure if my work has meaning.',
        quote:
          'To love only what happens, what was destined. No greater harmony.',
        author: 'Marcus Aurelius',
        explanation:
          'Finding purpose doesn’t always require a grand vision; instead, accept and love the work as it is, and find harmony by aligning it with your values.'
      }
      // Additional topics for "Finding Purpose & Meaning"
    ]
  },
  {
    category: 'Relationships',
    topics: [
      {
        topic: 'My loved one doesn’t support my dreams.',
        quote: 'Be tolerant with others and strict with yourself.',
        author: 'Marcus Aurelius',
        explanation:
          'Recognize that others may not share your vision, but your path is yours to follow. Keep moving forward with understanding and focus on self-discipline, rather than relying on external support.'
      },
      {
        topic: 'I often feel hurt by things my friends or family say.',
        quote:
          'Remember, it’s not what happens to you, but how you react to it that matters.',
        author: 'Epictetus',
        explanation:
          'The Stoic approach encourages you to control your response, rather than the words of others. Remain calm and recognize that you can choose your reaction to protect your peace.'
      }
      // Additional topics for "Relationships"
    ]
  },
  {
    category: 'Work & Career',
    topics: [
      {
        topic: 'I feel stuck in a job that doesn’t fulfill me.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'Focus on embodying your values in any situation. Though your current job may not reflect your dreams, your actions and mindset can align with your ideals, which can bring fulfillment within any role.'
      },
      {
        topic: 'I’m constantly comparing myself to others in my field.',
        quote:
          'Wealth consists not in having great possessions, but in having few wants.',
        author: 'Epictetus',
        explanation:
          'Find contentment by reducing desires for external validation. Your worth isn’t measured by comparison but by your personal growth and satisfaction with your efforts.'
      }
      // Additional topics for "Work & Career"
    ]
  },
  {
    category: 'Personal Growth & Self-Worth',
    topics: [
      {
        topic: 'I fear failure when trying something new.',
        quote: 'The obstacle is the way.',
        author: 'Marcus Aurelius',
        explanation:
          'Rather than fearing failure, see it as an opportunity for growth. Stoicism teaches us that challenges can be valuable teachers, pushing us toward resilience and self-discovery.'
      },
      {
        topic: 'I focus too much on my flaws.',
        quote:
          'The happiness of your life depends upon the quality of your thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Shift your focus from flaws to strengths and constructive actions. Your happiness is shaped by what you choose to dwell on, so choose thoughts that encourage self-compassion and growth.'
      }
      // Additional topics for "Personal Growth & Self-Worth"
    ]
  }
  // Additional categories with topics
];

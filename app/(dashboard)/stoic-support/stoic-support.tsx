'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AccordionByButtons,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  accordionContentAsButtonClass
} from '@/components/ui/accordion-by-buttons';
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
import Help from '@/components/common/Help';
import { barlow } from '@/app/ui/fonts';
import { cn } from '@/lib/utils';
import ExplanationStoicSupport from './explanation-stoic-support';
import {
  BookOpen,
  Briefcase,
  Compass,
  DollarSign,
  HeartHandshake,
  HeartPulse,
  HelpCircle,
  Home,
  MessageCirclePlus,
  UserCheck,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function StoicSupport({ name }: { name: string }) {
  const [openAction, setOpenAction] = useState(false);

  const sortedStoicResponses = stoicResponses.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return 0;
  });

  const getContent = (category: string, topic: Topic) => {
    const content = `${category}: ${topic.topic} | Quote: "${topic.quote}" — ${topic.author} | Explanation: ${topic.explanation}`;
    return content;
  };

  return (
    <Card className="min-h-[75vh]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-0 w-full">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="mb-0">Stoic Support</CardTitle>
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
        </div>
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
        <div className="flex justify-center">
          <p className="text-base font-semibold mb-12">
            Click on a category, and choose a topic:
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto mb-12">
          {sortedStoicResponses.map((el: Category) => (
            <div key={el.category}>
              <AccordionByButtons type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="text-left w-[20em] h-[3.8em]">
                    {getIcon(el.category, 'accordion')}
                    {el.category}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col items-start gap-2">
                    {el.topics.map((topic: Topic) => (
                      <div key={topic.topic}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className={cn(
                                accordionContentAsButtonClass,
                                'px-2 py-1 w-full justify-start text-left'
                              )}
                            >
                              {topic.topic}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[calc(100%-35px)] sm:p-8">
                            <AlertDialogHeader>
                              <span className="text-sm font-semibold bg-primary w-full text-white py-1 text-center mb-8">
                                {el.category}
                              </span>
                              <AlertDialogTitle className="flex items-center gap-2 uppercase font-bold text-left text-xl px-12">
                                {getIcon(el.category, 'dialog')}
                                {topic.topic}
                              </AlertDialogTitle>
                              <AlertDialogDescription
                                className="py-4 text-primary"
                                asChild
                              >
                                <div>
                                  <div className="flex flex-col gap-2 my-8 p-4 bg-muted">
                                    <span className="text-lg font-semibold italic">
                                      {`"${topic.quote}"`}
                                    </span>
                                    <p className="font-semibold text-left ml-4 sm:text-right mr-8">{`— ${topic.author}`}</p>
                                  </div>
                                  <div className="p-4 text-left text-base">
                                    <div>{`${name}, `}</div>
                                    <span className="mb-4 mt-1">
                                      {topic.explanation}
                                    </span>
                                  </div>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col gap-4">
                              <Button variant={'outline'}>
                                <CopyToClipboard
                                  text={getContent(el.category, topic)}
                                >
                                  <p>Copy to Clipboard</p>
                                </CopyToClipboard>
                              </Button>
                              <AlertDialogAction>Close</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </AccordionByButtons>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const getIcon = (category: string, location: string) => {
  const iconFound = iconCategories.find((el) => el.label === category);

  if (location === 'accordion') {
    return iconFound?.icon;
  }

  if (location === 'dialog') {
    return iconFound?.iconDialog;
  }
};

const iconClass = 'w-5 h-5 stroke-1.1 mr-2';
const iconClassDialog =
  'w-24 h-24 sm:w-12 sm:h-12 stroke-[1.4px] sm:stroke-[1.8px] mr-2';

const iconCategories = [
  {
    label: 'Relationships',
    icon: <HeartHandshake className={iconClass} />,
    iconDialog: <HeartHandshake className={iconClassDialog} />
  },
  {
    label: 'Work & Career',
    icon: <Briefcase className={iconClass} />,
    iconDialog: <Briefcase className={iconClassDialog} />
  },
  {
    label: 'Self-Worth',
    icon: <UserCheck className={iconClass} />,
    iconDialog: <UserCheck className={iconClassDialog} />
  },
  {
    label: 'Health & Well-being',
    icon: <HeartPulse className={iconClass} />,
    iconDialog: <HeartPulse className={iconClassDialog} />
  },
  {
    label: 'Money & Finances',
    icon: <DollarSign className={iconClass} />,
    iconDialog: <DollarSign className={iconClassDialog} />
  },
  {
    label: 'Overwhelm & Burnout',
    icon: <Zap className={iconClass} />,
    iconDialog: <Zap className={iconClassDialog} />
  },
  {
    label: 'Fear of the Future',
    icon: <HelpCircle className={iconClass} />,
    iconDialog: <HelpCircle className={iconClassDialog} />
  },
  {
    label: 'Friendship',
    icon: <Users className={iconClass} />,
    iconDialog: <Users className={iconClassDialog} />
  },
  {
    label: 'Learning & Growth',
    icon: <BookOpen className={iconClass} />,
    iconDialog: <BookOpen className={iconClassDialog} />
  },
  {
    label: 'Learning a New Language',
    icon: <MessageCirclePlus className={iconClass} />,
    iconDialog: <MessageCirclePlus className={iconClassDialog} />
  },
  {
    label: 'Parenting & Family Life',
    icon: <Home className={iconClass} />,
    iconDialog: <Home className={iconClassDialog} />
  },
  {
    label: 'Finding Purpose',
    icon: <Compass className={iconClass} />,
    iconDialog: <Compass className={iconClassDialog} />
  }
];

const stoicResponses = [
  {
    category: 'Relationships',
    topics: [
      {
        topic: 'My loved one doesn’t support my dreams.',
        quote: 'Be tolerant with others and strict with yourself.',
        author: 'Marcus Aurelius',
        explanation:
          'Understand that others may not see your vision, but your journey is yours to pursue. Show understanding toward others, and maintain focus on your goals without depending on external support.'
      },
      {
        topic: 'I feel misunderstood or unheard by my partner.',
        quote:
          'If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.',
        author: 'Marcus Aurelius',
        explanation:
          'Focus on how you interpret and respond to feeling unheard. While external validation is pleasant, self-assurance can ease the pain of misunderstanding.'
      },
      {
        topic: 'I’m dealing with the pain of a recent breakup.',
        quote:
          'He who fears death will never do anything worth of a man who is alive.',
        author: 'Seneca',
        explanation:
          "Grieving is part of healing, but don't let fear of future pain prevent you from loving again. Living fully means embracing both joy and sorrow."
      },
      {
        topic: 'I have conflicts with family members over values or decisions.',
        quote:
          'We should always be asking ourselves: ‘Is this something that is, or is not, in my control?’',
        author: 'Epictetus',
        explanation:
          "Focus on what you can control, such as your reactions and your decisions. You can’t change others' beliefs but can choose to act with respect and calmness."
      },
      {
        topic: 'I feel alone even when I’m with people.',
        quote: 'As long as you live, keep learning how to live.',
        author: 'Seneca',
        explanation:
          'Solitude can teach you more about your own values and desires. View your time alone as an opportunity for self-reflection and personal growth.'
      },
      {
        topic: 'I struggle with jealousy in my relationships.',
        quote: 'The soul becomes dyed with the color of its thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Jealousy stems from inner insecurities. Focus on cultivating positive and secure thoughts within yourself, rather than dwelling on comparisons with others.'
      },
      {
        topic: 'I find it hard to forgive someone who hurt me.',
        quote:
          'How much more grievous are the consequences of anger than the causes of it.',
        author: 'Marcus Aurelius',
        explanation:
          'Holding onto resentment ultimately harms you more than the person who wronged you. Forgiving is a way to free yourself from unnecessary suffering.'
      },
      {
        topic: 'I feel insecure about my partner’s past relationships.',
        quote:
          'You have power over your mind—not outside events. Realize this, and you will find strength.',
        author: 'Marcus Aurelius',
        explanation:
          'You cannot change the past, but you can control your thoughts about it. Direct your focus to the present and trust in the relationship you are building now.'
      },
      {
        topic: 'I feel pressure to meet family expectations.',
        quote:
          'To live a good life: We have the potential for it. If we learn to be indifferent to what makes no difference.',
        author: 'Marcus Aurelius',
        explanation:
          'Family expectations can be challenging, but true contentment comes from living according to your own values. Decide what truly matters to you.'
      },
      {
        topic: 'I’m afraid of being vulnerable in my relationships.',
        quote:
          'Don’t be ashamed of needing help. You have a duty to fulfill just like a soldier on the wall of battle.',
        author: 'Marcus Aurelius',
        explanation:
          'Being vulnerable doesn’t make you weak. It’s an honest acceptance of the human condition. Embrace openness as a way to build genuine connections.'
      }
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
          'Focus on embodying your values in any situation. Even if your current role feels unfulfilling, you can find purpose by aligning your actions with what you believe.'
      },
      {
        topic: 'I get frustrated with coworkers who don’t carry their weight.',
        quote: 'You always own the option of having no opinion.',
        author: 'Marcus Aurelius',
        explanation:
          "Release yourself from the frustration of others' actions by not forming opinions on things beyond your control. Focus instead on your own contributions."
      },
      {
        topic: 'I worry about not advancing in my career fast enough.',
        quote:
          'If you are pained by any external thing, it is not this thing that disturbs you, but your own judgment about it.',
        author: 'Marcus Aurelius',
        explanation:
          "Instead of measuring success by comparison, see advancement as a continuous journey. Progress comes from valuing your work, not from others' timelines."
      },
      {
        topic: 'I feel undervalued at work.',
        quote:
          'Wealth consists not in having great possessions, but in having few wants.',
        author: 'Epictetus',
        explanation:
          "True value comes from internal satisfaction, not from others' recognition. Focus on finding worth in what you contribute, regardless of others' opinions."
      },
      {
        topic: 'I’m afraid to take on more responsibility.',
        quote:
          'First say to yourself what you would be; and then do what you have to do.',
        author: 'Epictetus',
        explanation:
          'Start by defining what you want to achieve. Taking on new responsibilities can lead to growth and align you with your vision of who you wish to become.'
      },
      {
        topic: 'I struggle to balance work and personal life.',
        quote: 'No man is free who is not master of himself.',
        author: 'Epictetus',
        explanation:
          'Balance is achieved through self-discipline and priorities. Evaluate how you spend time, and set boundaries to maintain harmony in both work and personal areas.'
      },
      {
        topic: 'I’m scared to leave a stable job for something uncertain.',
        quote:
          'It is not death that a man should fear, but he should fear never beginning to live.',
        author: 'Marcus Aurelius',
        explanation:
          'Growth often requires facing uncertainty. Pursue what brings you fulfillment, even if it means stepping out of comfort; this is how true living begins.'
      },
      {
        topic: 'I’m constantly comparing myself to others in my field.',
        quote:
          'Look well into yourself; there is a source of strength which will always spring up if you will always look.',
        author: 'Marcus Aurelius',
        explanation:
          'Instead of comparing externally, look inward to find strength and satisfaction. Self-worth is rooted in your personal growth, not in external comparisons.'
      },
      {
        topic: 'I don’t feel motivated in my current role.',
        quote: 'The best revenge is not to be like your enemy.',
        author: 'Marcus Aurelius',
        explanation:
          'Rather than allowing a lack of motivation to control you, strive to embody purpose and integrity. Act from a place of self-respect and commitment to your values.'
      },
      {
        topic: 'I get overwhelmed by tight deadlines and workload.',
        quote:
          'If it is not right, do not do it; if it is not true, do not say it.',
        author: 'Marcus Aurelius',
        explanation:
          'Prioritize quality over quantity. Tackle each task with integrity and focus, knowing that what matters is doing it well, not just quickly.'
      }
    ]
  },
  {
    category: 'Self-Worth',
    topics: [
      {
        topic: 'I fear failure when trying something new.',
        quote: 'The obstacle is the way.',
        author: 'Marcus Aurelius',
        explanation:
          'Embrace challenges as stepping stones to growth. Failure is simply part of the journey, offering valuable lessons that ultimately strengthen you.'
      },
      {
        topic: 'I feel like I’m always falling short of my goals.',
        quote:
          'You have power over your mind – not outside events. Realize this, and you will find strength.',
        author: 'Marcus Aurelius',
        explanation:
          'Focus on what is within your control, like your efforts and mindset, rather than the outcome. True achievement lies in consistency and dedication.'
      },
      {
        topic: 'I struggle with low self-esteem and doubt my abilities.',
        quote: 'The soul becomes dyed with the color of its thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Nurture positive thoughts about yourself. Self-esteem grows from kind and empowering beliefs; recognize your strengths and cultivate resilience.'
      },
      {
        topic: 'I feel like I’m not living up to my potential.',
        quote:
          'First say to yourself what you would be; and then do what you have to do.',
        author: 'Epictetus',
        explanation:
          'Define what reaching your potential looks like, and align your actions toward it. Fulfillment comes from intentional steps, no matter how small.'
      },
      {
        topic: 'I’m afraid of making mistakes in public.',
        quote:
          "If anyone tells you that a certain person speaks ill of you, do not make excuses about what is said of you, but answer: 'He was ignorant of my other faults, else he would not have mentioned these alone.'",
        author: 'Epictetus',
        explanation:
          "Accepting imperfection is liberating. Mistakes are part of growth, and you can learn without being defined by others' judgments."
      },
      {
        topic: 'I focus too much on my flaws.',
        quote:
          'The happiness of your life depends upon the quality of your thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Shift focus from flaws to growth. Happiness is shaped by what you choose to dwell on; focus on positive progress rather than perceived shortcomings.'
      },
      {
        topic: 'I have a hard time accepting praise.',
        quote:
          'Don’t be ashamed of needing help. You have a duty to fulfill just like a soldier on the wall of battle.',
        author: 'Marcus Aurelius',
        explanation:
          'Praise is a form of support, reminding you that you’re on the right path. Accept it with humility as acknowledgment of your effort and dedication.'
      },
      {
        topic: 'I compare my progress to others’ too often.',
        quote: 'The soul becomes dyed with the color of its thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Focus on your unique journey. Comparing yourself to others dilutes your own strengths; instead, nurture your path with positive thoughts.'
      },
      {
        topic: 'I worry too much about other people’s opinions of me.',
        quote:
          'It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.',
        author: 'Marcus Aurelius',
        explanation:
          "Value your self-approval above others' judgments. Ground yourself in your values, letting self-respect lead rather than external opinions."
      },
      {
        topic: 'I feel pressured to be perfect.',
        quote:
          'Perfection of character is this: to live each day as if it were your last, without frenzy, without apathy, without pretense.',
        author: 'Marcus Aurelius',
        explanation:
          'Perfection is not about flawlessness but about sincerity and effort. Live authentically each day, free from the burden of unrealistic standards.'
      }
    ]
  },
  {
    category: 'Health & Well-being',
    topics: [
      {
        topic: 'I’m anxious about my health.',
        quote: 'We suffer more in imagination than in reality.',
        author: 'Seneca',
        explanation:
          'Focus on the present moment rather than letting fear of what might happen take over. Worry less about hypothetical outcomes and more on caring for yourself today.'
      },
      {
        topic: 'I feel guilty about not exercising regularly.',
        quote: 'No man is free who is not master of himself.',
        author: 'Epictetus',
        explanation:
          'Guilt is often a signal to take action. Rather than dwelling on missed workouts, focus on regaining control by taking small, consistent steps toward your health goals.'
      },
      {
        topic: 'I have trouble sleeping due to stress.',
        quote:
          'If you are pained by any external thing, it is not this thing that disturbs you, but your own judgment about it.',
        author: 'Marcus Aurelius',
        explanation:
          'Recognize that stress comes from your perception of events. Try shifting your focus to what you can control and let go of what you cannot before bed.'
      },
      {
        topic: 'I’m dealing with chronic pain or illness.',
        quote:
          'He who suffers before it is necessary, suffers more than is necessary.',
        author: 'Seneca',
        explanation:
          'While pain can’t always be controlled, suffering in anticipation intensifies it. Focus on enduring each moment rather than worrying about the next.'
      },
      {
        topic: 'I’m hard on myself for not following a diet plan.',
        quote:
          'To live a good life: We have the potential for it. If we learn to be indifferent to what makes no difference.',
        author: 'Marcus Aurelius',
        explanation:
          'A balanced life is about moderation, not perfection. View each day as a new opportunity to make healthy choices without judging yourself harshly.'
      },
      {
        topic: 'I’m insecure about my appearance.',
        quote:
          'If you want to improve, be content to be thought foolish and stupid.',
        author: 'Epictetus',
        explanation:
          'Others’ judgments about appearance are fleeting. True confidence comes from aligning with your own values, not from others’ opinions.'
      },
      {
        topic: 'I feel overwhelmed by conflicting health advice.',
        quote:
          'If it is not right, do not do it; if it is not true, do not say it.',
        author: 'Marcus Aurelius',
        explanation:
          'Trust in the basics and avoid overcomplicating things. Make choices that feel true to you, rather than trying to follow every external recommendation.'
      },
      {
        topic: 'I have difficulty making time for self-care.',
        quote:
          'How long are you going to wait before you demand the best for yourself?',
        author: 'Epictetus',
        explanation:
          'Self-care is an investment in your well-being. Prioritize moments for yourself, understanding that caring for your mind and body is essential to living fully.'
      },
      {
        topic: 'I feel frustrated by my body’s limitations.',
        quote:
          'Make the best use of what is in your power, and take the rest as it happens.',
        author: 'Epictetus',
        explanation:
          'Focus on what you can control about your health and accept the rest with resilience. Frustration fades when you work within your body’s unique limits.'
      },
      {
        topic: 'I fear aging and its effects on my health.',
        quote:
          'It is not death that a man should fear, but he should fear never beginning to live.',
        author: 'Marcus Aurelius',
        explanation:
          'Aging is a natural part of life. Instead of fearing it, focus on living fully each day, making the most of the present moment while caring for your body.'
      }
    ]
  },
  {
    category: 'Money & Finances',
    topics: [
      {
        topic: 'I’m stressed about my financial situation.',
        quote: 'The greatest wealth is to live content with little.',
        author: 'Plato',
        explanation:
          'True wealth is a state of mind. By focusing on contentment and reducing unnecessary desires, you may find relief from financial stress.'
      },
      {
        topic: 'I feel embarrassed about not having as much as others.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'Value lies in character, not possessions. Embody the values that matter to you, rather than feeling shame over material differences.'
      },
      {
        topic: 'I’m afraid of being unable to provide for my family.',
        quote:
          'Wealth consists not in having great possessions, but in having few wants.',
        author: 'Epictetus',
        explanation:
          'Security is found in minimizing desires rather than maximizing income. Provide by focusing on what’s truly necessary and finding contentment in simplicity.'
      },
      {
        topic: 'I feel pressured to keep up with others’ spending habits.',
        quote:
          'If you are pained by any external thing, it is not this thing that disturbs you, but your own judgment about it.',
        author: 'Marcus Aurelius',
        explanation:
          'Instead of letting external pressures dictate your actions, find pride in living by your own standards. True satisfaction is independent of comparison.'
      },
      {
        topic: 'I have trouble controlling impulsive spending.',
        quote:
          'He who is not satisfied with a little, is satisfied with nothing.',
        author: 'Epicurus',
        explanation:
          'Practice contentment in small things. Recognizing that joy is found within can curb the urge to seek satisfaction through purchases.'
      },
      {
        topic: 'I’m uncertain about financial planning.',
        quote: 'No man is free who is not master of himself.',
        author: 'Epictetus',
        explanation:
          'Financial freedom comes through discipline. Start with small steps to gain control over finances, prioritizing essentials and saving steadily.'
      },
      {
        topic: 'I regret past financial decisions.',
        quote:
          'You could leave life right now. Let that determine what you do and say and think.',
        author: 'Marcus Aurelius',
        explanation:
          'The past is unchangeable, but you can focus on present actions that align with your goals. Let go of regrets and create a better financial future today.'
      },
      {
        topic: 'I feel overwhelmed by debt.',
        quote:
          'The more we value things outside our control, the less control we have.',
        author: 'Epictetus',
        explanation:
          'Debt can be overwhelming, but focus on what you can control: taking small, consistent steps toward reducing it. Value what you own rather than what you owe.'
      },
      {
        topic: 'I feel like I never have enough money.',
        quote:
          'Wealth consists not in having great possessions, but in having few wants.',
        author: 'Epictetus',
        explanation:
          'Redefine wealth as contentment. Instead of seeking more, find satisfaction in what you have. Financial peace often lies in appreciating what’s already present.'
      },
      {
        topic: 'I worry about the financial future.',
        quote:
          'Do not anticipate trouble, or worry about what may never happen.',
        author: 'Benjamin Franklin',
        explanation:
          'While it’s wise to prepare, excessive worry only drains your present peace. Take sensible steps now and trust in your ability to handle challenges as they come.'
      }
    ]
  },
  {
    category: 'Overwhelm & Burnout',
    topics: [
      {
        topic: 'I feel overwhelmed by too much information.',
        quote: 'If you seek tranquility, do less.',
        author: 'Marcus Aurelius',
        explanation:
          'When faced with information overload, focus on what truly matters. Simplify by concentrating on the essentials and tuning out distractions.'
      },
      {
        topic: 'I have too many tasks and don’t know where to start.',
        quote:
          'Well-being is realized by small steps, but is truly no small thing.',
        author: 'Zeno of Citium',
        explanation:
          'Break down large tasks into manageable steps. Each small accomplishment brings you closer to your goal and reduces feelings of overwhelm.'
      },
      {
        topic: 'I feel exhausted by my workload.',
        quote: 'If it is endurable, then endure it. Stop complaining.',
        author: 'Marcus Aurelius',
        explanation:
          'Acknowledge that some tasks require resilience. Instead of focusing on exhaustion, take breaks to renew your energy and approach each task with purpose.'
      },
      {
        topic: 'I struggle to prioritize responsibilities.',
        quote:
          'First say to yourself what you would be; and then do what you have to do.',
        author: 'Epictetus',
        explanation:
          'Define your priorities clearly. Align your actions with these values, and focus on what contributes most to your life and purpose.'
      },
      {
        topic: 'I feel pressured to do everything perfectly.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'Perfection is an illusion. Instead, focus on doing your best and living your values. True fulfillment lies in effort, not in perfection.'
      },
      {
        topic: 'I’m overwhelmed by daily chores.',
        quote: 'No man is free who is not master of himself.',
        author: 'Epictetus',
        explanation:
          'Mastery begins with controlling small tasks. Approach each chore as a way to practice discipline, allowing you to feel more grounded and in control.'
      },
      {
        topic: 'I feel guilty for resting or taking breaks.',
        quote:
          'If you want to improve, be content to be thought foolish and stupid.',
        author: 'Epictetus',
        explanation:
          'Rest is necessary, not a weakness. Allow yourself breaks without guilt, as they are essential for your health and productivity.'
      },
      {
        topic: 'I feel like I’m constantly behind.',
        quote: 'To be even minded is the greatest virtue.',
        author: 'Heraclitus',
        explanation:
          'Rather than comparing yourself to others, focus on your own progress. Pace yourself and trust that you’re on the right path, regardless of speed.'
      },
      {
        topic: 'I’m overwhelmed by the expectations of others.',
        quote: 'Care about people’s approval and you will be their prisoner.',
        author: 'Lao Tzu',
        explanation:
          'Live according to your values, not others’ expectations. True freedom comes from aligning with your own principles.'
      },
      {
        topic: 'I’m exhausted by decision-making.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'Make decisions that align with your core values. By simplifying your choices this way, you reduce decision fatigue and find peace.'
      }
    ]
  },
  {
    category: 'Fear of the Future',
    topics: [
      {
        topic: 'I’m afraid of change and the unknown.',
        quote:
          'The impediment to action advances action. What stands in the way becomes the way.',
        author: 'Marcus Aurelius',
        explanation:
          'Embrace change as a catalyst for growth. Obstacles and uncertainties can guide you toward resilience and self-improvement.'
      },
      {
        topic: 'I worry about losing what I have.',
        quote:
          'He who fears death will never do anything worth of a man who is alive.',
        author: 'Seneca',
        explanation:
          'Fear of loss limits your potential. Focus on gratitude for the present, and accept that change is a natural part of life.'
      },
      {
        topic: 'I catastrophize potential future events.',
        quote: 'We suffer more in imagination than in reality.',
        author: 'Seneca',
        explanation:
          'Worrying about hypothetical scenarios increases suffering. Face each day as it comes, and focus on what is within your control.'
      },
      {
        topic: 'I struggle to stay optimistic about the future.',
        quote: 'The best revenge is not to be like your enemy.',
        author: 'Marcus Aurelius',
        explanation:
          'Resist the negativity around you by embodying optimism. By focusing on actions that align with your values, you cultivate hope for the future.'
      },
      {
        topic: 'I’m afraid of making the wrong choice.',
        quote:
          'First say to yourself what you would be; and then do what you have to do.',
        author: 'Epictetus',
        explanation:
          'Choose in alignment with your values, and trust yourself. The ‘right’ choice often aligns with the actions that make you proud and true to yourself.'
      },
      {
        topic: 'I feel anxious about world events and their impact on me.',
        quote:
          'Do not anticipate trouble, or worry about what may never happen.',
        author: 'Benjamin Franklin',
        explanation:
          'Focus on what you can control, especially in uncertain times. Trust that you have the resilience to face what may come.'
      },
      {
        topic: 'I fear that I’ll regret my decisions.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'When decisions align with your values, regret becomes less significant. Embrace the present, make mindful choices, and learn from any mistakes.'
      },
      {
        topic: 'I worry that I won’t achieve my goals.',
        quote:
          'Well-being is realized by small steps, but is truly no small thing.',
        author: 'Zeno of Citium',
        explanation:
          'Goals are achieved through consistent, small actions. Focus on daily efforts, and trust that each step brings you closer to your aspirations.'
      },
      {
        topic: 'I have trouble dealing with unpredictability.',
        quote:
          'The more we value things outside our control, the less control we have.',
        author: 'Epictetus',
        explanation:
          'By focusing on your responses rather than external circumstances, you find steadiness in a changing world.'
      },
      {
        topic: 'I feel anxious about what’s to come.',
        quote:
          'Let us prepare our minds as if we’d come to the very end of life.',
        author: 'Seneca',
        explanation:
          'Living each day fully prepares you for whatever may come. By embracing the present, you’re better equipped to face the future.'
      }
    ]
  },
  {
    category: 'Friendship',
    topics: [
      {
        topic: 'I feel like my friends don’t understand me.',
        quote:
          'Accept the things to which fate binds you, and love the people with whom fate brings you together.',
        author: 'Marcus Aurelius',
        explanation:
          'True friendship may involve differences in understanding. Appreciate others as they are, embracing connection even amidst differences.'
      },
      {
        topic: 'I struggle to make new friends.',
        quote:
          'We have two ears and one mouth so that we can listen twice as much as we speak.',
        author: 'Epictetus',
        explanation:
          'Making new friends often starts with genuine listening and curiosity. When you focus on others, friendships can grow naturally.'
      },
      {
        topic: 'I feel disconnected from friends I used to be close with.',
        quote:
          'Time is like a river made up of the events which happen, and a violent stream; for as soon as a thing has been seen, it is carried away.',
        author: 'Marcus Aurelius',
        explanation:
          'Accept that relationships, like all things, change with time. Cherish memories and be open to forming new connections, even as old ones evolve.'
      },
      {
        topic: 'I worry about being judged by friends.',
        quote:
          'You have power over your mind—not outside events. Realize this, and you will find strength.',
        author: 'Marcus Aurelius',
        explanation:
          'Remember that others’ judgments are beyond your control. Focus on being true to yourself rather than fearing others’ opinions.'
      },
      {
        topic: 'I feel pressure to be a good friend even when exhausted.',
        quote:
          'No great thing is created suddenly, any more than a bunch of grapes or a fig.',
        author: 'Epictetus',
        explanation:
          'True friendships understand the need for rest. Allow yourself time to recharge, knowing that genuine friends will respect your limits.'
      },
      {
        topic: 'I find it hard to keep in touch regularly.',
        quote: 'Waste no more time arguing what a good man should be. Be one.',
        author: 'Marcus Aurelius',
        explanation:
          'Instead of feeling guilty, focus on being present when you do connect. Quality matters more than frequency in sustaining friendships.'
      },
      {
        topic: 'I feel left out of group plans.',
        quote:
          'If a person gave away your body to some passerby, you’d be furious. Yet you hand over your mind to anyone who comes along.',
        author: 'Epictetus',
        explanation:
          'Being excluded can hurt, but remember that self-worth isn’t defined by others’ choices. Focus on friendships where you feel valued.'
      },
      {
        topic: 'I get hurt when friends cancel plans.',
        quote: 'Take away the opinion, and ‘I am hurt’ is taken away.',
        author: 'Marcus Aurelius',
        explanation:
          'View cancellations as neutral events rather than personal slights. Flexibility and understanding can strengthen bonds.'
      },
      {
        topic: 'I have trouble setting boundaries with friends.',
        quote:
          'He who fears death will never do anything worthy of a living man.',
        author: 'Seneca',
        explanation:
          'Setting boundaries may be difficult, but they are essential for maintaining healthy relationships and respect for oneself.'
      },
      {
        topic: 'I feel like I don’t have any true friends.',
        quote: 'Associate with people who are likely to improve you.',
        author: 'Seneca',
        explanation:
          'Seek friendships that uplift and align with your values. Meaningful connections form when you are true to yourself and your values.'
      }
    ]
  },
  {
    category: 'Learning & Growth',
    topics: [
      {
        topic: 'I find it hard to stay motivated to learn something new.',
        quote:
          'The happiness of your life depends upon the quality of your thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Shift focus from immediate results to the joy of learning. Motivation grows when you find value in the process itself.'
      },
      {
        topic: 'I feel like I’m too old to learn new skills.',
        quote:
          'We are always complaining that our days are few, and acting as though there would be no end of them.',
        author: 'Seneca',
        explanation:
          'Growth has no age limit. Use time wisely by embracing lifelong learning, regardless of age, to make the most of each day.'
      },
      {
        topic: 'I get frustrated when I don’t understand quickly.',
        quote:
          'Nothing happens to anyone that he is not fitted by nature to bear.',
        author: 'Marcus Aurelius',
        explanation:
          'Learning takes patience and persistence. Trust that your mind is capable of growth, even if it requires more time than expected.'
      },
      {
        topic: 'I struggle to stay consistent in my learning.',
        quote: 'No great thing is created suddenly.',
        author: 'Epictetus',
        explanation:
          'Consistency, not speed, is key. Embrace small, steady progress, understanding that meaningful learning is a gradual process.'
      },
      {
        topic: 'I feel embarrassed asking for help when learning.',
        quote:
          'If you want to improve, be content to be thought foolish and stupid.',
        author: 'Epictetus',
        explanation:
          'Asking for help is a strength, not a weakness. Being open to guidance accelerates learning and enriches your understanding.'
      },
      {
        topic: 'I compare my learning pace to others.',
        quote: "Don't explain your philosophy. Embody it.",
        author: 'Epictetus',
        explanation:
          'Comparison hinders growth. Focus instead on your own journey, embracing learning as an individual path that requires patience and resilience.'
      },
      {
        topic: 'I worry that I’m not smart enough.',
        quote:
          'The impediment to action advances action. What stands in the way becomes the way.',
        author: 'Marcus Aurelius',
        explanation:
          'Doubt can block progress, but perseverance can turn obstacles into achievements. Trust in your ability to learn, regardless of setbacks.'
      },
      {
        topic: 'I’m afraid to make mistakes while learning.',
        quote: 'To be even-minded is the greatest virtue.',
        author: 'Heraclitus',
        explanation:
          'Mistakes are part of the journey. Embrace them calmly, knowing they provide valuable lessons and help build resilience.'
      },
      {
        topic: 'I lack confidence in trying new things.',
        quote:
          'How long are you going to wait before you demand the best for yourself?',
        author: 'Epictetus',
        explanation:
          'Confidence grows with action. Start small, and remember that courage is built through consistent effort and stepping out of your comfort zone.'
      },
      {
        topic: 'I struggle to apply what I’ve learned in real life.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'Knowledge is only useful when applied. Seek practical ways to incorporate what you’ve learned, making theory a part of your daily life.'
      }
    ]
  },
  {
    category: 'Learning a New Language',
    topics: [
      {
        topic: 'I feel embarrassed about making mistakes.',
        quote:
          'If you want to improve, be content to be thought foolish and stupid.',
        author: 'Epictetus',
        explanation:
          'Learning comes from being open to errors. Embrace mistakes as vital steps toward mastery, instead of feeling embarrassed.'
      },
      {
        topic: 'I’m afraid to speak the language in public.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'True confidence comes from action. Practicing in public helps you embody your learning and overcome fear.'
      },
      {
        topic: 'I struggle with pronunciation.',
        quote:
          'Progress is not achieved by luck or accident, but by working on yourself daily.',
        author: 'Epictetus',
        explanation:
          'Improvement in pronunciation comes with consistent practice. Focus on gradual progress rather than expecting perfection immediately.'
      },
      {
        topic: 'I find it hard to remember vocabulary.',
        quote: 'You have power over your mind—not outside events.',
        author: 'Marcus Aurelius',
        explanation:
          'Focus on methods within your control, like repetition and context, to build vocabulary naturally over time.'
      },
      {
        topic: 'I feel too shy to practice with others.',
        quote: 'Waste no more time arguing what a good man should be. Be one.',
        author: 'Marcus Aurelius',
        explanation:
          'Instead of worrying, take small steps to practice with others. Each attempt builds confidence, lessening shyness.'
      },
      {
        topic: 'I get discouraged by slow progress.',
        quote: 'No great thing is created suddenly.',
        author: 'Epictetus',
        explanation:
          'Learning a language is a long journey. Progress may seem slow, but each small step contributes to lasting understanding.'
      },
      {
        topic: 'I worry that I’ll never sound fluent.',
        quote:
          'The impediment to action advances action. What stands in the way becomes the way.',
        author: 'Marcus Aurelius',
        explanation:
          'Fluency grows from persistence. Use your doubts as motivation to practice, making each attempt an opportunity for growth.'
      },
      {
        topic: 'I feel like I’ll never master grammar rules.',
        quote:
          'The happiness of your life depends upon the quality of your thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Grammar mastery takes time. Approach it with curiosity and patience, allowing each rule to become clearer over time.'
      },
      {
        topic: 'I’m intimidated by native speakers.',
        quote: 'Associate with people who are likely to improve you.',
        author: 'Seneca',
        explanation:
          'Engaging with native speakers is a chance to improve. View them as allies in your learning journey rather than as sources of intimidation.'
      },
      {
        topic: 'I feel overwhelmed by the amount of practice needed.',
        quote:
          'First say to yourself what you would be; and then do what you have to do.',
        author: 'Epictetus',
        explanation:
          'Break down practice into manageable steps. Focus on daily actions that align with your goal, rather than feeling overwhelmed by the journey.'
      }
    ]
  },
  {
    category: 'Parenting & Family Life',
    topics: [
      {
        topic: 'I worry about setting a good example for my child.',
        quote: 'Don’t explain your philosophy. Embody it.',
        author: 'Epictetus',
        explanation:
          'Children learn most by observing. Strive to live by your values, setting an example through your actions rather than words.'
      },
      {
        topic: 'I feel overwhelmed by parenting responsibilities.',
        quote: 'The mind that is anxious about future events is miserable.',
        author: 'Seneca',
        explanation:
          'Parenting is challenging, but focusing on the present moment can reduce overwhelm. Handle each responsibility as it comes.'
      },
      {
        topic: 'I struggle to balance work and family time.',
        quote:
          'No man can escape his destiny, the next inquiry must be how he may best live the time that he has to live.',
        author: 'Marcus Aurelius',
        explanation:
          'Balance is a constant process. Use the time you have intentionally, creating quality moments with family whenever possible.'
      },
      {
        topic: 'I feel guilty for disciplining my child.',
        quote: 'Be tolerant with others and strict with yourself.',
        author: 'Marcus Aurelius',
        explanation:
          'Discipline is part of guiding children. Approach it with love and patience, knowing that setting boundaries helps them grow.'
      },
      {
        topic: 'I get frustrated by my child’s behavior.',
        quote:
          'You have power over your mind—not outside events. Realize this, and you will find strength.',
        author: 'Marcus Aurelius',
        explanation:
          'Children are still learning. Focus on your reaction, practicing patience, and viewing their behavior as a learning opportunity for both of you.'
      },
      {
        topic: 'I worry about my child’s future.',
        quote:
          'Don’t demand that things happen as you wish, but wish that they happen as they do happen, and you will go on well.',
        author: 'Epictetus',
        explanation:
          'Guide your child, but accept that their path is their own. Support them without clinging to a specific outcome.'
      },
      {
        topic: 'I feel judged by other parents.',
        quote: 'Waste no more time arguing what a good man should be. Be one.',
        author: 'Marcus Aurelius',
        explanation:
          'Others’ opinions are beyond your control. Trust yourself as a parent, focusing on your own values rather than others’ judgments.'
      },
      {
        topic: 'I struggle to find time for myself as a parent.',
        quote:
          'How long are you going to wait before you demand the best for yourself?',
        author: 'Epictetus',
        explanation:
          'Self-care is essential to good parenting. Prioritize time for yourself, knowing it strengthens your ability to care for your family.'
      },
      {
        topic: 'I’m unsure how to handle my child’s emotions.',
        quote: 'The best revenge is not to be like your enemy.',
        author: 'Marcus Aurelius',
        explanation:
          'Respond to your child’s emotions with empathy rather than reacting out of frustration. Modeling calm responses teaches resilience.'
      },
      {
        topic: 'I worry that I’m not doing enough for my child.',
        quote:
          'Enough of this complaining and groaning and acting like you’re the only one bearing a burden.',
        author: 'Marcus Aurelius',
        explanation:
          'Parenting is challenging, but guilt is unproductive. Focus on doing your best, trusting that your love and effort are enough.'
      }
    ]
  },
  {
    category: 'Finding Purpose',
    topics: [
      {
        topic: 'I feel lost and unsure about my life direction.',
        quote:
          'First say to yourself what you would be; and then do what you have to do.',
        author: 'Epictetus',
        explanation:
          'Take time to reflect on the person you want to become. Clarity often comes from small, intentional actions toward that vision.'
      },
      {
        topic: 'I don’t know what truly matters to me.',
        quote:
          'It is not death that a man should fear, but he should fear never beginning to live.',
        author: 'Marcus Aurelius',
        explanation:
          'Exploring what matters requires courage to live fully and make choices aligned with your inner values, even if they’re not yet clear.'
      },
      {
        topic: 'I feel like I lack a sense of purpose.',
        quote: 'The soul becomes dyed with the color of its thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Purpose grows from the quality of your thoughts. Focus on cultivating a mindset of curiosity and gratitude to naturally deepen purpose.'
      },
      {
        topic: 'I struggle to find joy in daily life.',
        quote:
          'The happiness of your life depends upon the quality of your thoughts.',
        author: 'Marcus Aurelius',
        explanation:
          'Shift focus to the small moments of joy that often go unnoticed. Meaning is often found in appreciating life’s simple experiences.'
      },
      {
        topic: 'I worry that my life lacks meaning.',
        quote: 'No man is free who is not master of himself.',
        author: 'Epictetus',
        explanation:
          'Meaning comes from exercising control over your inner self. Take responsibility for your actions and values to create meaning from within.'
      },
      {
        topic: 'I feel like I’m drifting without goals.',
        quote:
          'If a man knows not to which port he sails, no wind is favorable.',
        author: 'Seneca',
        explanation:
          'Even a small goal provides direction. Reflect on something that inspires you and set simple steps toward it, building clarity with each action.'
      },
      {
        topic: 'I’m unsure how to create a fulfilling life.',
        quote: 'Waste no more time arguing what a good man should be. Be one.',
        author: 'Marcus Aurelius',
        explanation:
          'Fulfillment comes through action aligned with your values. Strive to embody qualities you respect and fulfillment will naturally follow.'
      },
      {
        topic: 'I feel unmotivated to pursue my interests.',
        quote: 'Do not act as if you were going to live ten thousand years.',
        author: 'Marcus Aurelius',
        explanation:
          'Life is finite. Allow this reality to inspire you to pursue interests with curiosity and energy, using each moment as an opportunity.'
      },
      {
        topic: 'I question my values and beliefs.',
        quote: 'Examine what is said, not who speaks.',
        author: 'Epictetus',
        explanation:
          'Reflect deeply on your beliefs and values independently. True values stand firm under scrutiny and guide you toward a meaningful life.'
      },
      {
        topic: 'I feel disconnected from a sense of purpose.',
        quote:
          'To live a good life: We have the potential for it. If we learn to be indifferent to what makes no difference.',
        author: 'Marcus Aurelius',
        explanation:
          'Focus on what truly matters, letting go of distractions. Purpose often arises naturally when you give energy to meaningful pursuits.'
      }
    ]
  }
];

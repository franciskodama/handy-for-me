import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  Modal,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { BottomTabInset } from '@/constants/theme';

interface UserData {
  email: string;
  name?: string;
  image?: string;
}

// Pure JS base64 decoder for Hermes
function decodeBase64(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }
  
  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < base64.length; i += 4) {
    const encoded1 = lookup[base64.charCodeAt(i)];
    const encoded2 = lookup[base64.charCodeAt(i + 1)];
    const encoded3 = lookup[base64.charCodeAt(i + 2)];
    const encoded4 = lookup[base64.charCodeAt(i + 3)];
    
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    if (p < bufferLength) {
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    }
    if (p < bufferLength) {
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
  }
  
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return decodeURIComponent(escape(result));
}

function decodeJWT(token: string): UserData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const jsonStr = decodeBase64(parts[1]);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return null;
  }
}

const quotes = [
  { quote: "Your capacity to say 'No' determines your capacity to say 'Yes' to greater things.", author: "E. Stanley Jones" },
  { quote: "Do fewer things. Do them better. Know why you're doing them.", author: "Cal Newport" },
  { quote: "Stop managing your time. Start managing your focus.", author: "Unknown" },
  { quote: "If you don't like where you are, change it. You're not a tree.", author: "Jim Rohn" },
  { quote: "Forgive yourself for your faults and your mistakes and move on.", author: "Les Brown" },
  { quote: "What you do matters, but why you do it matters much more.", author: "Unknown" },
  { quote: "When the whole world is silent, even one voice becomes powerful.", author: "Malala Yousafzai" },
  { quote: "Do the thing you think you cannot do.", author: "Eleanor Roosevelt" },
  { quote: "Be not afraid of growing slowly; be afraid only of standing still.", author: "Chinese Proverb" },
  { quote: "Success isn't about how your life looks to others. It's about how it feels to you.", author: "Michelle Obama" },
  { quote: "Learn the rules like a pro, so you can break them like an artist.", author: "Pablo Picasso" },
  { quote: "People do not seem to realize that their opinion of the world is also a confession of character.", author: "Ralph A. Emerson" },
  { quote: "May your life be full in the simplicity of your actions.", author: "Unknown" },
  { quote: "You are what you do repeatedly.", author: "Unknown" },
  { quote: "The only person who needs to believe in you is you.", author: "Unknown" },
  { quote: "A stumble may prevent a fall.", author: "Gretchen Rubin" },
  { quote: "Empathy is the bridge that connects us to other people, despite the differences that separate us.", author: "Melinda Gates" },
  { quote: "Give whatever you are doing and whoever you are with the gift of your attention.", author: "Jim Rohn" },
  { quote: "Be the type of person you want to meet.", author: "Unknown" }
];

const categoryEmojis: { [key: string]: string } = {
  'Relationships': '🤝',
  'Work & Career': '💼',
  'Self-Worth': '👤',
  'Health & Well-being': '🍏',
  'Money & Finances': '💵',
  'Overwhelm & Burnout': '⚡',
  'Fear of the Future': '🔮',
  'Friendship': '👥',
  'Learning & Growth': '📚',
  'Learning a New Language': '💬',
  'Parenting & Family Life': '🏠',
  'Finding Purpose': '🧭',
};

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

export default function StoicSupportScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });
  const [showExplanation, setShowExplanation] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ topic: string, quote: string, author: string, explanation: string, category: string } | null>(null);

  // Sign out user
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      router.replace('/');
    } catch (e) {
      console.error(e);
      router.replace('/');
    }
  };

  // Load auth state
  useEffect(() => {
    async function loadAuth() {
      try {
        const storedToken = await SecureStore.getItemAsync('user_token');
        if (!storedToken) {
          router.replace('/');
          return;
        }
        setToken(storedToken);
        const decoded = decodeJWT(storedToken);
        setUserData(decoded);

        // Select random quote
        const randomIdx = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIdx]);
      } catch (e) {
        console.error('Failed to load session token:', e);
        router.replace('/');
      }
    }
    loadAuth();
  }, [ip]);

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  const handleCopy = (categoryName: string, topicItem: { topic: string, quote: string, author: string, explanation: string }) => {
    const textToCopy = `${categoryName}: ${topicItem.topic} | Quote: "${topicItem.quote}" — ${topicItem.author} | Explanation: ${topicItem.explanation}`;
    Clipboard.setString(textToCopy);
    Alert.alert('Copied!', 'The Stoic insight has been copied to your clipboard.');
  };

  // Sort categories alphabetically
  const sortedStoicResponses = [...stoicResponses].sort((a, b) => a.category.localeCompare(b.category));

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
      
      {/* Dynamic Header Quote Banner */}
      {currentQuote.quote ? (
        <View className="bg-[#DDF906] border-b-2 border-[#0F1739] px-4 py-2.5 flex-row justify-between items-center">
          <Text className="text-[#0F1739] font-bold text-xs flex-1 mr-2" numberOfLines={1}>
            "{currentQuote.quote}" — {currentQuote.author}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              const randomIdx = Math.floor(Math.random() * quotes.length);
              setCurrentQuote(quotes[randomIdx]);
            }}
            className="w-5 h-5 border border-[#0F1739] justify-center items-center rounded-none bg-white"
          >
            <Text className="text-[#0F1739] font-black text-[10px]">↻</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Top Navbar */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b-2 border-[#0F1739] bg-white">
        
        {/* Menu Burger Drawer Button */}
        <TouchableOpacity 
          className="w-10 h-9 border-2 border-[#0F1739] bg-white rounded-none justify-center items-center shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#0F1739]"
          onPress={() => setMenuOpen(true)}
        >
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
          <View className="w-5 h-0.5 bg-[#0F1739] my-0.5" />
        </TouchableOpacity>

        {/* Greetings and Profile Avatar */}
        <View className="flex-row items-center">
          <Text className="text-[#0F1739] text-base font-black mr-3">
            Howdy {getFirstName()}! 🤠
          </Text>
          <TouchableOpacity 
            className="w-9 h-9 border-2 border-[#0F1739] rounded-none bg-slate-200 justify-center items-center shadow-[2px_2px_0px_0px_#0F1739] active:bg-rose-50"
            onPress={handleLogout}
          >
            {userData?.image ? (
              <Image source={{ uri: userData.image }} className="w-full h-full" />
            ) : (
              <Text className="text-sm">👤</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Main Content */}
      <ScrollView className="flex-1 px-4 py-3" style={{ marginBottom: BottomTabInset }} showsVerticalScrollIndicator={false}>
        
        {/* Main Dashboard Card */}
        <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 mb-8 shadow-[4px_4px_0px_0px_#0f1739]">
          
          {/* Header Row with Title and Help "?" Toggle */}
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#0F1739] text-3xl font-black uppercase tracking-tighter">Stoic Support</Text>
              <View className="bg-slate-100 px-2 py-0.5 border border-slate-300">
                <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">🔒 Personal</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setShowExplanation(!showExplanation)}
              className="w-7 h-7 rounded-full border-2 border-[#0F1739] bg-white justify-center items-center active:bg-slate-100"
            >
              <Text className="text-[#0F1739] font-black text-xs">?</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
            Turn life’s challenges into growth with timeless wisdom.
          </Text>

          {/* ExplanationBox Help Overlay */}
          {showExplanation && (
            <View className="bg-slate-50 border-2 border-[#0F1739] p-4 rounded-none mb-6">
              
              <View className="flex-row justify-between items-center mb-3 border-b border-slate-200 pb-2">
                <Text className="text-[#0F1739] font-black text-xs uppercase">🌾 What's This?</Text>
              </View>
              <Text className="text-[#0F1739] text-xs font-semibold mb-4 leading-relaxed">
                Navigate life’s challenges with wisdom. Stoic Support offers guidance rooted in Stoic philosophy, helping you find clarity and resilience when facing obstacles, big or small.
              </Text>

              <View className="flex-row justify-between items-center mb-3 border-b border-slate-200 pb-2">
                <Text className="text-[#0F1739] font-black text-xs uppercase">⚙️ How to use</Text>
              </View>
              <View className="gap-2 mb-4">
                <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                  • Select a Category: <Text className="font-semibold text-slate-500">Choose an area that resonates with your current situation.</Text>
                </Text>
                <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                  • Identify Challenge: <Text className="font-semibold text-slate-500">Pick a specific topic that matches your struggle.</Text>
                </Text>
                <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                  • Receive Insight: <Text className="font-semibold text-slate-500">See Stoic advice with quotes, authors and guidance.</Text>
                </Text>
                <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                  • Copy: <Text className="font-semibold text-slate-500">Use the Copy button to save or share wisdom.</Text>
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-3 border-b border-slate-200 pb-2">
                <Text className="text-[#0F1739] font-black text-xs uppercase">❤️ Why You Need It</Text>
              </View>
              <View className="gap-2 mb-4">
                <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                  • Gain Perspective: <Text className="font-semibold text-slate-500">Shift viewpoints to approach life with calm and clarity.</Text>
                </Text>
                <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                  • Build Resilience: <Text className="font-semibold text-slate-500">Discover inner strength through ancient principles.</Text>
                </Text>
              </View>

              <TouchableOpacity
                className="bg-[#0F1739] py-2 px-4 rounded-none border-2 border-[#0F1739] shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] self-start"
                onPress={() => setShowExplanation(false)}
              >
                <Text className="text-white font-black text-[10px] uppercase tracking-wider">Find Your Stoic Path</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Interactive Categories list */}
          <Text className="text-[#0F1739] text-sm font-black text-center mb-6 uppercase tracking-wider">
            Click on a category, and choose a topic:
          </Text>

          <View className="gap-4">
            {sortedStoicResponses.map((catItem) => {
              const isExpanded = expandedCategory === catItem.category;
              const emoji = categoryEmojis[catItem.category] || '🏛️';

              return (
                <View key={catItem.category} className="border-2 border-[#0F1739] rounded-none bg-white">
                  
                  {/* Category Header Button */}
                  <TouchableOpacity
                    onPress={() => toggleCategory(catItem.category)}
                    className="flex-row justify-between items-center p-4 bg-white active:bg-slate-50"
                  >
                    <View className="flex-row items-center gap-2.5">
                      <Text className="text-[#0F1739] text-xl font-bold">{emoji}</Text>
                      <Text className="text-[#0F1739] text-sm font-black uppercase tracking-tight">
                        {catItem.category}
                      </Text>
                    </View>
                    <Text className="text-[#0F1739] text-xs font-black">
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {/* Collapsible Accordion Topics Content */}
                  {isExpanded && (
                    <View className="bg-slate-50 border-t-2 border-[#0F1739] p-3 gap-2">
                      {catItem.topics.map((topicItem) => (
                        <TouchableOpacity
                          key={topicItem.topic}
                          className="bg-white border border-[#0F1739] p-3 rounded-none active:bg-slate-100 shadow-[1px_1px_0px_0px_#0F1739]"
                          onPress={() => setSelectedTopic({
                            category: catItem.category,
                            ...topicItem
                          })}
                        >
                          <Text className="text-[#0F1739] text-xs font-bold leading-normal">
                            {topicItem.topic}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

        </View>
      </ScrollView>

      {/* Stoic Insight Dialog/Modal Pop-up */}
      {selectedTopic && (
        <Modal
          visible={!!selectedTopic}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedTopic(null)}
        >
          <View className="flex-1 items-center justify-center bg-black/60 p-6">
            <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 w-full max-w-sm shadow-[6px_6px_0px_0px_#0F1739]">
              
              {/* Category tag */}
              <View className="bg-[#0F1739] py-1.5 px-3 mb-4 rounded-none">
                <Text className="text-white text-center font-black text-xxs uppercase tracking-widest">
                  {selectedTopic.category}
                </Text>
              </View>

              {/* Topic title */}
              <Text className="text-[#0F1739] font-black text-sm uppercase mb-4 text-left leading-normal">
                {categoryEmojis[selectedTopic.category] || '🏛️'} {selectedTopic.topic}
              </Text>

              {/* Quote Card */}
              <View className="bg-slate-100 border-2 border-[#0F1739] rounded-none p-4 mb-4 shadow-[2px_2px_0px_0px_#0f1739]">
                <Text className="text-[#0F1739] font-bold italic text-sm leading-relaxed mb-2">
                  "{selectedTopic.quote}"
                </Text>
                <Text className="text-[#0F1739] font-black text-right text-xs">
                  — {selectedTopic.author}
                </Text>
              </View>

              {/* Explanation Text */}
              <View className="bg-slate-50 border border-slate-200 p-4 rounded-none mb-6">
                <Text className="text-[#0F1739] font-black text-xs leading-normal mb-1">
                  {getFirstName()},
                </Text>
                <Text className="text-[#0F1739] font-semibold text-xs leading-relaxed">
                  {selectedTopic.explanation}
                </Text>
              </View>

              {/* Action buttons */}
              <View className="flex-row gap-3">
                
                <TouchableOpacity
                  className="flex-1 bg-white py-3 rounded-none border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0f1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739] justify-center items-center"
                  onPress={() => handleCopy(selectedTopic.category, selectedTopic)}
                >
                  <Text className="text-[#0F1739] font-black text-[10px] uppercase tracking-wider text-center">
                    Copy to Clipboard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-[#DDF906] py-3 rounded-none border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0f1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#0f1739] justify-center items-center"
                  onPress={() => setSelectedTopic(null)}
                >
                  <Text className="text-[#0F1739] font-black text-[10px] uppercase tracking-wider text-center">
                    Close
                  </Text>
                </TouchableOpacity>

              </View>
              
            </View>
          </View>
        </Modal>
      )}

      {/* Dim Menu Overlay / Navigation Drawer */}
      {menuOpen && (
        <View className="absolute inset-0 bg-black/60 z-50 flex-row">
          <View className="w-4/5 max-w-[280px] bg-white h-full p-5 justify-between">
            <View>
              {/* Drawer Header */}
              <View className="flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <View className="flex-row items-center">
                  <Image 
                    source={require('../../assets/images/HandyForMe_Cog200x200.png')} 
                    className="w-8 h-8 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-[#0F1739] font-black text-sm uppercase">Handyfor.me</Text>
                </View>
                <TouchableOpacity 
                  className="w-8 h-8 border border-slate-300 items-center justify-center rounded-none"
                  onPress={() => setMenuOpen(false)}
                >
                  <Text className="text-[#0F1739] font-black text-xs">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <View className="gap-3">
                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/wins', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🏆 Weekly Wins</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/decision-helper', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🤔 Decision Helper</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/bucket-list', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🪣 Bucket List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/vision-board', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🖼️ Vision Board</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/shortcuts', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">⚡ Shortcuts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/random-question', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">❓ Random Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-4 bg-white border-2 border-[#0F1739] rounded-none active:bg-slate-100 flex-row items-center shadow-[2px_2px_0px_0px_#0F1739]"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push({ pathname: '/stoic-support', params: { ip } });
                  }}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">🧠 Stoic Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom logout block */}
            <TouchableOpacity
              className="py-3 px-4 bg-rose-50 border-2 border-rose-500 rounded-none active:bg-rose-100 flex-row justify-center items-center"
              onPress={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              <Text className="text-rose-600 font-black text-xs uppercase tracking-wider">Sign Out</Text>
            </TouchableOpacity>
          </View>
          
          {/* Clickable dim background area to dismiss */}
          <TouchableOpacity 
            className="flex-1 h-full" 
            activeOpacity={1} 
            onPress={() => setMenuOpen(false)} 
          />
        </View>
      )}

    </SafeAreaView>
  );
}

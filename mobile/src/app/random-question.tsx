import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  ActivityIndicator
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
  { quote: "The only person who needs to believe in you is you.", author: "Unknown" }
];

export const topicsRandomQuestions = [
  { id: '101', name: '101' },
  { id: 'dailyLife', name: 'Daily Life' },
  { id: 'travel', name: 'Travel' },
  { id: 'dreams', name: 'Dreams' },
  { id: 'lifeGoals', name: 'Life Goals' },
  { id: 'familyQuestions', name: 'Family Questions' },
  { id: 'moviesAndTVShows', name: 'Movies & TV Shows' },
  { id: 'technologyAndGadgets', name: 'Technology & Gadgets' },
  { id: 'booksAndReading', name: 'Books & Reading' },
  { id: 'healthAndFitness', name: 'Health & Fitness' },
  { id: 'futureGoals', name: 'Future Goals' },
  { id: 'educationAndLearning', name: 'Education & Learning' },
  { id: 'dreamsAndAmbitions', name: 'Dreams & Ambitions' },
  { id: 'currentEvents', name: 'Current Events' },
  { id: 'personalStories', name: 'Personal Stories' },
  { id: 'funAndRandom', name: 'Fun & Random' }
];

const datasetQuestions: Record<string, string[]> = {
  101: [
    "What's the dumbest way you've hurt yourself?",
    "What's your favorite hobby outside of work?",
    "What's the best book you've read recently?",
    "If you could visit any place in the world, where would you go?",
    "What's your favorite meal of the day, and why?",
    "What's your favorite movie of all time?",
    "If you could have any superpower, what would it be?",
    "What's your favorite way to relax after a long day?",
    "What was your dream job as a child?",
    "What's something you've always wanted to try but haven't yet?",
    "If you could meet any historical figure, who would it be?",
    "What's one thing you can't live without?",
    "What's your favorite season, and why?",
    "What is your favorite family tradition?",
    "What's something you wish you knew more about?",
    "What's your favorite thing about your job?",
    "If you could live in any era, which would you choose?",
    "What was the last concert you attended?",
    "What's your favorite type of cuisine?",
    "What's the most challenging thing you've ever done?",
    "If you won the lottery, what's the first thing you would do?",
    "What's your earliest memory?",
    "What's your favorite animal, and why?",
    "If you could master one skill you don't have, what would it be?",
    "What's your favorite way to exercise?",
    "What's the most spontaneous thing you've ever done?",
    "What's the best advice you've ever received?",
    "What's your favorite type of music?",
    "What's something that made you smile today?",
    "If you could teach any subject, what would it be?",
    "What's your favorite quote?",
    "What was your favorite subject in school?",
    "If you could have dinner with anyone in the world, who would it be?",
    "What's your favorite way to start the day?",
    "What's something you're proud of?",
    "What's your favorite thing about where you live?",
    "What's a goal you have for this year?",
    "What's your favorite childhood memory?",
    "What's your favorite outdoor activity?",
    "What's something you've learned recently?",
    "What's your favorite type of dessert?",
    "If you could live anywhere in the world, where would it be?",
    "What's something you're looking forward to?",
    "What's a hobby you'd like to get into if you had the time?",
    "What's your favorite type of coffee or tea?",
    "What's a cause you're passionate about?",
    "What's a movie or book that had a big impact on you?",
    "What's the most interesting fact you know?",
    "If you could have any job in the world, what would it be?",
    "What's a talent you have that people might not know about?",
    "What's the best trip you've ever been on?",
    "If you could learn any language fluently, what would it be?",
    "What's something you're really good at?",
    "What's a skill you'd like to improve on?",
    "What's the most exciting thing you've ever done?",
    "What's your favorite art medium?",
    "What's the best gift you've ever received?",
    "What's the craziest thing you've ever done?",
    "What's a dish you're really good at making?",
    "What's something you were really into as a kid?",
    "What's a dream you've always had?",
    "What's the most beautiful place you've ever been?",
    "What's something that's on your bucket list?",
    "What's the funniest thing that's ever happened to you?",
    "What's something you've done that you're really proud of?",
    "What's an accomplishment you're proud of?",
    "What's something you're thankful for?",
    "What's the best vacation you've ever taken?",
    "What's something you're really excited about?",
    "What's a movie you could watch over and over again?",
    "What's the best meal you've ever had?",
    "What's a song that always puts you in a good mood?",
    "What's a book you couldn't put down?",
    "What's a weird fact you know?",
    "What's the best compliment you've ever received?",
    "What's something you can't believe you did?",
    "What's your favorite type of weather?",
    "What's the bravest thing you've ever done?",
    "What's your favorite board game?",
    "What's a show you're currently watching?",
    "What's the coolest thing you've ever seen?",
    "What's your favorite time of day?",
    "What's a goal you've set for yourself?",
    "What's a habit you'd like to break?",
    "What's a habit you'd like to start?",
    "What's something that always cheers you up?",
    "What's the best piece of advice you've ever given?",
    "What's a risk you've taken recently?",
    "What's the best thing that happened to you this week?",
    "What's a book you'd recommend to everyone?",
    "What's the best surprise you've ever had?",
    "What's a food you've always wanted to try?",
    "What's a city you've always wanted to visit?",
    "What's your favorite thing about yourself?"
  ],
  dailyLife: [
    "What time do you usually wake up?",
    "How do you start your morning routine?",
    "Do you prefer coffee or tea in the morning?",
    "What’s your favorite breakfast food?",
    "How do you get to work or school?",
    "What do you usually do during your lunch break?",
    "How do you like to relax after a long day?",
    "Do you prefer to cook at home or eat out for dinner?",
    "What time do you usually go to bed?",
    "What’s your favorite way to spend a weekend?",
    "Do you enjoy exercising? What type of exercise do you prefer?",
    "What is your most productive time of the day?",
    "Do you like to plan your day ahead or take it as it comes?",
    "What’s your favorite thing to do when you have free time?",
    "How do you stay organized throughout your day?",
    "What’s one thing you do every day without fail?",
    "How often do you talk to your friends or family during the week?",
    "What’s your favorite way to unwind after a busy day?",
    "Do you have any daily habits that you want to improve?",
    "How do you keep track of important tasks or events?",
    "What’s something you always look forward to each day?",
    "How often do you take breaks during your workday?",
    "What’s the first thing you do when you get home?",
    "Do you prefer watching TV or reading in your downtime?",
    "What’s your least favorite daily chore and why?",
    "How do you balance work and relaxation in your day?",
    "Do you have any hobbies that you practice daily?",
    "What’s something you wish you had more time for during the day?",
    "How do you usually spend your evenings?",
    "What’s the last thing you do before going to bed?"
  ],
  travel: [
    "What’s your favorite destination you’ve visited?",
    "Do you prefer traveling by plane, train, or car?",
    "What’s the most adventurous trip you’ve taken?",
    "Do you like to travel alone or with others?",
    "What’s your dream vacation destination?",
    "How do you typically plan your trips?",
    "Do you prefer cities, beaches, or mountains for a vacation?",
    "What’s the longest trip you’ve ever taken?",
    "How do you usually pack for a trip: light or heavy?",
    "What’s the best travel advice you’ve ever received?",
    "Do you prefer staying in hotels, hostels, or Airbnbs?",
    "What’s your favorite activity to do while traveling?",
    "Have you ever had any travel mishaps? What happened?",
    "What’s the most beautiful place you’ve ever been to?",
    "Do you enjoy trying local food when you travel?",
    "What’s the most memorable travel experience you’ve had?",
    "Do you prefer to visit famous landmarks or explore hidden spots?",
    "How do you stay organized when traveling?",
    "What’s one place you’d never want to visit again?",
    "Do you like to keep a travel journal or take lots of photos?",
    "What’s the best souvenir you’ve brought home from a trip?",
    "How do you handle jet lag after a long trip?",
    "What’s your favorite way to relax on vacation?",
    "Do you like to plan your trips in advance or be spontaneous?",
    "What’s your favorite travel app or tool?",
    "Have you ever had a cultural experience that changed your perspective?",
    "What’s the most unexpected thing you’ve encountered while traveling?",
    "What’s one place you’d recommend everyone visit?",
    "Do you prefer budget travel or luxury travel?",
    "What’s the first thing you do when you arrive at a new destination?"
  ],
  dreams: [
    "Have you ever had a recurring dream? What was it about?",
    "Do you think dreams have hidden meanings? Why or why not?",
    "What’s the most vivid dream you can remember?",
    "Do you believe in the concept of lucid dreaming? Have you ever experienced it?",
    "Have you ever had a dream that later came true?",
    "Do you usually remember your dreams in the morning?",
    "What’s the weirdest dream you’ve ever had?",
    "Do you think dreams reflect our subconscious mind?",
    "Have you ever had a flying dream? How did it feel?",
    "Do you think dreams can help us solve problems?",
    "Have you ever had a nightmare that woke you up?",
    "Do you believe in the idea of dream interpretation?",
    "What’s the funniest dream you can recall?",
    "Have you ever experienced sleep paralysis? How was it?",
    "Do you think dreams can inspire creativity?",
    "Have you ever had a dream where you couldn’t move or speak?",
    "Do you think dreams can help us deal with emotions?",
    "What’s the most frightening dream you’ve had?",
    "Do you believe dreams can predict the future?",
    "Have you ever dreamed about someone you hadn’t thought of in a long time?",
    "Do you think animals dream? Why or why not?",
    "What’s a dream you wish you could relive?",
    "Do you have a dream journal? If not, would you consider keeping one?",
    "Have you ever woken up from a dream feeling confused about whether it was real?",
    "What’s the strangest dream-related experience you’ve had?",
    "Do you think dreams have any connection to our waking life?",
    "Have you ever had a dream where you realized you were dreaming?",
    "What’s the saddest dream you’ve had?",
    "Do you think recurring dreams mean anything?",
    "If you could control your dreams, what would you dream about?"
  ],
  lifeGoals: [
    "What’s your biggest life goal right now?",
    "Do you think it's important to set life goals? Why or why not?",
    "What’s a goal you’ve achieved that you’re most proud of?",
    "How do you stay motivated to achieve your life goals?",
    "What’s one goal you’d like to achieve in the next 5 years?",
    "Do you believe in setting long-term or short-term goals? Why?",
    "What’s a personal goal you’ve been working on for a while?",
    "How do you handle setbacks when pursuing your goals?",
    "What’s a goal you once had but decided to give up on? Why?",
    "Who inspires you the most when it comes to achieving life goals?",
    "How do you plan and prioritize your goals?",
    "What’s a financial goal you have for your future?",
    "Have your life goals changed over time? If so, how?",
    "Do you believe that failure is part of achieving your goals?",
    "What’s a health-related goal you’re currently working on?",
    "What’s the hardest goal you’ve ever accomplished?",
    "Do you share your life goals with others or keep them private?",
    "What’s a skill you want to develop as part of your life goals?",
    "How do you celebrate when you achieve a big goal?",
    "What’s a career goal that excites you?",
    "Do you set New Year’s resolutions? Why or why not?",
    "What’s a relationship goal that’s important to you?",
    "How do you stay on track with your goals over time?",
    "What’s the biggest obstacle you’ve faced in reaching your goals?",
    "Do you believe in creating vision boards or using other tools for goal-setting?",
    "What’s a goal you’ve set that others may find unusual?",
    "What’s a travel destination you’ve set as a life goal?",
    "How do you balance multiple life goals at once?",
    "What’s a creative project you’d love to achieve one day?",
    "What legacy do you want to leave behind as part of your life goals?"
  ],
  familyQuestions: [
    "What’s your favorite family tradition?",
    "How do you spend time with your family?",
    "What’s a fun memory you have with your family?",
    "How has your family influenced who you are today?",
    "Do you think family is more important than friends? Why or why not?",
    "What’s one value your family taught you?",
    "How do you celebrate holidays with your family?",
    "What’s the best advice a family member has ever given you?",
    "Do you have any family heirlooms? What are they?",
    "What’s your favorite meal to have with your family?",
    "How do you resolve conflicts within your family?",
    "What’s one thing you admire about a family member?",
    "How does your family support you during tough times?",
    "What’s a fun activity your family enjoys together?",
    "How do you stay connected with family members who live far away?",
    "What’s a family tradition you want to continue with your own children?",
    "Do you share any hobbies with your family?",
    "How does your family celebrate birthdays?",
    "What’s a family holiday tradition you love the most?",
    "What’s a funny story you always tell about a family member?",
    "Do you have family reunions? What are they like?",
    "What’s a skill or talent you share with other family members?",
    "How does your family handle big decisions?",
    "What’s the most important lesson you’ve learned from your family?",
    "What’s a goal you and your family are working towards together?",
    "How do you celebrate milestones within your family?",
    "What role does family play in your everyday life?",
    "What’s a special nickname someone in your family gave you?",
    "How does your family show love and appreciation for each other?",
    "What’s something you’ve taught a younger family member?"
  ],
  moviesAndTVShows: [
    "What’s your favorite movie of all time and why?",
    "Which TV show are you currently binge-watching?",
    "Who’s your favorite actor or actress and what’s your favorite role they’ve played?",
    "What’s a movie or show you can watch over and over without getting bored?",
    "What’s the last movie you saw in theaters and how was it?",
    "Do you prefer watching movies at home or at the theater?",
    "What’s your favorite genre of films or TV shows?",
    "Which movie or show do you think had the best plot twist?",
    "Have you ever been surprised by a movie you didn’t expect to enjoy?",
    "Who’s your favorite character from a TV series and why?",
    "What’s a classic movie you think everyone should watch at least once?",
    "What’s the best film you’ve seen that was based on a true story?",
    "Do you prefer watching TV shows weekly or binge-watching a season all at once?",
    "What’s the most underrated movie or show you’ve seen?",
    "What’s the best film you’ve seen this year so far?",
    "Do you like foreign films or do you mostly stick to local cinema?",
    "What’s the worst movie or TV show you’ve ever watched?",
    "What’s your opinion on reboots or remakes of older movies and shows?",
    "Which movie has the best soundtrack in your opinion?",
    "What’s the scariest movie you’ve ever seen?",
    "What’s your favorite animated movie or series?",
    "What’s a movie or TV show that made you cry?",
    "If you could live in any movie or TV universe, which would it be and why?",
    "What’s a film or show that really made you think differently about something?",
    "Do you prefer stand-alone films or franchises with multiple sequels?",
    "What’s the funniest TV show or movie you’ve ever seen?",
    "What’s the most visually stunning movie you’ve ever seen?",
    "If you could direct a movie, what would it be about?",
    "What’s the most memorable scene from a movie or show that’s stuck with you?",
    "What’s the last TV series you finished and would you recommend it?"
  ],
  technologyAndGadgets: [
    "What’s the most useful gadget you own and why?",
    "How do you think technology has changed the way we live?",
    "What’s a piece of technology you can’t live without?",
    "Do you prefer Android or iOS devices? Why?",
    "What’s the coolest new tech you’ve seen recently?",
    "How has social media affected your daily life?",
    "What’s your favorite app or software and how do you use it?",
    "How do you think artificial intelligence will impact the future?",
    "What’s your opinion on wearable technology like smartwatches or fitness trackers?",
    "Have you ever built your own computer or customized tech gear?",
    "What’s a gadget you bought but never really used?",
    "How has technology improved your productivity?",
    "What’s a digital trend you think will fade away soon?",
    "Do you think technology is making people more or less social?",
    "What’s the next big thing in technology, in your opinion?",
    "What’s your experience with smart home devices?",
    "How do you handle tech-related issues like security or privacy concerns?",
    "Do you prefer using a laptop or a desktop for work or personal use?",
    "What’s your go-to device for entertainment, and why?",
    "What’s one piece of outdated technology you still love to use?",
    "How do you stay updated on the latest technology trends?",
    "What’s a tech feature you wish existed in the gadgets you use?",
    "Do you think technology has improved education or made it more challenging?",
    "What’s your take on electric vehicles and their impact on the environment?",
    "What’s the most futuristic piece of tech you’ve ever seen in real life?",
    "How do you manage screen time in your daily life?",
    "Do you think virtual reality will become mainstream soon?",
    "What’s the best piece of tech advice you’ve ever received?",
    "What’s a technology-related skill you want to learn?",
    "What’s the most impressive tech innovation of the last decade, in your opinion?"
  ],
  booksAndReading: [
    "What’s the best book you’ve read recently?",
    "Who’s your favorite author and why?",
    "Do you prefer fiction or non-fiction books?",
    "What’s your favorite book genre?",
    "Do you prefer reading physical books, eBooks, or listening to audiobooks?",
    "What’s a book that changed the way you see the world?",
    "Do you enjoy re-reading books or do you prefer reading new ones?",
    "What’s the longest book you’ve ever read?",
    "What’s a book you couldn’t finish and why?",
    "What’s the first book you remember reading as a child?",
    "What’s your favorite book series of all time?",
    "Who’s a character from a book that you relate to the most?",
    "Do you like to read multiple books at once or focus on one at a time?",
    "What’s your favorite place to read?",
    "Do you prefer standalone books or series?",
    "What’s a book you would recommend to everyone?",
    "What’s the most underrated book you’ve ever read?",
    "How do you decide which book to read next?",
    "Do you prefer books with happy or tragic endings?",
    "What’s a book you’ve always wanted to read but haven’t gotten around to yet?",
    "Do you enjoy reading books that are adapted into movies or TV shows?",
    "What’s your favorite classic novel?",
    "Do you prefer books set in the past, present, or future?",
    "What’s a book that made you laugh out loud?",
    "What’s a book that made you cry?",
    "Do you like to join book clubs or read alone?",
    "What’s a book you’ve learned the most from?",
    "What’s a book you’ve read that you’d love to discuss with others?",
    "What’s a book that’s on your reading list for this year?",
    "What’s the best book recommendation you’ve ever received?"
  ],
  healthAndFitness: [
    "What’s your go-to exercise routine?",
    "Do you prefer working out in the morning or at night?",
    "What’s your favorite type of workout: cardio, strength training, or something else?",
    "How do you stay motivated to exercise regularly?",
    "Do you follow a specific diet or nutrition plan?",
    "What’s your favorite healthy meal or snack?",
    "How do you balance fitness with your daily life?",
    "What’s a fitness goal you’ve achieved that you’re proud of?",
    "What’s your favorite way to relax and recover after a workout?",
    "Do you prefer working out at home, outside, or in a gym?",
    "What’s your favorite form of exercise: running, swimming, yoga, etc.?",
    "How do you track your fitness progress?",
    "Do you enjoy exercising alone or with a group?",
    "What’s the best piece of fitness advice you’ve ever received?",
    "What’s a wellness habit you practice every day?",
    "Do you enjoy trying new fitness activities or sticking to a routine?",
    "What’s your go-to playlist or music for working out?",
    "How do you handle setbacks or injuries in your fitness journey?",
    "What’s one health or fitness tip you wish you’d known sooner?",
    "How do you stay consistent with your health and fitness goals?",
    "What’s your favorite way to stay active on the weekends?",
    "What’s a workout you find challenging but rewarding?",
    "How do you manage stress through fitness or wellness practices?",
    "What’s a fitness goal you’re currently working towards?",
    "Do you prefer short, intense workouts or longer, more relaxed ones?",
    "How do you incorporate mindfulness into your fitness routine?",
    "What’s your favorite way to stay active while traveling?",
    "What’s a wellness practice that’s improved your quality of life?",
    "What’s one fitness trend you think is overrated?",
    "How do you celebrate reaching your health or fitness milestones?"
  ],
  futureGoals: [
    "What’s a personal goal you’re working on right now?",
    "Where do you see yourself in five years?",
    "What’s one skill you want to develop in the future?",
    "What’s a career goal you have for the next year?",
    "What’s something you want to achieve before the end of this year?",
    "Do you have any long-term financial goals?",
    "What’s a dream you’ve had since childhood that you still want to pursue?",
    "What’s one place you want to travel to in the future?",
    "What’s a personal habit you want to improve?",
    "What’s a new hobby or interest you want to explore?",
    "Do you prefer setting small goals or big, ambitious ones?",
    "What’s a lifestyle change you hope to make in the future?",
    "How do you stay motivated when working towards your goals?",
    "What’s something you want to do in the next five years that you’ve never done before?",
    "What’s a goal you’ve accomplished recently that you’re proud of?",
    "What’s one area of your life you want to focus on more in the future?",
    "What’s a financial goal you’re currently saving for?",
    "Do you have any goals related to your physical or mental health?",
    "What’s a personal project you want to start in the near future?",
    "How do you keep track of your progress towards your goals?",
    "What’s a goal that feels challenging but exciting to you?",
    "Do you have any travel goals you want to achieve in the next few years?",
    "What’s a professional goal you hope to achieve in the next five years?",
    "What’s a long-term relationship goal you have?",
    "What’s one thing you’d like to learn or master in the future?",
    "What’s a major life change you hope to make in the next 10 years?",
    "What’s one thing you’d like to do to improve your community or the world?",
    "Do you have any creative or artistic goals?",
    "What’s something you want to accomplish by the end of the decade?",
    "What’s a milestone you’re excited to reach in the future?"
  ],
  educationAndLearning: [
    "What’s your preferred way of learning new things?",
    "Do you prefer learning in a classroom or online?",
    "What’s a subject you’ve always been interested in learning more about?",
    "How do you stay motivated when studying?",
    "What’s a skill you’ve learned recently that you’re proud of?",
    "Do you prefer learning by doing or by studying theory?",
    "What’s the most challenging subject you’ve ever studied?",
    "How do you balance your time between learning and other activities?",
    "What’s the most important thing you’ve learned this year?",
    "What’s a study habit that works well for you?",
    "Do you prefer group study sessions or studying alone?",
    "What’s your favorite subject in school or college?",
    "What’s a learning goal you want to achieve this year?",
    "How do you handle difficult or boring subjects?",
    "What’s the best piece of advice you’ve received about learning?",
    "What’s one learning method that doesn’t work well for you?",
    "What’s a topic you think everyone should learn more about?",
    "How do you apply what you’ve learned in real life?",
    "What’s a new skill or subject you want to start learning soon?",
    "What’s a subject you found difficult but now enjoy?",
    "Do you prefer formal education or self-directed learning?",
    "How do you stay organized while studying or learning?",
    "What’s one book or resource that’s helped you learn a lot?",
    "What’s a learning achievement you’re particularly proud of?",
    "What’s one thing you’ve always wanted to learn but haven’t yet?",
    "What’s a learning challenge you’ve recently overcome?",
    "What’s your favorite way to practice what you’ve learned?",
    "How do you stay focused when learning for long periods?",
    "What’s a subject or skill you want to revisit and improve on?",
    "What’s the next educational goal you’ve set for yourself?"
  ],
  dreamsAndAmbitions: [
    "What’s a dream you’ve had since you were a child?",
    "What’s your biggest life goal right now?",
    "How do you stay motivated to pursue your ambitions?",
    "What’s one thing you hope to achieve in the next five years?",
    "What’s a personal dream that you’re actively working on?",
    "How do you handle setbacks when chasing your dreams?",
    "What’s an ambition you had in the past that you’ve already achieved?",
    "Do you prefer setting long-term or short-term goals?",
    "What’s a dream you’ve had that you’re not sure how to achieve?",
    "How do you balance your dreams with your daily responsibilities?",
    "What’s a career ambition you want to pursue?",
    "What’s a personal goal that you’ve accomplished recently?",
    "How do you overcome fear when pursuing big dreams?",
    "What’s one thing you hope to achieve by the end of the year?",
    "How do you track your progress towards your goals?",
    "What’s a creative dream that you’d love to fulfill?",
    "How do you stay focused on your long-term goals?",
    "What’s a dream or goal you’ve been thinking about a lot recently?",
    "What’s an ambition you’re working on but haven’t shared with many people?",
    "What’s the first step you take when setting a new goal?",
    "How do you celebrate when you reach a personal milestone?",
    "What’s a dream you’ve put on hold but still want to achieve?",
    "How do you find inspiration to pursue your goals?",
    "What’s a personal growth goal that you’re working towards?",
    "How do you push through when your dreams feel out of reach?",
    "What’s one dream you’ve had to adjust or change over time?",
    "What’s a major milestone you hope to reach in the next 10 years?",
    "How do you balance pursuing your ambitions with self-care?",
    "What’s an ambition that excites you every time you think about it?",
    "What’s a dream you hope to make a reality soon?"
  ],
  currentEvents: [
    "What recent news story has caught your attention?",
    "How do you stay informed about global events?",
    "What’s the most surprising news you’ve heard recently?",
    "Do you follow any particular news sources?",
    "What’s a current event that has impacted your community?",
    "How do you think social media influences how we view news?",
    "What’s a recent positive news story that you enjoyed?",
    "How do you feel about the way news is reported today?",
    "What’s a current event that you think people should pay more attention to?",
    "What’s a global issue you believe needs more coverage?",
    "What’s a recent technological development that excites you?",
    "How do you balance staying informed without feeling overwhelmed by the news?",
    "What’s your opinion on how the media covers important events?",
    "How do you think recent events will shape the future?",
    "What’s a current event that has personally affected you?",
    "Do you prefer reading news, watching it, or listening to podcasts?",
    "What’s a local news story that has sparked conversation in your area?",
    "How do you stay critical of news sources while staying informed?",
    "What’s a recent event that has sparked a lot of debate online?",
    "How do you think the way we consume news has changed over the years?",
    "What’s one event in the past year that you think will have long-term effects?",
    "What’s a recent environmental story that you’ve been following?",
    "Do you think people are becoming more engaged with current events now?",
    "How do you filter through misinformation when staying informed?",
    "What’s a story that you think has been under-reported?",
    "What’s a major cultural event that has occurred recently?",
    "How do you think recent political events will shape the future?",
    "What’s your opinion on the way the news covers environmental issues?",
    "What’s a recent event that has made you hopeful for the future?",
    "What’s an event or trend that you think will be talked about for years to come?"
  ],
  personalStories: [
    "Can you share a time when you overcame a big challenge?",
    "What’s the best decision you’ve ever made?",
    "Can you describe a moment that changed your perspective on life?",
    "What’s a funny story from your childhood?",
    "What’s a personal achievement that makes you proud?",
    "Have you ever taken a big risk? How did it turn out?",
    "Can you share a travel experience that had a big impact on you?",
    "What’s a lesson you learned the hard way?",
    "What’s a random act of kindness you’ve experienced or given?",
    "Can you describe a time when you felt truly happy?",
    "What’s the most valuable piece of advice you’ve received?",
    "What’s a friendship or relationship that shaped who you are today?",
    "Can you share a moment of unexpected success or failure?",
    "What’s a family tradition that means a lot to you?",
    "What’s a time when you were really proud of yourself?",
    "What’s a decision you wish you could go back and change?",
    "Can you share a time when you helped someone in a meaningful way?",
    "What’s a childhood dream you’ve held onto?",
    "What’s a significant life change you’ve experienced?",
    "Can you describe a time when you felt out of your comfort zone?",
    "What’s a difficult decision you had to make recently?",
    "Can you share a story about a surprising encounter?",
    "What’s a hobby or interest that has brought you joy over the years?",
    "What’s a challenge that you didn’t think you could overcome, but did?",
    "Can you describe a moment when you felt extremely grateful?",
    "What’s a time when you faced a fear?",
    "What’s a funny or embarrassing moment that you now laugh about?",
    "What’s a moment when you felt truly connected to someone?",
    "Can you share a story of perseverance that inspires you?"
  ],
  funAndRandom: [
    "If you could have any superpower, what would it be and why?",
    "What’s the weirdest food combination you’ve ever tried?",
    "If you were a superhero, what would your catchphrase be?",
    "What’s your favorite way to relax after a long day?",
    "If you could time travel, would you go to the past or the future?",
    "What’s a talent you have that most people don’t know about?",
    "If you could live anywhere in the world, where would it be?",
    "What’s the funniest joke or meme you’ve seen recently?",
    "If you could swap lives with anyone for a day, who would it be?",
    "What’s a movie you could watch over and over without getting tired of?",
    "If you could only eat one food for the rest of your life, what would it be?",
    "What’s the most random fact you know?",
    "If you could have dinner with any three people, dead or alive, who would they be?",
    "What’s the most spontaneous thing you’ve ever done?",
    "If you could be famous for anything, what would it be?",
    "What’s a guilty pleasure TV show or movie you secretly enjoy?",
    "If you could instantly learn any skill, what would it be?",
    "What’s the weirdest dream you’ve ever had?",
    "If you could meet any fictional character, who would it be?",
    "What’s your go-to karaoke song?",
    "If you were an animal, what animal would you be and why?",
    "What’s something random that always makes you laugh?",
    "If you could create a new holiday, what would it celebrate?",
    "What’s a silly habit you’ve never grown out of?",
    "If you were stranded on a desert island, what three things would you want with you?",
    "What’s the best prank you’ve ever played on someone?",
    "If your life were a movie, what genre would it be?",
    "What’s a conspiracy theory you secretly believe?",
    "If you could design your own planet, what would it look like?",
    "What’s something you’ve always wanted to try but never have?"
  ]
};

const linkingWords = [
  {
    category: 'Addition',
    words: [
      'as well as',
      'in addition',
      'additionally',
      'furthermore',
      'moreover',
      'besides',
      'on top of that',
      "what's more",
      'along with',
      'not only ... but also'
    ]
  },
  {
    category: 'Contrast',
    words: [
      'however',
      'although',
      'though',
      'even though',
      'despite',
      'in spite of',
      'nevertheless',
      'on the other hand',
      'whereas',
      'while',
      'yet',
      'conversely',
      'nonetheless',
      'still'
    ]
  },
  {
    category: 'Cause',
    words: ['since', 'as', 'for', 'due to', 'owing to', 'as a result of']
  },
  {
    category: 'Result',
    words: [
      'therefore',
      'thus',
      'as a result',
      'consequently',
      "that's why",
      'for this reason',
      'hence',
      'that is why',
      'it follows that'
    ]
  },
  {
    category: 'Sequence',
    words: [
      'first',
      'firstly',
      'to start with',
      'first of all',
      'then',
      'next',
      'after that',
      'afterwards',
      'secondly',
      'thirdly',
      'finally',
      'lastly',
      'meanwhile',
      'in the meantime',
      'before',
      'prior to'
    ]
  },
  {
    category: 'Example',
    words: [
      'such as',
      'like',
      'to illustrate',
      'in particular',
      'for example',
      'for instance'
    ]
  },
  {
    category: 'Opinion',
    words: [
      'in my opinion',
      'personally',
      'in fact',
      'to be honest',
      'frankly',
      'surprisingly',
      'believe it or not',
      'as far as I know',
      'as a matter of fact'
    ]
  },
  {
    category: 'Time',
    words: [
      'at the moment',
      'currently',
      'right now',
      'suddenly',
      'eventually',
      'soon',
      'later',
      'at the same time',
      'simultaneously'
    ]
  },
  {
    category: 'Conclusion',
    words: [
      'in conclusion',
      'to sum up',
      'overall',
      'all in all',
      'in short',
      'briefly',
      'in a nutshell'
    ]
  },
  {
    category: 'Condition/Purpose',
    words: [
      'if',
      'unless',
      'as long as',
      'so that',
      'in order to',
      'so as to',
      'provided that'
    ]
  }
];

export default function RandomQuestionScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [activeTab, setActiveTab] = useState<'topic' | 'vocabulary'>('topic');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [spinning, setSpinning] = useState(false);

  // Timer fields
  const [selectedMinutes, setSelectedMinutes] = useState('2');
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 mins default
  const [timerRunning, setTimerRunning] = useState(false);

  // Collapsed accordion lists in Vocabulary
  const [expandedVocabKeys, setExpandedVocabKeys] = useState<Set<string>>(new Set());

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ quote: '', author: '' });

  const timerRef = useRef<any>(null);

  const getBaseUrl = (targetIp: string) => {
    if (!targetIp) return 'http://localhost:3000';
    let cleaned = targetIp.trim();
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.slice(0, -1);
    }
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned;
    }
    return `http://${cleaned}:3000`;
  };

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

  // Countdown timer logic
  useEffect(() => {
    if (timerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            Alert.alert("Time's Up!", "Keep practicing and speaking english!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleSpin = () => {
    if (!selectedTopic) return;
    setSpinning(true);
    setCurrentQuestion('');
    setTimerRunning(false);

    setTimeout(() => {
      const qs = datasetQuestions[selectedTopic] || [];
      const randomIndex = Math.floor(Math.random() * qs.length);
      setCurrentQuestion(qs[randomIndex]);
      setSpinning(false);
      
      // Auto reset timer to selected minutes
      resetTimer();
    }, 1000);
  };

  const handleFeelingLucky = () => {
    setSpinning(true);
    setCurrentQuestion('');
    setTimerRunning(false);

    setTimeout(() => {
      const randomTopicObj = topicsRandomQuestions[Math.floor(Math.random() * topicsRandomQuestions.length)];
      setSelectedTopic(randomTopicObj.id);
      
      const qs = datasetQuestions[randomTopicObj.id] || [];
      const randomIndex = Math.floor(Math.random() * qs.length);
      setCurrentQuestion(qs[randomIndex]);
      setSpinning(false);

      // Auto reset timer
      resetTimer();
    }, 1000);
  };

  const handleTimeValueChange = (minutesStr: string) => {
    setSelectedMinutes(minutesStr);
    const timeInSeconds = Math.floor(parseFloat(minutesStr) * 60);
    setTimeRemaining(timeInSeconds);
    setTimerRunning(false);
    setTimeDropdownOpen(false);
  };

  const resetTimer = () => {
    const timeInSeconds = Math.floor(parseFloat(selectedMinutes) * 60);
    setTimeRemaining(timeInSeconds);
    setTimerRunning(false);
  };

  const toggleVocabAccordion = (categoryName: string) => {
    setExpandedVocabKeys(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const getFirstName = () => {
    if (!userData?.name) return 'User';
    return userData.name.split(' ')[0];
  };

  return (
    <View className="flex-1 bg-[#f8fafc]">
      
      {/* Quote Banner */}
      {currentQuote.quote ? (
        <SafeAreaView edges={['top']} className="bg-[#0F1739]">
          <View className="px-6 py-2.5 justify-center items-center">
            <Text className="text-white text-[9.5px] font-black text-center uppercase tracking-widest leading-tight">
              "{currentQuote.quote.toUpperCase()}"  —  {currentQuote.author.toUpperCase()}
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      {/* Header Container */}
      <View className="flex-row justify-between items-center bg-white border-b-2 border-[#0F1739] px-5 py-3.5">
        {/* Drawer menu button */}
        <TouchableOpacity 
          className="w-10 h-10 bg-white border-2 border-[#0F1739] rounded-none items-center justify-center shadow-[2px_2px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#0F1739]"
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

      {/* Scrollable Main Layout */}
      <ScrollView className="flex-1 px-4 py-3" style={{ marginBottom: BottomTabInset }} showsVerticalScrollIndicator={false}>
        
        {/* Main Neobrutalist Dashboard Card */}
        <View className="bg-white border-2 border-[#0F1739] rounded-none p-5 mb-8 shadow-[4px_4px_0px_0px_#0f1739]">
          
          {/* Random Questions Header Row */}
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#0F1739] text-3xl font-black uppercase tracking-tighter">Random Questions</Text>
              <View className="bg-slate-100 px-2 py-0.5 border border-slate-300">
                <Text className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">🔒 Personal</Text>
              </View>
            </View>
            <View className="w-7 h-7 rounded-full border-2 border-[#0F1739] justify-center items-center">
              <Text className="text-[#0F1739] font-black text-xs">?</Text>
            </View>
          </View>
          
          <Text className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
            Boost your English with fun, random prompts!
          </Text>

          {/* Toggle Tabs (Topic vs Vocabulary) */}
          <View className="flex-row border-2 border-[#0F1739] mb-6 rounded-none overflow-hidden">
            <TouchableOpacity 
              className={`flex-1 items-center py-2.5 ${activeTab === 'topic' ? 'bg-[#0F1739]' : 'bg-white'}`}
              onPress={() => setActiveTab('topic')}
            >
              <Text className={`font-black text-xs uppercase tracking-wide ${activeTab === 'topic' ? 'text-white' : 'text-[#0F1739]'}`}>
                Topic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 items-center py-2.5 ${activeTab === 'vocabulary' ? 'bg-[#0F1739]' : 'bg-white'}`}
              onPress={() => setActiveTab('vocabulary')}
            >
              <Text className={`font-black text-xs uppercase tracking-wide ${activeTab === 'vocabulary' ? 'text-white' : 'text-[#0F1739]'}`}>
                Vocabulary
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB: Topic */}
          {activeTab === 'topic' && (
            <View>
              {/* Topic picker */}
              <View className="mb-4 relative z-50">
                <Text className="text-[#0F1739] font-black text-xs uppercase mb-1.5">Pick a Topic</Text>
                <TouchableOpacity
                  className="bg-white border-2 border-[#0F1739] px-3.5 py-2 flex-row justify-between items-center rounded-none h-12"
                  onPress={() => setTopicDropdownOpen(!topicDropdownOpen)}
                >
                  <Text className="text-[#0F1739] font-black text-sm uppercase">
                    {topicsRandomQuestions.find(t => t.id === selectedTopic)?.name || 'Select Topic'}
                  </Text>
                  <Text className="text-[#0F1739] font-bold text-xs">▼</Text>
                </TouchableOpacity>

                {topicDropdownOpen && (
                  <View className="absolute top-[65px] left-0 right-0 bg-white border-2 border-[#0F1739] rounded-none z-50 shadow-[3px_3px_0px_0px_#0F1739] max-h-[180px]">
                    <ScrollView nestedScrollEnabled={true}>
                      {topicsRandomQuestions.map(topic => (
                        <TouchableOpacity
                          key={topic.id}
                          className="p-3 border-b border-slate-100 active:bg-slate-50"
                          onPress={() => {
                            setSelectedTopic(topic.id);
                            setTopicDropdownOpen(false);
                            setCurrentQuestion('');
                          }}
                        >
                          <Text className="text-[#0F1739] font-bold text-sm uppercase">{topic.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Action Buttons Row */}
              <View className="flex-row gap-3 mb-6">
                <TouchableOpacity
                  className="bg-[#0F1739] flex-1 justify-center items-center py-3.5 border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px] disabled:opacity-50"
                  disabled={!selectedTopic || spinning}
                  onPress={handleSpin}
                >
                  {spinning ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white font-black text-xs uppercase tracking-widest">SPIN!</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white flex-1 justify-center items-center py-3.5 border-2 border-[#0F1739] shadow-[3px_3px_0px_0px_#0F1739] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px]"
                  onPress={handleFeelingLucky}
                  disabled={spinning}
                >
                  <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">I'm Feeling Lucky</Text>
                </TouchableOpacity>
              </View>

              {/* Display Result Question & Timer Countdown */}
              {currentQuestion ? (
                <View className="bg-slate-50 border-2 border-[#0F1739] p-5 rounded-none mb-6">
                  {/* Selected Topic name */}
                  <View className="bg-[#DDF906] px-2 py-0.5 border border-[#0F1739] self-start mb-3">
                    <Text className="text-[#0F1739] font-bold text-[8px] uppercase tracking-wider">
                      {topicsRandomQuestions.find(t => t.id === selectedTopic)?.name}
                    </Text>
                  </View>

                  <Text className="text-[#0F1739] text-base font-black uppercase tracking-tight leading-relaxed mb-6">
                    "{currentQuestion}"
                  </Text>

                  {/* Divider */}
                  <View className="h-0.5 bg-slate-200 mb-4" />

                  {/* Countdown Timer controls */}
                  <View className="flex-row items-center justify-between flex-wrap gap-4">
                    {/* Time Value Dropdown */}
                    <View className="relative z-40 w-32">
                      <Text className="text-[#0F1739] font-black text-[9px] uppercase mb-1">Set Time</Text>
                      <TouchableOpacity
                        className="bg-white border border-[#0F1739] px-2.5 py-1.5 flex-row justify-between items-center rounded-none h-8"
                        onPress={() => setTimeDropdownOpen(!timeDropdownOpen)}
                      >
                        <Text className="text-[#0F1739] font-black text-xs">
                          {selectedMinutes} Min
                        </Text>
                        <Text className="text-[#0F1739] font-bold text-[9px]">▼</Text>
                      </TouchableOpacity>

                      {timeDropdownOpen && (
                        <View className="absolute bottom-[35px] left-0 right-0 bg-white border-2 border-[#0F1739] rounded-none z-50 shadow-[2px_2px_0px_0px_#0F1739]">
                          {['0.1', '1', '2', '3', '4', '5'].map(m => (
                            <TouchableOpacity
                              key={m}
                              className="p-2 border-b border-slate-100 active:bg-slate-50"
                              onPress={() => handleTimeValueChange(m)}
                            >
                              <Text className="text-[#0F1739] font-bold text-xs">{m} Min</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Timer Screen formatted MM:SS */}
                    <View className="flex-row items-center bg-[#0F1739] px-3.5 py-2.5 border border-[#0F1739]">
                      <Text className="text-white font-mono font-black text-lg">
                        {formatTime(timeRemaining)}
                      </Text>
                    </View>

                    {/* Controls */}
                    <View className="flex-row gap-1.5">
                      <TouchableOpacity
                        className="w-8 h-8 border border-[#0F1739] bg-white items-center justify-center rounded-none shadow-[1px_1px_0px_0px_#0F1739]"
                        onPress={() => setTimerRunning(!timerRunning)}
                      >
                        <Text className="text-xs font-black text-[#0F1739]">
                          {timerRunning ? '⏸' : '▶'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="w-8 h-8 border border-[#0F1739] bg-white items-center justify-center rounded-none shadow-[1px_1px_0px_0px_#0F1739]"
                        onPress={resetTimer}
                      >
                        <Text className="text-xs font-black text-[#0F1739]">🔄</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              ) : (
                <View className="py-12 items-center justify-center bg-slate-50 border-2 border-dashed border-[#0F1739] rounded-none">
                  <Text className="text-[#0F1739] text-center font-black text-sm mb-1 uppercase">Select a prompt above 🎲</Text>
                  <Text className="text-slate-400 text-center text-xs font-semibold px-8 leading-relaxed">
                    Pick a topic or let fate decide with "I'm feeling lucky" to spin your speaking helper!
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* TAB: Vocabulary Accordion lists */}
          {activeTab === 'vocabulary' && (
            <View>
              {linkingWords.map(category => {
                const expanded = expandedVocabKeys.has(category.category);
                return (
                  <View key={category.category} className="mb-2">
                    {/* Collapsible header */}
                    <TouchableOpacity
                      className="bg-white border-2 border-[#0F1739] px-4 py-3 flex-row justify-between items-center rounded-none"
                      onPress={() => toggleVocabAccordion(category.category)}
                    >
                      <Text className="text-[#0F1739] font-black text-xs uppercase tracking-wider">
                        {category.category}
                      </Text>
                      <Text className="text-[#0F1739] font-black text-xs">
                        {expanded ? '▲' : '▼'}
                      </Text>
                    </TouchableOpacity>

                    {/* expanded content */}
                    {expanded && (
                      <View className="bg-slate-50 border-x-2 border-b-2 border-[#0F1739] p-4 rounded-none gap-2">
                        {category.words.map(word => (
                          <View key={word} className="flex-row items-center">
                            <Text className="text-slate-400 text-xs font-black mr-2">-</Text>
                            <Text className="text-[#0F1739] text-sm font-bold uppercase tracking-tight">
                              {word}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Drawer Navigation Overlay */}
      {menuOpen && (
        <View className="absolute inset-0 bg-black/60 z-50 flex-row">
          <View className="w-[260px] h-full bg-[#f8fafc] border-r-2 border-[#0F1739] p-5 justify-between">
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

    </View>
  );
}

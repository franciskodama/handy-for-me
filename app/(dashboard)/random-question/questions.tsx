export const getQuestions = (topic: string) => {
  switch (topic) {
    case 'dailyLife':
      return dailyLife;
    case 'travel':
      return travel;
    case 'dreams':
      return dreams;
    case 'lifeGoals':
      return lifeGoals;
    default:
      return [];
  }
};

export const topicsRandomQuestions = [
  { id: 'dailyLife', name: 'Daily Life' },
  { id: 'travel', name: 'Travel' },
  { id: 'dreams', name: 'Dreams' },
  { id: 'lifeGoals', name: 'Life Goals' }
];

const dailyLife = [
  'What time do you usually wake up?',
  'How do you start your morning routine?',
  'Do you prefer coffee or tea in the morning?',
  'What’s your favorite breakfast food?',
  'How do you get to work or school?',
  'What do you usually do during your lunch break?',
  'How do you like to relax after a long day?',
  'Do you prefer to cook at home or eat out for dinner?',
  'What time do you usually go to bed?',
  'What’s your favorite way to spend a weekend?',
  'Do you enjoy exercising? What type of exercise do you prefer?',
  'What is your most productive time of the day?',
  'Do you like to plan your day ahead or take it as it comes?',
  'What’s your favorite thing to do when you have free time?',
  'How do you stay organized throughout your day?',
  'What’s one thing you do every day without fail?',
  'How often do you talk to your friends or family during the week?',
  'What’s your favorite way to unwind after a busy day?',
  'Do you have any daily habits that you want to improve?',
  'How do you keep track of important tasks or events?',
  'What’s something you always look forward to each day?',
  'How often do you take breaks during your workday?',
  'What’s the first thing you do when you get home?',
  'Do you prefer watching TV or reading in your downtime?',
  'What’s your least favorite daily chore and why?',
  'How do you balance work and relaxation in your day?',
  'Do you have any hobbies that you practice daily?',
  'What’s something you wish you had more time for during the day?',
  'How do you usually spend your evenings?',
  'What’s the last thing you do before going to bed?'
];

const travel = [
  'What’s your favorite destination you’ve visited?',
  'Do you prefer traveling by plane, train, or car?',
  'What’s the most adventurous trip you’ve taken?',
  'Do you like to travel alone or with others?',
  'What’s your dream vacation destination?',
  'How do you typically plan your trips?',
  'Do you prefer cities, beaches, or mountains for a vacation?',
  'What’s the longest trip you’ve ever taken?',
  'How do you usually pack for a trip: light or heavy?',
  'What’s the best travel advice you’ve ever received?',
  'Do you prefer staying in hotels, hostels, or Airbnbs?',
  'What’s your favorite activity to do while traveling?',
  'Have you ever had any travel mishaps? What happened?',
  'What’s the most beautiful place you’ve ever been to?',
  'Do you enjoy trying local food when you travel?',
  'What’s the most memorable travel experience you’ve had?',
  'Do you prefer to visit famous landmarks or explore hidden spots?',
  'How do you stay organized when traveling?',
  'What’s one place you’d never want to visit again?',
  'Do you like to keep a travel journal or take lots of photos?',
  'What’s the best souvenir you’ve brought home from a trip?',
  'How do you handle jet lag after a long trip?',
  'What’s your favorite way to relax on vacation?',
  'Do you like to plan your trips in advance or be spontaneous?',
  'What’s your favorite travel app or tool?',
  'Have you ever had a cultural experience that changed your perspective?',
  'What’s the most unexpected thing you’ve encountered while traveling?',
  'What’s one place you’d recommend everyone visit?',
  'Do you prefer budget travel or luxury travel?',
  'What’s the first thing you do when you arrive at a new destination?'
];

const dreams = [
  'Have you ever had a recurring dream? What was it about?',
  'Do you think dreams have hidden meanings? Why or why not?',
  'What’s the most vivid dream you can remember?',
  'Do you believe in the concept of lucid dreaming? Have you ever experienced it?',
  'Have you ever had a dream that later came true?',
  'Do you usually remember your dreams in the morning?',
  'What’s the weirdest dream you’ve ever had?',
  'Do you think dreams reflect our subconscious mind?',
  'Have you ever had a flying dream? How did it feel?',
  'Do you think dreams can help us solve problems?',
  'Have you ever had a nightmare that woke you up?',
  'Do you believe in the idea of dream interpretation?',
  'What’s the funniest dream you can recall?',
  'Have you ever experienced sleep paralysis? How was it?',
  'Do you think dreams can inspire creativity?',
  'Have you ever had a dream where you couldn’t move or speak?',
  'Do you think dreams can help us deal with emotions?',
  'What’s the most frightening dream you’ve had?',
  'Do you believe dreams can predict the future?',
  'Have you ever dreamed about someone you hadn’t thought of in a long time?',
  'Do you think animals dream? Why or why not?',
  'What’s a dream you wish you could relive?',
  'Do you have a dream journal? If not, would you consider keeping one?',
  'Have you ever woken up from a dream feeling confused about whether it was real?',
  'What’s the strangest dream-related experience you’ve had?',
  'Do you think dreams have any connection to our waking life?',
  'Have you ever had a dream where you realized you were dreaming?',
  'What’s the saddest dream you’ve had?',
  'Do you think recurring dreams mean anything?',
  'If you could control your dreams, what would you dream about?'
];

const lifeGoals = [
  'What’s your biggest life goal right now?',
  "Do you think it's important to set life goals? Why or why not?",
  'What’s a goal you’ve achieved that you’re most proud of?',
  'How do you stay motivated to achieve your life goals?',
  'What’s one goal you’d like to achieve in the next 5 years?',
  'Do you believe in setting long-term or short-term goals? Why?',
  'What’s a personal goal you’ve been working on for a while?',
  'How do you handle setbacks when pursuing your goals?',
  'What’s a goal you once had but decided to give up on? Why?',
  'Who inspires you the most when it comes to achieving life goals?',
  'How do you plan and prioritize your goals?',
  'What’s a financial goal you have for your future?',
  'Have your life goals changed over time? If so, how?',
  'Do you believe that failure is part of achieving your goals?',
  'What’s a health-related goal you’re currently working on?',
  'What’s the hardest goal you’ve ever accomplished?',
  'Do you share your life goals with others or keep them private?',
  'What’s a skill you want to develop as part of your life goals?',
  'How do you celebrate when you achieve a big goal?',
  'What’s a career goal that excites you?',
  'Do you set New Year’s resolutions? Why or why not?',
  'What’s a relationship goal that’s important to you?',
  'How do you stay on track with your goals over time?',
  'What’s the biggest obstacle you’ve faced in reaching your goals?',
  'Do you believe in creating vision boards or using other tools for goal-setting?',
  'What’s a goal you’ve set that others may find unusual?',
  'What’s a travel destination you’ve set as a life goal?',
  'How do you balance multiple life goals at once?',
  'What’s a creative project you’d love to achieve one day?',
  'What legacy do you want to leave behind as part of your life goals?'
];

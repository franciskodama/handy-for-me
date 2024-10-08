export default function PencilBanner() {
  const randomIndex = Math.floor(Math.random() * quotes.length);

  return (
    <>
      <div className="flex flex-col items-center px-12 py-2 bg-primary border-0">
        <div className="flex tracking-wide text-xs text-white uppercase font-semibold">
          <p>"{quotes[randomIndex].quote}"</p>
          <p className="mx-2">—</p>
          <p>{quotes[randomIndex].author}</p>
        </div>
      </div>
    </>
  );
}

const quotes = [
  {
    quote:
      'Your capacity to say ‘No’ determines your capacity to say ‘Yes’ to greater things.',
    author: 'E. Stanley Jones'
  },
  {
    quote: "Do fewer things. Do them better. Know why you're doing them.",
    author: 'Cal Newport'
  },
  {
    quote: 'Stop managing your time. Start managing your focus.',
    author: 'Unknown'
  },
  {
    quote: "If you don't like where you are, change it. You're not a tree.",
    author: 'Jim Rohn'
  },
  {
    quote: 'Forgive yourself for your faults and your mistakes and move on.',
    author: 'Les Brown'
  },
  {
    quote: 'What you do matters, but why you do it matters much more.',
    author: 'Unknown'
  },
  {
    quote:
      'We either make ourselves miserable, or we make ourselves strong. The amount of work is the same.',
    author: 'Carlos Castaneda'
  },
  {
    quote: 'When the whole world is silent, even one voice becomes powerful.',
    author: 'Malala Yousafzai'
  },
  {
    quote: 'Do the thing you think you cannot do.',
    author: 'Eleanor Roosevelt'
  },
  {
    quote:
      'If you know you have to swallow a frog, swallow it first thing in the morning. If there are two frogs, swallow the big one first.',
    author: 'Mark Twain'
  },
  {
    quote: 'Be not afraid of growing slowly; be afraid only of standing still.',
    author: 'Chinese Proverb'
  },
  {
    quote:
      "Success isn't about how your life looks to others. It's about how it feels to you.",
    author: 'Michelle Obama'
  },
  {
    quote: 'Learn the rules like a pro, so you can break them like an artist.',
    author: 'Pablo Picasso'
  },
  {
    quote:
      'People do not seem to realize that their opinion of the world is also a confession of character.',
    author: 'Ralph Algo Emerson'
  },
  {
    quote:
      'Some people make your laugh a little louder, your smile a little brighter and your life a little better. Try to be one of those people.',
    author: 'Unknown'
  },
  {
    quote: 'May your life be full in the simplicity of your actions.',
    author: 'Unknown'
  },
  {
    quote:
      "You often feel tired, not because you've done too much, but because you've done too little of what sparks a light in you.",
    author: 'Unknown'
  },
  { quote: 'You are what you do repeatedly.', author: 'Unknown' },
  {
    quote: 'The only person who needs to believe in you is you.',
    author: 'Unknown'
  },
  { quote: 'A stumble may prevent a fall.', author: 'Gretchen Rubin' },
  {
    quote:
      'Empathy is the bridge that connects us to other people, despite the differences that separate us.',
    author: 'Melinda Gates'
  },
  {
    quote:
      'Give whatever you are doing and whoever you are with the gift of your attention.',
    author: 'Jim Rohn'
  },
  { quote: 'Be the type of person you want to meet.', author: 'Unknown' },
  {
    quote:
      'Give me six hours to chop down a tree and i will spend the first four sharpening the axe.',
    author: 'Attributed to Abraham Lincoln'
  },
  {
    quote:
      'To attain knowledge add things every day. to attain wisdom subtract things every day.',
    author: 'Lao-Tzu'
  },
  {
    quote:
      'Not having the best situation, but seeing the best in your situation is the key to happiness.',
    author: 'Marie Forleo'
  },
  {
    quote: 'People may hear your words, but they feel your attitude.',
    author: 'John C. Maxwell'
  },
  {
    quote: 'Experience is simply the name we give our mistakes.',
    author: 'Oscar Wilde'
  },
  {
    quote: 'Whoever is happy will make others happy too.',
    author: 'Anne Frank'
  },
  { quote: 'What you seek is seeking you.', author: 'Romi' },
  {
    quote:
      'I have had lots of troubles in my life, most of which never happened.',
    author: 'Mark Twain'
  },
  {
    quote:
      'Nothing is so fatiguing as the eternal hanging on of an uncompleted task.',
    author: 'William James'
  },
  {
    quote:
      "Being happy doesn't mean that everything is perfect. It means that you decided to look beyond the imperfections.",
    author: 'Unknown'
  },
  {
    quote: 'Tension is who you think you should be. Relaxation is who you are.',
    author: 'Unknown'
  },
  {
    quote:
      'Respect yourself enough to walk away from anything that no longer serves you, grows you, or makes you happy.',
    author: 'Robert Tew'
  },
  {
    quote: 'The past is done. The future has plenty of room for change.',
    author: 'Unknown'
  },
  {
    quote:
      'A positive attitude causes a chain reaction of positive thoughts, events, and outcomes.',
    author: 'Wade Boggs'
  },
  {
    quote:
      'Progress is impossible without change, and those who cannot change their minds cannot change anything.',
    author: 'George Bernard Shaw'
  },
  { quote: 'Bravery is the solution to regret.', author: 'Robin Sharma' },
  { quote: 'Do or do not, there is no try.', author: 'Yoda' },
  {
    quote: "Don't let a bad day make you feel like you have a bad life.",
    author: 'Unknown'
  },
  {
    quote: 'Life is a series of building, testing, changing and iterating.',
    author: 'Lauren Mosenthal'
  },
  {
    quote:
      'Victory is always possible for the person who refuses to stop fighting.',
    author: 'Napoleon Hill'
  },
  { quote: 'All great achievements require time.', author: 'Maya Angelou' },
  {
    quote:
      'What you get by achieving your goals is not as important as what you become by achieving your goals.',
    author: 'Henry David Thoreau'
  },
  {
    quote:
      'Beating yourself up for your flaws and mistakes won’t make you perfect, and you don’t have to be. Learn, forgive yourself, and remember: We all struggle; it’s just part of being human.',
    author: 'Lori Deschene'
  },
  {
    quote:
      'Successful people have fear, successful people have doubts, and successful people have worry. They just don’t let these feelings stop them.',
    author: 'T. Harv Eker'
  },
  {
    quote:
      "Do a little more of what you want to do every day, until your idea becomes what's real.",
    author: 'Unknown'
  },
  {
    quote:
      'Never give up, for that is just the place and time that the tide will turn.',
    author: 'Harriet Beecher Stowe'
  },
  { quote: "It's kind of fun to do the impossible.", author: 'Walt Disney' },
  {
    quote:
      'Learn to love slow progress. Learn to forgive yourself for the inevitable backsliding. And of course, expect to be uncomfortable along the way.',
    author: 'Steven Kotler'
  },
  {
    quote: 'A goal without a plan is only a wish.',
    author: 'Antoine de Saint-Exupéry'
  }
];

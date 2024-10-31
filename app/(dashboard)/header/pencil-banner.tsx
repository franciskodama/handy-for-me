export default function PencilBanner() {
  const randomIndex = Math.floor(Math.random() * quotes.length);

  return (
    <div>
      <div className="flex flex-col items-center px-8 py-2 bg-primary border-0">
        <div className="flex tracking-wide text-[10px] sm:text-xs md:text-sm text-white text-center uppercase font-semibold">
          <p>"{quotes[randomIndex].quote}"</p>
          <p className="mx-2">—</p>
          <p>{quotes[randomIndex].author}</p>
        </div>
      </div>
    </div>
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
    quote: 'When the whole world is silent, even one voice becomes powerful.',
    author: 'Malala Yousafzai'
  },
  {
    quote: 'Do the thing you think you cannot do.',
    author: 'Eleanor Roosevelt'
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
    author: 'Ralph A. Emerson'
  },
  {
    quote: 'May your life be full in the simplicity of your actions.',
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
    author: 'Unknown'
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
    quote: 'Tension is who you think you should be. Relaxation is who you are.',
    author: 'Unknown'
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
      "Do a little more of what you want to do every day, until your idea becomes what's real.",
    author: 'Unknown'
  },
  {
    quote:
      'Never give up, for that is just the place and time that the tide will turn.',
    author: 'Harriet Stowe'
  },
  { quote: "It's kind of fun to do the impossible.", author: 'Walt Disney' },
  {
    quote: 'A goal without a plan is only a wish.',
    author: 'Antoine de Saint-Exupéry'
  }
];

import { Goal, Settings, Speech } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationLetterLeap({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        The Letter Leap will help you think on your feet, improve sentence
        structure, and expand your vocabulary — all while having fun!
      </p>
      <p className="mt-4">
        <span className="mr-2">Great for Solo or Group Practice:</span>
        You can play this game alone or with friends for a fun and interactive
        learning experience.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p>
        - Click the
        <span className="border border-primary py-1 px-2 mx-2">
          Spin & Start
        </span>
        to randomly generate a letter.
      </p>
      <p>
        - Start a sentence or phrase with this letter — the more creative, the
        better! For example, if the letter is “B,” you could say: “Before the
        sun rises…”
      </p>
      <p>
        <span className="font-semibold mr-2">- Stuck for ideas?</span>
        Hit the
        <span className="border border-primary py-1 px-2 mx-2">
          Emergency Helper
        </span>
        button for a boost! But only in case of emergency! It’s better to try on
        your own to grow your vocabulary!
      </p>
    </>
  );

  const contentThree = (
    <>
      <p>
        <span className="font-semibold mr-1">- Boost Your Fluency:</span>
        By thinking of phrases quickly, you improve your conversational speed
        and natural fluency.
      </p>

      <p>
        <span className="font-semibold mr-1">- Get Creative:</span>
        This is a playful way to push your imagination and make language
        learning more enjoyable.
      </p>
      <p>
        <span className="font-semibold mr-1">- Expand Your Vocabulary:</span>
        Use the helper button to discover new words, and challenge yourself to
        use them in conversation.
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Speech size={24} strokeWidth={1.6} />}
      titleOne="Alphabet guide"
      contentOne={contentOne}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      titleTwo="How to use"
      contentTwo={contentTwo}
      iconThree={<div className="mt-8" />}
      titleThree="Benefits"
      contentThree={contentThree}
      callToAction="Start spinning now!"
    />
  );
}

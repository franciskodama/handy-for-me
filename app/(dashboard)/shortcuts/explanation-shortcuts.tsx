import { Lightbulb, Settings, Snail, Trash2 } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationShortcuts({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        With Spin Magic, you can turn any list into a fun, random selection!
      </p>
      <p>
        Whether it’s picking a family activity, deciding on what to cook for
        dinner, or choosing the next movie for movie night — Spin Magic has you
        covered.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p>
        Create lists. Then, simply add your favorite items to each list, and
        when it’s time to make a decision, spin the wheel for a surprise choice!
      </p>
      <p className="flex items-center gap-4">
        Easily manage items by unselecting them to skip the next draw without
        deleting them.
      </p>
      <p className="flex items-center gap-4">
        You can also permanently delete items whenever you no longer need them.
      </p>
    </>
  );

  const contentThree = (
    <>
      <p>
        - Family Activities:{' '}
        <span className="font-normal">
          From board games to outdoor adventures.
        </span>
      </p>
      <p>
        - Date Night Ideas:{' '}
        <span className="font-normal">
          Pick the perfect plan without the hassle.
        </span>
      </p>
      <p>
        - Weekly Chores:{' '}
        <span className="font-normal">
          Make it fun by spinning for who does what!
        </span>
      </p>
      <p>
        - Fitness Challenges:{' '}
        <span className="font-normal">
          Choose a workout at random to keep things exciting!
        </span>
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Snail size={24} strokeWidth={1.6} />}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      iconThree={<Lightbulb size={24} strokeWidth={1.6} />}
      titleOne="Overwhelmed by choices?"
      titleTwo="How to use"
      titleThree="Some ideas"
      contentOne={contentOne}
      contentTwo={contentTwo}
      contentThree={contentThree}
      callToAction="Start spinning today!"
    />
  );
}

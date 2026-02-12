import { Brain, Goal, Settings } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';
import Link from 'next/link';

export default function ExplanationVisionBoard({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        The Vision Board is your personal space to visualize and focus on your
        biggest goals. Inspired by Think and Grow Rich by Napoleon Hill, it
        reinforces your desires through daily visualization.
      </p>
      <p>
        By regularly seeing your goals, you engage your subconscious mind,
        strengthening your mental and emotional connection to your dreams,
        keeping you motivated and on track.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p>
        <span className="font-semibold mr-1">1) Enter a goal name:</span>
        e.g., Job, House, Car, Health, etc.
      </p>
      <p>
        <span className="font-semibold mr-1">2) Enter an Image Url:</span>
        Paste a URL from
        <Link
          href="https://unsplash.com/"
          target="_blank"
          className="mx-1 underpne"
        >
          <span className="uppercase">U</span>nsplash
        </Link>
        that represents your vision
        <span className="text-xs italic ml-1">
          (Only Unsplash images are accepted.)
        </span>
      </p>
      <p>
        <span className="font-semibold mr-1">3) Tap “Add”</span>
        to instantly see your goal’s image in the gallery.
      </p>
      <div className="font-semibold mr-1">
        4) Hover over an image:
        <div className="flex flex-col gap-1 mt-2 ml-4 font-normal">
          <p>a) Check a goal when completed (can be unchecked).</p>
          <p>b) Delete a goal if no longer relevant.</p>
        </div>
      </div>
    </>
  );

  const contentThree = (
    <>
      <p className="font-semibold">
        - Clarify Your Desires:{' '}
        <span className="font-normal">
          Clearly define your goals with visual support.
        </span>
      </p>
      <p className="font-semibold">
        - Daily Motivation:{' '}
        <span className="font-normal">
          Constantly remind yourself of what you’re working toward.
        </span>
      </p>
      <p className="font-semibold">
        - Strengthen Focus:{' '}
        <span className="font-normal">
          Visualization encourages belief and action, key to success according
          to Napoleon Hill.
        </span>
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Brain size={24} strokeWidth={1.6} />}
      titleOne="What is the Vision Board?"
      contentOne={contentOne}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      titleTwo="How to use"
      contentTwo={contentTwo}
      iconThree={<Goal size={24} strokeWidth={1.6} />}
      titleThree="Benefits"
      contentThree={contentThree}
      callToAction="Add a new goal"
    />
  );
}

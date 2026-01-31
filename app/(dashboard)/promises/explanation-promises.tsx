import { Calendar, Target, TrendingUp } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationPromises({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        Yearly Promises is your strategic roadmap. It helps you break down your
        big yearly ambitions into manageable phases by organizing them into
        quarters (Q1 to Q4).
      </p>
      <p>
        Stay focused on what matters now while keeping an eye on the bigger
        picture of your journey throughout the year.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p>
        <span className="font-semibold mr-1">1) Create a Promise:</span>
        Give it a name and choose the starting quarter.
      </p>
      <p>
        <span className="font-semibold mr-1">2) Track Progress:</span>
        Use the segmented bar to update completion (25% to 100%).
      </p>
      <p>
        <span className="font-semibold mr-1">3) Dynamic Planning:</span>
        Drag and drop your promises between quarters if your priorities change.
      </p>
      <p>
        <span className="font-semibold mr-1">4) Celebrate:</span>
        Reach 100% to mark the promise as achieved and celebrate your win!
      </p>
    </>
  );

  const contentThree = (
    <>
      <p className="font-semibold">
        - Manageable Focus:{' '}
        <span className="font-normal">
          Don't get overwhelmed; focus on 3 months at a time.
        </span>
      </p>
      <p className="font-semibold">
        - Visual Roadmap:{' '}
        <span className="font-normal">
          See your entire year's commitments at a glance.
        </span>
      </p>
      <p className="font-semibold">
        - Flexibility:{' '}
        <span className="font-normal">
          Easily adapt your schedule by moving items between quarters.
        </span>
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Calendar size={24} strokeWidth={1.6} />}
      titleOne="Yearly Roadmap"
      contentOne={contentOne}
      iconTwo={<TrendingUp size={24} strokeWidth={1.6} />}
      titleTwo="How to use"
      contentTwo={contentTwo}
      iconThree={<Target size={24} strokeWidth={1.6} />}
      titleThree="Benefits"
      contentThree={contentThree}
      callToAction="Plan My Year"
    />
  );
}

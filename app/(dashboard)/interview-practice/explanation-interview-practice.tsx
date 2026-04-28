import { Goal, Settings, Briefcase, Layout, Lightbulb } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationInterviewPractice({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        Interview Practice is designed to help you ace your PM interviews by 
        providing structured practice with real-world questions and frameworks.
      </p>
      <div className="flex items-center gap-2 mt-4">
        <Goal size={24} strokeWidth={1.6} />
        <p className="text-lg font-bold">Goals</p>
      </div>
      <ul className="flex flex-col gap-2 mt-2">
        <li>- Master common PM interview categories like Strategy, Technical, and Behavioral.</li>
        <li>- Improve your ability to structure complex answers under time pressure.</li>
        <li>- Learn and apply industry-standard PM frameworks (CIRCLES, RICE, HEART).</li>
      </ul>
    </>
  );

  const contentTwo = (
    <>
      <p className="mb-2">
        - <strong>Pick a Category:</strong> Select a specific area of focus or use &quot;I&apos;m Feeling Lucky&quot; for a surprise challenge.
      </p>
      <p className="mb-2">
        - <strong>Set the Timer:</strong> Practice answering within the allocated time to build discipline and conciseness.
      </p>
      <p className="mb-2">
        - <strong>Review Suggested Answers:</strong> Once the timer ends, reveal the answer to compare your approach and learn key points.
      </p>
    </>
  );

  const contentThree = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Layout size={20} className="text-primary" />
        <p className="font-bold">Frameworks Tab</p>
      </div>
      <p className="mb-2">
        Use the Frameworks tab to quickly review common models like CIRCLES for product design or RICE for prioritization.
      </p>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={20} className="text-yellow-500" />
        <p className="font-bold">Pro Tip</p>
      </div>
      <p>
        Try to vocalize your answer as if you were in a real interview. Recording yourself can also provide great feedback!
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Briefcase size={24} strokeWidth={1.6} />}
      titleOne="Level up your PM Career."
      contentOne={contentOne}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      titleTwo="How to Practice?"
      contentTwo={contentTwo}
      iconThree={<div className="mt-8" />}
      titleThree="Features & Tips"
      contentThree={contentThree}
      callToAction="Start Your Mock Interview!"
    />
  );
}

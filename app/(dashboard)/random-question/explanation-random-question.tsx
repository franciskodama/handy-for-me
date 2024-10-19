import { Goal, Settings, Speech } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationRandomQuestion({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        Random Questions is a simple and effective tool for practicing English
        through spontaneous conversation.
      </p>
      <div className="flex items-center gap-2 mt-4">
        <Goal size={24} strokeWidth={1.6} />
        <p className="text-lg font-bold">Why?</p>
      </div>
      <ul className="flex flex-wrap gap-4">
        <li>- Practice speaking in a fun, low-pressure environment.</li>
        <li>- Enhance your fluency, vocabulary, and confidence.</li>
        <li>- Great for solo practice or group language sessions.</li>
      </ul>
    </>
  );

  const contentTwo = (
    <>
      <p>
        - Set a Timer to ensure everyone has equal time to share their
        responses.
      </p>
      <p>
        - Choose Your Topic: Pick a subject you want to focus on, from daily
        life topics to more advanced discussions.
      </p>
      <p>
        - Get Random Questions: Receive random, engaging questions related to
        your chosen topic to answer aloud.
      </p>
    </>
  );

  const contentThree = (
    <>
      <p>
        - Practice Alone or in Groups: Answer the questions by yourself, or
        invite friends to answer the same question and practice together.
      </p>
      <p>
        - Build Confidence: Use the entire time to talk and develop your
        answers, improving fluency and confidence.
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Speech size={24} strokeWidth={1.6} />}
      titleOne="Practice, anytime, anywhere."
      contentOne={contentOne}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      titleTwo="How?"
      contentTwo={contentTwo}
      iconThree={<div className="mt-8" />}
      titleThree=" "
      contentThree={contentThree}
      callToAction="Start Practicing Now!"
    />
  );
}

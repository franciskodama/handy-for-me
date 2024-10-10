'use client';

import { Goal, Settings, Speech, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ExplanationRandomQuestion({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  return (
    <div className="relative">
      <Alert
        style={{
          borderImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2.5px,
              black 3px,
              black 3px,
              transparent 3px,
              transparent 3px
            ) 15 / 0.75rem`,
          borderStyle: 'solid',
          borderWidth: '1em'
        }}
      >
        <AlertDescription className="relative text-sm flex items-start justify-between p-2">
          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Speech size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">Practice, anytime, anywhere.</p>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <p>
                Random Questions is a simple and effective tool for practicing
                English through spontaneous conversation.
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
            </div>
          </div>

          <div className="flex flex-col justify-between w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={24} strokeWidth={1.6} />
              <p className="text-lg font-bold">How?</p>
            </div>
            <ul className="flex flex-wrap gap-4">
              <li>
                - Set a Timer to ensure everyone has equal time to share their
                responses.
              </li>
              <li>
                - Choose Your Topic: Pick a subject you want to focus on, from
                daily life topics to more advanced discussions.
              </li>
              <li>
                - Get Random Questions: Receive random, engaging questions
                related to your chosen topic to answer aloud.
              </li>
            </ul>
          </div>

          <div className="flex flex-col w-1/3 py-2 px-12">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-bold text-white">.</p>
            </div>
            <ul className="flex flex-wrap gap-4">
              <li>
                - Practice Alone or in Groups: Answer the questions by yourself,
                or invite friends to answer the same question and practice
                together.
              </li>
              <li>
                - Build Confidence: Use the entire time to talk and develop your
                answers, improving fluency and confidence.
              </li>
            </ul>
            <Button
              variant={'outline'}
              className="capitalize mt-10 w-[26ch]"
              onClick={() => setOpenAction(false)}
            >
              Start Practicing Now!
            </Button>
          </div>

          <button
            className="absolute right-2 top-2"
            onClick={() => setOpenAction(false)}
          >
            <X size={24} color="black" strokeWidth={1.8} />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

import { Heart, Lightbulb, Settings, Snail, Wheat } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationStoicSupport({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        Navigate life’s challenges with wisdom. Stoic Support offers guidance
        rooted in Stoic philosophy, helping you find clarity and resilience when
        facing obstacles, big or small.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p className="font-semibold">
        - Select a Category:
        <span className="font-normal ml-1">
          Begin by choosing an area that resonates with your current situation,
          such as “Relationships” or “Learning & Growth.”
        </span>
      </p>
      <p className="font-semibold">
        - Identify Your Challenge:
        <span className="font-normal ml-1">
          Choose a specific topic that reflects your struggle, like “Feeling
          unsupported” or “Fear of making mistakes.”
        </span>
      </p>
      <p className="font-semibold">
        - Receive Stoic Insights:
        <span className="font-normal ml-1">
          Instantly see Stoic-based advice, complete with a relevant quote and
          an explanation that illuminates how to apply the philosophy in this
          context.
        </span>
      </p>
      <p className="font-semibold">
        - Copy & Share:
        <span className="font-normal ml-1">
          Use the “Copy to Clipboard” button to easily save insights for quick
          reference or to share with others.
        </span>
      </p>

      <p className="font-semibold">
        - Reflect & Apply:
        <span className="font-normal ml-1">
          Take a moment to consider the wisdom provided, and think about how you
          can implement it to face your challenge with resilience and insight.
        </span>
      </p>
    </>
  );

  const contentThree = (
    <>
      <p className="font-semibold">
        - Gain Perspective:
        <span className="font-normal ml-1">
          Shift your viewpoint to approach challenges with calm and clarity.
        </span>
      </p>
      <p className="font-semibold">
        - Build Resilience:
        <span className="font-normal ml-1">
          Discover inner strength through ancient wisdom, enhancing your ability
          to handle adversity.
        </span>
      </p>
      <p className="font-semibold">
        Empower Growth:
        <span className="font-normal ml-1">
          Turn obstacles into learning opportunities, fostering a growth
          mindset.
        </span>
      </p>
      <p className="font-semibold">
        Practice Mindful Action:
        <span className="font-normal ml-1">
          Use each insight as a stepping stone toward becoming your best self,
          one challenge at a time.
        </span>
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Wheat size={24} strokeWidth={1.6} />}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      iconThree={<Heart size={24} strokeWidth={1.6} />}
      titleOne="What’s This?"
      titleTwo="How to use"
      titleThree="Why You Need It"
      contentOne={contentOne}
      contentTwo={contentTwo}
      contentThree={contentThree}
      callToAction="Find Your Stoic Path"
    />
  );
}

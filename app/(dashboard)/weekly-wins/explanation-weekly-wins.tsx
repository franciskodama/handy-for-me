import {
  CalendarClock,
  Gem,
  Gift,
  Rocket,
  Settings,
  Telescope
} from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationWeeklyWins({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        Weekly Wins is your go-to tool for setting and tracking your main tasks
        for the week.
      </p>
      <p>
        Think of it as a focused to-do list, where you can set goals, monitor
        progress, and finish each week with a clear sense of accomplishment.
      </p>
      <p></p>
    </>
  );

  const contentTwo = (
    <>
      <p>
        <span className="font-semibold mr-1">1) Add Your Tasks:</span>
        Enter each task you want to accomplish during the week.
      </p>
      <p>
        <span className="font-semibold mr-1">
          2) Choose a Difficulty Level:
        </span>
        Each task can be marked as Easy, Moderate, or Challenging—a way to
        reflect the effort it’ll take to complete.
      </p>

      <div className="flex flex-col gap-1 ml-2">
        <p>
          <span className="font-semibold mr-1">- Easy</span>tasks are quick wins
          (1 point)
        </p>
        <p>
          <span className="font-semibold mr-1">- Moderate</span>tasks require a
          bit more time (3 points)
        </p>
        <p>
          <span className="font-semibold mr-1">- Challenging</span>tasks are
          your big accomplishments (5 points)
        </p>
      </div>

      <p>
        <span className="font-semibold mr-1">3) Track Your Progress:</span>
        Your home page features a progress bar that fills up as you complete
        each task, giving you a satisfying visual of how far you’ve come.
      </p>
    </>
  );

  const contentThree = (
    <>
      <p>
        <span className="font-semibold mr-1">Better Task Management:</span>
        With difficulty levels, you’ll know where your time and energy are going
        each week.
      </p>
      <p>
        <span className="font-semibold mr-1">Boosted Motivation: </span>As you
        complete tasks and see your progress, you’ll feel even more motivated to
        tackle next week.
      </p>
      <p>
        <span className="font-semibold mr-1">
          Celebrate Wins Big and Small:{' '}
        </span>
        The Weekly Wins tracker gives every accomplishment—whether Easy,
        Moderate, or Challenging—the recognition it deserves.
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<CalendarClock size={24} strokeWidth={1.6} />}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      iconThree={<Rocket size={24} strokeWidth={1.6} />}
      titleOne="What It Is"
      contentOne={contentOne}
      titleTwo="How It Works"
      contentTwo={contentTwo}
      contentThree={contentThree}
      titleThree="Benefits"
      callToAction="Let’s Crush This Week!"
    />
  );
}

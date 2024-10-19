import { Gem, Settings, Telescope } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationIn({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        This feature lets you create a personalized list of places to visit or
        things to do—whether it’s local hotspots or bucket list adventures.
      </p>
      <p>
        Input the name of your goal (e.g., Notre-Dame Church, Japan, Finnigan's
        Pub) and choose its category (Cultural, Destination, Adventure, etc.).
      </p>
      <p>
        Each category is color-coded for easy distinction, and you can hover
        over any item to see its category.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p>- Enter the name of the place or goal.</p>
      <p>- Choose a category to classify your entry</p>
      <p>- Hover over an item to view its category.</p>
      <p>
        - Cross off goals you’ve accomplished, or delete them if they’re no
        longer relevant.
      </p>
    </>
  );

  const contentThree = (
    <>
      <p>
        - Keep track of your dream destinations and goals in one place, ensuring
        you never forget them.
      </p>
      <p>
        - Add new goals anytime you remember or discover a place you want to
        visit.
      </p>
      <p>
        - Gain a sense of accomplishment by crossing off places you’ve visited,
        while keeping them for future reference.
      </p>

      <p>
        - Reflect on the memories and experiences you’ve achieved as your list
        grows over time.
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<Telescope size={24} strokeWidth={1.6} />}
      iconTwo={<Settings size={24} strokeWidth={1.6} />}
      iconThree={<Gem size={24} strokeWidth={1.6} />}
      titleOne="Explore Adventures"
      contentOne={contentOne}
      contentTwo={contentTwo}
      contentThree={contentThree}
      titleTwo="How to use"
      titleThree="The Perks"
      callToAction=" Start Your Journey!"
    />
  );
}

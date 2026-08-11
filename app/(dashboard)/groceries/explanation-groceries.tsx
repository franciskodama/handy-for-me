import { ShoppingCart, Store, Sparkles } from 'lucide-react';
import ExplanationBox from '@/components/ExplanationBox';

export default function ExplanationGroceries({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const contentOne = (
    <>
      <p>
        The Grocery & Co-Shopping Hub helps couples and households streamline their entire grocery workflow—from weekly planning at home to fast in-store shopping.
      </p>
      <p>
        Items are automatically categorized into supermarket departments (Produce, Dairy & Eggs, Meat & Seafood, Bakery, Pantry, Frozen, Snacks, Household) so you can navigate store aisles in record time.
      </p>
      <p>
        Live collaboration keeps both co-shoppers in sync in real time with instant cart updates and claim badges.
      </p>
    </>
  );

  const contentTwo = (
    <>
      <p>
        - <strong>Phase 1 (Plan):</strong> Quick-add items with smart auto-categorization, quantities, and brand notes. Use the <em>Restock & Staples</em> drawer to add frequent essentials with 1 click.
      </p>
      <p>
        - <strong>Phase 2 (In-Store):</strong> Switch to <em>In-Store Shopping Mode</em> for a high-contrast checklist organized by aisle department.
      </p>
      <p>
        - <strong>Real-Time Cart:</strong> Tap to place items into the cart. Your partner sees your initials or avatar instantly, preventing duplicate purchases.
      </p>
      <p>
        - <strong>Checkout & Restock:</strong> Verify all cart items at a glance, and hit <em>Finish Trip</em> to archive items into your restock catalog.
      </p>
    </>
  );

  const contentThree = (
    <>
      <p>
        - <strong>Zero Forgotten Items:</strong> Maintain a living household catalog with persistent restock history.
      </p>
      <p>
        - <strong>No Double Purchases:</strong> Real-time co-shopper badges eliminate the &quot;Did you grab the eggs?&quot; confusion.
      </p>
      <p>
        - <strong>Faster Trips:</strong> Department aisle grouping prevents backtracking across aisles.
      </p>
      <p>
        - <strong>Clear Preferences:</strong> Specific brand notes and quantities keep everyone on the same page.
      </p>
    </>
  );

  return (
    <ExplanationBox
      setOpenAction={setOpenAction}
      iconOne={<ShoppingCart size={24} strokeWidth={1.6} />}
      iconTwo={<Store size={24} strokeWidth={1.6} />}
      iconThree={<Sparkles size={24} strokeWidth={1.6} />}
      titleOne="Smart Grocery Hub"
      contentOne={contentOne}
      titleTwo="How to Use"
      contentTwo={contentTwo}
      titleThree="Co-Shopper Perks"
      contentThree={contentThree}
      callToAction="Let's Go Shopping!"
    />
  );
}

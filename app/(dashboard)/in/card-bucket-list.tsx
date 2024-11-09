import Link from 'next/link';

import { tagClass } from './cards';
import { BucketListItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { bucketListCategories } from '../bucket-list/bucket-list';

export default function CardBucketList({
  bucketListItems
}: {
  bucketListItems: BucketListItem[];
}) {
  const filteredBucketListItems = bucketListItems.filter(
    (item: BucketListItem) => !item.done
  );

  return (
    <>
      <div className="relative w-full p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex flex-wrap gap-1">
          {filteredBucketListItems.map((el: BucketListItem) => (
            <div key={el.id}>
              <p
                className="text-sm sm:text-base px-1 py-1 font-semibold"
                style={getColorCodes(el.category)}
              >
                {el.item}
              </p>
            </div>
          ))}
        </div>
        <div className={tagClass}>Bucket List</div>
        <Button
          variant="ghost"
          className="absolute -bottom-2 sm:bottom-4 right-6 sm:right-2 text-xs underline bg-white sm:bg-transparent p-1 h-4"
        >
          <Link href="/bucket-list">View All</Link>
        </Button>
      </div>
    </>
  );
}

function getColorCodes(category: string) {
  const foundCategory = bucketListCategories.find(
    (item: any) => item.name === category
  );
  const bgColorCode = foundCategory?.bgColor || '#0F1739';
  const textColorCode = foundCategory?.textColor || '#FFF';

  return { color: textColorCode, backgroundColor: bgColorCode };
}

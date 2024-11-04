import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { BucketListItem } from '@/lib/types';
import { tagClass } from './cards';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { bucketListCategories } from '../bucket-list/bucket-list';

export default function CardBucketList({
  bucketListItems
}: {
  bucketListItems: BucketListItem[];
}) {
  function getColorCodes(category: string) {
    const foundCategory = bucketListCategories.find(
      (item: any) => item.name === category
    );
    const bgColorCode = foundCategory?.bgColor || '#000000';
    const textColorCode = foundCategory?.textColor || '#FFF';

    return { color: textColorCode, backgroundColor: bgColorCode };
  }

  const filteredBucketListItems = bucketListItems.filter(
    (item: BucketListItem) => !item.done
  );

  return (
    <>
      <div className="relative w-full p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex flex-wrap">
          {filteredBucketListItems.map((item: BucketListItem) => (
            <div key={item.id}>
              <p
                className="text-sm sm:text-xl px-1 py-1 font-semibold"
                style={getColorCodes(item.category)}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
        <div className={tagClass}>Bucket List</div>
        <Button
          variant="ghost"
          className="absolute bottom-4 sm:bottom-4 right-6 sm:right-2 text-xs underline bg-white sm:bg-transparent p-1 h-4"
        >
          <Link href="/buclet-list">View All</Link>
        </Button>
      </div>
    </>
  );
}

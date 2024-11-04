import Link from 'next/link';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { tagClass } from './cards';
import { VisualBoardItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function CardVisionBoard({
  visionBoardItems
}: {
  visionBoardItems: VisualBoardItem[];
}) {
  return (
    <>
      <div className="relative flex justify-center items-center w-[calc(100%-50px)] sm:w-full p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <Carousel
          className="flex justify-center w-[18em] sm:w-full sm:max-w-sm"
          plugins={[
            Autoplay({
              delay: 2000
            })
          ]}
        >
          <CarouselContent>
            {visionBoardItems.map((item) => (
              <CarouselItem key={item.id} className="basis-1/3">
                <div className="relative group">
                  <Image
                    src={item.url}
                    width={150}
                    height={150}
                    alt={`Picture of ${item.name}`}
                    className="object-cover w-60 h-60 group-hover:opacity-100"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className={tagClass}>Vision Board</div>
        <Button
          variant="ghost"
          className="absolute bottom-6 sm:bottom-4 right-6 sm:right-2 text-xs underline bg-white sm:bg-transparent p-1 h-4"
        >
          <Link href="/vision-board">View All</Link>
        </Button>
      </div>
    </>
  );
}

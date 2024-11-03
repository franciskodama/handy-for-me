import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { kumbh_sans } from '@/app/ui/fonts';
import { VisualBoardItem } from '@/lib/types';
import { tagButtonLink, tagClass } from './cards';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { SquareArrowOutUpRight } from 'lucide-react';

export default function CardVisionBoard({
  visionBoardItems
}: {
  visionBoardItems: VisualBoardItem[];
}) {
  return (
    <>
      <div className="relative flex justify-center bg-muted p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <Carousel
          //   className="w-[calc(100%-70px)]"
          opts={{
            align: 'start'
          }}
          className="w-full max-w-sm"
          plugins={[
            Autoplay({
              delay: 2000
            })
          ]}
        >
          <CarouselContent>
            {visionBoardItems.map((item) => (
              <CarouselItem
                key={item.id}
                //   className="flex justify-center"
                className="basis-1/3 sm:basis-1/3"
              >
                <div className="relative group">
                  <Image
                    src={item.url}
                    width={150}
                    height={150}
                    alt={`Picture of ${item.name}`}
                    className="object-cover w-60 h-60 group-hover:opacity-100"
                  />
                  {/* <p
                    className={`${kumbh_sans.className} bg-white text-left uppercase text-sm leading-none absolute bottom-0 left-2 px-2 py-1`}
                  >
                    {item.name}
                  </p> */}
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
          <Link href="/vision-board">
            {/* <SquareArrowOutUpRight className="w-4 h-4 mr-1" /> */}
            View All
          </Link>
        </Button>
      </div>
    </>
  );
}

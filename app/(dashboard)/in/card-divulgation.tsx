import Link from 'next/link';

import { tagClass } from './cards';
import { Button } from '@/components/ui/button';

export default function CardDivulgation({
  image,
  title,
  description,
  cta
}: {
  image: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <>
      <div className="relative w-full p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex flex-wrap gap-1">
          <h3 className="text-sm sm:text-base px-1 py-1 font-semibold">
            {title}
          </h3>
          <p>{description}</p>
        </div>
        {/* <div className={tagClass}>Bucket List</div> */}
        <Button
          variant="ghost"
          className="absolute -bottom-2 sm:bottom-4 right-6 sm:right-2 text-xs underline bg-white sm:bg-transparent p-1 h-4"
        >
          <Link href="/bucket-list">{cta}</Link>
        </Button>
      </div>
    </>
  );
}

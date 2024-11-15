import Link from 'next/link';

import { tagClass } from './cards';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import Image from 'next/image';

export default function CardDivulgation({
  feature,
  image,
  title,
  copy,
  cta,
  url
}: {
  feature: string;
  image: string;
  title: string;
  copy: string;
  cta: string;
  url: string;
}) {
  return (
    <>
      <div className="relative flex flex-col sm:flex-row items-center w-full border border-slate-300 border-dashed">
        <div className="w-full mx-auto">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={image}
              alt={feature}
              className="object-cover border-primary"
              priority
              fill
              sizes="(max-width: 400px) 100vw"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col items-center sm:items-start w-full gap-1 sm:gap-4 px-4 py-4 sm:py-0 sm:pl-4">
          <h3 className="text-lg uppercase font-bold my-2 sm:my-0">{title}</h3>
          <p className="my-2 sm:my-0 pl-4 pr-4 sm:pl-0 text-sm text-center sm:text-left">
            {copy}
          </p>
          <Button
            variant="outline"
            size={'sm'}
            className="text-xs my-4 sm:my-0"
          >
            <Link href={`/${url}`}>{cta}</Link>
          </Button>
        </div>
        <div className={tagClass}>{feature}</div>
      </div>
    </>
  );
}

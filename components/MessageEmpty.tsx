import Image from 'next/image';

import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export type MessageInTable = {
  image: string;
  objectPosition: string;
  alt: string;
  icon: React.ReactNode;
  titleOne: string;
  titleTwo?: string;
  subtitle: string;
  setOpenAction: (value: boolean) => void;
  buttonCopy: string;
  hasButton?: boolean;
};

export default function MessageEmpty({
  image,
  objectPosition,
  alt,
  icon,
  titleOne,
  titleTwo,
  subtitle,
  setOpenAction,
  buttonCopy,
  hasButton
}: MessageInTable) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-around px-8 sm:px-0 mb-24">
      <div className="w-full sm:w-[450px] mx-auto mb-8 sm:my-8">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={image}
            alt={alt}
            className="object-cover rounded-sm border-primary"
            priority
            fill
            sizes="(max-width: 500px) 100vw"
            style={{ objectPosition: objectPosition }}
          />
        </AspectRatio>
      </div>
      <div className="flex flex-col sm:w-[450px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <p className="text-4xl font-semibold">{titleOne}</p>
        </div>
        <p className="text-2xl font-semibold">{titleTwo}</p>
        <p className="text-base my-6">{subtitle}</p>

        {hasButton && (
          <>
            <Button
              className="w-fit mt-4"
              variant="outline"
              onClick={() => {
                setOpenAction(true);
              }}
            >
              {buttonCopy}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

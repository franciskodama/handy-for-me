import Link from 'next/link';
import Image from 'next/image';
import { CircleHelp, HelpCircle, MoveUpRight } from 'lucide-react';

import { tagClass } from './cards';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export default function CardDivulgationHelp() {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center text-lg uppercase font-bold my-2">
                <CircleHelp size={32} strokeWidth={1} className="mx-2" />
                <p>Need a hand?</p>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-2 text-primary">
              <p>
                Look for the Help Icon to explore how the feature works and its
                benefits (top-right of each feature page).
              </p>
              <p className="mt-2"></p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex items-center">
              <p className="mr-2">Curious? You can test it right here</p>
              <MoveUpRight size={16} strokeWidth={2} />
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <div className="relative flex flex-col sm:flex-row items-center w-full border border-slate-300 border-dashed">
        <div className="w-full mx-auto">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={'/thumbnail/card-help.png'}
              alt={'Girl in doubt with question mark'}
              className="object-cover border-primary w-32"
              priority
              fill
              sizes="(max-width: 400px) 100vw"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col items-center sm:items-start w-full gap-1 sm:gap-4 px-4 py-4 sm:py-0 sm:pl-4">
          <div className="flex items-center text-lg uppercase font-bold my-2 sm:my-0">
            <h3 className="mr-2">Need Help? Click this</h3>
            <CircleHelp size={32} strokeWidth={1} />
          </div>
          <p className="my-2 sm:my-0 pl-4 pr-4 sm:pl-0 text-sm text-center sm:text-left">
            Find the question mark icon in the top-right corner of any feature
            page. Click it to learn how the feature works and get tips to make
            the most out of it!
          </p>
        </div>
        <div className={tagClass}>Help</div>
      </div> */}
    </>
  );
}

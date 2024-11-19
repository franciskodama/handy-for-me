import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { menuItems } from '@/lib/menu';
import { List, PocketKnife, Rocket, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <Card className="px-4 py-4 bg-primary text-white text-sm w-full">
      <CardContent className="flex flex-col sm:flex-row gap-12 items-start justify-between p-4">
        <div className="flex flex-col sm:w-1/5 gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={16} color="red" />
            <h4 className="font-semibold text-red-500 uppercase">
              Behind the Code
            </h4>
          </div>
          <p className="pr-4 max-w-80">
            {/* Designed to simplify your journey, inspire growth, and help you
            achieve more. Your go-to companion for a mindful and productive
            life. */}
            This app was originally created to simplify my life, achieve more,
            and practice my skills as a software developer. Now, it’s here to
            help you do the same. One feature at a time. Enjoy!
          </p>
        </div>

        <div className="flex flex-col w-full sm:w-2/5 gap-2">
          <div className="flex items-center gap-2 mb-2">
            <PocketKnife size={18} color="red" />
            {/* <List size={16} color="red" /> */}
            <h4 className="font-semibold text-red-500 uppercase">Features</h4>
          </div>
          <div className="flex flex-wrap content-start leading-6 gap-1">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <p className="text-white text-left w-[20ch] underline-offset-4 hover:underline">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-end sm:w-1/5">
          <Image
            // src={'/logos/kodes-logo-bg-dark.png'}
            src={'/logos/HandyForMe_OnlyText-1200x1200.png'}
            width={36}
            height={36}
            alt="Logo of HandyFor.Me"
            className="w-[5em] sm:mr-4 sm:mt-4"
          />
        </div>
      </CardContent>
      <div className="flex items-end justify-between text-right text-xs gap-4 p-4">
        <div className="flex gap-4 sm:gap-8">
          <Link href={'/policy'} target="_blank">
            <p className="text-xs text-white text-left underline-offset-4 hover:underline">
              Policy
            </p>
          </Link>
          <Link href={'/terms'} target="_blank">
            <p className="text-xs text-white text-left underline-offset-4 hover:underline">
              Terms of Service
            </p>
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <p>HandyFor.Me - 2024</p>
          <p>© All rights reserved.</p>
        </div>
      </div>
    </Card>
  );
}

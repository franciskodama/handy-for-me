import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import { menuItems } from '@/lib/menu';

export default function Footer() {
  return (
    <Card className="px-4 mx-[5em]">
      {/* <CardHeader>
        <CardTitle>HandyFor.Me Inc., 2024</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-col sm:flex-row gap-12 items-start justify-between text-sm p-4">
        <div className="flex flex-col w-1/5 gap-2">
          <h4 className="font-semibold uppercase text-sm mb-2">
            Behind the Code
          </h4>
          <p className="pr-4">
            {/* Designed to simplify your journey, inspire growth, and help you
            achieve more. Your go-to companion for a mindful and productive
            life. */}
            This app was originally created to simplify my life, achieve more,
            and practice my skills as a software developer. Now, it’s here to
            help you do the same. One feature at a time. Enjoy!
          </p>
        </div>
        <div className="flex flex-col w-4/5 gap-2">
          <h4 className="font-semibold uppercase text-base mb-2">Features</h4>
          <div className="flex flex-wrap gap-4">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button variant="link" className="p-0 font-normal m-0">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="flex items-center justify-between text-xs gap-4 p-4">
        <p>HandyFor.Me Inc., 2024 © All rights reserved.</p>
        <div className="flex gap-4">
          <p>Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>
    </Card>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoaderPinwheelIcon } from 'lucide-react';

export default function Spin() {
  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2">
          Spin Magic
          <LoaderPinwheelIcon className="h-6 w-6 animate-spin" />
        </CardTitle>
        <CardDescription>
          A fun, random decision-maker that spins the wheel to pick your next
          adventure!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex w-[20em] items-center gap-2">
            <p className="text-sm">List:</p>
            <Input placeholder="Enter an Item" />
          </div>
          <div className="flex w-[20em] items-center gap-2">
            <Input placeholder="Enter an Item" />
            <Button>Add</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { LoaderPinwheelIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SpinList } from '@/lib/types';
import { addSpinList } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Spin({
  uid,
  lists
}: {
  uid: string;
  lists: SpinList[];
}) {
  const [list, setList] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);

  const handleCreateNewList = async () => {
    setPending(true);
    const success = await addSpinList(uid, list);
    if (success) {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2">
          Spin Magic
          <LoaderPinwheelIcon className="h-6 w-6" />
        </CardTitle>
        <CardDescription>
          A fun, random decision-maker that spins the wheel to pick your next
          adventure!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-8 mb-4 w-full">
          <div className="flex w-full">
            <div className="flex w-1/2 items-center gap-2">
              <p className="text-sm font-semibold w-[18ch]">Choose a List:</p>
              <Input placeholder="xxxxx" />
            </div>

            <div className="flex w-1/2 items-center gap-2">
              <Input
                placeholder="List's Name"
                value={list}
                onChange={(e) => setList(e.target.value)}
              />
              {/* <p>{list}</p> */}
              <Button
                className={pending ? 'bg-orange-500' : ''}
                onClick={handleCreateNewList}
                disabled={pending || list.trim() === ''}
              >
                {pending ? 'Creating...' : 'Create a New List'}
              </Button>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex items-center w-1/2">
              <p className="text-sm font-semibold w-[18ch]">Chosen List:</p>
              {lists.map((item: SpinList) => (
                <p key={item.id} className="text-sm font-semibold w-[18ch]">
                  {item.name}
                </p>
              ))}
            </div>
            <div className="flex w-1/2 items-center gap-2">
              <Input placeholder="Enter an Item" />
              <Button>Add</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

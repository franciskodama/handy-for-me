'use client';

import { use, useEffect, useState } from 'react';

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
import { addSpinList, getSpinLists, getUsers } from '@/lib/actions';

// https://react.dev/reference/react/use#use

export default function Spin({
  firstName,
  uid
}: {
  firstName: string;
  uid: string;
}) {
  const [list, setList] = useState('');
  const [lists, setLists] = useState([]);
  const [pending, setPending] = useState(false);

  const handleAddList = async () => {
    setPending(true);
    await addSpinList(uid, list);
    setPending(false);
  };

  // const lists = use(getSpinLists(uid));
  // console.log('---  🚀 ---> | lists:', lists);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchData = async () => {
      const data = await getSpinLists(uid); // Fetch data with the current uid
      setLists(data); // Update state with the fetched data
    };

    fetchData(); // Call the async function

    // Optional: You could add cleanup logic here if necessary
  }, [uid]);

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2">
          Spin Magic
          <LoaderPinwheelIcon className="h-6 w-6" />
          {/* animate-spin */}
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
              <Input placeholder="List's Name" />
            </div>
            <div className="flex w-1/2 items-center gap-2">
              <Input
                placeholder="List's Name"
                value={list}
                onChange={(e) => setList(e.target.value)}
              />
              <Button
                className={pending ? 'bg-orange-500' : ''}
                onClick={handleAddList}
              >
                Create a New List
              </Button>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex items-center w-1/2">
              <p className="text-sm font-semibold w-[18ch]">Chosen List:</p>
              {lists?.map((list: string) => (
                <p key={list.name} className="text-sm font-semibold w-[18ch]">
                  {list.name}
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

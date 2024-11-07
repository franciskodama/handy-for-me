'use client';

import { useActionState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { kumbh_sans } from '@/app/ui/fonts';
import { Shortcut, ShortcutCategory } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { addShortcut, getShortcuts } from '@/lib/actions';

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const shortcut = formData.get('shortcut') as string;
  const url = formData.get('url') as string;
  const categoryId = formData.get('category') as string;
  const description = (formData.get('description') || '') as string;
  const uid = formData.get('uid') as string;

  if (shortcut.length > 20) {
    toast({
      title: 'Maximum 20 characters!',
      description: 'The name should be at most 20 characters.',
      variant: 'destructive'
    });
    return;
  }

  if (!url.includes('https://') && !url.includes('http://')) {
    toast({
      title: 'Enter the full website link!',
      description: 'e.g., https://example.com',
      variant: 'destructive'
    });
    return;
  }

  const newShortcut = await addShortcut({
    uid,
    shortcut,
    url,
    description,
    categoryId
  });

  if (!newShortcut) {
    toast({
      title: 'Ops...',
      description: 'Something got wrong. 🚨 Try again.',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Added successfully! 🎉',
      description: 'Your new shortcut is ready to use!',
      variant: 'success'
    });
  }
  const _currentShortcuts = await getShortcuts(uid);

  return {
    _currentShortcuts
  };
};

export function AddShortcut({
  uid,
  currentCategories,
  setCurrentShortcutsAction
}: {
  uid: string;
  currentCategories: ShortcutCategory[];
  setCurrentShortcutsAction: React.Dispatch<React.SetStateAction<Shortcut[]>>;
}) {
  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  useEffect(() => {
    if (data?._currentShortcuts && Array.isArray(data._currentShortcuts)) {
      setCurrentShortcutsAction(data._currentShortcuts);
    }
  }, [data]);

  return (
    <Sheet>
      <SheetTrigger asChild className="w-full">
        <Button>Add Shortcut</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xs mt-8 gap-8">
        <div className="flex flex-col gap-2 my-8">
          <h2 className={`${kumbh_sans.className} text-lg uppercase font-bold`}>
            Add Your Shortcut
          </h2>
          <p className="text-sm font-normal lowercase">
            Store your go-to websites and categorize them with a personal touch.
          </p>
        </div>
        <form
          action={action}
          className="flex flex-col items-start gap-8 font-normal"
        >
          <div className="flex flex-col gap-1 w-full">
            <Input placeholder="Shortcut Name" id="shortcut" name="shortcut" />
            <p className="text-xs ml-4 mt-1">
              Give your shortcut a memorable name.
            </p>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Input placeholder="Url" id="url" name="url" />
            <p className="text-xs ml-4 mt-1">Enter the full website address</p>
            <p className="text-xs ml-4">(e.g., https://example.com).</p>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Input
              placeholder="Description"
              id="description"
              name="description"
            />
            <p className="text-xs ml-4 mt-1">
              Add a quick reminder for this site.
            </p>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Select name="category">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" id="category" />
              </SelectTrigger>
              <SelectContent>
                {currentCategories.map((category: ShortcutCategory) => (
                  <div key={category.id}>
                    {category && (
                      <SelectItem value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <p className="capitalize">{category.category}</p>
                        </div>
                      </SelectItem>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs ml-4 mt-1">Choose a Category</p>
          </div>
          <Input id="uid" name="uid" value={uid} readOnly className="hidden" />
          <SheetClose asChild>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </SheetClose>
        </form>
      </SheetContent>
    </Sheet>
  );
}

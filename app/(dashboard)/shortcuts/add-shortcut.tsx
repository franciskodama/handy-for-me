'use client';

import { useActionState, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
import { addShortcut, getShortcuts } from '@/lib/actions/shortcuts';

type FormErrors = {
  shortcut?: string;
  url?: string;
  description?: string;
  category?: string;
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
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      setFormErrors({});
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (previousState: unknown, formData: FormData) => {
      setFormErrors({});

      const shortcut = formData.get('shortcut') as string;
      const url = formData.get('url') as string;
      const categoryId = formData.get('category') as string;
      const description = (formData.get('description') || '') as string;
      const uid = formData.get('uid') as string;

      const errors: FormErrors = {};

      if (!shortcut) {
        errors.shortcut = 'Enter a name for your shortcut.';
      } else if (shortcut.length > 20) {
        errors.category = 'Shortcut name should be 20 characters or fewer';
      }

      if (!url) {
        errors.url = 'Enter a url for your shortcut.';
      } else if (!url.includes('https://') && !url.includes('http://')) {
        errors.url = `Enter a valid url for your shortcut. 'e.g., https://example.com'`;
      }

      if (!categoryId) {
        errors.category = 'Select a category for your shortcut.';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
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
        return;
      }

      setOpen(false);
      toast({
        title: 'Added successfully! 🎉',
        description: 'Your new shortcut is ready to use!',
        variant: 'success'
      });

      const _currentShortcuts = await getShortcuts(uid);

      return {
        _currentShortcuts
      };
    },
    []
  );

  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  useEffect(() => {
    if (data?._currentShortcuts && Array.isArray(data._currentShortcuts)) {
      setCurrentShortcutsAction(data._currentShortcuts);
    }
  }, [data]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="w-full">
        <Button>Add Shortcut</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xs mt-8 gap-8">
        <div className="flex flex-col gap-2 my-8">
          <VisuallyHidden>
            <SheetTitle>Add Your Shortcut</SheetTitle>
            <SheetDescription>
              Store your go-to websites and categorize them with a personal
              touch.
            </SheetDescription>
          </VisuallyHidden>
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
            <Input
              className={formErrors.shortcut ? 'border-2 border-red-500' : ''}
              placeholder="Shortcut Name"
              id="shortcut"
              name="shortcut"
            />
            {formErrors.shortcut ? (
              <p className="text-xs font-bold text-red-500 ml-4 mt-1">
                {formErrors.shortcut}
              </p>
            ) : (
              <p className="text-xs ml-4 mt-1">
                Give your shortcut a memorable name.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Input
              className={formErrors.url ? 'border-2 border-red-500' : ''}
              placeholder="Url"
              id="url"
              name="url"
            />
            {formErrors.url ? (
              <p className="text-xs font-bold text-red-500 ml-4 mt-1">
                {formErrors.url}
              </p>
            ) : (
              <>
                <p className="text-xs ml-4 mt-1">
                  Enter the full website address
                </p>
                <p className="text-xs ml-4">(e.g., https://example.com).</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Input
              className={
                formErrors.description ? 'border-2 border-red-500' : ''
              }
              placeholder="Description"
              id="description"
              name="description"
            />
            {formErrors.description ? (
              <p className="text-xs font-bold text-red-500 ml-4 mt-1">
                {formErrors.description}
              </p>
            ) : (
              <p className="text-xs ml-4 mt-1">
                Add a quick reminder for this site.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Select name="category">
              <SelectTrigger
                className={
                  formErrors.category ? 'w-full border-2 border-red-500' : ''
                }
              >
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
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

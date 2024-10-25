'use client';

import { useActionState, useEffect, useState } from 'react';
import { Bomb, Inbox, Trash2 } from 'lucide-react';
import { shortcut_color_enum } from '@prisma/client';

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
import { kumbh_sans } from '@/app/ui/fonts';
import { ShortcutCategory } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import {
  addShortcutCategory,
  deleteShortcutCategory,
  getShortcutsCategories
} from '@/lib/actions';
import { colors } from '@/lib/utils';

type Color = {
  name: string;
  code: string;
  foreground?: string;
};

const handleSubmit = async (previousState: unknown, formData: FormData) => {
  const name = formData.get('name') as string;
  const color = formData.get('color');
  const colorUppperCase =
    (typeof color === 'string' &&
      (color.toUpperCase() as shortcut_color_enum)) ||
    ('GREY' as shortcut_color_enum);
  const uid = formData.get('uid') as string;

  if (name.length > 20) {
    toast({
      title: 'Maximum 20 characters!',
      description: 'The name should be at most 20 characters.',
      variant: 'destructive'
    });
    return;
  }

  const shortcutCategory = await addShortcutCategory({
    uid,
    name,
    colorUppperCase
  });

  if (!shortcutCategory) {
    toast({
      title: 'Ops...',
      description: 'Something got wrong. 🚨 Try again.',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'URL added successfully! 🎉',
      description: 'You have one more Category to manage your shortcuts.',
      variant: 'success'
    });
  }
  const _currentCategories = await getShortcutsCategories(uid);

  return {
    _currentCategories
  };
};

export function AddCategory({
  uid,
  categories
}: {
  uid: string;
  categories: ShortcutCategory[];
}) {
  const [data, action, isPending] = useActionState(handleSubmit, undefined);
  const [currentCategories, setCurrentCategories] =
    useState<ShortcutCategory[]>(categories);

  useEffect(() => {
    if (data?._currentCategories && Array.isArray(data._currentCategories)) {
      setCurrentCategories(data._currentCategories);
    }
  }, [data]);

  const handleDeleteCategory = async (category: ShortcutCategory) => {
    try {
      const success = await deleteShortcutCategory(category.id);
      if (success) {
        setCurrentCategories(
          currentCategories.filter((el) => el.id !== category.id)
        );
      }
      toast({
        title: 'Category gone!',
        description: `The ${category.name} has been successfully deleted.`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error deleting Shortcut Category! 🚨',
        description: 'Something went wrong while deleting this Category.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="w-full">
        <Button variant="outline">Manage Categories</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xs mt-8 gap-8">
        <div className="flex flex-col gap-2 my-8">
          <h2 className={`${kumbh_sans.className} text-lg uppercase font-bold`}>
            Add Category
          </h2>
          <p className="text-sm font-normal lowercase">
            Organize your content with categories.
          </p>
        </div>
        <form
          action={action}
          className="flex flex-col items-start gap-8 font-normal"
        >
          <div className="flex flex-col gap-1 w-full">
            <Input placeholder="Name" id="name" name="name" />
            <p className="text-xs ml-4 mt-1">Name your category in one word</p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Select name="color">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category Color" id="color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color: Color) => (
                  <div key={color.code}>
                    {color && (
                      <SelectItem value={color.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color.code }}
                          />
                          <p className="capitalize">{color.name}</p>
                        </div>
                      </SelectItem>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs ml-4 mt-1">Pick a color</p>
          </div>
          <Input id="uid" name="uid" value={uid} readOnly className="hidden" />
          <SheetClose asChild>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </SheetClose>
        </form>

        <div className="flex flex-col gap-2 my-12">
          <p className="text-sm font-semibold capitalize mb-2">
            Current Categories:
          </p>
          {currentCategories.length > 0 ? (
            currentCategories.map((category: ShortcutCategory) => (
              <div
                key={category.id}
                className="flex items-center justify-between border border-primary px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: category.color,
                      border:
                        category.color === 'YELLOW'
                          ? `1px solid lightgrey`
                          : `1px solid ${category.color}`
                    }}
                  />
                  <p className="text-center text-sm capitalize">
                    {category.name}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 size={18} strokeWidth={1.8} color="black" />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-4/5">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Bomb size={24} strokeWidth={1.8} />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="py-4">
                        This will permanently delete this Category
                        <span className="font-bold mx-1">{category.name}</span>
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          toast({
                            title: 'Operation Cancelled! ❌',
                            description: `Phew! 😮‍💨 Crisis averted. You successfully cancelled the operation.`,
                            variant: 'destructive'
                          });
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCategory(category)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <Inbox size={24} strokeWidth={1.8} />
              <p className="text-sm capitalize">No categories yet</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

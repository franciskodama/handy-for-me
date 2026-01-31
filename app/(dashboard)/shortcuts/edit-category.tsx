'use client';

import { useActionState, useCallback, useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { shortcut_color_enum } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
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
import { ShortcutCategory } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import {
  getShortcutsCategories,
  updateShortcutCategory
} from '@/lib/actions/shortcuts';
import { colors } from '@/lib/utils';

type Color = {
  name: string;
  code: string;
  foreground?: string;
};

type FormErrors = {
  category?: string;
  color?: string;
};

export function EditCategory({
  uid,
  category,
  currentCategories,
  setCurrentCategoriesAction
}: {
  uid: string;
  category: ShortcutCategory;
  currentCategories: ShortcutCategory[];
  setCurrentCategoriesAction: React.Dispatch<
    React.SetStateAction<ShortcutCategory[]>
  >;
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

      const categoryName = formData.get('category') as string;
      const color = formData.get('color');
      const colorUppperCase =
        (typeof color === 'string' &&
          (color.toUpperCase() as shortcut_color_enum)) ||
        ('GREY' as shortcut_color_enum);
      const uid = formData.get('uid') as string;

      const errors: FormErrors = {};

      if (!categoryName) {
        errors.category = 'Category name is required';
      } else if (categoryName.length > 20) {
        errors.category = 'Category name should be 20 characters or fewer';
      }

      if (!color) {
        errors.color = 'Please pick a color';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const updatedCategory = await updateShortcutCategory({
        id: category.id,
        uid,
        category: categoryName,
        colorUppperCase
      });

      if (!updatedCategory) {
        toast({
          title: 'Ops...',
          description: 'Something got wrong. 🚨 Try again.',
          variant: 'destructive'
        });
        return;
      }

      setOpen(false);
      toast({
        title: 'Category updated successfully! 🎉',
        description: 'Your category has been updated.',
        variant: 'success'
      });

      const _currentCategories = await getShortcutsCategories(uid);

      return {
        _currentCategories
      };
    },
    [category.id]
  );

  const [data, action, isPending] = useActionState(handleSubmit, undefined);

  useEffect(() => {
    if (data?._currentCategories && Array.isArray(data._currentCategories)) {
      setCurrentCategoriesAction(data._currentCategories);
    }
  }, [data]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-4 w-4 p-0">
          <Pencil size={18} className="text-black transition-colors" />
          <span className="sr-only">Edit Category</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xs mt-8 gap-8">
        <div className="flex flex-col gap-2 my-8">
          <VisuallyHidden>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Update your category details.</SheetDescription>
          </VisuallyHidden>
          <h2 className={`${kumbh_sans.className} text-lg uppercase font-bold`}>
            Edit Category
          </h2>
          <p className="text-sm font-normal lowercase">
            Update your category details.
          </p>
        </div>
        <form
          action={action}
          className="flex flex-col items-start gap-8 font-normal"
        >
          <div className="flex flex-col gap-1 w-full">
            <Input
              placeholder="Category Name"
              id="category"
              name="category"
              defaultValue={category.category}
              className={formErrors.category ? 'border-2 border-red-500' : ''}
            />
            {formErrors.category ? (
              <p className="text-xs font-bold text-red-500 ml-4 mt-1">
                {formErrors.category}
              </p>
            ) : (
              <p className="text-xs ml-4 mt-1">
                Name your category in one word
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Select name="color" defaultValue={category.color}>
              <SelectTrigger
                className={
                  formErrors.color ? 'w-full border-2 border-red-500' : ''
                }
              >
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
            {formErrors.color ? (
              <p className="text-xs font-bold text-red-500 ml-4 mt-1">
                {formErrors.color}
              </p>
            ) : (
              <p className="text-xs ml-4 mt-1">
                Name your category in one word
              </p>
            )}
          </div>

          <Input id="uid" name="uid" value={uid} readOnly className="hidden" />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

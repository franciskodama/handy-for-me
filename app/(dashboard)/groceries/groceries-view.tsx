'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ShoppingCart,
  Store,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  Star,
  Check,
  Package,
  Layers,
  ArrowRight,
  Info,
  Clock,
  HeartHandshake,
  Wand2,
  FileText
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
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

import { GroceryItem } from '@/lib/types';
import {
  addGroceryItem,
  getGroceryItems,
  toggleGroceryItemInCart,
  updateGroceryItem,
  deleteGroceryItem,
  restockGroceryItem,
  finishShoppingTrip,
  batchAddGroceryItems
} from '@/lib/actions/groceries';
import { inferCategory, parseRawGroceryText, ParsedGroceryItem } from '@/lib/groceries.utils';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { toast } from '@/hooks/use-toast';
import Help from '@/components/common/Help';
import MessageEmpty from '@/components/MessageEmpty';
import ExplanationGroceries from './explanation-groceries';

export const GROCERY_CATEGORIES = [
  {
    name: 'Produce',
    label: '🥦 Fresh Produce',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#065f46',
    order: 1
  },
  {
    name: 'Bakery',
    label: '🥖 Bakery & Bread',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    textColor: '#92400e',
    order: 2
  },
  {
    name: 'Meat & Seafood',
    label: '🥩 Meat & Seafood',
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#991b1b',
    order: 3
  },
  {
    name: 'Dairy & Eggs',
    label: '🧀 Dairy & Eggs',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#1e40af',
    order: 4
  },
  {
    name: 'Pantry',
    label: '🥫 Pantry & Grains',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#5b21b6',
    order: 5
  },
  {
    name: 'Snacks & Drinks',
    label: '🍿 Snacks & Drinks',
    color: '#ec4899',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    textColor: '#9d174d',
    order: 6
  },
  {
    name: 'Frozen',
    label: '🍦 Frozen Foods',
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    textColor: '#155e75',
    order: 7
  },
  {
    name: 'Household',
    label: '🧼 Household & Care',
    color: '#64748b',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    textColor: '#334155',
    order: 8
  },
  {
    name: 'Other',
    label: '🛒 Other Essentials',
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#e5e7eb',
    textColor: '#374151',
    order: 9
  }
];

export const POPULAR_STAPLES = [
  // { name: 'Whole Milk', category: 'Dairy & Eggs', quantity: '1 gal' },
  {
    name: 'Oat Milk',
    category: 'Dairy & Eggs',
    quantity: '1 carton',
    notes: 'Barista blend'
  },
  {
    name: 'Eggs (Dozen)',
    category: 'Dairy & Eggs',
    quantity: '1 carton',
    notes: 'Pasture-raised'
  },
  { name: 'Butter', category: 'Dairy & Eggs', quantity: '1 box' },
  { name: 'Cheddar Cheese', category: 'Dairy & Eggs', quantity: '1 block' },
  {
    name: 'Greek Yogurt',
    category: 'Dairy & Eggs',
    quantity: '1 tub',
    notes: 'Plain / Unsweetened'
  },
  { name: 'Bananas', category: 'Produce', quantity: '1 bunch' },
  {
    name: 'Avocados',
    category: 'Produce',
    quantity: '3 count',
    notes: 'Medium ripe'
  },
  { name: 'Spinach', category: 'Produce', quantity: '1 box' },
  { name: 'Tomatoes', category: 'Produce', quantity: '4 count' },
  { name: 'Garlic & Onions', category: 'Produce', quantity: '1 bag' },
  {
    name: 'Apples',
    category: 'Produce',
    quantity: '1 bag',
    notes: 'Honeycrisp'
  },
  { name: 'Sourdough Bread', category: 'Bakery', quantity: '1 loaf' },
  { name: 'Bagels', category: 'Bakery', quantity: '1 pack' },
  { name: 'Chicken Breast', category: 'Meat & Seafood', quantity: '2 lbs' },
  { name: 'Salmon Fillet', category: 'Meat & Seafood', quantity: '1 lb' },
  {
    name: 'Olive Oil',
    category: 'Pantry',
    quantity: '1 bottle',
    notes: 'Extra Virgin'
  },
  {
    name: 'Coffee Beans',
    category: 'Pantry',
    quantity: '1 bag',
    notes: 'Medium roast'
  },
  { name: 'Pasta & Sauce', category: 'Pantry', quantity: '2 boxes' },
  { name: 'Sparkling Water', category: 'Snacks & Drinks', quantity: '1 pack' },
  { name: 'Paper Towels', category: 'Household', quantity: '1 pack' }
];

type AddFormInputs = {
  name: string;
  category: string;
  quantity?: string;
  notes?: string;
  isStaple?: boolean;
};

type EditFormInputs = {
  name: string;
  category: string;
  quantity?: string;
  notes?: string;
  isStaple?: boolean;
};

interface GroceriesViewProps {
  uid: string;
  userName?: string | null;
  initialActiveItems: GroceryItem[];
  initialArchivedItems: GroceryItem[];
  householdDetails: any;
}

export default function GroceriesView({
  uid,
  userName,
  initialActiveItems,
  initialArchivedItems,
  householdDetails
}: GroceriesViewProps) {
  const [activeItems, setActiveItems] =
    useState<GroceryItem[]>(initialActiveItems);
  const [archivedItems, setArchivedItems] =
    useState<GroceryItem[]>(initialArchivedItems);
  const [viewMode, setViewMode] = useState<'plan' | 'store'>('plan');
  const [filter, setFilter] = useState<
    'all' | 'remaining' | 'inCart' | 'staples'
  >('all');
  const [openAction, setOpenAction] = useState(false);
  const [showStaplesDrawer, setShowStaplesDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [isFinishingTrip, setIsFinishingTrip] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [showInCartTray, setShowInCartTray] = useState(true);
  const [showSmartPasteModal, setShowSmartPasteModal] = useState(false);
  const [rawPasteText, setRawPasteText] = useState('');
  const [parsedPreviewItems, setParsedPreviewItems] = useState<ParsedGroceryItem[]>([]);
  const [isBatchAdding, setIsBatchAdding] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleParseRawText = () => {
    if (!rawPasteText.trim()) return;
    const parsed = parseRawGroceryText(rawPasteText);
    setParsedPreviewItems(parsed);
    if (parsed.length === 0) {
      toast({
        title: 'No items recognized',
        description: 'Please check your text format and try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: `Recognized ${parsed.length} items! ✨`,
        description: 'Review the extracted quantities and departments below.',
        variant: 'success'
      });
    }
  };

  const handleUpdateParsedItem = (
    index: number,
    field: keyof ParsedGroceryItem,
    value: any
  ) => {
    setParsedPreviewItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteParsedItem = (index: number) => {
    setParsedPreviewItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddNewParsedRow = () => {
    setParsedPreviewItems((prev) => [
      ...prev,
      {
        id: `ai-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: '',
        category: 'Produce',
        quantity: '',
        notes: '',
        isStaple: false
      }
    ]);
  };

  const handleSaveAllParsedItems = async () => {
    const validItems = parsedPreviewItems.filter((i) => i.name.trim().length > 0);
    if (validItems.length === 0) {
      toast({
        title: 'No valid items',
        description: 'Please enter at least one item name.',
        variant: 'destructive'
      });
      return;
    }

    setIsBatchAdding(true);
    try {
      const added = await batchAddGroceryItems(uid, validItems);
      if (added && Array.isArray(added)) {
        // Refresh active and archived items
        const res = await getGroceryItems(uid);
        if (res && typeof res === 'object') {
          setActiveItems(res.active);
          setArchivedItems(res.archived);
        }

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });

        toast({
          title: `Added ${validItems.length} items to list! ✨🛒`,
          description: 'All items were auto-categorized into your store aisles.',
          variant: 'success'
        });

        setRawPasteText('');
        setParsedPreviewItems([]);
        setShowSmartPasteModal(false);
      } else {
        throw new Error('Failed to save parsed items');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error importing items',
        description: 'Could not batch add items. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsBatchAdding(false);
    }
  };

  // Sync state when props change
  useEffect(() => {
    setActiveItems(initialActiveItems);
    setArchivedItems(initialArchivedItems);
  }, [initialActiveItems, initialArchivedItems]);

  // Real-time collaborative polling (every 3.5s when household sharing is enabled)
  useEffect(() => {
    const isShared =
      householdDetails?.inHousehold &&
      householdDetails?.userSettings?.shareGroceryList;

    if (!isShared) return;

    const interval = setInterval(async () => {
      const result = await getGroceryItems(uid);
      if (result && typeof result === 'object') {
        setActiveItems(result.active);
        setArchivedItems(result.archived);
        setLastSyncTime(new Date());
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [uid, householdDetails]);

  // Form for Adding new items
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AddFormInputs>({
    defaultValues: {
      name: '',
      category: '',
      quantity: '',
      notes: '',
      isStaple: false
    }
  });

  const watchedName = watch('name');

  // Auto-fill category suggestion based on typed name if category isn't picked yet
  useEffect(() => {
    if (watchedName && watchedName.trim().length > 1) {
      const suggested = inferCategory(watchedName);
      if (suggested) {
        setValue('category', suggested);
      }
    }
  }, [watchedName, setValue]);

  // Form for Editing an item
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    reset: resetEdit,
    formState: { isSubmitting: isSubmittingEdit }
  } = useForm<EditFormInputs>();

  const openEditModal = (item: GroceryItem) => {
    setEditingItem(item);
    resetEdit({
      name: item.name,
      category: item.category,
      quantity: item.quantity || '',
      notes: item.notes || '',
      isStaple: item.isStaple
    });
  };

  const onAddSubmit = async (data: AddFormInputs) => {
    try {
      const optimisticId = `temp-${Date.now()}`;
      const category = data.category || inferCategory(data.name);

      const optimisticItem: GroceryItem = {
        id: optimisticId,
        uid,
        householdId: householdDetails?.household?.id || null,
        name: data.name.trim(),
        category,
        quantity: data.quantity?.trim() || null,
        notes: data.notes?.trim() || null,
        inCart: false,
        pickedByUid: null,
        isStaple: !!data.isStaple,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Optimistic update
      setActiveItems((prev) => [
        optimisticItem,
        ...prev.filter(
          (i) => i.name.toLowerCase() !== data.name.trim().toLowerCase()
        )
      ]);
      setArchivedItems((prev) =>
        prev.filter(
          (i) => i.name.toLowerCase() !== data.name.trim().toLowerCase()
        )
      );

      reset({
        name: '',
        category: '',
        quantity: '',
        notes: '',
        isStaple: false
      });

      const res = await addGroceryItem(uid, {
        name: data.name,
        category,
        quantity: data.quantity,
        notes: data.notes,
        isStaple: data.isStaple
      });

      if (res) {
        setActiveItems((prev) =>
          prev.map((item) => (item.id === optimisticId ? res : item))
        );
        toast({
          title: 'Item added! 🛒',
          description: `"${res.name}" is now on your list.`,
          variant: 'success'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error adding item',
        description: 'Could not add item to list. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const onEditSubmit = async (data: EditFormInputs) => {
    if (!editingItem) return;

    try {
      const updated = await updateGroceryItem(editingItem.id, {
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        notes: data.notes,
        isStaple: data.isStaple
      });

      if (updated) {
        setActiveItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated : item))
        );
        toast({
          title: 'Item updated ✨',
          description: `Updated "${updated.name}".`,
          variant: 'success'
        });
      }
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Update failed',
        description: 'Could not save changes.',
        variant: 'destructive'
      });
    }
  };

  const handleToggleCart = async (item: GroceryItem) => {
    const nextState = !item.inCart;
    const currentUserName = userName || uid.split('@')[0];

    // Optimistic UI update
    setActiveItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inCart: nextState,
              pickedByUid: nextState ? currentUserName : null
            }
          : i
      )
    );

    try {
      const res = await toggleGroceryItemInCart(item.id, nextState);
      if (res) {
        setActiveItems((prev) => prev.map((i) => (i.id === item.id ? res : i)));
      }
    } catch (error) {
      console.error(error);
      // Revert on error
      setActiveItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      toast({
        title: 'Status sync error',
        description: 'Failed to update cart status.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    try {
      setActiveItems((prev) => prev.filter((i) => i.id !== id));
      setArchivedItems((prev) => prev.filter((i) => i.id !== id));

      await deleteGroceryItem(id);
      toast({
        title: 'Item removed',
        description: `"${name}" was deleted.`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error removing item',
        variant: 'destructive'
      });
    }
  };

  const handleRestockItem = async (item: GroceryItem) => {
    try {
      // Optimistic
      setArchivedItems((prev) => prev.filter((i) => i.id !== item.id));
      setActiveItems((prev) => [
        { ...item, archived: false, inCart: false },
        ...prev
      ]);

      const res = await restockGroceryItem(item.id);
      if (res) {
        setActiveItems((prev) => prev.map((i) => (i.id === item.id ? res : i)));
        toast({
          title: 'Restocked! 🔄',
          description: `Added "${item.name}" back to the active list.`,
          variant: 'success'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Restock failed',
        variant: 'destructive'
      });
    }
  };

  const handleQuickAddStaple = async (staple: {
    name: string;
    category: string;
    quantity?: string;
    notes?: string;
  }) => {
    await onAddSubmit({
      name: staple.name,
      category: staple.category,
      quantity: staple.quantity || '',
      notes: staple.notes || '',
      isStaple: true
    });
  };

  const handleFinishTrip = async () => {
    setIsFinishingTrip(true);
    try {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      await finishShoppingTrip(uid);

      // Refresh list
      const res = await getGroceryItems(uid);
      if (res) {
        setActiveItems(res.active);
        setArchivedItems(res.archived);
      }

      toast({
        title: 'Shopping Trip Complete! 🎉🛒',
        description: 'All in-cart items were moved to your restock history.',
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Could not finish trip',
        variant: 'destructive'
      });
    } finally {
      setIsFinishingTrip(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Grocery-List-${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: 'PDF Exported! 📄',
        description: 'Your grocery checklist is ready.',
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Export failed',
        variant: 'destructive'
      });
    }
  };

  // Calculations & Filtering
  const totalItemsCount = activeItems.length;
  const inCartItems = activeItems.filter((i) => i.inCart);
  const remainingItems = activeItems.filter((i) => !i.inCart);
  const cartPercentage =
    totalItemsCount > 0
      ? Math.round((inCartItems.length / totalItemsCount) * 100)
      : 0;

  // Filtered active items
  const displayedActiveItems = useMemo(() => {
    if (filter === 'remaining') return remainingItems;
    if (filter === 'inCart') return inCartItems;
    if (filter === 'staples') return activeItems.filter((i) => i.isStaple);
    return activeItems;
  }, [activeItems, filter, remainingItems, inCartItems]);

  // Group items by category / department order
  const groupedDepartments = useMemo(() => {
    const groups: {
      category: (typeof GROCERY_CATEGORIES)[0];
      items: GroceryItem[];
    }[] = [];

    GROCERY_CATEGORIES.forEach((cat) => {
      const itemsInCat = displayedActiveItems.filter(
        (i) => i.category.toLowerCase() === cat.name.toLowerCase()
      );
      if (itemsInCat.length > 0) {
        groups.push({ category: cat, items: itemsInCat });
      }
    });

    // Catch any uncategorized items
    const knownNames = GROCERY_CATEGORIES.map((c) => c.name.toLowerCase());
    const extraItems = displayedActiveItems.filter(
      (i) => !knownNames.includes(i.category.toLowerCase())
    );
    if (extraItems.length > 0) {
      const otherCat = GROCERY_CATEGORIES.find((c) => c.name === 'Other')!;
      groups.push({ category: otherCat, items: extraItems });
    }

    return groups.sort((a, b) => a.category.order - b.category.order);
  }, [displayedActiveItems]);

  // Archived items categorized for the restock catalog
  const archivedByCat = useMemo(() => {
    const map: Record<string, GroceryItem[]> = {};
    archivedItems.forEach((item) => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [archivedItems]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1
                  className={`${kumbh_sans.className} text-2xl md:text-3xl font-bold flex items-center gap-2.5`}
                >
                  <ShoppingCart className="h-7 w-7 text-primary" />
                  Groceries & Co-Shopping
                </h1>

                {householdDetails?.inHousehold &&
                householdDetails?.userSettings?.shareGroceryList ? (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 flex items-center px-2.5 py-1 text-xs">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    👥 Shared with Household
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="gap-1 flex items-center text-xs"
                  >
                    🔒 Personal List
                  </Badge>
                )}

                {householdDetails?.inHousehold &&
                  householdDetails?.userSettings?.shareGroceryList &&
                  householdDetails.household?.members && (
                    <div
                      className="flex -space-x-1.5 overflow-hidden ml-1"
                      title="Active household co-shoppers"
                    >
                      {householdDetails.household.members.map((member: any) => (
                        <div
                          key={member.id}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-background overflow-hidden bg-primary/15 text-[10px] font-bold items-center justify-center"
                          title={member.name || member.uid}
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name || 'avatar'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>
                              {(member.name || member.uid)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                <div className="block md:hidden ml-auto">
                  {!openAction ? (
                    <Help setOpenAction={setOpenAction} />
                  ) : (
                    <div />
                  )}
                </div>
              </div>

              <p
                className={`${barlow.className} text-sm text-muted-foreground font-normal`}
              >
                Plan together, coordinate item preferences, and shop aisles
                efficiently in real time.
              </p>
            </div>

            {/* Mode Selector & Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
              <div className="flex bg-muted p-1 border rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('plan')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    viewMode === 'plan'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  📝 Plan & Prepare
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('store')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    viewMode === 'store'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Store className="h-3.5 w-3.5" />
                  🛒 In-Store Mode
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSmartPasteModal(true)}
                className="gap-1.5 text-xs font-semibold h-9 border-purple-300 bg-purple-50/50 hover:bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300"
              >
                <Wand2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                ✨ AI Smart Paste
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStaplesDrawer(true)}
                className="gap-1.5 text-xs font-semibold h-9"
              >
                <RotateCcw className="h-3.5 w-3.5 text-primary" />
                Restock & Staples
                {archivedItems.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0 text-[10px]"
                  >
                    {archivedItems.length}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="gap-1.5 text-xs font-semibold h-9"
              >
                <Printer className="h-3.5 w-3.5" />
                Print List
              </Button>

              <div className="hidden md:block">
                {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Live Trip Status & Progress Bar */}
        {totalItemsCount > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">
                  Cart Progress: {inCartItems.length} of {totalItemsCount} items
                  ({cartPercentage}%)
                </span>
                {remainingItems.length > 0 ? (
                  <Badge
                    variant="outline"
                    className="text-amber-700 bg-amber-50 border-amber-200"
                  >
                    {remainingItems.length} remaining
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-600 text-white flex items-center gap-1">
                    <Check className="h-3 w-3" /> All Items in Cart!
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {inCartItems.length > 0 && (
                  <Button
                    size="sm"
                    onClick={handleFinishTrip}
                    disabled={isFinishingTrip}
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Finish Trip & Archive
                  </Button>
                )}
              </div>
            </div>

            {/* Progress bar track */}
            <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${cartPercentage}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Explanation Banner */}
      <AnimatePresence>
        {openAction && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <ExplanationGroceries setOpenAction={setOpenAction} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 1: Plan & Prepare - Quick Add Toolbar */}
      {viewMode === 'plan' && (
        <Card className="border-border shadow-sm bg-card/60 backdrop-blur">
          <CardContent className="p-4 sm:p-6">
            <h3
              className={`${kumbh_sans.className} text-base font-semibold mb-3 flex items-center gap-2`}
            >
              <Plus className="h-4 w-4 text-primary" />
              Quick-Add Grocery Item
            </h3>

            <form
              onSubmit={handleSubmit(onAddSubmit)}
              className="flex flex-col gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Item Name (col-span 5) */}
                <div className="sm:col-span-4 flex flex-col gap-1">
                  <Input
                    placeholder="e.g. Oat Milk, Avocados, Sourdough"
                    {...register('name', { required: 'Item name is required' })}
                    className="h-10"
                  />
                  {errors.name && (
                    <span className="text-destructive text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Category Selector (col-span 3) */}
                <div className="sm:col-span-3 flex flex-col gap-1">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Department / Aisle" />
                        </SelectTrigger>
                        <SelectContent>
                          {GROCERY_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Quantity (col-span 2) */}
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Qty (e.g. 2 bags, 1kg)"
                    {...register('quantity')}
                    className="h-10"
                  />
                </div>

                {/* Brand / Preference Note (col-span 3) */}
                <div className="sm:col-span-3">
                  <Input
                    placeholder="Brand / Note (e.g. Oatly, Ripe)"
                    {...register('notes')}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-1 pt-2 border-t border-border flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('isStaple')}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
                    Save as frequent household staple
                  </label>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSmartPasteModal(true)}
                    className="h-9 text-xs font-semibold gap-1.5 border-purple-300 text-purple-800 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    Paste List
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 font-semibold gap-1.5 px-4"
                  >
                    <Plus className="h-4 w-4" />
                    {isSubmitting ? 'Adding...' : 'Add to List'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs & View Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border text-xs overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 font-semibold rounded transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Items ({activeItems.length})
          </button>
          <button
            onClick={() => setFilter('remaining')}
            className={`px-3 py-1 font-semibold rounded transition-colors whitespace-nowrap ${
              filter === 'remaining'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            To Buy ({remainingItems.length})
          </button>
          <button
            onClick={() => setFilter('inCart')}
            className={`px-3 py-1 font-semibold rounded transition-colors whitespace-nowrap ${
              filter === 'inCart'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            In Cart ({inCartItems.length})
          </button>
          <button
            onClick={() => setFilter('staples')}
            className={`px-3 py-1 font-semibold rounded transition-colors whitespace-nowrap ${
              filter === 'staples'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⭐ Staples ({activeItems.filter((i) => i.isStaple).length})
          </button>
        </div>

        {viewMode === 'store' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live In-Store Mode • Tap items as you pick them
          </div>
        )}
      </div>

      {/* Empty State */}
      {activeItems.length === 0 && (
        <div className="mt-4">
          <MessageEmpty
            image={'/superman-where.webp'}
            objectPosition={'50% 10%'}
            alt={'Grocery list is empty'}
            icon={<ShoppingBag size={32} strokeWidth={1.6} />}
            titleOne={'Fridge looking empty?'}
            titleTwo={'No Grocery Items Yet'}
            subtitle={
              'Add items to your list or tap "Restock & Staples" to quickly add household essentials.'
            }
            setOpenAction={setShowStaplesDrawer}
            buttonCopy={'Quick-Add Staples'}
            hasButton={true}
          />
        </div>
      )}

      {/* Printable / Board Container */}
      <div ref={printRef} className="flex flex-col gap-6">
        {/* Department / Aisle Groupings */}
        {groupedDepartments.map(({ category, items }) => (
          <Card
            key={category.name}
            className={`border transition-all ${
              viewMode === 'store' ? 'border-2 shadow-md' : 'shadow-sm'
            }`}
            style={{ borderColor: category.borderColor }}
          >
            {/* Department Header */}
            <div
              className="px-4 py-3 border-b flex items-center justify-between rounded-t-lg"
              style={{
                backgroundColor: category.bgColor,
                borderColor: category.borderColor
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-base font-bold"
                  style={{ color: category.textColor }}
                >
                  {category.label}
                </span>
                <Badge
                  variant="outline"
                  className="bg-white/80 font-bold text-xs"
                  style={{
                    color: category.textColor,
                    borderColor: category.borderColor
                  }}
                >
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>

              <span
                className="text-[11px] font-medium tracking-wide uppercase"
                style={{ color: category.textColor }}
              >
                Aisle {category.order}
              </span>
            </div>

            {/* Department Items List */}
            <CardContent className="p-2 sm:p-4 divide-y divide-border/60">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between p-3 rounded-lg transition-all ${
                    item.inCart
                      ? 'bg-muted/40 opacity-75'
                      : 'hover:bg-accent/40 bg-card'
                  } ${viewMode === 'store' ? 'py-3.5 my-1 border border-border/40' : ''}`}
                >
                  {/* Left: Cart Checkbox & Item Info */}
                  <div
                    onClick={() => handleToggleCart(item)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
                  >
                    <button
                      type="button"
                      className="flex-shrink-0 transition-transform active:scale-90"
                    >
                      {item.inCart ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>

                    <div className="flex flex-col items-start gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm sm:text-base ${
                            item.inCart
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {item.name}
                        </span>

                        {item.quantity && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5 font-bold bg-primary/10 text-primary border-primary/20"
                          >
                            {item.quantity}
                          </Badge>
                        )}

                        {item.isStaple && (
                          <span title="Household Staple">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
                          </span>
                        )}
                      </div>

                      {/* Notes / Brand / Preference coordination */}
                      {item.notes && (
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <Tag className="h-3 w-3 text-muted-foreground/70" />
                          <span>{item.notes}</span>
                        </p>
                      )}

                      {/* Co-Shopper Attribution Badges */}
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.inCart && item.pickedByUid && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Picked by {item.pickedByUid}
                          </span>
                        )}
                        {!item.inCart && item.uid && (
                          <span className="text-[10px] text-muted-foreground">
                            Added by {item.uid.split('@')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(item)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      title="Edit Item"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove from list?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove &quot;{item.name}
                            &quot; from your grocery list?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Item Dialog */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-primary" />
              Edit Grocery Item
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <form
              onSubmit={handleSubmitEdit(onEditSubmit)}
              className="flex flex-col gap-4 py-2"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Item Name
                </label>
                <Input {...registerEdit('name', { required: true })} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Department / Aisle
                </label>
                <Controller
                  name="category"
                  control={controlEdit}
                  defaultValue={editingItem.category}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GROCERY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Quantity / Unit
                  </label>
                  <Input
                    placeholder="e.g. 2 packs"
                    {...registerEdit('quantity')}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Brand / Note
                  </label>
                  <Input
                    placeholder="e.g. Organic, Oatly"
                    {...registerEdit('notes')}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editIsStaple"
                  {...registerEdit('isStaple')}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <label
                  htmlFor="editIsStaple"
                  className="text-xs font-medium text-muted-foreground cursor-pointer"
                >
                  Frequent Household Staple
                </label>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Restock & Staples Drawer / Modal */}
      <Dialog open={showStaplesDrawer} onOpenChange={setShowStaplesDrawer}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <RotateCcw className="h-5 w-5 text-primary" />
              Restock & Staples Catalog
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Quickly re-add staples or items from past shopping trips with a
              single click.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-3">
            {/* Section 1: Popular Household Essentials */}
            <div>
              <h4
                className={`${kumbh_sans.className} text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2`}
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                Popular Household Staples (1-Click Add)
              </h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_STAPLES.map((staple) => {
                  const alreadyOnList = activeItems.some(
                    (i) => i.name.toLowerCase() === staple.name.toLowerCase()
                  );
                  return (
                    <Button
                      key={staple.name}
                      variant={alreadyOnList ? 'secondary' : 'outline'}
                      size="sm"
                      disabled={alreadyOnList}
                      onClick={() => handleQuickAddStaple(staple)}
                      className={`text-xs font-medium h-8 gap-1.5 transition-all ${
                        alreadyOnList
                          ? 'opacity-50'
                          : 'hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {alreadyOnList ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      <span>{staple.name}</span>
                      {staple.quantity && (
                        <span className="text-[10px] text-muted-foreground">
                          ({staple.quantity})
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Previous Trip History (Archived Items) */}
            <div>
              <h4
                className={`${kumbh_sans.className} text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2`}
              >
                <Clock className="h-4 w-4 text-primary" />
                Past Shopping Trips History ({archivedItems.length} items)
              </h4>

              {archivedItems.length === 0 ? (
                <div className="p-6 text-center border border-dashed rounded-lg text-xs text-muted-foreground">
                  No previous shopping trip history yet. Items you check off and
                  finish will appear here for fast re-ordering.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(archivedByCat).map(([catName, items]) => (
                    <div
                      key={catName}
                      className="border rounded-lg p-3 bg-muted/20"
                    >
                      <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2">
                        {catName}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 rounded bg-card border text-xs"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold">{item.name}</span>
                              {item.quantity && (
                                <span className="text-[10px] text-muted-foreground">
                                  {item.quantity}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestockItem(item)}
                              className="h-7 text-[11px] font-semibold gap-1 hover:bg-primary hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                              Add Back
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowStaplesDrawer(false)}
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Smart Paste / Bulk Import Dialog */}
      <Dialog open={showSmartPasteModal} onOpenChange={setShowSmartPasteModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Wand2 className="h-5 w-5 text-purple-600" />
              AI Smart Paste & Bulk Importer
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Paste a messy grocery list from WhatsApp, notes, or recipes. Our AI parses items, quantities, brands, and automatically routes them to the correct store departments.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Textarea Input Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Paste Raw Grocery Text
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setRawPasteText(
                      `6 Banana\nOrange 12\nLimes  12\n2L Oat Milk (Oatly)\n1kg chicken breast\n1 sourdough bread\nsalted butter`
                    )
                  }
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Fill with example
                </button>
              </div>

              <textarea
                value={rawPasteText}
                onChange={(e) => setRawPasteText(e.target.value)}
                placeholder={`Paste your list here, e.g.:\n6 Banana\nOrange 12\nLimes  12\n2L Oat Milk (Oatly)\n1kg chicken breast\n1 pack paper towels`}
                rows={5}
                className="w-full rounded-md border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[11px] text-muted-foreground">
                  💡 Supports quantities at the start (<code>6 Banana</code>) or end (<code>Orange 12</code>), notes in parentheses, and bullet points.
                </p>

                <Button
                  type="button"
                  onClick={handleParseRawText}
                  disabled={!rawPasteText.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs font-semibold h-8 ml-auto"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Parse List ✨
                </Button>
              </div>
            </div>

            {/* Parsed Preview Section */}
            {parsedPreviewItems.length > 0 && (
              <div className="flex flex-col gap-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className={`${kumbh_sans.className} text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2`}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Recognized Items ({parsedPreviewItems.length})
                  </h4>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddNewParsedRow}
                    className="text-xs h-7 text-primary hover:bg-primary/5"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Row
                  </Button>
                </div>

                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {parsedPreviewItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 rounded-lg border bg-card/60 items-center text-xs"
                    >
                      {/* Name (col 4) */}
                      <div className="sm:col-span-4">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateParsedItem(idx, 'name', e.target.value)
                          }
                          placeholder="Item Name"
                          className="h-8 text-xs font-semibold"
                        />
                      </div>

                      {/* Department / Category (col 3) */}
                      <div className="sm:col-span-3">
                        <Select
                          value={item.category}
                          onValueChange={(val) =>
                            handleUpdateParsedItem(idx, 'category', val)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GROCERY_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.name} value={cat.name}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Qty (col 2) */}
                      <div className="sm:col-span-2">
                        <Input
                          value={item.quantity || ''}
                          onChange={(e) =>
                            handleUpdateParsedItem(idx, 'quantity', e.target.value)
                          }
                          placeholder="Qty"
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* Notes (col 2) */}
                      <div className="sm:col-span-2">
                        <Input
                          value={item.notes || ''}
                          onChange={(e) =>
                            handleUpdateParsedItem(idx, 'notes', e.target.value)
                          }
                          placeholder="Brand / Note"
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* Delete button (col 1) */}
                      <div className="sm:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteParsedItem(idx)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {parsedPreviewItems.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setParsedPreviewItems([]);
                  setRawPasteText('');
                }}
                disabled={isBatchAdding}
                className="text-xs"
              >
                Clear
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSmartPasteModal(false)}
              disabled={isBatchAdding}
              className="text-xs"
            >
              Cancel
            </Button>

            {parsedPreviewItems.length > 0 && (
              <Button
                type="button"
                onClick={handleSaveAllParsedItems}
                disabled={isBatchAdding || parsedPreviewItems.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5"
              >
                <Plus className="h-4 w-4" />
                {isBatchAdding
                  ? 'Adding to List...'
                  : `Add All ${parsedPreviewItems.length} Items to List`}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

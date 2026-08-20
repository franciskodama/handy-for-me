'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
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
  FileText,
  Footprints
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  toggleGroceryItemStaple,
  updateGroceryItem,
  deleteGroceryItem,
  restockGroceryItem,
  batchRestockGroceryItems,
  finishShoppingTrip,
  batchAddGroceryItems,
  clearActiveGroceryItems,
  removeActiveGroceryItem
} from '@/lib/actions/groceries';
import {
  inferCategory,
  parseRawGroceryText,
  ParsedGroceryItem,
  DEFAULT_CATEGORY_ORDER,
  getSavedCategoryOrder,
  GROCERY_CATEGORIES,
  GroceryCategory
} from '@/lib/groceries.utils';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import { toast } from '@/hooks/use-toast';
import Help from '@/components/common/Help';
import MessageEmpty from '@/components/MessageEmpty';
import ExplanationGroceries from './explanation-groceries';
import AisleReorderModal from './aisle-reorder-modal';
import AisleQuickNav from './aisle-quick-nav';
import PartnerLocationRadar from '@/components/groceries/partner-location-radar';
import { getPartnerLocationsFromItems } from '@/lib/location-tracker.utils';

export { GROCERY_CATEGORIES };
export type { GroceryCategory };

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
  initialStaples?: GroceryItem[];
  householdDetails: any;
}

export default function GroceriesView({
  uid,
  userName,
  initialActiveItems,
  initialArchivedItems,
  initialStaples = [],
  householdDetails
}: GroceriesViewProps) {
  const [activeItems, setActiveItems] =
    useState<GroceryItem[]>(initialActiveItems);
  const [archivedItems, setArchivedItems] =
    useState<GroceryItem[]>(initialArchivedItems);
  const [staples, setStaples] = useState<GroceryItem[]>(initialStaples);
  const [viewMode, setViewMode] = useState<'plan' | 'store'>('plan');
  const [filter, setFilter] = useState<
    'all' | 'remaining' | 'inCart' | 'staples'
  >('all');
  const [openAction, setOpenAction] = useState(false);
  const [showStaplesDrawer, setShowStaplesDrawer] = useState(false);
  const [staplesModalTab, setStaplesModalTab] = useState<
    'staples' | 'history' | 'essentials'
  >('staples');
  const [staplesSearch, setStaplesSearch] = useState('');
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [isFinishingTrip, setIsFinishingTrip] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [showInCartTray, setShowInCartTray] = useState(true);
  const [showSmartPasteModal, setShowSmartPasteModal] = useState(false);
  const [rawPasteText, setRawPasteText] = useState('');
  const [saveAllAsStaples, setSaveAllAsStaples] = useState(false);
  const [parsedPreviewItems, setParsedPreviewItems] = useState<
    ParsedGroceryItem[]
  >([]);
  const [isBatchAdding, setIsBatchAdding] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearingList, setIsClearingList] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState<string[]>(
    DEFAULT_CATEGORY_ORDER
  );
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [collapsedAisles, setCollapsedAisles] = useState<
    Record<string, boolean>
  >({});
  const [parkedCartCategory, setParkedCartCategory] = useState<string | null>(null);

  const currentUserName = useMemo(() => userName || uid.split('@')[0], [userName, uid]);

  const partnerLocations = useMemo(
    () => getPartnerLocationsFromItems(activeItems, currentUserName),
    [activeItems, currentUserName]
  );

  // Load custom supermarket aisle order from localStorage
  useEffect(() => {
    const saved = getSavedCategoryOrder(uid);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setCategoryOrder(saved);
    }
  }, [uid]);

  const toggleAisleCollapse = (categoryName: string) => {
    setCollapsedAisles((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handleParseRawText = () => {
    if (!rawPasteText.trim()) return;
    const parsed = parseRawGroceryText(rawPasteText);
    const withStapleState = parsed.map((item) => ({
      ...item,
      isStaple: saveAllAsStaples
    }));
    setParsedPreviewItems(withStapleState);
    if (withStapleState.length === 0) {
      toast({
        title: 'No items recognized',
        description: 'Please check your text format and try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: `Recognized ${withStapleState.length} items! ✨`,
        description: 'Review the extracted quantities and departments below.',
        variant: 'success'
      });
    }
  };

  const handleToggleAllStaples = (checked: boolean) => {
    setSaveAllAsStaples(checked);
    setParsedPreviewItems((prev) =>
      prev.map((item) => ({ ...item, isStaple: checked }))
    );
  };

  const handleUpdateParsedItem = (
    index: number,
    field: keyof ParsedGroceryItem,
    value: any
  ) => {
    setParsedPreviewItems((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      if (field === 'isStaple') {
        const allStaples = updated.every((i) => i.isStaple);
        setSaveAllAsStaples(allStaples);
      }
      return updated;
    });
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
        isStaple: saveAllAsStaples
      }
    ]);
  };

  const handleSaveAllParsedItems = async () => {
    const validItems = parsedPreviewItems.filter(
      (i) => i.name.trim().length > 0
    );
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
        // Refresh active, archived, and staples
        const res = await getGroceryItems(uid);
        if (res && typeof res === 'object') {
          setActiveItems(res.active);
          setArchivedItems(res.archived);
          setStaples(res.staples);
        }

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });

        toast({
          title: `Added ${validItems.length} items to list! ✨🛒`,
          description:
            'All items were auto-categorized into your store aisles.',
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
        setStaples(result.staples);
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
      if (data.isStaple) {
        setStaples((prev) => [
          optimisticItem,
          ...prev.filter(
            (i) => i.name.toLowerCase() !== data.name.trim().toLowerCase()
          )
        ]);
      }

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
        if (res.isStaple) {
          setStaples((prev) => [
            res,
            ...prev.filter(
              (i) =>
                i.id !== optimisticId &&
                i.name.toLowerCase() !== res.name.toLowerCase()
            )
          ]);
        }
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
        if (editingItem.archived) {
          setArchivedItems((prev) =>
            prev.map((item) => (item.id === editingItem.id ? updated : item))
          );
        } else {
          setActiveItems((prev) =>
            prev.map((item) => (item.id === editingItem.id ? updated : item))
          );
        }
        setStaples((prev) => {
          if (updated.isStaple) {
            const filtered = prev.filter((i) => i.id !== updated.id);
            return [updated, ...filtered];
          } else {
            return prev.filter((i) => i.id !== updated.id);
          }
        });
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

  const handleToggleStaple = async (item: GroceryItem) => {
    const nextStapleState = !item.isStaple;

    // Optimistic UI update
    setActiveItems((prev) =>
      prev.map((i) =>
        i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase()
          ? { ...i, isStaple: nextStapleState }
          : i
      )
    );
    setArchivedItems((prev) =>
      prev.map((i) =>
        i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase()
          ? { ...i, isStaple: nextStapleState }
          : i
      )
    );
    setStaples((prev) => {
      if (nextStapleState) {
        const updated = { ...item, isStaple: true };
        return [
          updated,
          ...prev.filter(
            (i) =>
              i.id !== item.id &&
              i.name.toLowerCase() !== item.name.toLowerCase()
          )
        ];
      } else {
        return prev.filter(
          (i) =>
            i.id !== item.id && i.name.toLowerCase() !== item.name.toLowerCase()
        );
      }
    });

    try {
      const res = await toggleGroceryItemStaple(item.id, nextStapleState);
      if (res) {
        toast({
          title: nextStapleState
            ? 'Saved to Staples ⭐'
            : 'Removed from Staples',
          description: nextStapleState
            ? `"${item.name}" is saved in your household staples.`
            : `"${item.name}" was removed from frequent staples.`,
          variant: 'success'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Could not update staple status',
        variant: 'destructive'
      });
      const refresh = await getGroceryItems(uid);
      if (refresh && typeof refresh === 'object') {
        setActiveItems(refresh.active);
        setArchivedItems(refresh.archived);
        setStaples(refresh.staples);
      }
    }
  };

  const handleToggleCart = async (item: GroceryItem) => {
    const nextState = !item.inCart;
    const currentUserName = userName || uid.split('@')[0];

    // Optimistic UI update using functional updater to avoid stale state closures
    setActiveItems((prev) => {
      const updated = prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              inCart: nextState,
              pickedByUid: nextState ? currentUserName : null
            }
          : i
      );

      // Auto-collapse completed aisle in In-Store mode when the last remaining item is collected
      if (nextState && viewMode === 'store') {
        const aisleItems = updated.filter(
          (i) => i.category.toLowerCase() === item.category.toLowerCase()
        );
        const isAisleFullyCollected =
          aisleItems.length > 0 && aisleItems.every((i) => i.inCart);
        if (isAisleFullyCollected) {
          setCollapsedAisles((prevCollapse) => ({
            ...prevCollapse,
            [item.category]: true
          }));
        }
      }

      return updated;
    });

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

  const handleRemoveFromActiveList = async (item: GroceryItem) => {
    try {
      if (item.isStaple) {
        // Optimistic: remove from active, move to archived, KEEP in staples catalog
        setActiveItems((prev) => prev.filter((i) => i.id !== item.id));
        const archivedStaple: GroceryItem = {
          ...item,
          archived: true,
          inCart: false,
          pickedByUid: null
        };
        setArchivedItems((prev) => [
          archivedStaple,
          ...prev.filter((i) => i.id !== item.id)
        ]);
        setStaples((prev) =>
          prev.map((i) => (i.id === item.id ? archivedStaple : i))
        );

        await removeActiveGroceryItem(item.id);
        toast({
          title: 'Removed from list',
          description: `"${item.name}" was removed from this week's list and remains saved in your Staples ⭐.`,
          variant: 'success'
        });
      } else {
        // Optimistic: delete non-staple item
        setActiveItems((prev) => prev.filter((i) => i.id !== item.id));
        setArchivedItems((prev) => prev.filter((i) => i.id !== item.id));

        await removeActiveGroceryItem(item.id);
        toast({
          title: 'Item removed',
          description: `"${item.name}" was deleted.`,
          variant: 'success'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error removing item',
        variant: 'destructive'
      });
      const refresh = await getGroceryItems(uid);
      if (refresh && typeof refresh === 'object') {
        setActiveItems(refresh.active);
        setArchivedItems(refresh.archived);
        setStaples(refresh.staples);
      }
    }
  };

  const handlePermanentDelete = async (id: string, name: string) => {
    try {
      setActiveItems((prev) => prev.filter((i) => i.id !== id));
      setArchivedItems((prev) => prev.filter((i) => i.id !== id));
      setStaples((prev) => prev.filter((i) => i.id !== id));

      await deleteGroceryItem(id);
      toast({
        title: 'Item deleted',
        description: `"${name}" was permanently removed.`,
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error deleting item',
        variant: 'destructive'
      });
      const refresh = await getGroceryItems(uid);
      if (refresh && typeof refresh === 'object') {
        setActiveItems(refresh.active);
        setArchivedItems(refresh.archived);
        setStaples(refresh.staples);
      }
    }
  };

  const handleRestockItem = async (item: GroceryItem) => {
    try {
      // Optimistic
      setArchivedItems((prev) => prev.filter((i) => i.id !== item.id));
      setActiveItems((prev) => {
        const exists = prev.some(
          (i) =>
            i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase()
        );
        if (exists) {
          return prev.map((i) =>
            i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase()
              ? { ...item, archived: false, inCart: false }
              : i
          );
        }
        return [{ ...item, archived: false, inCart: false }, ...prev];
      });
      setStaples((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, archived: false, inCart: false } : i
        )
      );

      const res = await restockGroceryItem(item.id);
      if (res) {
        setActiveItems((prev) => prev.map((i) => (i.id === item.id ? res : i)));
        setStaples((prev) => prev.map((i) => (i.id === item.id ? res : i)));
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

  const handleBatchRestock = async (onlyStaples?: boolean) => {
    const itemsToRestock = onlyStaples
      ? archivedItems.filter((i) => i.isStaple)
      : archivedItems;

    if (itemsToRestock.length === 0) return;

    // Optimistic UI update
    setArchivedItems((prev) =>
      onlyStaples ? prev.filter((i) => !i.isStaple) : []
    );
    setActiveItems((prev) => [
      ...itemsToRestock.map((i) => ({ ...i, archived: false, inCart: false })),
      ...prev
    ]);

    try {
      const res = await batchRestockGroceryItems(uid, { onlyStaples });
      if (res && typeof res === 'object') {
        setActiveItems(res.active);
        setArchivedItems(res.archived);
        setStaples(res.staples);
      }

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });

      toast({
        title: onlyStaples
          ? `Restocked ${itemsToRestock.length} Household Staples! ⭐`
          : `Restocked all ${itemsToRestock.length} items! 🛒`,
        description:
          'Items are now on your active list ready for planning or shopping.',
        variant: 'success'
      });

      setShowStaplesDrawer(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Restock failed',
        description: 'Could not restore items. Please try again.',
        variant: 'destructive'
      });
      const refresh = await getGroceryItems(uid);
      if (refresh && typeof refresh === 'object') {
        setActiveItems(refresh.active);
        setArchivedItems(refresh.archived);
        setStaples(refresh.staples);
      }
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

  const handleClearActiveList = async (deletePermanently: boolean) => {
    if (activeItems.length === 0) return;
    const count = activeItems.length;
    setIsClearingList(true);

    // Optimistic UI updates: active list becomes empty
    const movedToArchive = activeItems.map((i) => ({
      ...i,
      archived: true,
      inCart: false,
      pickedByUid: null
    }));

    setActiveItems([]);
    setArchivedItems((prev) => [
      ...(deletePermanently
        ? movedToArchive.filter((i) => i.isStaple)
        : movedToArchive),
      ...prev
    ]);
    // Always preserve all staples in staples state!
    setStaples((prev) =>
      prev.map((s) => ({
        ...s,
        archived: true,
        inCart: false,
        pickedByUid: null
      }))
    );

    try {
      const res = await clearActiveGroceryItems(uid, { deletePermanently });
      if (res && typeof res === 'object') {
        setActiveItems(res.active);
        setArchivedItems(res.archived);
        setStaples(res.staples);
      }

      toast({
        title: deletePermanently
          ? 'List cleared'
          : 'List cleared & archived 📦',
        description: deletePermanently
          ? `Cleared ${count} active items. Your staples remain safely saved in your catalog ⭐.`
          : `Moved ${count} items to your restock history. Your staples remain saved ⭐.`,
        variant: 'success'
      });
      setShowClearModal(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error clearing list',
        description: 'Could not clear active items. Please try again.',
        variant: 'destructive'
      });
      const refresh = await getGroceryItems(uid);
      if (refresh && typeof refresh === 'object') {
        setActiveItems(refresh.active);
        setArchivedItems(refresh.archived);
        setStaples(refresh.staples);
      }
    } finally {
      setIsClearingList(false);
    }
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
      if (res && typeof res === 'object') {
        setActiveItems(res.active);
        setArchivedItems(res.archived);
        setStaples(res.staples);
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

  // Master list of unique staples across all sources
  const allUserStaples = useMemo(() => {
    const map = new Map<string, GroceryItem>();
    staples.forEach((item) => {
      if (item.isStaple) {
        map.set(item.name.toLowerCase(), item);
      }
    });
    activeItems.forEach((item) => {
      if (item.isStaple) {
        map.set(item.name.toLowerCase(), item);
      }
    });
    archivedItems.forEach((item) => {
      if (item.isStaple && !map.has(item.name.toLowerCase())) {
        map.set(item.name.toLowerCase(), item);
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }, [staples, activeItems, archivedItems]);

  // Staples not currently in the active grocery list
  const staplesNotInActive = useMemo(() => {
    return allUserStaples.filter(
      (staple) =>
        !activeItems.some(
          (active) => active.name.toLowerCase() === staple.name.toLowerCase()
        )
    );
  }, [allUserStaples, activeItems]);

  // Filtered staples for the search bar inside the modal
  const filteredUserStaples = useMemo(() => {
    if (!staplesSearch.trim()) return allUserStaples;
    const q = staplesSearch.toLowerCase().trim();
    return allUserStaples.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.notes && i.notes.toLowerCase().includes(q))
    );
  }, [allUserStaples, staplesSearch]);

  const handleAddAllStaplesToActive = async () => {
    if (staplesNotInActive.length === 0) return;

    // Optimistic UI updates
    setActiveItems((prev) => [
      ...staplesNotInActive.map((s) => ({
        ...s,
        archived: false,
        inCart: false,
        pickedByUid: null
      })),
      ...prev
    ]);
    setArchivedItems((prev) =>
      prev.filter(
        (a) =>
          !staplesNotInActive.some(
            (s) => s.name.toLowerCase() === a.name.toLowerCase()
          )
      )
    );

    try {
      for (const staple of staplesNotInActive) {
        if (staple.archived) {
          await restockGroceryItem(staple.id);
        } else {
          await addGroceryItem(uid, {
            name: staple.name,
            category: staple.category,
            quantity: staple.quantity || '',
            notes: staple.notes || '',
            isStaple: true
          });
        }
      }

      const res = await getGroceryItems(uid);
      if (res && typeof res === 'object') {
        setActiveItems(res.active);
        setArchivedItems(res.archived);
        setStaples(res.staples);
      }

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      toast({
        title: `Restocked ${staplesNotInActive.length} Household Staples! ⭐`,
        description: 'All your essentials are back on the active list.',
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error restocking staples',
        variant: 'destructive'
      });
      const refresh = await getGroceryItems(uid);
      if (refresh && typeof refresh === 'object') {
        setActiveItems(refresh.active);
        setArchivedItems(refresh.archived);
        setStaples(refresh.staples);
      }
    }
  };

  // Filtered active items
  const displayedActiveItems = useMemo(() => {
    if (filter === 'remaining') return remainingItems;
    if (filter === 'inCart') return inCartItems;
    if (filter === 'staples') return activeItems.filter((i) => i.isStaple);
    return activeItems;
  }, [activeItems, filter, remainingItems, inCartItems]);

  // Group items by custom category / department walking order and sort alphabetically A-Z
  const groupedDepartments = useMemo(() => {
    const sortItems = (items: GroceryItem[]) => {
      return [...items].sort((a, b) => {
        // Alphabetical order A-Z within each department
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
    };

    const groups: {
      category: (typeof GROCERY_CATEGORIES)[0];
      items: GroceryItem[];
    }[] = [];

    // Map through the custom categoryOrder sequence
    categoryOrder.forEach((catName, index) => {
      const catObj = GROCERY_CATEGORIES.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      ) || {
        name: catName,
        label: `🛒 ${catName}`,
        color: '#6b7280',
        bgColor: '#f9fafb',
        borderColor: '#e5e7eb',
        textColor: '#374151',
        order: index + 1
      };

      const itemsInCat = displayedActiveItems.filter(
        (i) => i.category.toLowerCase() === catName.toLowerCase()
      );
      if (itemsInCat.length > 0) {
        groups.push({
          category: { ...catObj, order: index + 1 },
          items: sortItems(itemsInCat)
        });
      }
    });

    // Catch any uncategorized items not in categoryOrder
    const orderedLower = categoryOrder.map((c) => c.toLowerCase());
    const extraItems = displayedActiveItems.filter(
      (i) => !orderedLower.includes(i.category.toLowerCase())
    );
    if (extraItems.length > 0) {
      const otherCat = GROCERY_CATEGORIES.find((c) => c.name === 'Other') || {
        name: 'Other',
        label: '🛒 Other Essentials',
        color: '#6b7280',
        bgColor: '#f9fafb',
        borderColor: '#e5e7eb',
        textColor: '#374151',
        order: groups.length + 1
      };
      groups.push({
        category: { ...otherCat, order: groups.length + 1 },
        items: sortItems(extraItems)
      });
    }

    return groups;
  }, [displayedActiveItems, categoryOrder]);

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
    <Card className="min-h-[75vh]">
      <CardHeader className="mb-4">
        <CardTitle className="flex justify-between items-center gap-2 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <p>Groceries</p>
            {householdDetails?.inHousehold &&
            householdDetails?.userSettings?.shareGroceryList ? (
              <Badge className="bg-violet-600 hover:bg-violet-700 text-white gap-1 flex items-center rounded-none">
                👥 Household
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="gap-1 flex items-center rounded-none"
              >
                🔒 Personal
              </Badge>
            )}
            {householdDetails?.inHousehold &&
              householdDetails?.userSettings?.shareGroceryList &&
              householdDetails.household?.members && (
                <div className="flex -space-x-1.5 overflow-hidden ml-1">
                  {householdDetails.household.members.map((member: any) => (
                    <div
                      key={member.id}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-background overflow-hidden"
                      title={member.name || member.uid}
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name || 'avatar'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/25 flex items-center justify-center font-bold text-[10px]">
                          {(member.name || member.uid).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <div className="flex items-center gap-4">
            {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
          </div>
        </CardTitle>
        <CardDescription>
          Plan together, coordinate item preferences, and shop aisles
          efficiently in real time.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Explanation Banner */}
        <AnimatePresence>
          {openAction && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="mb-2">
                <ExplanationGroceries setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selector & Quick Actions Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex bg-muted p-1 border rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase font-semibold rounded-md transition-all ${
                viewMode === 'plan'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              Plan & Prepare
            </button>
            <button
              type="button"
              onClick={() => setViewMode('store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase font-semibold rounded-md transition-all ${
                viewMode === 'store'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              In-Store Mode
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
              onClick={() => {
                setStaplesModalTab('staples');
                setShowStaplesDrawer(true);
              }}
              className="gap-1.5 text-xs font-semibold h-9"
            >
              <RotateCcw className="h-3.5 w-3.5 text-primary" />
              Restock & Staples
              {(allUserStaples.length > 0 || archivedItems.length > 0) && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {allUserStaples.length > 0
                    ? allUserStaples.length
                    : archivedItems.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReorderModal(true)}
              className="gap-1.5 text-xs font-semibold h-9"
              title="Arrange supermarket walking route"
            >
              <Footprints className="h-3.5 w-3.5 text-primary" />
              Aisle Route
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
          </div>
        </div>

        {/* Live Trip Status & Progress Bar */}
        {totalItemsCount > 0 && (
          <div className="p-3 bg-muted/40 border border-border/60">
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
            <div className="w-full bg-muted h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${cartPercentage}%` }}
              />
            </div>
          </div>
        )}

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
                      {...register('name', {
                        required: 'Item name is required'
                      })}
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
              className={`px-3 py-1 font-semibold transition-colors whitespace-nowrap ${
                filter === 'inCart'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              In Cart ({inCartItems.length})
            </button>
            <button
              onClick={() => setFilter('staples')}
              className={`px-3 py-1 font-semibold transition-colors whitespace-nowrap ${
                filter === 'staples'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ⭐ Staples ({activeItems.filter((i) => i.isStaple).length})
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {viewMode === 'store' && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-2 w-2 bg-emerald-500 animate-pulse" />
                Live In-Store Mode • Tap items as you pick them
              </div>
            )}

            {activeItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearModal(true)}
                className="gap-1.5 text-xs font-semibold h-8 hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5"
                title="Clear all active items and start a fresh list"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear List
              </Button>
            )}
          </div>
        </div>

        {/* Empty State / Quick Launchpad */}
        {activeItems.length === 0 && (
          <div className="mt-4 flex flex-col gap-6">
            {/* 1. Quick-Start Banner for returning users with past trips or saved staples */}
            {archivedItems.length > 0 || allUserStaples.length > 0 ? (
              <div className="p-5 sm:p-6 border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-12 w-12 bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                      Ready for this week&apos;s grocery run?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      You have{' '}
                      {allUserStaples.length > 0 && (
                        <span>
                          <strong>
                            {allUserStaples.length} saved staples ⭐
                          </strong>
                          {archivedItems.length > 0 && ' and '}
                        </span>
                      )}
                      {archivedItems.length > 0 && (
                        <span>
                          <strong>{archivedItems.length} items</strong> from
                          past trips
                        </span>
                      )}
                      . Restock in 1 tap, then trim what you don&apos;t need.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full md:w-auto">
                  {staplesNotInActive.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddAllStaplesToActive}
                      className="text-xs font-semibold gap-1.5 border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 flex-1 md:flex-none h-9"
                    >
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      Restock Staples ({staplesNotInActive.length})
                    </Button>
                  )}

                  {archivedItems.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleBatchRestock(false)}
                      className="text-xs font-semibold gap-1.5 flex-1 md:flex-none h-9"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restock Past Items ({archivedItems.length})
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setStaplesModalTab('staples');
                      setShowStaplesDrawer(true);
                    }}
                    className="text-xs font-semibold h-9"
                    title="Browse and select individual catalog items"
                  >
                    Catalog
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border bg-muted/20 text-center flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="max-w-md">
                  <h4 className="font-bold text-base text-foreground">
                    Your grocery list is empty & ready
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add items using the quick-add bar above, paste a list from
                    WhatsApp or Notes, or pick from popular essentials below.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSmartPasteModal(true)}
                    className="text-xs font-semibold gap-1.5 border-purple-300 text-purple-700 dark:border-purple-800 dark:text-purple-300 hover:bg-purple-50"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    AI Smart Paste
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setStaplesModalTab('essentials');
                      setShowStaplesDrawer(true);
                    }}
                    className="text-xs font-semibold gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Browse Staples Catalog
                  </Button>
                </div>
              </div>
            )}

            {/* 2. Quick-Add Essentials Bar (Instant 1-click additions) */}
            <div className="p-4 sm:p-5 border bg-card/60 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h5
                    className={`${kumbh_sans.className} text-xs font-bold uppercase tracking-wider text-foreground`}
                  >
                    1-Click Add Popular Household Essentials
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSmartPasteModal(true)}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Wand2 className="h-3 w-3" />
                  Paste whole list instead
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_STAPLES.map((staple) => (
                  <Button
                    key={staple.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAddStaple(staple)}
                    className="text-xs font-medium h-8 gap-1.5 transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    <span>{staple.name}</span>
                    {staple.quantity && (
                      <span className="text-[10px] text-muted-foreground">
                        ({staple.quantity})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* In-Store Mode Live Location Radar & Sticky Quick Navigation Bar */}
        {viewMode === 'store' && (
          <div className="space-y-3">
            <PartnerLocationRadar
              activeItems={activeItems}
              currentUserName={currentUserName}
              parkedCartCategory={parkedCartCategory}
              onSetParkedCartCategory={setParkedCartCategory}
              categories={GROCERY_CATEGORIES}
            />
            <AisleQuickNav
              groupedDepartments={groupedDepartments}
              onOpenReorderModal={() => setShowReorderModal(true)}
              partnerLocations={partnerLocations}
              parkedCartCategory={parkedCartCategory}
            />
          </div>
        )}

        {/* Printable / Board Container */}
        <div ref={printRef} className="flex flex-col gap-6">
          {/* Empty state when filtering by staples and no active staples */}
          {filter === 'staples' && displayedActiveItems.length === 0 && (
            <Card className="p-8 text-center border-dashed border-2 flex flex-col items-center justify-center gap-3 bg-card/60">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Star className="h-6 w-6 fill-amber-500/20 text-amber-500" />
              </div>
              <div className="max-w-md">
                <h4 className="font-bold text-base text-foreground">
                  No Staples on your active list
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {allUserStaples.length > 0
                    ? `You have ${allUserStaples.length} saved household staples in your catalog ready to add.`
                    : 'Save frequent grocery items as staples using the star icon, or pick from popular essentials.'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
                {staplesNotInActive.length > 0 && (
                  <Button
                    size="sm"
                    onClick={handleAddAllStaplesToActive}
                    className="text-xs font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                    Restock All Staples ({staplesNotInActive.length})
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setStaplesModalTab('staples');
                    setShowStaplesDrawer(true);
                  }}
                  className="text-xs font-semibold gap-1.5 border-amber-500/40 text-amber-800 dark:text-amber-300"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Browse Staples Catalog
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFilter('all')}
                  className="text-xs text-muted-foreground"
                >
                  View All Items
                </Button>
              </div>
            </Card>
          )}
          {/* Department / Aisle Groupings */}
          {groupedDepartments.map(({ category, items }) => {
            const isAisleCollapsed = !!collapsedAisles[category.name];
            const remainingInAisle = items.filter((i) => !i.inCart).length;
            const allInCartInAisle = items.length > 0 && remainingInAisle === 0;

            const partnersInThisAisle = partnerLocations.filter(
              (p) => p.categoryName.toLowerCase() === category.name.toLowerCase()
            );
            const isCartParkedInThisAisle =
              parkedCartCategory &&
              parkedCartCategory.toLowerCase() === category.name.toLowerCase();

            return (
              <Card
                key={category.name}
                id={`aisle-${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`border transition-all scroll-mt-24 ${
                  viewMode === 'store' ? 'border-2 shadow-md' : 'shadow-sm'
                } ${allInCartInAisle && isAisleCollapsed ? 'opacity-70 bg-muted/20' : ''}`}
                style={{ borderColor: category.borderColor }}
              >
                {/* Department Header - Clickable to toggle collapse */}
                <div
                  onClick={() => toggleAisleCollapse(category.name)}
                  className="px-4 py-3 border-b flex items-center justify-between rounded-t-lg cursor-pointer select-none transition-colors hover:brightness-95 flex-wrap gap-2"
                  style={{
                    backgroundColor: category.bgColor,
                    borderColor: category.borderColor
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
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

                    {allInCartInAisle && (
                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold gap-1 py-0 px-1.5 hidden sm:flex">
                        <Check className="h-2.5 w-2.5" /> All in Cart
                      </Badge>
                    )}

                    {isCartParkedInThisAisle && (
                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold gap-1 py-0 px-2 shadow-xs">
                        <ShoppingBag className="h-3 w-3" /> Cart Parked Here
                      </Badge>
                    )}

                    {partnersInThisAisle.map((p) => (
                      <Badge
                        key={p.userName}
                        className="bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-500/40 text-[10px] font-bold gap-1 py-0 px-2 animate-pulse"
                      >
                        <span>👤 {p.userName} was here ({p.timeAgoFormatted})</span>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-medium tracking-wide uppercase"
                      style={{ color: category.textColor }}
                    >
                      Aisle {category.order}
                    </span>

                    <button
                      type="button"
                      className="p-0.5 rounded text-current hover:bg-black/5 dark:hover:bg-white/10 transition-transform"
                      title={
                        isAisleCollapsed ? 'Expand aisle' : 'Collapse aisle'
                      }
                    >
                      {isAisleCollapsed ? (
                        <ChevronDown
                          className="h-4 w-4"
                          style={{ color: category.textColor }}
                        />
                      ) : (
                        <ChevronUp
                          className="h-4 w-4"
                          style={{ color: category.textColor }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* If Collapsed, show compact summary banner */}
                {isAisleCollapsed && (
                  <div
                    onClick={() => toggleAisleCollapse(category.name)}
                    className="p-3 text-xs text-muted-foreground bg-muted/10 cursor-pointer flex items-center justify-between hover:bg-muted/20 transition-colors"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      {allInCartInAisle ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          All {items.length} items collected in cart
                        </span>
                      ) : (
                        <span>
                          {remainingInAisle} of {items.length} items remaining
                          to collect
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-0.5">
                      Tap to view aisle items{' '}
                      <ChevronDown className="h-3 w-3" />
                    </span>
                  </div>
                )}

                {/* Department Items List (when not collapsed) */}
                <AnimatePresence initial={false}>
                  {!isAisleCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-2 sm:p-4 divide-y divide-border/60">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`group flex items-center justify-between p-3 rounded-lg ${
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

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStaple(item);
                                    }}
                                    title={
                                      item.isStaple
                                        ? 'Frequent Staple ⭐ (Click to unmark)'
                                        : 'Click to save as frequent household staple'
                                    }
                                    className={`p-0.5 rounded transition-all active:scale-90 ${
                                      item.isStaple
                                        ? 'text-amber-500 hover:text-amber-600'
                                        : 'text-muted-foreground/30 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                                    }`}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        item.isStaple
                                          ? 'fill-amber-500 text-amber-500'
                                          : 'text-muted-foreground hover:text-amber-500'
                                      }`}
                                    />
                                  </button>
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
                                    title={
                                      item.isStaple
                                        ? "Remove from this week's list (keeps staple in catalog)"
                                        : 'Delete Item'
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {item.isStaple
                                        ? "Remove from this week's list?"
                                        : 'Remove from list?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {item.isStaple
                                        ? `"${item.name}" will be removed from your active grocery list, but will remain saved in your Staples catalog ⭐ for future shopping trips.`
                                        : `Are you sure you want to remove "${item.name}" from your grocery list?`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRemoveFromActiveList(item)
                                      }
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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

                <DialogFooter className="mt-4 flex flex-row items-center justify-between sm:justify-between w-full gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    onClick={() => {
                      if (editingItem) {
                        if (editingItem.archived) {
                          handlePermanentDelete(
                            editingItem.id,
                            editingItem.name
                          );
                        } else {
                          handleRemoveFromActiveList(editingItem);
                        }
                        setEditingItem(null);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 hover:text-white text-white h-9 text-xs font-semibold gap-1.5 px-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                      className="h-9 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmittingEdit}
                      className="h-9 text-xs font-semibold"
                    >
                      {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Restock & Staples Drawer / Modal */}
        <Dialog open={showStaplesDrawer} onOpenChange={setShowStaplesDrawer}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <RotateCcw className="h-5 w-5 text-primary" />
                Restock & Staples Catalog
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Quickly re-add staples, manage frequent essentials, or restock
                items from past shopping trips.
              </p>
            </DialogHeader>

            {/* Header Tabs: My Staples | Past Trip History | Essentials Library */}
            <div className="flex items-center gap-1 border-b pb-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => setStaplesModalTab('staples')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  staplesModalTab === 'staples'
                    ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>My Staples</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-bold"
                >
                  {allUserStaples.length}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setStaplesModalTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  staplesModalTab === 'history'
                    ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Trip History</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-bold"
                >
                  {archivedItems.length}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setStaplesModalTab('essentials')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  staplesModalTab === 'essentials'
                    ? 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                <span>Popular Essentials</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-bold"
                >
                  {POPULAR_STAPLES.length}
                </Badge>
              </button>
            </div>

            <div className="py-2">
              {/* TAB 1: MY HOUSEHOLD STAPLES */}
              {staplesModalTab === 'staples' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search your staples..."
                        value={staplesSearch}
                        onChange={(e) => setStaplesSearch(e.target.value)}
                        className="h-8 text-xs w-48 sm:w-64"
                      />
                      {staplesSearch && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setStaplesSearch('')}
                          className="h-8 px-2 text-xs text-muted-foreground"
                        >
                          Clear
                        </Button>
                      )}
                    </div>

                    {staplesNotInActive.length > 0 && (
                      <Button
                        size="sm"
                        onClick={handleAddAllStaplesToActive}
                        className="h-8 text-xs font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                        Restock All Staples ({staplesNotInActive.length})
                      </Button>
                    )}
                  </div>

                  {filteredUserStaples.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-lg flex flex-col items-center justify-center gap-3 bg-muted/10">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Star className="h-5 w-5 fill-amber-500/20 text-amber-500" />
                      </div>
                      <div className="max-w-sm">
                        <h5 className="font-bold text-sm text-foreground">
                          {staplesSearch
                            ? 'No matching staples found'
                            : 'No household staples saved yet'}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {staplesSearch
                            ? `No saved staples matched "${staplesSearch}".`
                            : 'Star frequent items directly on your grocery list, or pick essentials from our curated library below.'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStaplesModalTab('essentials')}
                        className="text-xs font-semibold gap-1.5 border-purple-300 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                        Browse Popular Essentials
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredUserStaples.map((staple) => {
                        const isOnActiveList = activeItems.some(
                          (i) =>
                            i.name.toLowerCase() === staple.name.toLowerCase()
                        );

                        return (
                          <div
                            key={staple.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-card border text-xs gap-2 hover:border-amber-500/40 transition-colors shadow-xs"
                          >
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStaple(staple)}
                                  title="Click to remove from Staples"
                                  className="text-amber-500 hover:text-amber-600 transition-transform active:scale-90"
                                >
                                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                                </button>
                                <span className="font-semibold text-foreground truncate">
                                  {staple.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground">
                                <span className="bg-muted px-1.5 py-0.5 rounded font-medium text-foreground">
                                  {staple.category}
                                </span>
                                {staple.quantity && (
                                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                                    {staple.quantity}
                                  </span>
                                )}
                                {staple.notes && (
                                  <span className="italic text-muted-foreground/90 truncate max-w-[120px]">
                                    {staple.notes}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {isOnActiveList ? (
                                <Badge
                                  variant="secondary"
                                  className="h-7 text-[11px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1 px-2"
                                >
                                  <Check className="h-3 w-3" />
                                  On List
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRestockItem(staple)}
                                  className="h-7 text-[11px] font-semibold gap-1 hover:bg-primary hover:text-white"
                                  title="Add to active grocery list"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add to List
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditModal(staple)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                title="Edit staple details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PAST SHOPPING TRIPS HISTORY */}
              {staplesModalTab === 'history' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h4
                      className={`${kumbh_sans.className} text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2`}
                    >
                      <Clock className="h-4 w-4 text-primary" />
                      Past Shopping Trips History ({archivedItems.length})
                    </h4>

                    {archivedItems.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {archivedItems.filter((i) => i.isStaple).length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBatchRestock(true)}
                            className="h-8 text-xs font-semibold gap-1.5 border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                          >
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            Restock Staples (
                            {archivedItems.filter((i) => i.isStaple).length})
                          </Button>
                        )}

                        <Button
                          size="sm"
                          onClick={() => handleBatchRestock(false)}
                          className="h-8 text-xs font-semibold gap-1.5"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Restock All ({archivedItems.length})
                        </Button>
                      </div>
                    )}
                  </div>

                  {archivedItems.length === 0 ? (
                    <div className="p-6 text-center border border-dashed rounded-lg text-xs text-muted-foreground">
                      No previous shopping trip history yet. Items you check off
                      and complete with &quot;Finish Trip & Archive&quot; will
                      appear here for fast re-ordering.
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
                                className="flex items-center justify-between p-2.5 rounded-lg bg-card border text-xs gap-2 hover:border-primary/40 transition-colors"
                              >
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-foreground truncate">
                                      {item.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleStaple(item)}
                                      title={
                                        item.isStaple
                                          ? 'Staple ⭐ (click to unmark)'
                                          : 'Mark as frequent staple'
                                      }
                                      className="transition-transform active:scale-90"
                                    >
                                      <Star
                                        className={`h-3 w-3 ${
                                          item.isStaple
                                            ? 'text-amber-500 fill-amber-500'
                                            : 'text-muted-foreground/40 hover:text-amber-500'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground">
                                    {item.quantity && (
                                      <span className="bg-muted px-1.5 py-0.5 rounded font-medium text-foreground">
                                        {item.quantity}
                                      </span>
                                    )}
                                    {item.notes && (
                                      <span className="italic text-muted-foreground/90 truncate max-w-[140px]">
                                        {item.notes}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openEditModal(item)}
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                    title="Edit item details"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRestockItem(item)}
                                    className="h-7 text-[11px] font-semibold gap-1 hover:bg-primary hover:text-white"
                                    title="Add back to current grocery list"
                                  >
                                    <Plus className="h-3 w-3" />
                                    Add Back
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: POPULAR HOUSEHOLD ESSENTIALS */}
              {staplesModalTab === 'essentials' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4
                      className={`${kumbh_sans.className} text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2`}
                    >
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Popular Household Essentials Library (
                      {POPULAR_STAPLES.length})
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Click any item to add it to your list with 1 tap.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {POPULAR_STAPLES.map((staple) => {
                      const isOnActive = activeItems.some(
                        (i) =>
                          i.name.toLowerCase() === staple.name.toLowerCase()
                      );
                      const isStapleSaved = allUserStaples.some(
                        (i) =>
                          i.name.toLowerCase() === staple.name.toLowerCase()
                      );

                      return (
                        <div
                          key={staple.name}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-card border text-xs gap-2 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-foreground truncate">
                                {staple.name}
                              </span>
                              {isStapleSaved && (
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground">
                              <span className="bg-muted px-1.5 py-0.5 rounded font-medium text-foreground">
                                {staple.category}
                              </span>
                              {staple.quantity && (
                                <span>{staple.quantity}</span>
                              )}
                              {staple.notes && (
                                <span className="italic text-muted-foreground/80 truncate max-w-[120px]">
                                  {staple.notes}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isOnActive ? (
                              <Badge
                                variant="secondary"
                                className="h-7 text-[11px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1 px-2"
                              >
                                <Check className="h-3 w-3" />
                                On List
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickAddStaple(staple)}
                                className="h-7 text-[11px] font-semibold gap-1 hover:bg-primary hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                                Add to List
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-2 pt-2 border-t">
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
        <Dialog
          open={showSmartPasteModal}
          onOpenChange={setShowSmartPasteModal}
        >
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Wand2 className="h-5 w-5 text-purple-600" />
                AI Smart Paste & Bulk Importer
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Paste a messy grocery list from WhatsApp, notes, or recipes. Our
                AI parses items, quantities, brands, and automatically routes
                them to the correct store departments.
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
                    💡 Supports quantities at the start (<code>6 Banana</code>)
                    or end (<code>Orange 12</code>), notes in parentheses, and
                    bullet points.
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
                    <h4
                      className={`${kumbh_sans.className} text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2`}
                    >
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

                  {/* Bulk Household Staple Banner */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                    <label className="flex items-center gap-2 font-semibold text-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveAllAsStaples}
                        onChange={(e) =>
                          handleToggleAllStaples(e.target.checked)
                        }
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                      />
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                      Save all items as frequent household staples
                    </label>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      Will appear in your 1-Click Restock catalog
                    </span>
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
                              handleUpdateParsedItem(
                                idx,
                                'name',
                                e.target.value
                              )
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
                              handleUpdateParsedItem(
                                idx,
                                'quantity',
                                e.target.value
                              )
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
                              handleUpdateParsedItem(
                                idx,
                                'notes',
                                e.target.value
                              )
                            }
                            placeholder="Brand / Note"
                            className="h-8 text-xs"
                          />
                        </div>

                        {/* Actions: Staple Star & Delete button (col 1) */}
                        <div className="sm:col-span-1 flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateParsedItem(
                                idx,
                                'isStaple',
                                !item.isStaple
                              )
                            }
                            title={
                              item.isStaple
                                ? 'Saved as Household Staple'
                                : 'Mark as Household Staple'
                            }
                            className={`h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors ${
                              item.isStaple
                                ? 'text-amber-500'
                                : 'text-muted-foreground/50 hover:text-amber-500'
                            }`}
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                item.isStaple ? 'fill-amber-500' : ''
                              }`}
                            />
                          </button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteParsedItem(idx)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Delete Row"
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

        {/* Clear List Confirmation Modal */}
        <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    Clear Active Grocery List?
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You have {activeItems.length}{' '}
                    {activeItems.length === 1 ? 'item' : 'items'} on your
                    current list.
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="py-3 text-xs text-muted-foreground flex flex-col gap-2.5">
              <p>Choose how you would like to clear your active list:</p>

              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-lg border bg-muted/30 flex items-start gap-2.5">
                  <RotateCcw className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">
                      Archive to History (Recommended)
                    </span>
                    <span className="text-[11px]">
                      Clears your active list, but saves items in your{' '}
                      <strong>Restock History</strong> so you can restore them
                      anytime. Household staples stay saved in your catalog.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-destructive/5 border-destructive/20 flex items-start gap-2.5">
                  <Trash2 className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-destructive">
                      Delete Active Items
                    </span>
                    <span className="text-[11px]">
                      Deletes active one-off items from your account. All saved
                      household staples remain safely in your Staples catalog
                      ⭐.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearModal(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearActiveList(true)}
                  disabled={isClearingList}
                  className="h-9 text-xs font-semibold text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Delete Permanently
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleClearActiveList(false)}
                  disabled={isClearingList}
                  className="h-9 text-xs font-semibold gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Archive to History
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Aisle Reorder Modal */}
        <AisleReorderModal
          open={showReorderModal}
          onOpenChange={setShowReorderModal}
          uid={uid}
          categoryOrder={categoryOrder}
          activeItems={activeItems}
          onOrderSaved={(newOrder) => setCategoryOrder(newOrder)}
        />
      </CardContent>
    </Card>
  );
}

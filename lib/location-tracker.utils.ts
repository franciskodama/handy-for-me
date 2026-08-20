import { GroceryItem } from '@/lib/types';
import { GROCERY_CATEGORIES, GroceryCategory } from '@/lib/groceries.utils';

export interface PartnerLocationInfo {
  userName: string;
  categoryName: string;
  categoryLabel: string;
  categoryColor: string;
  lastItemName: string;
  updatedAt: Date;
  timeAgoFormatted: string;
  isRecent: boolean; // active in last 15 minutes
}

export function formatTimeAgo(dateInput: Date | string | undefined | null): string {
  if (!dateInput) return 'Recently';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Recently';

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 30) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Extracts the most recent location per partner based on items checked into the cart.
 */
export function getPartnerLocationsFromItems(
  items: GroceryItem[],
  currentUserName?: string
): PartnerLocationInfo[] {
  if (!items || items.length === 0) return [];

  // Filter items in cart that have a pickedByUid
  const cartItems = items.filter((item) => item.inCart && item.pickedByUid);

  // Group by pickedByUid
  const userLatestMap = new Map<string, GroceryItem>();

  for (const item of cartItems) {
    const user = item.pickedByUid?.trim();
    if (!user) continue;

    const existing = userLatestMap.get(user);
    if (!existing) {
      userLatestMap.set(user, item);
    } else {
      const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
      const itemTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
      if (itemTime >= existingTime) {
        userLatestMap.set(user, item);
      }
    }
  }

  const results: PartnerLocationInfo[] = [];

  userLatestMap.forEach((item, user) => {
    const categoryObj = GROCERY_CATEGORIES.find(
      (c) => c.name.toLowerCase() === item.category.toLowerCase()
    ) || {
      name: item.category,
      label: `🛒 ${item.category}`,
      color: '#6b7280'
    };

    const itemDate = item.updatedAt ? new Date(item.updatedAt) : new Date();
    const diffMinutes = (Date.now() - itemDate.getTime()) / (1000 * 60);

    results.push({
      userName: user,
      categoryName: item.category,
      categoryLabel: categoryObj.label,
      categoryColor: categoryObj.color,
      lastItemName: item.name,
      updatedAt: itemDate,
      timeAgoFormatted: formatTimeAgo(itemDate),
      isRecent: diffMinutes <= 15
    });
  });

  // Sort so current user is shown or most recent first
  return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

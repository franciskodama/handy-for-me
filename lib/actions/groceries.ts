'use server';

import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { GroceryItem } from '@/lib/types';
import { inferCategory } from '@/lib/groceries.utils';

// Helper to get authenticated user details
async function getAuthenticatedUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { uid: email } });
}

export async function getGroceryItems(uid: string): Promise<{
  active: GroceryItem[];
  archived: GroceryItem[];
  staples: GroceryItem[];
} | false> {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return false;
    }

    const isShared = user.householdId && user.shareGroceryList;

    const items = await prisma.groceryItem.findMany({
      where: isShared
        ? { householdId: user.householdId }
        : { uid, householdId: null },
      orderBy: { createdAt: 'desc' }
    });

    const active = items.filter((item) => !item.archived) as unknown as GroceryItem[];
    const archived = items.filter((item) => item.archived) as unknown as GroceryItem[];
    const staples = items.filter((item) => item.isStaple) as unknown as GroceryItem[];

    return { active, archived, staples };
  } catch (error) {
    console.error('Error fetching grocery items:', error);
    return false;
  }
}

export async function addGroceryItem(
  uid: string,
  data: {
    name: string;
    category?: string;
    quantity?: string;
    notes?: string;
    isStaple?: boolean;
  }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      console.warn('Unauthorized add grocery item');
      return false;
    }

    const cleanName = data.name.trim();
    if (!cleanName) return false;

    const isShared = user.householdId && user.shareGroceryList;
    const category = data.category || inferCategory(cleanName);

    // Check if an unarchived item with this exact name already exists in active list
    const existing = await prisma.groceryItem.findFirst({
      where: {
        ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
        name: { equals: cleanName, mode: 'insensitive' },
        archived: false
      }
    });

    if (existing) {
      // If it exists in active list, just ensure it's un-carted or update quantity if provided
      const updated = await prisma.groceryItem.update({
        where: { id: existing.id },
        data: {
          quantity: data.quantity || existing.quantity,
          notes: data.notes || existing.notes,
          isStaple: data.isStaple ?? existing.isStaple,
          inCart: false
        }
      });
      return updated as unknown as GroceryItem;
    }

    // Check if it exists in archived list -> restore it
    const existingArchived = await prisma.groceryItem.findFirst({
      where: {
        ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
        name: { equals: cleanName, mode: 'insensitive' },
        archived: true
      }
    });

    if (existingArchived) {
      const restored = await prisma.groceryItem.update({
        where: { id: existingArchived.id },
        data: {
          archived: false,
          inCart: false,
          category: data.category || existingArchived.category,
          quantity: data.quantity || existingArchived.quantity,
          notes: data.notes || existingArchived.notes,
          isStaple: data.isStaple ?? existingArchived.isStaple,
          pickedByUid: null
        }
      });
      return restored as unknown as GroceryItem;
    }

    const newItem = await prisma.groceryItem.create({
      data: {
        id: uuidv4(),
        uid,
        householdId: isShared ? user.householdId : null,
        name: cleanName,
        category,
        quantity: data.quantity?.trim() || null,
        notes: data.notes?.trim() || null,
        inCart: false,
        isStaple: data.isStaple || false,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return newItem as unknown as GroceryItem;
  } catch (error) {
    console.error('Error adding grocery item:', error);
    return false;
  }
}

export async function toggleGroceryItemInCart(
  id: string,
  inCart: boolean
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.groceryItem.findUnique({
      where: { id }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      (item.householdId && user.householdId === item.householdId && user.shareGroceryList);

    if (!isAuthorized) {
      console.warn('Unauthorized grocery item cart toggle');
      return false;
    }

    const userName = user.name?.split(' ')[0] || user.uid.split('@')[0];

    const updated = await prisma.groceryItem.update({
      where: { id },
      data: {
        inCart,
        pickedByUid: inCart ? userName : null
      }
    });

    return updated as unknown as GroceryItem;
  } catch (error) {
    console.error('Error toggling inCart status:', error);
    return false;
  }
}

export async function updateGroceryItem(
  id: string,
  data: {
    name?: string;
    category?: string;
    quantity?: string | null;
    notes?: string | null;
    isStaple?: boolean;
  }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.groceryItem.findUnique({
      where: { id }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      (item.householdId && user.householdId === item.householdId && user.shareGroceryList);

    if (!isAuthorized) {
      return false;
    }

    const updated = await prisma.groceryItem.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name.trim() : undefined,
        category: data.category !== undefined ? data.category : undefined,
        quantity: data.quantity !== undefined ? data.quantity : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        isStaple: data.isStaple !== undefined ? data.isStaple : undefined
      }
    });

    return updated as unknown as GroceryItem;
  } catch (error) {
    console.error('Error updating grocery item:', error);
    return false;
  }
}

export async function deleteGroceryItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.groceryItem.findUnique({
      where: { id }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      (item.householdId && user.householdId === item.householdId && user.shareGroceryList);

    if (!isAuthorized) {
      return false;
    }

    await prisma.groceryItem.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error('Error deleting grocery item:', error);
    return false;
  }
}

export async function restockGroceryItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.groceryItem.findUnique({
      where: { id }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      (item.householdId && user.householdId === item.householdId && user.shareGroceryList);

    if (!isAuthorized) {
      return false;
    }

    const restored = await prisma.groceryItem.update({
      where: { id },
      data: {
        archived: false,
        inCart: false,
        pickedByUid: null
      }
    });

    return restored as unknown as GroceryItem;
  } catch (error) {
    console.error('Error restocking grocery item:', error);
    return false;
  }
}

export async function batchRestockGroceryItems(
  uid: string,
  options?: { onlyStaples?: boolean }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) return false;

    const isShared = user.householdId && user.shareGroceryList;

    await prisma.groceryItem.updateMany({
      where: {
        ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
        archived: true,
        ...(options?.onlyStaples ? { isStaple: true } : {})
      },
      data: {
        archived: false,
        inCart: false,
        pickedByUid: null
      }
    });

    const active = await prisma.groceryItem.findMany({
      where: {
        ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
        archived: false
      },
      orderBy: { createdAt: 'desc' }
    });

    const archived = await prisma.groceryItem.findMany({
      where: {
        ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
        archived: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    return {
      active: active as unknown as GroceryItem[],
      archived: archived as unknown as GroceryItem[]
    };
  } catch (error) {
    console.error('Error batch restocking grocery items:', error);
    return false;
  }
}

export async function finishShoppingTrip(uid: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) return false;

    const isShared = user.householdId && user.shareGroceryList;

    // Archive all items that were placed in cart
    await prisma.groceryItem.updateMany({
      where: {
        ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
        inCart: true,
        archived: false
      },
      data: {
        archived: true,
        inCart: false,
        pickedByUid: null
      }
    });

    return true;
  } catch (error) {
    console.error('Error completing shopping trip:', error);
    return false;
  }
}

export async function addMultipleStaples(
  uid: string,
  items: Array<{ name: string; category?: string; quantity?: string; notes?: string }>
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) return false;

    const isShared = user.householdId && user.shareGroceryList;

    for (const item of items) {
      const cleanName = item.name.trim();
      if (!cleanName) continue;

      const category = item.category || inferCategory(cleanName);

      const existing = await prisma.groceryItem.findFirst({
        where: {
          ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
          name: { equals: cleanName, mode: 'insensitive' }
        }
      });

      if (existing) {
        await prisma.groceryItem.update({
          where: { id: existing.id },
          data: {
            archived: false,
            inCart: false,
            category: item.category || existing.category,
            quantity: item.quantity || existing.quantity,
            notes: item.notes || existing.notes,
            pickedByUid: null
          }
        });
      } else {
        await prisma.groceryItem.create({
          data: {
            id: uuidv4(),
            uid,
            householdId: isShared ? user.householdId : null,
            name: cleanName,
            category,
            quantity: item.quantity?.trim() || null,
            notes: item.notes?.trim() || null,
            inCart: false,
            isStaple: true,
            archived: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error adding multiple staples:', error);
    return false;
  }
}

export async function batchAddGroceryItems(
  uid: string,
  items: Array<{
    name: string;
    category?: string;
    quantity?: string;
    notes?: string;
    isStaple?: boolean;
  }>
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) return false;

    const isShared = user.householdId && user.shareGroceryList;
    const addedItems = [];

    for (const item of items) {
      const cleanName = item.name.trim();
      if (!cleanName) continue;

      const category = item.category || inferCategory(cleanName);

      const existing = await prisma.groceryItem.findFirst({
        where: {
          ...(isShared ? { householdId: user.householdId } : { uid, householdId: null }),
          name: { equals: cleanName, mode: 'insensitive' }
        }
      });

      if (existing) {
        const updated = await prisma.groceryItem.update({
          where: { id: existing.id },
          data: {
            archived: false,
            inCart: false,
            category: item.category || existing.category,
            quantity: item.quantity !== undefined ? item.quantity : existing.quantity,
            notes: item.notes !== undefined ? item.notes : existing.notes,
            isStaple: item.isStaple !== undefined ? item.isStaple : existing.isStaple,
            pickedByUid: null
          }
        });
        addedItems.push(updated);
      } else {
        const created = await prisma.groceryItem.create({
          data: {
            id: uuidv4(),
            uid,
            householdId: isShared ? user.householdId : null,
            name: cleanName,
            category,
            quantity: item.quantity?.trim() || null,
            notes: item.notes?.trim() || null,
            inCart: false,
            isStaple: item.isStaple || false,
            archived: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        addedItems.push(created);
      }
    }

    return addedItems;
  } catch (error) {
    console.error('Error batch adding grocery items:', error);
    return false;
  }
}


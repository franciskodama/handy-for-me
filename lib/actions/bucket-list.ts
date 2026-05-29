'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Helper to get authenticated user details
async function getAuthenticatedUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { uid: email } });
}

export async function addBucketListItem(
  uid: string,
  item: string,
  category: string
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      console.warn('Unauthorized attempt to add bucket list item');
      return false;
    }

    const isShared = user.householdId && user.shareBucketList;

    const newItem = await prisma.bucketListItem.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        item,
        category,
        done: false,
        householdId: isShared ? user.householdId : null
      }
    });
    return newItem;
  } catch (error) {
    console.error('Error adding Bucket List item:', error);
    return false;
  }
}

export async function getBucketListItems(uid: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return false;
    }

    const isShared = user.householdId && user.shareBucketList;

    const items = await prisma.bucketListItem.findMany({
      where: isShared
        ? { householdId: user.householdId }
        : { uid, householdId: null }
    });
    return items;
  } catch (error) {
    console.error('Error getting Bucket List Array:', error);
    return false;
  }
}

export async function deleteBucketListItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.bucketListItem.findUnique({
      where: { id }
    });

    if (!item) return false;

    // Check authorization: must own item or share household
    const isAuthorized =
      item.uid === user.uid ||
      (item.householdId && user.householdId === item.householdId && user.shareBucketList);

    if (!isAuthorized) {
      console.warn('Unauthorized bucket list delete attempt');
      return false;
    }

    await prisma.bucketListItem.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function setBucketListItemDone(id: string, selection: boolean) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return null;

    const item = await prisma.bucketListItem.findUnique({
      where: { id }
    });

    if (!item) return null;

    // Check authorization: must own item or share household
    const isAuthorized =
      item.uid === user.uid ||
      (item.householdId && user.householdId === item.householdId && user.shareBucketList);

    if (!isAuthorized) {
      console.warn('Unauthorized bucket list update attempt');
      return null;
    }

    const updatedItem = await prisma.bucketListItem.update({
      where: { id },
      data: {
        done: selection
      }
    });
    return updatedItem;
  } catch (error) {
    console.error('Error setting check to the item:', error);
    return null;
  }
}

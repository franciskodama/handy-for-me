'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';

export async function addBucketListItem(
  uid: string,
  item: string,
  category: string
) {
  try {
    const newItem = await prisma.bucketListItem.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        item,
        category,
        done: false
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
    const items = await prisma.bucketListItem.findMany({
      where: {
        uid
      }
    });
    return items;
  } catch (error) {
    console.error('Error getting Bucket List Array:', error);
    return false;
  }
}

export async function deleteBucketListItem(id: string) {
  try {
    await prisma.bucketListItem.delete({
      where: {
        id
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function setBucketListItemDone(id: string, selection: boolean) {
  try {
    const check = await prisma.bucketListItem.update({
      where: {
        id
      },
      data: {
        done: selection
      }
    });
    return check;
  } catch (error) {
    console.error('Error setting check to the item:', error);
    return null;
  }
}

'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';

export async function addVisualBoardItem(
  uid: string,
  item: string,
  url: string
) {
  try {
    const newItem = await prisma.visualBoardItem.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        item: item || '',
        url,
        done: false
      }
    });

    return newItem;
  } catch (error) {
    console.error('Error adding Visual Board item:', error);
    return false;
  }
}

export async function getVisualBoardItems(uid: string) {
  try {
    const items = await prisma.visualBoardItem.findMany({
      where: {
        uid
      }
    });

    return items;
  } catch (error) {
    console.error('Error getting Visual Board Items:', error);
    return false;
  }
}

export async function deleteVisualBoardItem(id: string) {
  try {
    await prisma.visualBoardItem.delete({
      where: {
        id
      }
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function setVisualBoardItemDone(id: string, selection: boolean) {
  try {
    const check = await prisma.visualBoardItem.update({
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

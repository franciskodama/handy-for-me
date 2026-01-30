'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';
import { DecisionHelperItem, DecisionHelperList } from '@/lib/types';

export async function addDecisionHelperList(uid: string, list: string) {
  try {
    const newList = await prisma.decisionHelperList.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        list
      },
      include: {
        items: true
      }
    });

    return newList;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDecisionHelperLists(
  uid: string
): Promise<DecisionHelperList[] | { error: string }> {
  try {
    const data = await prisma.decisionHelperList.findMany({
      where: { uid },
      include: { items: true }
    });

    return data;
  } catch (error) {
    console.error('Error retrieving lists:', error);
    return { error: 'Failed to retrieve lists.' };
  }
}

export async function deleteDecisionHelperList(id: string) {
  try {
    await prisma.decisionHelperList.delete({
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

export async function addDecisionHelperItem(
  uid: string,
  listId: string,
  item: string
): Promise<DecisionHelperItem | false> {
  try {
    const newItem = await prisma.decisionHelperItem.create({
      data: {
        id: v4(),
        uid,
        createdAt: new Date(),
        listId,
        item,
        selected: true
      }
    });

    return newItem;
  } catch (error) {
    console.error('Error adding item:', error);
    return false;
  }
}

export async function getAllDecisionHelperItems(uid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return { error: 'User not found.' };
    }
    const data = await prisma.decisionHelperItem.findMany({
      where: {
        uid
      }
    });

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteDecisionHelperItem(id: string) {
  try {
    await prisma.decisionHelperItem.delete({
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

export async function selectionDecisionHelperItem(id: string) {
  try {
    const item = await prisma.decisionHelperItem.findUnique({ where: { id } });

    if (!item) {
      return false;
    }

    await prisma.decisionHelperItem.update({
      where: {
        id
      },
      data: {
        selected: !item.selected
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

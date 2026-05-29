'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';
import { DecisionHelperItem, DecisionHelperList } from '@/lib/types';
import { auth } from '@/lib/auth';

// Helper to get authenticated user uid and details
async function getAuthenticatedUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { uid: email } });
}

export async function addDecisionHelperList(uid: string, list: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      console.warn('Unauthorized attempt to add list');
      return false;
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const newList = await prisma.decisionHelperList.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        list,
        householdId: isShared ? user.householdId : null
      },
      include: {
        items: true
      }
    });

    return newList;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getDecisionHelperLists(
  uid: string
): Promise<DecisionHelperList[] | { error: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return { error: 'Unauthorized' };
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const data = await prisma.decisionHelperList.findMany({
      where: isShared
        ? { householdId: user.householdId }
        : { uid, householdId: null },
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
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const list = await prisma.decisionHelperList.findUnique({
      where: { id }
    });

    if (!list) return false;

    // Must be list owner or in same household with sharing active
    const isAuthorized =
      list.uid === user.uid ||
      (list.householdId && user.householdId === list.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized delete list attempt');
      return false;
    }

    // Delete associated items first to prevent constraint violations
    await prisma.decisionHelperItem.deleteMany({
      where: { listId: id }
    });

    await prisma.decisionHelperList.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addDecisionHelperItem(
  uid: string,
  listId: string,
  item: string
): Promise<DecisionHelperItem | false> {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return false;
    }

    const list = await prisma.decisionHelperList.findUnique({
      where: { id: listId }
    });

    if (!list) return false;

    // User must either own the list or belong to the list's household (if shared)
    const isAuthorized =
      list.uid === user.uid ||
      (list.householdId && user.householdId === list.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      return false;
    }

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
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return [];
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const data = await prisma.decisionHelperItem.findMany({
      where: {
        list: isShared
          ? { householdId: user.householdId }
          : { uid, householdId: null }
      }
    });

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteDecisionHelperItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.decisionHelperItem.findUnique({
      where: { id },
      include: { list: true }
    });

    if (!item) return false;

    // Check authorization on the parent list
    const isAuthorized =
      item.uid === user.uid ||
      item.list.uid === user.uid ||
      (item.list.householdId && user.householdId === item.list.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized delete item attempt');
      return false;
    }

    await prisma.decisionHelperItem.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function selectionDecisionHelperItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.decisionHelperItem.findUnique({
      where: { id },
      include: { list: true }
    });

    if (!item) {
      return false;
    }

    // Check authorization
    const isAuthorized =
      item.uid === user.uid ||
      item.list.uid === user.uid ||
      (item.list.householdId && user.householdId === item.list.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized item selection attempt');
      return false;
    }

    await prisma.decisionHelperItem.update({
      where: { id },
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

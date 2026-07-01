'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';
import { DecisionHelperItem, DecisionHelperList, DecisionHelperSubject, DecisionHelperProsConsItem } from '@/lib/types';
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

export async function addDecisionHelperSubject(uid: string, subject: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      console.warn('Unauthorized attempt to add subject');
      return false;
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const newSubject = await prisma.decisionHelperSubject.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        subject,
        householdId: isShared ? user.householdId : null
      },
      include: {
        items: true
      }
    });

    return newSubject;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getDecisionHelperSubjects(
  uid: string
): Promise<DecisionHelperSubject[] | { error: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return { error: 'Unauthorized' };
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const data = await prisma.decisionHelperSubject.findMany({
      where: isShared
        ? { householdId: user.householdId }
        : { uid, householdId: null },
      include: { items: true },
      orderBy: { createdAt: 'asc' }
    });

    return data as DecisionHelperSubject[];
  } catch (error) {
    console.error('Error retrieving subjects:', error);
    return { error: 'Failed to retrieve subjects.' };
  }
}

export async function deleteDecisionHelperSubject(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const subject = await prisma.decisionHelperSubject.findUnique({
      where: { id }
    });

    if (!subject) return false;

    const isAuthorized =
      subject.uid === user.uid ||
      (subject.householdId && user.householdId === subject.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized delete subject attempt');
      return false;
    }

    await prisma.decisionHelperProsConsItem.deleteMany({
      where: { subjectId: id }
    });

    await prisma.decisionHelperSubject.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addDecisionHelperProsConsItem(
  uid: string,
  subjectId: string,
  content: string,
  isPro: boolean,
  weight: number
): Promise<DecisionHelperProsConsItem | false> {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return false;
    }

    const subject = await prisma.decisionHelperSubject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) return false;

    const isAuthorized =
      subject.uid === user.uid ||
      (subject.householdId && user.householdId === subject.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      return false;
    }

    const newItem = await prisma.decisionHelperProsConsItem.create({
      data: {
        id: v4(),
        uid,
        createdAt: new Date(),
        subjectId,
        content,
        isPro,
        weight
      }
    });

    return newItem;
  } catch (error) {
    console.error('Error adding pros/cons item:', error);
    return false;
  }
}

export async function getAllDecisionHelperProsConsItems(uid: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return [];
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const data = await prisma.decisionHelperProsConsItem.findMany({
      where: {
        subject: isShared
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

export async function deleteDecisionHelperProsConsItem(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.decisionHelperProsConsItem.findUnique({
      where: { id },
      include: { subject: true }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      item.subject.uid === user.uid ||
      (item.subject.householdId && user.householdId === item.subject.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized delete pros/cons item attempt');
      return false;
    }

    await prisma.decisionHelperProsConsItem.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function toggleDecisionHelperProsConsItemType(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.decisionHelperProsConsItem.findUnique({
      where: { id },
      include: { subject: true }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      item.subject.uid === user.uid ||
      (item.subject.householdId && user.householdId === item.subject.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized toggle pros/cons item type attempt');
      return false;
    }

    await prisma.decisionHelperProsConsItem.update({
      where: { id },
      data: {
        isPro: !item.isPro
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateDecisionHelperProsConsItemWeight(id: string, weight: number) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return false;

    const item = await prisma.decisionHelperProsConsItem.findUnique({
      where: { id },
      include: { subject: true }
    });

    if (!item) return false;

    const isAuthorized =
      item.uid === user.uid ||
      item.subject.uid === user.uid ||
      (item.subject.householdId && user.householdId === item.subject.householdId && user.shareDecisionHelper);

    if (!isAuthorized) {
      console.warn('Unauthorized update pros/cons item weight attempt');
      return false;
    }

    await prisma.decisionHelperProsConsItem.update({
      where: { id },
      data: {
        weight: weight
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDecisionHelperData(uid: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return { error: 'Unauthorized' };
    }

    const isShared = user.householdId && user.shareDecisionHelper;

    const [lists, items, subjects, prosConsItems] = await Promise.all([
      prisma.decisionHelperList.findMany({
        where: isShared
          ? { householdId: user.householdId }
          : { uid, householdId: null },
        include: { items: true }
      }),
      prisma.decisionHelperItem.findMany({
        where: {
          list: isShared
            ? { householdId: user.householdId }
            : { uid, householdId: null }
        }
      }),
      prisma.decisionHelperSubject.findMany({
        where: isShared
          ? { householdId: user.householdId }
          : { uid, householdId: null },
        include: { items: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.decisionHelperProsConsItem.findMany({
        where: {
          subject: isShared
            ? { householdId: user.householdId }
            : { uid, householdId: null }
        }
      })
    ]);

    return {
      lists,
      items,
      subjects,
      prosConsItems
    };
  } catch (error) {
    console.error('Error fetching decision helper data:', error);
    return { error: 'Failed to fetch decision helper data.' };
  }
}


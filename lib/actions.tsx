'use server';

import { v4 } from 'uuid';
import { prisma } from './prisma';
import { AffirmationProps, SpinItem, SpinList } from './types';

export async function addUser(uid: string, name: string, avatar: string) {
  try {
    const user = await prisma.user.upsert({
      where: { uid },
      update: {
        name,
        avatar
      },
      create: {
        id: v4(),
        uid,
        name,
        avatar,
        createdAt: new Date()
      }
    });
    return user;
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
}

export async function addSpinList(uid: string, name: string) {
  try {
    const list = await prisma.spinList.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        name
      },
      include: {
        items: true
      }
    });
    return list;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getSpinLists(
  uid: string
): Promise<SpinList[] | { error: string }> {
  try {
    const data = await prisma.spinList.findMany({
      where: { uid },
      include: { items: true }
    });
    return data;
  } catch (error) {
    console.error('Error retrieving spin lists:', error);
    return { error: 'Failed to retrieve spin lists.' };
  }
}

export async function deleteSpinList(id: string) {
  try {
    await prisma.spinList.delete({
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

export async function addSpinItem(
  uid: string,
  listId: string,
  name: string
): Promise<SpinItem | false> {
  try {
    const item = await prisma.spinItem.create({
      data: {
        id: v4(),
        uid,
        createdAt: new Date(),
        listId,
        name,
        selected: true
      }
    });
    return item;
  } catch (error) {
    console.error('Error adding spin item:', error);
    return false;
  }
}

export async function getAllSpinItems(uid: string) {
  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return { error: 'User not found.' };
    }
    const data = await prisma.spinItem.findMany({
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

export async function deleteSpinItem(id: string) {
  try {
    await prisma.spinItem.delete({
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

export async function selectionSpinItem(id: string) {
  try {
    const item = await prisma.spinItem.findUnique({ where: { id } });

    if (!item) {
      return false;
    }

    await prisma.spinItem.update({
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

export async function addAffirmation(uid: string, name: string, url: string) {
  try {
    const item = await prisma.affirmation.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        name: name || '',
        url
      }
    });
    return item;
  } catch (error) {
    console.error('Error adding Affirmation item:', error);
    return false;
  }
}

export async function getAffirmations(uid: string) {
  try {
    const item = await prisma.affirmation.findMany({
      where: {
        uid
      }
    });
    return item;
  } catch (error) {
    console.error('Error getting Affirmations Array:', error);
    return false;
  }
}

export async function deleteAffirmations(id: string) {
  try {
    await prisma.affirmation.delete({
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

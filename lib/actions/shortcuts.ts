'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';
import { AddShortcutParams } from '@/lib/types';
import { shortcut_color_enum } from '@prisma/client';

export const getShortcutsCategories = async (uid: string) => {
  try {
    const shortcutsCategories = await prisma.shortcutCategory.findMany({
      where: {
        uid
      }
    });
    return shortcutsCategories;
  } catch (error) {
    return { error };
  }
};

export async function addShortcutCategory({
  uid,
  category,
  colorUppperCase
}: {
  uid: string;
  category: string;
  colorUppperCase: shortcut_color_enum;
}) {
  try {
    await prisma.shortcutCategory.create({
      data: {
        uid,
        id: v4(),
        createdAt: new Date(),
        category,
        color: colorUppperCase
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteShortcutCategory(id: string) {
  try {
    await prisma.shortcutCategory.delete({
      where: {
        id
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    throw new Error('🚨 Failed to delete Shortcut');
  }
}

export async function updateShortcutCategory({
  id,
  uid,
  category,
  colorUppperCase
}: {
  id: string;
  uid: string;
  category: string;
  colorUppperCase: shortcut_color_enum;
}) {
  try {
    await prisma.shortcutCategory.update({
      where: {
        id
      },
      data: {
        uid,
        category,
        color: colorUppperCase
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getShortcuts = async (uid: string) => {
  try {
    const shortcuts = await prisma.shortcut.findMany({
      where: {
        uid
      },
      include: {
        category: true
      }
    });
    return shortcuts;
  } catch (error) {
    return false;
  }
};

export async function addShortcut(formData: AddShortcutParams) {
  const { uid, shortcut, url, description, categoryId } = formData;

  try {
    await prisma.shortcut.create({
      data: {
        uid,
        id: v4(),
        createdAt: new Date(),
        shortcut,
        url,
        description,
        categoryId
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteShortcut(id: string) {
  try {
    await prisma.shortcut.delete({
      where: {
        id
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    throw new Error('🚨 Failed to delete Shortcut');
  }
}

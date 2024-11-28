'use server';

import { v4 } from 'uuid';
import { prisma } from './prisma';
import {
  AddShortcutParams,
  DecisionHelperItem,
  DecisionHelperList,
  weekDays
} from './types';
import { shortcut_color_enum } from '@prisma/client';
import { saltAndHashPassword } from './passwords';

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

export async function createUser({
  email,
  password,
  name
}: {
  email: string;
  password: string;
  name: string;
}) {
  const hashedPassword = await saltAndHashPassword(password);
  const user = await prisma.user.create({
    data: {
      uid: email,
      name,
      hashedPassword
    }
  });

  return user;
}

export async function getUser(uid: string, hashedPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid }
    });

    return user;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
}

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
    console.log(error);
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

// export async function updateShortcut(formData: Shortcut) {
//   const { uid, name, url, description, categoryId } = formData;

//   try {
//     await prisma.shortcut.update({
//       where: {
//         id
//       },
//       data: {
//         uid,
//         id: v4(),
//         createdAt: new Date(),
//         name,
//         url,
//         description,
//         categoryId
//       }
//     });
//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// }

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

export async function addWeeklyWin(
  uid: string,
  goal: string,
  type: string,
  weekDays: weekDays
) {
  try {
    const newItem = await prisma.weeklyWin.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        goal,
        type,
        done: false,
        weekDays: {
          create: {
            monday: weekDays.monday,
            tuesday: weekDays.tuesday,
            wednesday: weekDays.wednesday,
            thursday: weekDays.thursday,
            friday: weekDays.friday,
            saturday: weekDays.saturday,
            sunday: weekDays.sunday
          }
        }
      }
    });
    return newItem;
  } catch (error) {
    console.error('Error adding Weekly Wins item:', error);
    return false;
  }
}

export async function getWeeklyWins(uid: string) {
  try {
    const items = await prisma.weeklyWin.findMany({
      where: {
        uid
      }
    });
    return items;
  } catch (error) {
    console.error('Error getting Weekly Wins Array:', error);
    return false;
  }
}

export async function deleteWeeklyWin(id: string) {
  try {
    await prisma.weeklyWin.delete({
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

export async function setWeeklyWinDone(id: string, selection: boolean) {
  try {
    const check = await prisma.weeklyWin.update({
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

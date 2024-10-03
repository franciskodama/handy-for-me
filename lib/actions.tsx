'use server';

import { v4 } from 'uuid';
import { prisma } from './prisma';

export async function addSpinList(uid: string, name: string) {
  try {
    const list = await prisma.spinList.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        name
      }
    });
    return list;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getSpinLists(uid: string) {
  try {
    const data = await prisma.spinList.findMany({
      where: {
        uid
      }
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function addSpinItem(uid: string, listId: string, name: string) {
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
    console.log(error);
    return false;
  }
}

export async function getAllSpinItemsFromList(uid: string) {
  try {
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
    await prisma.spinItem.update({
      where: {
        id
      },
      data: {
        selected: !item?.selected
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// export type SpinListItem = {
//   id: string;
//   createdAt: Date;
//   uid: string;
//   listId: string;
//   name: string;
//   selected: boolean;
// };

// model SpinItem {
//   id        String   @id @default(uuid()) @db.VarChar(255)
//   createdAt DateTime @db.Date
//   uid       String
//   list      SpinList @relation(fields: [listId], references: [id])
//   item      String
//   selected Boolean   @default(true)
//   listId   String
// }
// export async function getUsers() {
//   try {
//     const data = await prisma.user.findMany();
//     return data;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

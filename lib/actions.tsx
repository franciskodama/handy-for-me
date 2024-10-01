'use server';

import { v4 } from 'uuid';
import { prisma } from './prisma';

// export async function addSpinItem(uid: string, list: string, item: string) {
//   try {
//     await prisma.spinItem.create({
//       data: {
//         id: v4(),
//         createdAt: new Date(),
//         uid,
//         list,
//         item,
//         selected: true
//       }
//     });
//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// }

// model SpinItem {
//   id        String   @id @default(uuid()) @db.VarChar(255)
//   createdAt DateTime @db.Date
//   uid       String   @db.VarChar(255)
//   list      SpinList @relation(fields: [listId], references: [id])
//   item      String   @db.VarChar(255)
//   selected Boolean   @default(true)
//   listId   String
// }

export async function addSpinList(uid: string, name: string) {
  try {
    await prisma.spinList.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        name
      }
    });
    return true;
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

export async function getUsers() {
  try {
    const data = await prisma.user.findMany();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

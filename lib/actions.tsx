'use server';

import { v4 } from 'uuid';
import { prisma } from './prisma';

export async function addDrawItem(uid: string, list: string, item: string) {
  try {
    await prisma.draw.create({
      data: {
        id: v4(),
        uid,
        list,
        item,
        created_at: new Date()
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDrawLists(uid: string) {
  try {
    const data = await prisma.draw.findMany({
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

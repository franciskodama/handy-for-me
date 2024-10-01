'use server';

import { v4 } from 'uuid';
import { prisma } from './prisma';

export async function addDrawItem(uid: string, item: string) {
  try {
    await prisma.draw.create({
      data: {
        id: v4(),
        uid,
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

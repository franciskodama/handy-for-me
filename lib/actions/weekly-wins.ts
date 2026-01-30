'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';

export async function addWeeklyWin(uid: string, goal: string, type: string) {
  try {
    const newItem = await prisma.weeklyWin.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        goal,
        type,
        done: false
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
    console.error(error);
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

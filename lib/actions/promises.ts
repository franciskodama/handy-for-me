'use server';

import prisma from '@/lib/prisma';
import { YearPromise } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getYearPromises(uid: string): Promise<YearPromise[]> {
  try {
    const promises = await prisma.yearPromise.findMany({
      where: { uid },
      orderBy: { createdAt: 'desc' }
    });
    return promises as YearPromise[];
  } catch (error) {
    console.error('Error fetching promises:', error);
    return [];
  }
}

export async function addYearPromise(
  uid: string,
  title: string,
  quarter: string
) {
  try {
    const newPromise = await prisma.yearPromise.create({
      data: {
        uid,
        title,
        quarter,
        progress: 0,
        done: false
      }
    });
    revalidatePath('/promises');
    return newPromise;
  } catch (error) {
    console.error('Error adding promise:', error);
    return null;
  }
}

export async function updateYearPromiseQuarter(id: string, quarter: string) {
  try {
    const updated = await prisma.yearPromise.update({
      where: { id },
      data: { quarter }
    });
    revalidatePath('/promises');
    return updated;
  } catch (error) {
    console.error('Error updating promise quarter:', error);
    return null;
  }
}

export async function updateYearPromiseProgress(id: string, progress: number) {
  try {
    const updated = await prisma.yearPromise.update({
      where: { id },
      data: {
        progress,
        done: progress === 100
      }
    });
    revalidatePath('/promises');
    return updated;
  } catch (error) {
    console.error('Error updating promise progress:', error);
    return null;
  }
}

export async function deleteYearPromise(id: string) {
  try {
    await prisma.yearPromise.delete({
      where: { id }
    });
    revalidatePath('/promises');
    return true;
  } catch (error) {
    console.error('Error deleting promise:', error);
    return false;
  }
}

export async function markYearPromiseAsDone(id: string, done: boolean) {
  try {
    const updated = await prisma.yearPromise.update({
      where: { id },
      data: {
        done,
        progress: done ? 100 : 75 // If mark as undone, set to 75% as a setback
      }
    });
    revalidatePath('/promises');
    return updated;
  } catch (error) {
    console.error('Error marking promise as done:', error);
    return null;
  }
}

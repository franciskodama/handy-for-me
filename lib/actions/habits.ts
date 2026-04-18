'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getHabits(uid: string) {
  try {
    const habits = await prisma.habit.findMany({
      where: { uid },
      orderBy: { createdAt: 'desc' }
    });
    return habits;
  } catch (error) {
    console.error('Error fetching habits:', error);
    return [];
  }
}

export async function createHabit(uid: string, name: string, startDate?: Date) {
  try {
    const habit = await prisma.habit.create({
      data: {
        uid,
        name,
        lastResetAt: startDate || new Date()
      }
    });
    revalidatePath('/dashboard');
    return { success: true, habit };
  } catch (error) {
    console.error('Error creating habit:', error);
    return { success: false, error: 'Failed to create habit' };
  }
}

export async function resetHabit(id: string) {
  try {
    await prisma.habit.update({
      where: { id },
      data: { lastResetAt: new Date() }
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error resetting habit:', error);
    return { success: false, error: 'Failed to reset habit' };
  }
}

export async function updateHabit(id: string, name: string, lastResetAt: Date) {
  try {
    await prisma.habit.update({
      where: { id },
      data: { name, lastResetAt }
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error updating habit:', error);
    return { success: false, error: 'Failed to update habit' };
  }
}

export async function deleteHabit(id: string) {
  try {
    await prisma.habit.delete({
      where: { id }
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting habit:', error);
    return { success: false, error: 'Failed to delete habit' };
  }
}

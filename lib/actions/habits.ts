'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getHabits(uid: string) {
  try {
    const habits = await prisma.habit.findMany({
      where: { uid },
      include: {
        history: {
          orderBy: { endedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return habits;
  } catch (error) {
    console.error('Error fetching habits:', error);
    return [];
  }
}

export async function createHabit(uid: string, name: string, startDate?: Date, targetDate?: Date) {
  try {
    if (startDate) {
      const d = new Date(startDate);
      if (isNaN(d.getTime()) || d.getFullYear() < 1000 || d.getFullYear() > 9999) {
        return { success: false, error: 'Invalid deployment date format or year.' };
      }
    }
    if (targetDate) {
      const d = new Date(targetDate);
      if (isNaN(d.getTime()) || d.getFullYear() < 1000 || d.getFullYear() > 9999) {
        return { success: false, error: 'Invalid milestone date format or year.' };
      }
    }
    const habit = await prisma.habit.create({
      data: {
        uid,
        name,
        lastResetAt: startDate || new Date(),
        targetDate: targetDate || null
      }
    });
    revalidatePath('/dashboard');
    return { success: true, habit };
  } catch (error) {
    console.error('Error creating habit:', error);
    return { success: false, error: 'Failed to create habit' };
  }
}

export async function resetHabit(id: string, note?: string) {
  try {
    const currentHabit = await prisma.habit.findUnique({
      where: { id }
    });

    if (!currentHabit) {
      return { success: false, error: 'Habit not found' };
    }

    const now = new Date();

    // Create history entry for the completed streak
    await prisma.habitHistory.create({
      data: {
        habitId: id,
        startedAt: currentHabit.lastResetAt,
        endedAt: now,
        note: note?.trim() || null
      }
    });

    // Reset habit counter
    await prisma.habit.update({
      where: { id },
      data: { lastResetAt: now }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error resetting habit:', error);
    return { success: false, error: 'Failed to reset habit' };
  }
}

export async function updateHabit(id: string, name: string, lastResetAt: Date, targetDate?: Date | null) {
  try {
    if (lastResetAt) {
      const d = new Date(lastResetAt);
      if (isNaN(d.getTime()) || d.getFullYear() < 1000 || d.getFullYear() > 9999) {
        return { success: false, error: 'Invalid start date format or year.' };
      }
    }
    if (targetDate) {
      const d = new Date(targetDate);
      if (isNaN(d.getTime()) || d.getFullYear() < 1000 || d.getFullYear() > 9999) {
        return { success: false, error: 'Invalid target date format or year.' };
      }
    }
    await prisma.habit.update({
      where: { id },
      data: { name, lastResetAt, targetDate: targetDate || null }
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

export async function deleteHabitHistoryItem(historyId: string) {
  try {
    await prisma.habitHistory.delete({
      where: { id: historyId }
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting habit history item:', error);
    return { success: false, error: 'Failed to delete history item' };
  }
}


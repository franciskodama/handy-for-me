import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';

// Helper to verify the JWT token from Authorization header
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const secretKey = process.env.AUTH_SECRET;
  if (!secretKey) {
    console.error('CRITICAL: AUTH_SECRET is not configured in the backend environment.');
    return null;
  }
  try {
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string; name?: string; image?: string };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// GET: Fetch habits for user
export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = authUser.email.toLowerCase().trim();

    const userDb = await prisma.user.findUnique({
      where: { uid: email }
    });

    if (!userDb) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const habits = await prisma.habit.findMany({
      where: { uid: email },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ habits });
  } catch (error) {
    console.error('API Error in GET habits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Handles CRUD operations for habits
export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = authUser.email.toLowerCase().trim();

    const userDb = await prisma.user.findUnique({
      where: { uid: email }
    });

    if (!userDb) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'action parameter is required' }, { status: 400 });
    }

    // ACTION: createHabit
    if (action === 'createHabit') {
      const name = body.name?.trim();
      const startDateVal = body.startDate ? new Date(body.startDate) : new Date();
      const targetDateVal = body.targetDate ? new Date(body.targetDate) : null;

      if (!name) {
        return NextResponse.json({ error: 'Habit name is required' }, { status: 400 });
      }

      if (isNaN(startDateVal.getTime())) {
        return NextResponse.json({ error: 'Invalid start date' }, { status: 400 });
      }

      if (targetDateVal && isNaN(targetDateVal.getTime())) {
        return NextResponse.json({ error: 'Invalid target date' }, { status: 400 });
      }

      const newHabit = await prisma.habit.create({
        data: {
          id: uuidv4(),
          createdAt: new Date(),
          uid: email,
          name,
          lastResetAt: startDateVal,
          targetDate: targetDateVal,
          color: '#ef4444' // default color tag matching schema
        }
      });

      return NextResponse.json(newHabit, { status: 201 });
    }

    // ACTION: resetHabit
    if (action === 'resetHabit') {
      const { habitId } = body;

      if (!habitId) {
        return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
      }

      const existing = await prisma.habit.findUnique({
        where: { id: habitId }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Habit monitor not found' }, { status: 404 });
      }

      if (existing.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const updated = await prisma.habit.update({
        where: { id: habitId },
        data: {
          lastResetAt: new Date()
        }
      });

      return NextResponse.json(updated);
    }

    // ACTION: updateHabit
    if (action === 'updateHabit') {
      const { habitId, name, lastResetAt, targetDate } = body;

      if (!habitId) {
        return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
      }

      const existing = await prisma.habit.findUnique({
        where: { id: habitId }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Habit monitor not found' }, { status: 404 });
      }

      if (existing.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const lastResetDateVal = lastResetAt ? new Date(lastResetAt) : new Date();
      const targetDateVal = targetDate ? new Date(targetDate) : null;

      if (isNaN(lastResetDateVal.getTime())) {
        return NextResponse.json({ error: 'Invalid start date' }, { status: 400 });
      }

      if (targetDateVal && isNaN(targetDateVal.getTime())) {
        return NextResponse.json({ error: 'Invalid target date' }, { status: 400 });
      }

      const updated = await prisma.habit.update({
        where: { id: habitId },
        data: {
          name: name?.trim() || existing.name,
          lastResetAt: lastResetDateVal,
          targetDate: targetDateVal
        }
      });

      return NextResponse.json(updated);
    }

    // ACTION: deleteHabit
    if (action === 'deleteHabit') {
      const { habitId } = body;

      if (!habitId) {
        return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
      }

      const existing = await prisma.habit.findUnique({
        where: { id: habitId }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Habit monitor not found' }, { status: 404 });
      }

      if (existing.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await prisma.habit.delete({
        where: { id: habitId }
      });

      return NextResponse.json({ success: true, message: 'Habit decommissioned successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error in POST habits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { 
  addWeeklyWin, 
  deleteWeeklyWin, 
  getWeeklyWins, 
  setWeeklyWinDone 
} from '@/lib/actions/weekly-wins';

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

// GET: Fetch all weekly wins for a user by email/uid
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uid = user.email.toLowerCase().trim();

    const items = await getWeeklyWins(uid);
    if (items === false) {
      return NextResponse.json({ error: 'Failed to retrieve weekly wins' }, { status: 500 });
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('API Error in GET weekly-wins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add a new weekly win
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const goal = body.goal?.trim();
    const type = body.type?.trim(); // 'Easy' | 'Moderate' | 'Challenging'

    if (!goal || !type) {
      return NextResponse.json({ error: 'goal and type are required' }, { status: 400 });
    }

    if (goal.length === 0) {
      return NextResponse.json({ error: 'Goal description cannot be empty' }, { status: 400 });
    }

    const validTypes = ['Easy', 'Moderate', 'Challenging'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid goal type level' }, { status: 400 });
    }

    const uid = user.email.toLowerCase().trim();

    const newItem = await addWeeklyWin(uid, goal, type);
    if (!newItem) {
      return NextResponse.json({ error: 'Failed to create weekly win' }, { status: 500 });
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('API Error in POST weekly-wins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Toggle/set done status of a weekly win
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, done } = body;

    if (!id || typeof done !== 'boolean') {
      return NextResponse.json({ error: 'id and done (boolean) are required' }, { status: 400 });
    }

    // Verify ownership before updating
    const existing = await prisma.weeklyWin.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Weekly win not found' }, { status: 404 });
    }

    if (existing.uid.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedItem = await setWeeklyWinDone(id, done);
    if (!updatedItem) {
      return NextResponse.json({ error: 'Failed to update weekly win status' }, { status: 500 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('API Error in PUT weekly-wins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove a weekly win by id
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Weekly Win ID is required' }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await prisma.weeklyWin.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Weekly win not found' }, { status: 404 });
    }

    if (existing.uid.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await deleteWeeklyWin(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete weekly win' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Weekly win deleted successfully' });
  } catch (error) {
    console.error('API Error in DELETE weekly-wins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

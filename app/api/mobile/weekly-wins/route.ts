import { NextRequest, NextResponse } from 'next/server';
import { 
  addWeeklyWin, 
  deleteWeeklyWin, 
  getWeeklyWins, 
  setWeeklyWinDone 
} from '@/lib/actions/weekly-wins';

// GET: Fetch all weekly wins for a user by email/uid
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid')?.toLowerCase().trim();

    if (!uid) {
      return NextResponse.json({ error: 'User ID (email) is required' }, { status: 400 });
    }

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
    const body = await request.json();
    const uid = body.uid?.toLowerCase().trim();
    const goal = body.goal?.trim();
    const type = body.type?.trim(); // 'Easy' | 'Moderate' | 'Challenging'

    if (!uid || !goal || !type) {
      return NextResponse.json({ error: 'uid, goal, and type are required' }, { status: 400 });
    }

    if (goal.length === 0) {
      return NextResponse.json({ error: 'Goal description cannot be empty' }, { status: 400 });
    }

    const validTypes = ['Easy', 'Moderate', 'Challenging'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid goal type level' }, { status: 400 });
    }

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
    const body = await request.json();
    const { id, done } = body;

    if (!id || typeof done !== 'boolean') {
      return NextResponse.json({ error: 'id and done (boolean) are required' }, { status: 400 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Weekly Win ID is required' }, { status: 400 });
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

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

// GET: Fetch all vision board items for a user
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

    const items = await prisma.visualBoardItem.findMany({
      where: { uid: email },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('API Error in GET vision-board:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add new vision board item or toggle status
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

    // ACTION: create
    if (action === 'create') {
      const item = body.item?.trim();
      const url = body.url?.trim();

      if (!item) {
        return NextResponse.json({ error: 'Goal is required!' }, { status: 400 });
      }

      if (item.length > 10) {
        return NextResponse.json({ error: 'Goal name should be at most 10 characters.' }, { status: 400 });
      }

      if (!url) {
        return NextResponse.json({ error: 'URL is required!' }, { status: 400 });
      }

      if (!url.includes('unsplash') && !url.includes('fkodama')) {
        return NextResponse.json({ error: 'Image URL should be sourced from Unsplash.' }, { status: 400 });
      }

      const newItem = await prisma.visualBoardItem.create({
        data: {
          id: uuidv4(),
          createdAt: new Date(),
          uid: email,
          item,
          url,
          done: false
        }
      });

      return NextResponse.json(newItem, { status: 201 });
    }

    // ACTION: toggle
    if (action === 'toggle') {
      const { id, done } = body;

      if (!id || typeof done !== 'boolean') {
        return NextResponse.json({ error: 'id and done (boolean) are required' }, { status: 400 });
      }

      const existing = await prisma.visualBoardItem.findUnique({
        where: { id }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Vision board item not found' }, { status: 404 });
      }

      if (existing.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const updated = await prisma.visualBoardItem.update({
        where: { id },
        data: { done }
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error in POST vision-board:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a vision board item
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const existing = await prisma.visualBoardItem.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Vision board item not found' }, { status: 404 });
    }

    if (existing.uid !== email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.visualBoardItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('API Error in DELETE vision-board:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

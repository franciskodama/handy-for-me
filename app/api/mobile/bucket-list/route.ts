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

// GET: Fetch all bucket list items for a user (or household if shared)
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

    const isShared = !!(userDb.householdId && userDb.shareBucketList);

    const items = await prisma.bucketListItem.findMany({
      where: isShared
        ? { householdId: userDb.householdId }
        : { uid: email, householdId: null },
      orderBy: { createdAt: 'desc' }
    });

    // Resolve household details
    let householdDetails: any = {
      inHousehold: false,
      userSettings: {
        shareDecisionHelper: userDb.shareDecisionHelper,
        shareBucketList: userDb.shareBucketList
      }
    };

    if (userDb.householdId) {
      const hh = await prisma.household.findUnique({
        where: { id: userDb.householdId },
        include: {
          users: {
            select: {
              id: true,
              uid: true,
              name: true,
              avatar: true
            }
          }
        }
      });
      if (hh) {
        householdDetails = {
          inHousehold: true,
          household: {
            id: hh.id,
            code: hh.code,
            name: hh.name,
            members: hh.users
          },
          userSettings: {
            shareDecisionHelper: userDb.shareDecisionHelper,
            shareBucketList: userDb.shareBucketList
          }
        };
      }
    }

    return NextResponse.json({ items, householdDetails });
  } catch (error) {
    console.error('API Error in GET bucket-list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add new bucket list item or toggle completed status
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

    const isShared = !!(userDb.householdId && userDb.shareBucketList);
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'action parameter is required' }, { status: 400 });
    }

    // ACTION: create
    if (action === 'create') {
      const item = body.item?.trim();
      const category = body.category?.trim();

      if (!item || !category) {
        return NextResponse.json({ error: 'item and category are required' }, { status: 400 });
      }

      if (item.length === 0 || item.length > 50) {
        return NextResponse.json({ error: 'Adventure name must be between 1 and 50 characters' }, { status: 400 });
      }

      const newItem = await prisma.bucketListItem.create({
        data: {
          id: uuidv4(),
          createdAt: new Date(),
          uid: email,
          item,
          category,
          done: false,
          householdId: isShared ? userDb.householdId : null
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

      const existing = await prisma.bucketListItem.findUnique({
        where: { id }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Bucket list item not found' }, { status: 404 });
      }

      // Authorization check: must own item or share same household with sharing enabled
      const isAuthorized =
        existing.uid === email ||
        (existing.householdId && userDb.householdId === existing.householdId && userDb.shareBucketList);

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const updated = await prisma.bucketListItem.update({
        where: { id },
        data: { done }
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error in POST bucket-list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a bucket list item
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

    const existing = await prisma.bucketListItem.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Bucket list item not found' }, { status: 404 });
    }

    const isAuthorized =
      existing.uid === email ||
      (existing.householdId && userDb.householdId === existing.householdId && userDb.shareBucketList);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.bucketListItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('API Error in DELETE bucket-list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

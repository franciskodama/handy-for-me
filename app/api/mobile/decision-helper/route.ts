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

// GET: Fetch decision helper lists, items, and household details
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

    const isShared = !!(userDb.householdId && userDb.shareDecisionHelper);

    // Fetch lists
    const lists = await prisma.decisionHelperList.findMany({
      where: isShared
        ? { householdId: userDb.householdId }
        : { uid: email, householdId: null },
      orderBy: { createdAt: 'asc' }
    });

    // Fetch items
    const items = await prisma.decisionHelperItem.findMany({
      where: {
        list: isShared
          ? { householdId: userDb.householdId }
          : { uid: email, householdId: null }
      },
      orderBy: { createdAt: 'asc' }
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

    return NextResponse.json({ lists, items, householdDetails });
  } catch (error) {
    console.error('API Error in GET decision-helper:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add list/item or toggle item selection state
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

    const isShared = !!(userDb.householdId && userDb.shareDecisionHelper);
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'action parameter is required' }, { status: 400 });
    }

    // ACTION: createList
    if (action === 'createList') {
      const listName = body.listName?.trim();
      if (!listName) {
        return NextResponse.json({ error: 'listName is required' }, { status: 400 });
      }

      const newList = await prisma.decisionHelperList.create({
        data: {
          id: uuidv4(),
          createdAt: new Date(),
          uid: email,
          list: listName,
          householdId: isShared ? userDb.householdId : null
        }
      });

      return NextResponse.json(newList, { status: 201 });
    }

    // ACTION: createItem
    if (action === 'createItem') {
      const { listId } = body;
      const itemName = body.itemName?.trim();

      if (!listId || !itemName) {
        return NextResponse.json({ error: 'listId and itemName are required' }, { status: 400 });
      }

      const list = await prisma.decisionHelperList.findUnique({
        where: { id: listId }
      });

      if (!list) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
      }

      // Authorization check
      const isAuthorized =
        list.uid === email ||
        (list.householdId && userDb.householdId === list.householdId && userDb.shareDecisionHelper);

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const newItem = await prisma.decisionHelperItem.create({
        data: {
          id: uuidv4(),
          uid: email,
          createdAt: new Date(),
          listId,
          item: itemName,
          selected: true
        }
      });

      return NextResponse.json(newItem, { status: 201 });
    }

    // ACTION: toggleSelection
    if (action === 'toggleSelection') {
      const { itemId } = body;
      if (!itemId) {
        return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
      }

      const item = await prisma.decisionHelperItem.findUnique({
        where: { id: itemId },
        include: { list: true }
      });

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      // Authorization check
      const isAuthorized =
        item.uid === email ||
        item.list.uid === email ||
        (item.list.householdId && userDb.householdId === item.list.householdId && userDb.shareDecisionHelper);

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const updatedItem = await prisma.decisionHelperItem.update({
        where: { id: itemId },
        data: {
          selected: !item.selected
        }
      });

      return NextResponse.json(updatedItem);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error in POST decision-helper:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a list or an individual item
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
    const listId = searchParams.get('listId');
    const itemId = searchParams.get('itemId');

    if (!listId && !itemId) {
      return NextResponse.json({ error: 'listId or itemId query parameter is required' }, { status: 400 });
    }

    // Scenario: Delete list (and nested items)
    if (listId) {
      const list = await prisma.decisionHelperList.findUnique({
        where: { id: listId }
      });

      if (!list) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
      }

      const isAuthorized =
        list.uid === email ||
        (list.householdId && userDb.householdId === list.householdId && userDb.shareDecisionHelper);

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Check if list has items first (Prisma action deleteDecisionHelperList fails if constraint exists)
      // Actually, standard cascade delete is not native in pg without cascade constraints or manual delete
      await prisma.decisionHelperItem.deleteMany({
        where: { listId }
      });

      await prisma.decisionHelperList.delete({
        where: { id: listId }
      });

      return NextResponse.json({ success: true, message: 'List deleted successfully' });
    }

    // Scenario: Delete individual item
    if (itemId) {
      const item = await prisma.decisionHelperItem.findUnique({
        where: { id: itemId },
        include: { list: true }
      });

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      const isAuthorized =
        item.uid === email ||
        item.list.uid === email ||
        (item.list.householdId && userDb.householdId === item.list.householdId && userDb.shareDecisionHelper);

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await prisma.decisionHelperItem.delete({
        where: { id: itemId }
      });

      return NextResponse.json({ success: true, message: 'Item deleted successfully' });
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    console.error('API Error in DELETE decision-helper:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

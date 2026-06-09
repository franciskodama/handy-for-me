import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { shortcut_color_enum } from '@prisma/client';

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

// GET: Fetch categories and shortcuts for user
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

    const categories = await prisma.shortcutCategory.findMany({
      where: { uid: email },
      orderBy: { createdAt: 'desc' }
    });

    const shortcuts = await prisma.shortcut.findMany({
      where: { uid: email },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ categories, shortcuts });
  } catch (error) {
    console.error('API Error in GET shortcuts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Handles category and shortcut mutations
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

    // ACTION: createCategory
    if (action === 'createCategory') {
      const category = body.category?.trim();
      let color = body.color?.toUpperCase().trim();

      if (!category) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
      }

      if (color === 'GREY') {
        color = 'GRAY';
      }

      // Check if color is a valid enum value
      const validColors = Object.values(shortcut_color_enum);
      if (!color || !validColors.includes(color as shortcut_color_enum)) {
        color = 'GRAY'; // Default color
      }

      const newCategory = await prisma.shortcutCategory.create({
        data: {
          id: uuidv4(),
          createdAt: new Date(),
          uid: email,
          category,
          color: color as shortcut_color_enum
        }
      });

      return NextResponse.json(newCategory, { status: 201 });
    }

    // ACTION: deleteCategory
    if (action === 'deleteCategory') {
      const { categoryId } = body;

      if (!categoryId) {
        return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
      }

      const existing = await prisma.shortcutCategory.findUnique({
        where: { id: categoryId }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Shortcut category not found' }, { status: 404 });
      }

      if (existing.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Prisma relation doesn't have cascade delete configured in the schema,
      // so we delete child shortcuts first.
      await prisma.shortcut.deleteMany({
        where: { categoryId, uid: email }
      });

      await prisma.shortcutCategory.delete({
        where: { id: categoryId }
      });

      return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    }

    // ACTION: createShortcut
    if (action === 'createShortcut') {
      const shortcut = body.shortcut?.trim();
      const url = body.url?.trim();
      const description = body.description?.trim();
      const { categoryId } = body;

      if (!shortcut) {
        return NextResponse.json({ error: 'Shortcut name is required' }, { status: 400 });
      }

      if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
      }

      if (!categoryId) {
        return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
      }

      const category = await prisma.shortcutCategory.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return NextResponse.json({ error: 'Shortcut category not found' }, { status: 404 });
      }

      if (category.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const newShortcut = await prisma.shortcut.create({
        data: {
          id: uuidv4(),
          createdAt: new Date(),
          uid: email,
          shortcut,
          url,
          description: description || 'No description yet',
          categoryId
        },
        include: {
          category: true
        }
      });

      return NextResponse.json(newShortcut, { status: 201 });
    }

    // ACTION: deleteShortcut
    if (action === 'deleteShortcut') {
      const { shortcutId } = body;

      if (!shortcutId) {
        return NextResponse.json({ error: 'shortcutId is required' }, { status: 400 });
      }

      const existing = await prisma.shortcut.findUnique({
        where: { id: shortcutId }
      });

      if (!existing) {
        return NextResponse.json({ error: 'Shortcut not found' }, { status: 404 });
      }

      if (existing.uid !== email) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await prisma.shortcut.delete({
        where: { id: shortcutId }
      });

      return NextResponse.json({ success: true, message: 'Shortcut deleted successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error in POST shortcuts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { getUserLocation } from '@/lib/location.server';
import { getWeather } from '@/lib/weather.server';

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

// GET: Consolidated data for the Mobile Dashboard
export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser || !authUser.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = authUser.email.toLowerCase().trim();

    // Check if user exists
    const userDb = await prisma.user.findUnique({
      where: { uid: email }
    });

    if (!userDb) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user items in parallel
    const [habits, visionBoardItems, shortcuts, bucketListItems] = await Promise.all([
      prisma.habit.findMany({
        where: { uid: email },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.visualBoardItem.findMany({
        where: { uid: email },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shortcut.findMany({
        where: { uid: email },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.bucketListItem.findMany({
        where: { uid: email },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Fetch location and weather
    let location = null;
    let weather = null;
    try {
      location = await getUserLocation();
      if (location && location.city) {
        weather = await getWeather(location.city);
      }
    } catch (e) {
      console.error('Failed to fetch location/weather for dashboard:', e);
    }

    return NextResponse.json({
      user: {
        email: userDb.uid,
        name: userDb.name || authUser.name,
        image: userDb.avatar || authUser.image
      },
      location,
      weather,
      habits,
      visionBoardItems,
      shortcuts,
      bucketListItems
    });

  } catch (error) {
    console.error('API Error in GET dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

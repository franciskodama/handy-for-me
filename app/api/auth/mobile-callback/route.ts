import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SignJWT } from 'jose';

export async function GET(request: NextRequest) {
  try {
    // 1. Get NextAuth session
    const session = await auth();
    const user = session?.user;

    // 2. If not logged in, redirect to the web login page
    if (!user || !user.email) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Retrieve AUTH_SECRET key
    const secretKey = process.env.AUTH_SECRET;
    if (!secretKey) {
      console.error('CRITICAL: AUTH_SECRET is not configured in the backend environment.');
      return NextResponse.json({ error: 'Authentication configuration error' }, { status: 500 });
    }

    // Convert secret key to Uint8Array for jose
    const secret = new TextEncoder().encode(secretKey);

    // 4. Sign a secure 30-day JWT containing the user profile details
    const token = await new SignJWT({
      email: user.email.toLowerCase().trim(),
      name: user.name || '',
      image: user.image || ''
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);

    // 5. Redirect back to the mobile app custom scheme
    const mobileRedirectUrl = `handyforme://redirect?token=${token}`;
    console.log(`Successfully authenticated mobile user ${user.email}. Redirecting to app...`);
    
    return NextResponse.redirect(mobileRedirectUrl);
  } catch (error) {
    console.error('Error in mobile-callback authentication handler:', error);
    return NextResponse.json({ error: 'Internal server error during mobile login callback' }, { status: 500 });
  }
}

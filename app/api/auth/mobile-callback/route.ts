import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SignJWT } from 'jose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectParam = searchParams.get('redirect') || '';

    // 1. Get NextAuth session
    const session = await auth();
    const user = session?.user;

    // 2. If not logged in, redirect to the web login page, passing along the redirect param
    if (!user || !user.email) {
      const loginUrl = new URL('/login', request.url);
      if (redirectParam) {
        loginUrl.searchParams.set('redirect', redirectParam);
      }
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

    // 5. Render HTML redirect bridge page
    const targetRedirect = redirectParam || 'handyforme://redirect';
    const mobileRedirectUrl = `${targetRedirect}${targetRedirect.includes('?') ? '&' : '?'}token=${token}`;
    console.log(`Successfully authenticated mobile user ${user.email}. Rendering HTML redirect bridge...`);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Handyfor.me Auth Success</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #ffffff;
              color: #0F1739;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              background: #ffffff;
              border: 2px solid #0F1739;
              padding: 30px;
              text-align: center;
              max-width: 400px;
              width: 100%;
              box-shadow: 6px 6px 0px 0px #0F1739;
            }
            h1 {
              font-size: 24px;
              font-weight: 900;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            p {
              color: #64748b;
              font-size: 14px;
              margin-bottom: 25px;
              font-weight: 600;
            }
            .btn {
              background: #DDF906;
              color: #0F1739;
              border: 2px solid #0F1739;
              padding: 15px 25px;
              text-decoration: none;
              font-weight: 900;
              font-size: 14px;
              text-transform: uppercase;
              display: inline-block;
              box-shadow: 3px 3px 0px 0px #0F1739;
              cursor: pointer;
            }
            .btn:active {
              transform: translate(1px, 1px);
              box-shadow: 2px 2px 0px 0px #0F1739;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Success! 🎉</h1>
            <p>You have logged in successfully. If the app does not open automatically, tap the button below to return.</p>
            <a href="${mobileRedirectUrl}" class="btn">Return to App ➔</a>
          </div>
          <script>
            // Try to redirect automatically
            setTimeout(function() {
              window.location.href = "${mobileRedirectUrl}";
            }, 300);
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error in mobile-callback authentication handler:', error);
    return NextResponse.json({ error: 'Internal server error during mobile login callback' }, { status: 500 });
  }
}

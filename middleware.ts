// middleware.ts (Modified)

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config'; // <-- Import the new Edge-safe config

// 4. Instantiate a separate Auth instance for the middleware
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

// export { auth as middleware } from '@/lib/auth';

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// };

// auth.config.ts (New File - Does NOT import the database logic)

import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const authConfig = {
  // 1. Session Strategy: JWT is correct for Edge
  session: { strategy: 'jwt' },

  // 2. Add OAuth providers (they don't use the database in middleware)
  providers: [
    GitHub,
    Google
    // 🛑 Credentials provider is OMITTED here 🛑
  ]

  // You might need to add pages config if you have custom login pages
  // pages: {
  //   signIn: '/login',
  //   error: '/auth/error',
  // },
} satisfies NextAuthConfig;

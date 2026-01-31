import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days sign out
  },

  providers: [GitHub, Google]

  // We might need to add pages config if we have custom login pages in the future
  // pages: {
  //   signIn: '/login',
  //   error: '/auth/error',
  // },
} satisfies NextAuthConfig;

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { addUser } from './actions/user';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        await addUser(
          user.email.toLowerCase().trim(),
          user.name ?? '',
          user.image ?? ''
        );
      }
      return true;
    }
  }
});

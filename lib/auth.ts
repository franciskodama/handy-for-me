import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/lib/zod';
import { ZodError } from 'zod';
import { getUser } from './actions/user';
import { saltAndHashPassword } from './passwords';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
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

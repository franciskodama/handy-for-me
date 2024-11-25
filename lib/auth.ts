import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { signInSchema } from '@/lib/zod';
import { ZodError } from 'zod';
import { getUser } from './actions';
import { saltAndHashPassword } from './passwords';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          // logic to salt and hash password
          const pwHash = await saltAndHashPassword(password);

          // logic to verify if the user exists
          user = await getUser(email, pwHash);
          // user = await getUser(email);

          if (!user) {
            throw new Error('Invalid credentials.');
          }

          // return JSON object with the user data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      }
    }),
    GitHub,
    Google
  ]
});

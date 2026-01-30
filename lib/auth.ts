import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/lib/zod';
import { ZodError } from 'zod';
import { getUser } from './actions/user';
import { saltAndHashPassword } from './passwords';
import { authConfig } from './auth.config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,

    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) {
            return null;
          }
          const { email, password } =
            await signInSchema.parseAsync(credentials);
          const hashedPassword = await saltAndHashPassword(password);
          const user = await getUser(email, hashedPassword);
          if (!user) {
            return null;
          }
          return {};
        } catch (error) {
          if (error instanceof ZodError) {
            console.error('Validation error:', error.errors);
          } else {
            console.error('Error in authorize:', error);
          }
          return null;
        }
      }
    })
  ]
});

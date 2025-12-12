// auth.ts (Modified)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/lib/zod';
import { ZodError } from 'zod';
import { getUser } from './actions';
import { saltAndHashPassword } from './passwords';
import { authConfig } from './auth.config'; // <-- Import the base config

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig, // <-- Spread the Edge-safe config
  providers: [
    ...authConfig.providers, // <-- Include OAuth providers

    // 3. Add the Node.js-dependent Credentials provider here
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        // ... (Your original authorize logic remains here)
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
          return {
            /* ... user object ... */
          };
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

// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import GitHub from 'next-auth/providers/github';
// import Google from 'next-auth/providers/google';
// import { signInSchema } from '@/lib/zod';
// import { ZodError } from 'zod';
// import { getUser } from './actions';
// import { saltAndHashPassword } from './passwords';

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   session: { strategy: 'jwt' },
//   providers: [
//     Credentials({
//       credentials: {
//         email: {},
//         password: {}
//       },
//       authorize: async (credentials) => {
//         try {
//           if (!credentials) {
//             return null;
//           }

//           const { email, password } =
//             await signInSchema.parseAsync(credentials);

//           const hashedPassword = await saltAndHashPassword(password);
//           const user = await getUser(email, hashedPassword);

//           if (!user) {
//             return null;
//           }

//           return {
//             id: user.id,
//             uid: user.uid,
//             name: user.name,
//             avatar: user.avatar,
//             hashedPassword: user.hashedPassword,
//             createdAt: user.createdAt
//           };
//         } catch (error) {
//           if (error instanceof ZodError) {
//             console.error('Validation error:', error.errors);
//           } else {
//             console.error('Error in authorize:', error);
//           }
//           return null;
//         }
//       }
//     }),
//     GitHub,
//     Google
//   ]
// });

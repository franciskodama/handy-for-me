import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { addUser } from './actions/user';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({ checks: ['none'] }),
    Google({ checks: ['none'] }),
    Credentials({
      id: 'google-id-token',
      name: 'Google ID Token',
      credentials: {
        idToken: { label: 'ID Token', type: 'text' }
      },
      async authorize(credentials) {
        const idToken = credentials?.idToken;
        if (typeof idToken !== 'string') {
          return null;
        }

        try {
          const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
          );
          if (!response.ok) {
            console.error('Failed to verify Google ID Token:', response.statusText);
            return null;
          }
          const payload = await response.json();

          const expectedAudience = process.env.AUTH_GOOGLE_ID;
          if (payload.aud !== expectedAudience) {
            console.error(
              'Audience verification failed:',
              payload.aud,
              expectedAudience
            );
            return null;
          }

          if (payload.email) {
            return {
              id: payload.sub,
              email: payload.email.toLowerCase().trim(),
              name: payload.name ?? '',
              image: payload.picture ?? ''
            };
          }
        } catch (e) {
          console.error('Error validating Google ID Token:', e);
        }
        return null;
      }
    })
  ],
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

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogoGitHub, LogoGoogle } from '@/lib/svgs';
import { signIn } from 'next-auth/react';
import { Capacitor } from '@capacitor/core';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { useRouter } from 'next/navigation';

export function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (Capacitor.isNativePlatform()) {
      setLoading('google');
      try {
        // Initialize the native Google Sign-In plugin
        try {
          await GoogleSignIn.initialize({
            clientId:
              '979910939497-ejct3qq5u7bmf81r8vilujjv1o8m5s64.apps.googleusercontent.com'
          });
        } catch (initErr) {
          console.warn('Google SDK initialization warning:', initErr);
        }

        // Perform native sign-in
        const res = await GoogleSignIn.signIn({});
        const idToken = res.idToken;

        if (!idToken) {
          throw new Error('No ID token returned from native Google Sign-In');
        }

        // Send token to NextAuth credentials endpoint
        const signInRes = await signIn('google-id-token', {
          idToken,
          redirect: false
        });

        if (signInRes?.error) {
          throw new Error(signInRes.error);
        }

        // Successful login, redirect to dashboard / home
        router.push('/');
        router.refresh();
      } catch (err: any) {
        if (
          err?.message?.includes('canceled') ||
          err?.message?.includes('cancelled')
        ) {
          console.log('User canceled native sign-in flow.');
        } else {
          console.error('Native Google Sign-In error:', err);
        }
      } finally {
        setLoading(null);
      }
    } else {
      // Standard Web Sign-In
      setLoading('google');
      await signIn('google', { redirectTo: '/' });
    }
  };

  const handleGitHubSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading('github');
    // Standard Web GitHub OAuth Sign-In (runs inside or launches browser)
    await signIn('github', { redirectTo: '/' });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        size="lg"
        onClick={handleGoogleSignIn}
        disabled={loading !== null}
        className="flex items-center gap-4 w-full text-base font-normal mb-4"
      >
        <LogoGoogle />
        <p>{loading === 'google' ? 'Signing in...' : 'Sign in with Google'}</p>
      </Button>

      <Button
        size="lg"
        onClick={handleGitHubSignIn}
        disabled={loading !== null}
        className="flex items-center gap-4 w-full text-base font-normal"
      >
        <LogoGitHub />
        <p>{loading === 'github' ? 'Signing in...' : 'Sign in with GitHub'}</p>
      </Button>
    </div>
  );
}

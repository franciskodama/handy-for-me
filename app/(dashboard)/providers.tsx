'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { TooltipProvider } from '@/components/ui/tooltip';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

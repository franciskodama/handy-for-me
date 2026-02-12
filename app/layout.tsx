import './globals.css';
import { barlow } from './ui/fonts';
import { CSPostHogProvider } from './(dashboard)/providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  },
  title: 'HandyFor.Me',
  description:
    'Your personal hub for organizing daily tasks is just one click away! Configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${barlow.className} antialiased flex min-h-screen w-full flex-col`}
      >
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  );
}

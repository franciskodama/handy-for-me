import Script from 'next/script';

import './globals.css';
import { barlow } from './ui/fonts';
import Footer from '@/components/Footer';
import { CSPostHogProvider } from './(dashboard)/providers';

export const metadata = {
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
    <html lang="en">
      <head>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M5MTJNHT');
          `}
        </Script>
      </head>
      <CSPostHogProvider>
        <body
          className={`${barlow.className} antialiased flex min-h-screen w-full flex-col`}
        >
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-M5MTJNHT"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {children}
        </body>
      </CSPostHogProvider>
    </html>
  );
}

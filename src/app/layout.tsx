/* eslint-disable @next/next/no-css-tags */

import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import AppShell from '../components/app/AppShell';
import { siteConfig } from '../lib/site';
import '../styles/globals.css';
import '../styles/prism-night-owl.css';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: '/site.webmanifest',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' }],
  },
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1500,
        height: 500,
        alt: "Gideon Idoko's card image",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.xHandle,
    site: siteConfig.xHandle,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/icon/neu.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="theme-color" content="#ffffff" />
        <noscript>
          <style>{`.page--overlay{display:none !important;}`}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QJ2RYXMK6E" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QJ2RYXMK6E');
          `}
        </Script>
      </body>
    </html>
  );
}

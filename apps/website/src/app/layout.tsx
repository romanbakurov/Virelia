import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { JsonLd } from '@/components/seo/JsonLd';

import '@vellira-ui/assets/styles';
import '@vellira-ui/react/styles';

import { WebsiteProviders } from '@/providers/WebsiteProviders';

import '../styles/globals.css';

const siteDescription =
  'Production-ready React and React Native UI components, design tokens, theming, accessibility, and TypeScript support for modern applications.';

export const metadata: Metadata = {
  metadataBase: new URL('https://vellira.dev'),
  title: {
    default: 'Vellira — React & React Native Design System',
    template: '%s · Vellira',
  },
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vellira',
    description: siteDescription,
    url: '/',
    siteName: 'Vellira',
    images: [
      {
        url: '/brand/social/vellira-og-code-to-ui.png',
        width: 1200,
        height: 630,
        alt: 'Vellira design system',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vellira',
    description: siteDescription,
    images: ['/brand/social/vellira-og-code-to-ui.png'],
  },

  manifest: '/manifest.webmanifest',

  icons: {
    icon: [
      { url: '/brand/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/icons/favicon.ico' },
      { url: '/brand/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/brand/icons/favicon-16x16.png', sizes: '16x16' },
    ],

    apple: '/brand/icons/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <JsonLd />
        <WebsiteProviders>{children}</WebsiteProviders>
        <Analytics />
      </body>
    </html>
  );
}

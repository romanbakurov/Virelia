import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { JsonLd } from '@/components/seo/JsonLd';

import '@vellira-ui/assets/styles';
import '@vellira-ui/react/styles';

import { WebsiteProviders } from '@/providers/WebsiteProviders';

import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vellira.dev'),
  title: {
    default: 'Vellira',
    template: '%s · Vellira',
  },
  description:
    'Production-ready React and React Native components with shared APIs, themes, and design tokens.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vellira',
    description:
      'Production-ready React and React Native components with shared APIs, themes, and design tokens.',
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
    description:
      'Production-ready React and React Native components with shared APIs, themes, and design tokens.',
    images: ['/brand/social/vellira-og-code-to-ui.png'],
  },

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

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@vellira-ui/assets/styles';
import '@vellira-ui/tokens/css';
import '@vellira-ui/react/styles';

import { WebsiteProviders } from '@/providers/WebsiteProviders';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Vellira',
    template: '%s · Vellira',
  },
  description:
    'Production-ready React and React Native components with shared APIs, themes, and design tokens.',

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
        <WebsiteProviders>{children}</WebsiteProviders>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@vellira-ui/tokens/css';
import '@vellira-ui/react/styles';

import { WebsiteProviders } from '@/providers/WebsiteProviders';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Vellira',
    template: '%s · Vellira',
  },
  description:
    'Production-ready React and React Native components with shared APIs, themes, and design tokens.',
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

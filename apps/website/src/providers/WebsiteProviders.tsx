'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@vellira-ui/react';

interface WebsiteProvidersProps {
  children: ReactNode;
}

export function WebsiteProviders({ children }: WebsiteProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

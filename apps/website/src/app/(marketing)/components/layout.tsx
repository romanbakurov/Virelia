import type { ReactNode } from 'react';

import {
  ComponentNavigationProvider,
  ComponentsHeader,
} from '@/features/components-catalog';

interface ComponentsLayoutProps {
  children: ReactNode;
}

export default function ComponentsLayout({ children }: ComponentsLayoutProps) {
  return (
    <ComponentNavigationProvider>
      <ComponentsHeader />
      {children}
    </ComponentNavigationProvider>
  );
}

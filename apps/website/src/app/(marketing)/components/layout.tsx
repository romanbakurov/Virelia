import type { ReactNode } from 'react';

import {
  ComponentNavigationProvider,
  ComponentsHeader,
} from '@/component-catalog';

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

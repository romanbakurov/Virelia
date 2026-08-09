import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/layout/SiteHeader';
import {
  ComponentNavigationProvider,
  ComponentNavigationTrigger,
} from '@/features/components-catalog';

interface ComponentsLayoutProps {
  children: ReactNode;
}

export default function ComponentsLayout({ children }: ComponentsLayoutProps) {
  return (
    <ComponentNavigationProvider>
      <SiteHeader
        variant='portal'
        mobileAction={<ComponentNavigationTrigger />}
      />

      {children}
    </ComponentNavigationProvider>
  );
}

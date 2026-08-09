import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/layout/SiteHeader';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SiteHeader variant='marketing' />
      {children}
    </>
  );
}

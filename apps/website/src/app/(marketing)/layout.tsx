import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/layout/SiteHeader';

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  );
}

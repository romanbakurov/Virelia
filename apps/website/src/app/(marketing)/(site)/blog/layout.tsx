import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}

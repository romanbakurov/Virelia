import type { ReactNode } from 'react';

import { PageTransition } from '@/components/layout/PageTransition/PageTransition';

interface SiteTemplateProps {
  children: ReactNode;
}

export default function SiteTemplate({ children }: SiteTemplateProps) {
  return <PageTransition>{children}</PageTransition>;
}

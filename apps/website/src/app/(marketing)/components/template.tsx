import type { ReactNode } from 'react';

import { PageTransition } from '@/components/layout/PageTransition/PageTransition';

interface ComponentsTemplateProps {
  children: ReactNode;
}

export default function ComponentsTemplate({
  children,
}: ComponentsTemplateProps) {
  return <PageTransition>{children}</PageTransition>;
}

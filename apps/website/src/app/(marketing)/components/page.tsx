import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';

import { ComponentsPageHero } from '@/features/components-catalog';
import { componentsPortalEnabled } from '@/config/features';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'React Components',
  description:
    'Explore accessible, production-ready React components built with Vellira.',
  alternates: {
    canonical: '/components',
  },
  openGraph: {
    title: 'React Components | Vellira',
    description:
      'Explore accessible, production-ready React components built with Vellira.',
    url: '/components',
  },
};

export default function ComponentsPage() {
  if (!componentsPortalEnabled) {
    notFound();
  }

  return (
    <>
      <ComponentsPageHero />
      <SiteFooter />
    </>
  );
}

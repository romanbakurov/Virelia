import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';

import {
  ComponentCatalog,
  ComponentsPageHero,
} from '@/features/components-catalog';

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
  return (
    <>
      <ComponentsPageHero />
      <ComponentCatalog />
      <SiteFooter />
    </>
  );
}

import type { Metadata } from 'next';

import { ComponentCatalog } from '@/features/components-catalog';

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
      <header>
        <p>React components</p>

        <h1>Build interfaces with Vellira</h1>

        <p>
          Explore the complete Vellira React component library with live
          examples and links to detailed documentation.
        </p>
      </header>

      <ComponentCatalog />
    </>
  );
}

import type { Metadata } from 'next';

import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/sections/SiteFooter';

import { webComponents } from '@/data/components';

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
      <SiteHeader />

      <main>
        <header>
          <p>React components</p>
          <h1>Build interfaces with Vellira</h1>
          <p>
            Explore the complete Vellira React component library with live
            examples and links to detailed documentation.
          </p>
        </header>

        <section aria-label='React components'>
          {webComponents.map((component) => (
            <article key={component.slug} id={component.slug}>
              <p>{component.category}</p>
              <h2>{component.name}</h2>
              <p>{component.description}</p>
              <a href={component.docsUrl}>View documentation</a>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

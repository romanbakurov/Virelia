import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompactFooter } from '@/components/layout/CompactFooter';

import {
  ComponentExplorer,
  getComponentBySlug,
  webComponents,
} from '@/features/components-catalog';

interface ComponentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return webComponents.map((component) => ({
    slug: component.slug,
  }));
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return {};
  }

  const title = `${component.name} React Component`;
  const description = component.description;
  const url = `/components/${component.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Vellira`,
      description,
      url,
    },
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <ComponentExplorer activeSlug={component.slug} footer={<CompactFooter />}>
      <header>
        <p>{component.category}</p>

        <h1>{component.name}</h1>

        <p>{component.description}</p>

        <a href={component.docsUrl} target='_blank' rel='noreferrer noopener'>
          View full documentation
        </a>
      </header>
    </ComponentExplorer>
  );
}

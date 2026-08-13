import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CompactFooter } from '@/components/layout/CompactFooter';
import { componentsPortalEnabled } from '@/config/features';

import {
  ComponentExplorer,
  ComponentPlatformView,
  getComponentBySlug,
  webComponents,
} from '@/component-catalog';

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
  if (!componentsPortalEnabled) {
    notFound();
  }

  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <ComponentExplorer activeSlug={component.slug} footer={<CompactFooter />}>
      <ComponentPlatformView component={component} />
    </ComponentExplorer>
  );
}

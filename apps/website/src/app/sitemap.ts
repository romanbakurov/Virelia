import type { MetadataRoute } from 'next';

import { webComponents } from '@/component-catalog';

const SITE_URL = 'https://vellira.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const componentPages: MetadataRoute.Sitemap = webComponents.map(
    (component) => ({
      url: `${SITE_URL}/components/${component.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },

    {
      url: `${SITE_URL}/components`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    ...componentPages,
  ];
}

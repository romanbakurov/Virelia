import { webComponents } from './components';

export const canonicalComponentSlugs = webComponents.map(
  (component) => component.slug
);

export const canonicalComponentSlugSet = new Set<string>(
  canonicalComponentSlugs
);

export function isCanonicalComponentSlug(slug: string) {
  return canonicalComponentSlugSet.has(slug);
}

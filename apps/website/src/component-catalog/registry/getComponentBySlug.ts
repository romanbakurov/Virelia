import { webComponents } from './components';
import { isCanonicalComponentSlug } from './componentIdentity';

export function getComponentBySlug(slug: string) {
  if (!isCanonicalComponentSlug(slug)) {
    return undefined;
  }

  return webComponents.find((component) => component.slug === slug);
}

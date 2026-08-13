import { webComponents } from './components';

export function getComponentBySlug(slug: string) {
  return webComponents.find((component) => component.slug === slug);
}

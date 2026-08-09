import { ComponentCard } from '../ComponentCard';

import { webComponents } from '../../data/components';

export function ComponentCatalog() {
  return (
    <section aria-label='React components'>
      {webComponents.map((component) => (
        <ComponentCard key={component.slug} component={component} />
      ))}
    </section>
  );
}

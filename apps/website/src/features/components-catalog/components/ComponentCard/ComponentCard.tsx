import Link from 'next/link';

import type { ComponentCatalogEntry } from '../../types';

interface ComponentCardProps {
  component: ComponentCatalogEntry;
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <article id={component.slug}>
      <div>
        <span>{component.category}</span>

        {component.status === 'beta' && <span>Beta</span>}
      </div>

      <h2>{component.name}</h2>

      <p>{component.description}</p>

      <Link href={component.docsUrl} target='_blank' rel='noreferrer noopener'>
        View documentation
      </Link>
    </article>
  );
}

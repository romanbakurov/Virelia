'use client';

import { useState } from 'react';

import type { ComponentCatalogEntry, ComponentPlatform } from '../../types';
import { ComponentHeader } from '../ComponentHeader';
import { ComponentDemoStateProvider } from '../ComponentDemoStateProvider';
import { componentPages } from '../../data/componentPages';
import { ComponentApi, type ComponentApiProp } from '../ComponentApi';
import { RelatedComponents } from '../RelatedComponents';
import { webComponents } from '../../data/components';

type ComponentPlatformViewProps = {
  component: ComponentCatalogEntry;
};

type ApiWithInheritedProps = {
  inherited?: Partial<Record<ComponentPlatform, readonly ComponentApiProp[]>>;
};

export function ComponentPlatformView({
  component,
}: ComponentPlatformViewProps) {
  const [platform, setPlatform] = useState<ComponentPlatform>(
    component.platforms[0] ?? 'react'
  );

  const page = componentPages[component.slug as keyof typeof componentPages];

  const Demo = page?.demos[platform];

  const relatedSlugs = page?.related ?? [];

  const relatedComponents: ComponentCatalogEntry[] = [];

  for (const slug of relatedSlugs) {
    const relatedComponent = webComponents.find((item) => item.slug === slug);

    if (relatedComponent) {
      relatedComponents.push(relatedComponent);
    }
  }

  return (
    <>
      <ComponentHeader
        component={component}
        platform={platform}
        onPlatformChange={setPlatform}
      />

      <ComponentDemoStateProvider key={component.slug}>
        {Demo ? <Demo /> : null}

        {page && (
          <>
            <page.Usage platform={platform} />
            <page.Examples platform={platform} />

            <ComponentApi
              description={`Props available for the ${
                platform === 'react' ? 'React' : 'React Native'
              } ${page.name}.`}
              inheritedProps={
                (page.api as ApiWithInheritedProps).inherited?.[platform]
              }
              platform={platform}
              props={page.api[platform]}
            />

            <page.Accessibility platform={platform} />
            <RelatedComponents components={relatedComponents} />
          </>
        )}
      </ComponentDemoStateProvider>
    </>
  );
}

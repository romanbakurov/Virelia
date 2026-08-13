'use client';

import { useState } from 'react';

import type { ComponentCatalogEntry, ComponentPlatform } from '../../types';
import { ComponentHeader } from '../ComponentHeader';
import { ComponentDemoStateProvider } from '../ComponentDemoStateProvider';
import { componentPages } from '../../registry/componentPages';
import {
  ComponentApi,
  type ComponentApiProp,
  type ComponentApiSection,
} from '../ComponentApi';
import { RelatedComponents } from '../RelatedComponents';
import { webComponents } from '../../registry/components';

type ComponentPlatformViewProps = {
  component: ComponentCatalogEntry;
};

type ComponentPlatformApi =
  | readonly ComponentApiProp[]
  | {
      sections?: readonly ComponentApiSection[];
      props?: readonly ComponentApiProp[];
      inheritedProps?: readonly ComponentApiProp[];
    };

type ApiWithPlatformSections = Record<
  ComponentPlatform,
  ComponentPlatformApi
> & {
  inherited?: Partial<Record<ComponentPlatform, readonly ComponentApiProp[]>>;
};

type SectionedPlatformApi = Exclude<
  ComponentPlatformApi,
  readonly ComponentApiProp[]
>;

function isSectionedPlatformApi(
  api: ComponentPlatformApi
): api is SectionedPlatformApi {
  return !Array.isArray(api);
}

function getPlatformApi(
  api: ApiWithPlatformSections,
  platform: ComponentPlatform
) {
  const platformApi = api[platform];

  if (!isSectionedPlatformApi(platformApi)) {
    return {
      props: platformApi,
      sections: undefined,
      inheritedProps: api.inherited?.[platform],
    };
  }

  return {
    props: platformApi.props ?? [],
    sections: platformApi.sections,
    inheritedProps: platformApi.inheritedProps ?? api.inherited?.[platform],
  };
}

export function ComponentPlatformView({
  component,
}: ComponentPlatformViewProps) {
  const [platform, setPlatform] = useState<ComponentPlatform>(
    component.platforms[0] ?? 'react'
  );

  const page = componentPages[component.slug as keyof typeof componentPages];

  const Demo = page?.demos[platform];
  const platformApi = page
    ? getPlatformApi(page.api as ApiWithPlatformSections, platform)
    : null;

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
              inheritedProps={platformApi?.inheritedProps}
              platform={platform}
              props={platformApi?.props}
              sections={platformApi?.sections}
            />

            <page.Accessibility platform={platform} />
            <RelatedComponents components={relatedComponents} />
          </>
        )}
      </ComponentDemoStateProvider>
    </>
  );
}

'use client';

import { useState } from 'react';

import type { ComponentCatalogEntry, ComponentPlatform } from '../../types';
import { componentDemos } from '../../demos';
import { ComponentHeader } from '../ComponentHeader';

type ComponentPlatformViewProps = {
  component: ComponentCatalogEntry;
};

export function ComponentPlatformView({
  component,
}: ComponentPlatformViewProps) {
  const [platform, setPlatform] = useState<ComponentPlatform>(
    component.platforms[0] ?? 'react'
  );

  const Demo = componentDemos[component.slug]?.[platform];

  return (
    <>
      <ComponentHeader
        component={component}
        platform={platform}
        onPlatformChange={setPlatform}
      />

      {Demo ? <Demo /> : null}
    </>
  );
}

import { describe, expect, it } from 'vitest';

import { buildPlaygroundArtifacts } from './playground';

import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp } from '../model/types';

const orientation: ExtractedProp = {
  name: 'orientation',
  kind: 'select',
  options: ['horizontal', 'vertical'],
  required: false,
};

const activationMode: ExtractedProp = {
  name: 'activationMode',
  kind: 'select',
  options: ['automatic', 'manual'],
  required: false,
};

const dir: ExtractedProp = {
  name: 'dir',
  kind: 'select',
  options: ['ltr', 'rtl'],
  required: false,
};

const loop: ExtractedProp = {
  name: 'loop',
  kind: 'boolean',
  required: false,
};

const playgroundProps = [
  orientation,
  activationMode,
  dir,
  loop,
] satisfies ExtractedProp[];

const componentConfig = {
  demo: {
    initialValues: {
      orientation: 'horizontal',
      activationMode: 'automatic',
      dir: 'ltr',
      loop: true,
    },
  },
} satisfies ComponentPageMetadata;

describe('buildPlaygroundArtifacts', () => {
  it('filters playground bindings by platform API', () => {
    const result = buildPlaygroundArtifacts({
      componentName: 'Tabs',
      slug: 'tabs',
      componentConfig,
      playgroundProps,
      reactApiProps: playgroundProps,
      nativeApiProps: [orientation],
      generatedFileHeader: '',
      getChangeHandlerName: () => null,
    });

    expect(result.reactPropBindings).toContain(
      'orientation={value.orientation}'
    );
    expect(result.reactPropBindings).toContain(
      'activationMode={value.activationMode}'
    );
    expect(result.reactPropBindings).toContain('dir={value.dir}');
    expect(result.reactPropBindings).toContain('loop={value.loop}');

    expect(result.nativePropBindings).toContain(
      'orientation={value.orientation}'
    );
    expect(result.nativePropBindings).not.toContain('activationMode=');
    expect(result.nativePropBindings).not.toContain('dir=');
    expect(result.nativePropBindings).not.toContain('loop=');
  });
});

import { describe, expect, it } from 'vitest';

import { renderUsage } from './usage';

import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp } from '../model/types';

const orientation: ExtractedProp = {
  name: 'orientation',
  kind: 'select',
  options: ['horizontal', 'vertical'],
  required: false,
  type: "'horizontal' | 'vertical'",
  description: '',
};

const activationMode: ExtractedProp = {
  name: 'activationMode',
  kind: 'select',
  options: ['automatic', 'manual'],
  required: false,
  type: "'automatic' | 'manual'",
  description: '',
};

const dir: ExtractedProp = {
  name: 'dir',
  kind: 'select',
  options: ['ltr', 'rtl'],
  required: false,
  type: "'ltr' | 'rtl'",
  description: '',
};

const loop: ExtractedProp = {
  name: 'loop',
  kind: 'boolean',
  required: false,
  type: 'boolean',
  description: '',
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

describe('renderUsage', () => {
  it('guards platform-specific playground props', () => {
    const result = renderUsage({
      componentName: 'Tabs',
      componentConfig,
      playgroundProps,
      reactApiProps: playgroundProps,
      nativeApiProps: [orientation],
      generatedFileHeader: '',
      getDemoProps: () => '',
    });

    expect(result.content).toContain(
      "if (platform === 'react' && value.activationMode !== 'automatic')"
    );

    expect(result.content).toContain(
      "if (platform === 'react' && value.dir !== 'ltr')"
    );

    expect(result.content).toContain("if (platform === 'react' && value.loop)");

    expect(result.content).toContain("if (value.orientation !== 'horizontal')");
  });

  it('omits the value parameter when there are no playground props', () => {
    const result = renderUsage({
      componentName: 'Switch',
      componentConfig: {},
      playgroundProps: [],
      reactApiProps: [],
      nativeApiProps: [],
      generatedFileHeader: '',
      getDemoProps: () => '',
    });

    expect(result.content).toContain(
      'function createSwitchCode(\n  platform: ComponentPlatform\n)'
    );
    expect(result.content).toContain('const code = createSwitchCode(platform);');
    expect(result.content).not.toContain(
      'value: SwitchPlaygroundValue\n)'
    );
  });
});

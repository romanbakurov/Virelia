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

const label: ExtractedProp = {
  name: 'label',
  kind: 'string',
  required: false,
  type: 'string',
  description: '',
};

const description: ExtractedProp = {
  name: 'description',
  kind: 'string',
  required: false,
  type: 'string',
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

  it('does not emit an unused playground value when there are no controls', () => {
    const result = renderUsage({
      componentName: 'Switch',
      componentConfig: {},
      playgroundProps: [],
      reactApiProps: [],
      nativeApiProps: [],
      generatedFileHeader: '',
      getDemoProps: () => '',
    });

    expect(result.content).toMatch(
      /function createSwitchCode\(\s*platform: ComponentPlatform\s*\)/
    );
    expect(result.content).toContain(
      'const code = createSwitchCode(platform);'
    );
    expect(result.content).not.toContain('const [value] =');
  });

  it('emits demo shortcut props only on platforms whose root API supports them', () => {
    const result = renderUsage({
      componentName: 'Accordion',
      componentConfig: {
        demo: {
          label: 'Account settings',
          description: 'Expand a section to review its settings.',
        },
      },
      playgroundProps: [],
      reactApiProps: [label],
      nativeApiProps: [description],
      generatedFileHeader: '',
      getDemoProps: () => '',
    });

    expect(result.content).toContain(
      "platform === 'react'\n      ? [\n        `label='Account settings'`,\n        ]\n      : [\n        `description='Expand a section to review its settings.'`,\n        ];"
    );
  });

  it('does not emit unsupported or duplicate demo shortcut props', () => {
    const unsupported = renderUsage({
      componentName: 'Accordion',
      componentConfig: {
        demo: {
          label: 'Account settings',
          description: 'Expand a section to review its settings.',
        },
      },
      playgroundProps: [],
      reactApiProps: [],
      nativeApiProps: [],
      generatedFileHeader: '',
      getDemoProps: () => '',
    });

    expect(unsupported.content).not.toContain("label='Account settings'");
    expect(unsupported.content).not.toContain(
      "description='Expand a section to review its settings.'"
    );

    const deduplicated = renderUsage({
      componentName: 'Input',
      componentConfig: {
        demo: {
          label: 'Email',
          description: 'Work email',
        },
      },
      playgroundProps: [],
      reactApiProps: [label, description],
      nativeApiProps: [label, description],
      generatedFileHeader: '',
      getDemoProps: () => "label='Email'\ndescription='Work email'",
    });

    expect(deduplicated.content.match(/label='Email'/g)).toHaveLength(2);
    expect(deduplicated.content.match(/description='Work email'/g)).toHaveLength(2);
  });
});

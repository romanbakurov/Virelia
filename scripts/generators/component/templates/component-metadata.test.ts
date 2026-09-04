import { describe, expect, it } from 'vitest';

import { renderMetadataTemplate } from './component-metadata';

function renderMetadata(
  overrides: Partial<Parameters<typeof renderMetadataTemplate>[0]> = {}
) {
  return renderMetadataTemplate({
    componentName: 'Switch',
    layer: 'primitives',
    category: 'form',
    platforms: ['react', 'react-native'],
    profile: 'form-control',
    capabilities: [
      'controlled',
      'uncontrolled',
      'disabled',
      'required',
      'invalid',
    ],
    ...overrides,
  });
}

describe('renderMetadataTemplate', () => {
  it('uses a source-safe relative import inside the metadata package', () => {
    const result = renderMetadata();

    expect(result).toContain(
      "import { defineComponentMetadata } from '../defineComponentMetadata';"
    );
    expect(result).not.toContain(
      "import { defineComponentMetadata } from '@vellira-ui/metadata';"
    );
  });

  it('keeps no-resource generation backward compatible', () => {
    expect(renderMetadata()).toContain(`  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },`);
  });

  it('renders an icon requirement', () => {
    expect(
      renderMetadata({
        icons: [
          {
            name: 'ChevronDown',
            purpose: 'disclosure indicator',
          },
        ],
      })
    ).toContain(`    icons: [
      {
        name: 'ChevronDown',
        purpose: 'disclosure indicator',
      },
    ],`);
  });

  it('renders a token requirement', () => {
    expect(
      renderMetadata({
        tokens: ['semantic.text.primary'],
      })
    ).toContain("    tokens: ['semantic.text.primary'],");
  });

  it('renders icon and token requirements together', () => {
    const result = renderMetadata({
      icons: [
        {
          name: 'ChevronDown',
          purpose: 'disclosure indicator',
        },
      ],
      tokens: ['semantic.text.primary'],
    });

    expect(result).toContain(`    icons: [
      {
        name: 'ChevronDown',
        purpose: 'disclosure indicator',
      },
    ],
    tokens: ['semantic.text.primary'],`);
  });

  it('renders resource strings as source-safe TypeScript literals', () => {
    const result = renderMetadata({
      icons: [
        {
          name: 'ChevronDown',
          purpose: "first line\nsecond line's purpose",
        },
      ],
    });

    expect(result).toContain(
      "purpose: 'first line\\nsecond line\\'s purpose',"
    );
    expect(result).not.toContain("purpose: 'first line\nsecond line");
  });
});

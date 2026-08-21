import { describe, expect, it } from 'vitest';

import { renderMetadataTemplate } from './component-metadata';

describe('renderMetadataTemplate', () => {
  it('uses a source-safe relative import inside the metadata package', () => {
    const result = renderMetadataTemplate({
      componentName: 'Switch',
      isNative: false,
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
    });

    expect(result).toContain(
      "import { defineComponentMetadata } from '../defineComponentMetadata';"
    );
    expect(result).not.toContain(
      "import { defineComponentMetadata } from '@vellira-ui/metadata';"
    );
  });
});

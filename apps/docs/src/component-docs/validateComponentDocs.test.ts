import { describe, expect, it } from 'vitest';

import type { ComponentMetadata } from '@vellira-ui/metadata';

import { componentMetadata } from '@vellira-ui/metadata';

import { switchDocs } from './Switch.docs';
import { validateComponentDocs } from './validateComponentDocs';

const crossPlatformMetadata = componentMetadata.find(
  (metadata) => metadata.name === 'Switch'
);

if (!crossPlatformMetadata) {
  throw new Error('Switch metadata fixture is required for docs tests.');
}

const reactOnlyMetadata: ComponentMetadata = {
  ...crossPlatformMetadata,
  platforms: ['react'],
};

const reactNativeOnlyMetadata: ComponentMetadata = {
  ...crossPlatformMetadata,
  platforms: ['react-native'],
};

const validReactDocs = {
  component: 'Switch',
  platforms: {
    react: {
      title: 'Switch',
      description: 'Use Switch for immediate boolean settings.',
      summary: 'A switch toggles a setting immediately.',
      whenToUse: ['Immediate settings'],
      accessibility: ['Provide a clear accessible name.'],
      notes: ['Use Checkbox for submitted form values.'],
      storybook: {
        story: 'Default',
        title: 'Primitives/Switch',
        height: 320,
      },
      seeAlso: [
        {
          component: 'Checkbox',
          label: 'For independent selections.',
        },
      ],
    },
  },
} as const;

const validReactNativeDocs = {
  component: 'Switch',
  platforms: {
    'react-native': {
      title: 'React Native Switch',
      description: 'Use Switch for immediate native boolean settings.',
      summary: 'A native switch toggles a setting immediately.',
      whenToUse: ['Immediate native settings'],
      accessibility: ['Provide a clear accessibilityLabel.'],
      notes: ['Verify announcements with assistive technology.'],
      seeAlso: [
        {
          component: 'Checkbox',
        },
      ],
    },
  },
} as const;

describe('validateComponentDocs', () => {
  it('accepts a valid cross-platform contract', () => {
    const result = validateComponentDocs(switchDocs, crossPlatformMetadata);

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.value.component).toBe('Switch');
    }
  });

  it('accepts a valid React-only contract', () => {
    expect(validateComponentDocs(validReactDocs, reactOnlyMetadata)).toEqual({
      valid: true,
      errors: [],
      value: validReactDocs,
    });
  });

  it('accepts a valid React Native-only contract', () => {
    expect(
      validateComponentDocs(validReactNativeDocs, reactNativeOnlyMetadata)
    ).toEqual({
      valid: true,
      errors: [],
      value: validReactNativeDocs,
    });
  });

  it('rejects unsupported platform mismatch against metadata', () => {
    const result = validateComponentDocs(
      validReactNativeDocs,
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react-native is not supported by metadata.platforms for Switch.'
      );
    }
  });

  it('rejects missing or empty title', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            title: ' ',
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.title must be a non-empty string.'
      );
    }
  });

  it('rejects missing or empty description', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            description: '',
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.description must be a non-empty string.'
      );
    }
  });

  it('rejects missing or empty summary', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            summary: '\t',
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.summary must be a non-empty string.'
      );
    }
  });

  it('rejects malformed optional arrays', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            whenToUse: ['Immediate settings', 'Immediate settings'],
            accessibility: ['Valid item', ''],
            notes: ['Valid note', 42],
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.whenToUse must not contain duplicates.'
      );
      expect(result.errors).toContain(
        'platforms.react.accessibility must not contain empty values.'
      );
      expect(result.errors).toContain(
        'platforms.react.notes must be an array of non-empty strings.'
      );
    }
  });

  it('rejects invalid Storybook reference', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            storybook: {
              story: '',
              title: ' ',
            },
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.storybook.story must be a non-empty string.'
      );
      expect(result.errors).toContain(
        'platforms.react.storybook.title must be a non-empty string.'
      );
    }
  });

  it('rejects invalid Storybook height', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            storybook: {
              story: 'Default',
              title: 'Primitives/Switch',
              height: Number.POSITIVE_INFINITY,
            },
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.storybook.height must be a positive finite number.'
      );
    }
  });

  it('rejects malformed related-component references', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            seeAlso: [
              {
                component: '',
              },
              {
                component: 'FormField',
                label: '',
              },
            ],
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.seeAlso[0].component must be a non-empty string.'
      );
      expect(result.errors).toContain(
        'platforms.react.seeAlso[1].label must be a non-empty string.'
      );
    }
  });

  it('rejects duplicate related components', () => {
    const result = validateComponentDocs(
      {
        ...validReactDocs,
        platforms: {
          react: {
            ...validReactDocs.platforms.react,
            seeAlso: [
              {
                component: 'Checkbox',
              },
              {
                component: 'Checkbox',
                label: 'Duplicate',
              },
            ],
          },
        },
      },
      reactOnlyMetadata
    );

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'platforms.react.seeAlso must not contain duplicate components.'
      );
    }
  });
});

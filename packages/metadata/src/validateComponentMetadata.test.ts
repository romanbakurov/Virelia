import { describe, expect, it } from 'vitest';

import { validateComponentMetadata } from './validateComponentMetadata';

const validMetadata = {
  name: 'Button',
  layer: 'primitives',
  category: 'action',
  platforms: ['react', 'react-native'],
  profile: 'base',
  status: 'stable',
  capabilities: ['disabled', 'loading'],
  dependencies: {
    packages: ['@vellira-ui/tokens'],
    components: [],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
    tokens: ['button'],
  },
} as const;

describe('validateComponentMetadata', () => {
  it('accepts valid component metadata', () => {
    const result = validateComponentMetadata(validMetadata);

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.value.name).toBe('Button');
    }
  });

  it('rejects non-object input', () => {
    expect(validateComponentMetadata(null)).toEqual({
      valid: false,
      errors: ['Component metadata must be an object.'],
    });
  });

  it('rejects missing required fields', () => {
    const result = validateComponentMetadata({});

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain('name must be a non-empty string.');
      expect(result.errors).toContain('requirements must be an object.');
    }
  });

  it('rejects unsupported enum values', () => {
    const result = validateComponentMetadata({
      ...validMetadata,
      category: 'unknown',
      platforms: ['web'],
      status: 'ready',
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'category must be one of: action, form, navigation, overlay, feedback, data-display, layout, utility.'
      );
      expect(result.errors).toContain(
        'platforms contains unsupported values: web.'
      );
      expect(result.errors).toContain(
        'status must be one of: experimental, stable, deprecated.'
      );
    }
  });

  it('rejects duplicate metadata entries', () => {
    const result = validateComponentMetadata({
      ...validMetadata,
      platforms: ['react', 'react'],
      capabilities: ['disabled', 'disabled'],
      requirements: {
        ...validMetadata.requirements,
        tokens: ['button', 'button'],
      },
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain('platforms must not contain duplicates.');
      expect(result.errors).toContain(
        'capabilities must not contain duplicates.'
      );
      expect(result.errors).toContain(
        'requirements.tokens must not contain duplicates.'
      );
    }
  });

  it('rejects invalid requirement types', () => {
    const result = validateComponentMetadata({
      ...validMetadata,
      requirements: {
        tests: 'yes',
        storybook: true,
        docs: true,
        accessibility: true,
      },
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain('requirements.tests must be a boolean.');
    }
  });

  it('rejects unsupported component profile', () => {
    const result = validateComponentMetadata({
      ...validMetadata,
      profile: 'unknown',
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toContain(
        'profile must be one of: base, form-control, compound, overlay.'
      );
    }
  });
});

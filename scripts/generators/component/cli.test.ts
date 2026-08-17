import { describe, expect, it } from 'vitest';

import { componentGeneratorUsage, parseComponentGeneratorArgs } from './cli';

describe('component generator CLI', () => {
  it('parses a complete component command', () => {
    expect(
      parseComponentGeneratorArgs([
        'Avatar',
        'both',
        'primitives',
        'data-display',
      ])
    ).toEqual({
      componentName: 'Avatar',
      platform: 'both',
      layer: 'primitives',
      category: 'data-display',
      profile: 'base',
      force: false,
    });
  });

  it('parses --force', () => {
    expect(
      parseComponentGeneratorArgs([
        'Toast',
        'web',
        'components',
        'feedback',
        '--force',
      ])
    ).toMatchObject({
      componentName: 'Toast',
      force: true,
    });
  });

  it('rejects missing arguments', () => {
    expect(() => parseComponentGeneratorArgs(['Avatar', 'both'])).toThrow(
      componentGeneratorUsage
    );
  });

  it.each(['avatar', 'avatar-item', 'Avatar_Item', '123Avatar'])(
    'rejects invalid component name "%s"',
    (name) => {
      expect(() =>
        parseComponentGeneratorArgs([
          name,
          'both',
          'primitives',
          'data-display',
        ])
      ).toThrow(
        'Component name must be PascalCase and contain only letters and numbers.'
      );
    }
  );

  it('rejects invalid platform', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Avatar',
        'desktop',
        'primitives',
        'data-display',
      ])
    ).toThrow('Invalid platform "desktop"');
  });

  it('rejects invalid layer', () => {
    expect(() =>
      parseComponentGeneratorArgs(['Avatar', 'both', 'widgets', 'data-display'])
    ).toThrow('Invalid layer "widgets"');
  });

  it('rejects invalid category', () => {
    expect(() =>
      parseComponentGeneratorArgs(['Avatar', 'both', 'primitives', 'profile'])
    ).toThrow('Invalid category "profile"');
  });

  it('rejects unknown flags', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Avatar',
        'both',
        'primitives',
        'data-display',
        '--overwrite',
      ])
    ).toThrow('Unknown option: --overwrite');
  });

  it('rejects unexpected positional arguments', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Avatar',
        'both',
        'primitives',
        'data-display',
        'extra',
      ])
    ).toThrow('Unexpected arguments: extra');
  });

  it('uses base profile by default', () => {
    const result = parseComponentGeneratorArgs([
      'Avatar',
      'both',
      'primitives',
      'data-display',
    ]);

    expect(result.profile).toBe('base');
  });

  it('parses an explicit component profile', () => {
    const result = parseComponentGeneratorArgs([
      'Modal',
      'both',
      'components',
      'overlay',
      '--profile=overlay',
    ]);

    expect(result.profile).toBe('overlay');
  });

  it('rejects an unsupported component profile', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Avatar',
        'both',
        'primitives',
        'data-display',
        '--profile=unknown',
      ])
    ).toThrow(
      'Invalid component profile "unknown". Expected base, form-control, compound, or overlay.'
    );
  });
});

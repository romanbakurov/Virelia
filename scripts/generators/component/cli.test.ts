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
      control: 'value',
      capabilities: [],
      parts: [],
      force: false,
      dryRun: false,
      check: false,
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

  it('parses --dry-run', () => {
    expect(
      parseComponentGeneratorArgs([
        'Avatar',
        'both',
        'primitives',
        'data-display',
        '--dry-run',
      ])
    ).toMatchObject({
      componentName: 'Avatar',
      dryRun: true,
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

  it('parses explicit boolean form-control intent', () => {
    const result = parseComponentGeneratorArgs([
      'Switch',
      'both',
      'components',
      'form',
      '--profile=form-control',
      '--control=boolean',
    ]);

    expect(result.control).toBe('boolean');
  });

  it('parses explicit text form-control intent', () => {
    const result = parseComponentGeneratorArgs([
      'Textarea',
      'both',
      'components',
      'form',
      '--profile=form-control',
      '--control=text',
    ]);

    expect(result.control).toBe('text');
  });

  it('parses explicit metadata capabilities', () => {
    const result = parseComponentGeneratorArgs([
      'Accordion',
      'both',
      'components',
      'navigation',
      '--profile=compound',
      '--capabilities=controlled,uncontrolled,disabled,keyboard',
      '--parts=Root,Item,Trigger,Content',
    ]);

    expect(result.capabilities).toEqual([
      'controlled',
      'uncontrolled',
      'disabled',
      'keyboard',
    ]);
  });

  it('rejects invalid metadata capabilities', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Accordion',
        'both',
        'components',
        'navigation',
        '--profile=compound',
        '--capabilities=keyboard,gesture',
      ])
    ).toThrow('Invalid component capabilities: gesture.');
  });

  it('rejects duplicate metadata capabilities', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Accordion',
        'both',
        'components',
        'navigation',
        '--profile=compound',
        '--capabilities=keyboard,keyboard',
      ])
    ).toThrow('Component capabilities must not contain duplicates.');
  });

  it('rejects unsupported form-control intent', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Switch',
        'both',
        'components',
        'form',
        '--profile=form-control',
        '--control=toggle',
      ])
    ).toThrow(
      'Invalid form-control kind "toggle". Expected value, boolean, or text.'
    );
  });

  it('rejects specialized control intent outside form-control profile', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Switch',
        'both',
        'components',
        'form',
        '--control=boolean',
      ])
    ).toThrow('--control is only supported by the form-control profile.');
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

  it('parses component parts', () => {
    const result = parseComponentGeneratorArgs([
      'Tabs',
      'both',
      'components',
      'navigation',
      '--profile=compound',
      '--parts=Root,List,Trigger,Content',
    ]);

    expect(result.parts).toEqual(['Root', 'List', 'Trigger', 'Content']);
  });

  it('rejects invalid component parts', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Tabs',
        'both',
        'components',
        'navigation',
        '--parts=Root,tab-trigger',
      ])
    ).toThrow(
      'Component parts must be PascalCase and contain only letters and numbers.'
    );
  });

  it('rejects duplicate component parts', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Tabs',
        'both',
        'components',
        'navigation',
        '--parts=Root,Trigger,Trigger',
      ])
    ).toThrow('Component parts must not contain duplicates.');
  });
});

describe('component generator check mode', () => {
  it('parses --check as a read-only generator mode', () => {
    const result = parseComponentGeneratorArgs([
      'Avatar',
      'both',
      'primitives',
      'data-display',
      '--check',
    ]);

    expect(result.check).toBe(true);
    expect(result.dryRun).toBe(false);
  });

  it('rejects combining --check with --dry-run', () => {
    expect(() =>
      parseComponentGeneratorArgs([
        'Avatar',
        'both',
        'primitives',
        'data-display',
        '--check',
        '--dry-run',
      ])
    ).toThrow('--dry-run and --check cannot be used together.');
  });
});

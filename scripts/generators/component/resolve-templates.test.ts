import { describe, expect, it } from 'vitest';

import { resolveComponentTemplates } from './resolve-templates';

import type {
  ComponentGenerationPlan,
  ComponentGenerationTarget,
} from './plan';

const createTarget = (isNative: boolean): ComponentGenerationTarget => ({
  packageName: isNative ? 'react-native' : 'react',
  componentDir: '/repo/component',
  barrelFile: '/repo/index.ts',
  isNative,
});

const createPlan = (
  profile: ComponentGenerationPlan['profile']
): ComponentGenerationPlan => ({
  componentName: 'Example',
  layer: 'components',
  category: 'utility',
  profile,
  parts: profile === 'compound' ? ['Root', 'Trigger', 'Content'] : [],
  force: false,
  targets: [],
  metadataFile: '/repo/metadata.ts',
  metadataBarrelFile: '/repo/metadata/index.ts',
});

describe('component template resolver', () => {
  it('resolves base web templates', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('base'),
      target: createTarget(false),
    });

    expect(result.component).toContain('<div');
  });

  it('resolves base native templates', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('base'),
      target: createTarget(true),
    });

    expect(result.component).toContain('<View');
  });

  it('resolves form-control web templates', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('form-control'),
      target: createTarget(false),
    });

    expect(result.types).toContain('onValueChange');
    expect(result.component).toContain('<button');
  });

  it('resolves form-control native templates', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('form-control'),
      target: createTarget(true),
    });

    expect(result.component).toContain('<Pressable');
  });

  it('resolves compound templates', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('compound'),
      target: createTarget(false),
    });

    expect(result.component).toContain('Object.assign(ExampleRoot');
  });

  it('resolves web overlay templates', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('overlay'),
      target: createTarget(false),
    });

    expect(result.types).toContain('closeOnEscape?: boolean');
    expect(result.types).toContain('closeOnOutsidePress?: boolean');
    expect(result.component).toContain('<div');
    expect(result.component).toContain('closeOnEscape = true');
  });

  it('resolves native overlay templates without browser-only behavior', () => {
    const result = resolveComponentTemplates({
      plan: createPlan('overlay'),
      target: createTarget(true),
    });

    expect(result.types).toContain('closeOnOutsidePress?: boolean');
    expect(result.types).toContain('restoreFocus?: boolean');
    expect(result.types).not.toContain('closeOnEscape');

    expect(result.component).toContain('<View>');
    expect(result.component).not.toContain('closeOnEscape');
  });
});

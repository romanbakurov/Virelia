import { describe, expect, it } from 'vitest';

import { resolvePartTemplates } from './resolve-part-templates';

import type {
  ComponentGenerationPlan,
  ComponentGenerationTarget,
} from './plan';

const plan: ComponentGenerationPlan = {
  componentName: 'Tabs',
  layer: 'components',
  category: 'navigation',
  profile: 'compound',
  parts: ['Root', 'Trigger'],
  force: false,
  targets: [],
  metadataFile: '/repo/metadata.ts',
  metadataBarrelFile: '/repo/metadata/index.ts',
};

const createTarget = (isNative: boolean): ComponentGenerationTarget => ({
  packageName: isNative ? 'react-native' : 'react',
  componentDir: '/repo/Tabs',
  barrelFile: '/repo/index.ts',
  isNative,
});

describe('component part template resolver', () => {
  it('resolves web part templates', () => {
    const result = resolvePartTemplates({
      plan,
      target: createTarget(false),
      partName: 'Trigger',
    });

    expect(result.types).toContain('TabsTriggerProps');
    expect(result.index).toContain("export * from './TabsTrigger'");
    expect(result.component).toContain('export function TabsTrigger');
    expect(result.component).toContain('<div>');
  });

  it('resolves native part templates', () => {
    const result = resolvePartTemplates({
      plan,
      target: createTarget(true),
      partName: 'Content',
    });

    expect(result.component).toContain('export function TabsContent');
    expect(result.component).toContain('<View>');
  });
});

import type { ComponentDependencies } from '@vellira-ui/metadata';
import { describe, expect, it } from 'vitest';

import { createComponentGenerationPlan } from './plan';

function planWithPlatforms(
  platforms: NonNullable<ComponentDependencies['platforms']>
) {
  return createComponentGenerationPlan({
    root: '/repo',
    options: {
      componentName: 'ContractProbe',
      platform: 'both',
      layer: 'components',
      category: 'utility',
      profile: 'base',
      capabilities: [],
      dependencies: { platforms },
      parts: [],
      force: false,
    },
  });
}

describe('component production plan normalization', () => {
  it('canonicalizes platform dependency order independently of JSON insertion order', () => {
    const reversed = planWithPlatforms({
      'react-native': { packages: ['@vellira-ui/assets'] },
      react: { packages: ['@vellira-ui/icons'] },
    });
    const forward = planWithPlatforms({
      react: { packages: ['@vellira-ui/icons'] },
      'react-native': { packages: ['@vellira-ui/assets'] },
    });

    expect(Object.keys(reversed.dependencies.platforms ?? {})).toEqual([
      'react',
      'react-native',
    ]);
    expect(reversed.dependencies).toEqual(forward.dependencies);
  });
});

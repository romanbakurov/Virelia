import { describe, expect, it } from 'vitest';

import { runComponentQualityCheck } from './engine';
import type { ComponentQualityRule } from './types';

const passRule: ComponentQualityRule = {
  definition: {
    id: 'test.pass',
    dimension: 'implementation-completeness',
    severity: 'required',
    evaluation: 'automated',
    description: 'Test passing rule.',
  },
  evaluate: ({ platform }) => ({
    ruleId: 'placeholder',
    dimension: 'implementation-completeness',
    severity: 'required',
    evaluation: 'automated',
    status: 'pass',
    platform,
  }),
};

const warningRule: ComponentQualityRule = {
  definition: {
    id: 'test.warning',
    dimension: 'documentation',
    severity: 'recommended',
    evaluation: 'automated',
    description: 'Test warning rule.',
  },
  evaluate: ({ platform }) => ({
    ruleId: 'placeholder',
    dimension: 'documentation',
    severity: 'recommended',
    evaluation: 'automated',
    status: 'warn',
    platform,
    message: 'Needs improvement.',
  }),
};

const webOnlyMetadata = {
  name: 'WebOnly',
  layer: 'components',
  category: 'utility',
  platforms: ['react'],
  profile: 'base',
  status: 'stable',
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
} as const;

describe('runComponentQualityCheck', () => {
  it('evaluates one component and aggregates rule results', async () => {
    const result = await runComponentQualityCheck({
      componentName: 'Button',
      rules: [passRule, warningRule],
    });

    expect(result.status).toBe('warn');
    expect(result.report.schemaVersion).toBe('1');
    expect(result.report.components).toHaveLength(1);
    expect(result.report.components[0]?.componentName).toBe('Button');
    expect(
      result.report.components[0]?.findings.map((finding) => finding.ruleId)
    ).toContain('test.pass');
  });

  it('can target one platform independently', async () => {
    const result = await runComponentQualityCheck({
      componentName: 'Button',
      platform: 'native',
      rules: [passRule],
    });

    expect(result.report.components[0]?.platforms).toHaveLength(1);
    expect(result.report.components[0]?.platforms[0]?.platform).toBe(
      'react-native'
    );
  });

  it('reports not-applicable when no rules are registered', async () => {
    const result = await runComponentQualityCheck({
      componentName: 'Button',
      rules: [],
    });

    expect(result.status).toBe('not-applicable');
  });

  it('rejects unknown components', async () => {
    await expect(
      runComponentQualityCheck({ componentName: 'DoesNotExist' })
    ).rejects.toThrow('Unknown component');
  });

  it('rejects unsupported platform selection', async () => {
    await expect(
      runComponentQualityCheck({
        componentName: 'WebOnly',
        platform: 'native',
        metadataRegistry: [webOnlyMetadata],
      })
    ).rejects.toThrow('does not support platform');
  });

  it('rejects malformed metadata', async () => {
    await expect(
      runComponentQualityCheck({ metadataRegistry: [{ name: 'Broken' }] })
    ).rejects.toThrow('Invalid metadata for Broken');
  });

  it('wraps rule execution failures as runtime errors', async () => {
    const brokenRule: ComponentQualityRule = {
      ...passRule,
      definition: { ...passRule.definition, id: 'test.broken' },
      evaluate: () => {
        throw new Error('boom');
      },
    };

    await expect(
      runComponentQualityCheck({ componentName: 'Button', rules: [brokenRule] })
    ).rejects.toThrow('test.broken');
  });
});

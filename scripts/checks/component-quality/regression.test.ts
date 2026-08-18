import { describe, expect, it } from 'vitest';

import { runComponentQualityCheck } from './engine';
import {
  crossPlatformMetadata,
  malformedMetadata,
  nativeOnlyMetadata,
  webOnlyMetadata,
} from './fixtures/metadata';
import {
  failRule,
  notApplicableRule,
  passRule,
  warnRule,
} from './fixtures/rules';

describe('Component Quality Checker regression contracts', () => {
  it('aggregates PASS deterministically', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [webOnlyMetadata],
      rules: [passRule],
    });

    expect(result.status).toBe('pass');
  });

  it('aggregates WARN above PASS', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [webOnlyMetadata],
      rules: [passRule, warnRule],
    });

    expect(result.status).toBe('warn');
  });

  it('aggregates FAIL above WARN and PASS', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [webOnlyMetadata],
      rules: [passRule, warnRule, failRule],
    });

    expect(result.status).toBe('fail');
  });

  it('preserves not-applicable when no applicable quality signal exists', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [webOnlyMetadata],
      rules: [notApplicableRule],
    });

    expect(result.status).toBe('not-applicable');
  });

  it('evaluates Web-only metadata only on React', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [webOnlyMetadata],
      rules: [passRule],
    });

    expect(result.report.components[0]?.platforms).toHaveLength(1);
    expect(result.report.components[0]?.platforms[0]?.platform).toBe('react');
  });

  it('evaluates Native-only metadata only on React Native', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [nativeOnlyMetadata],
      rules: [passRule],
    });

    expect(result.report.components[0]?.platforms).toHaveLength(1);
    expect(result.report.components[0]?.platforms[0]?.platform).toBe(
      'react-native'
    );
  });

  it('evaluates cross-platform metadata independently on both platforms', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [crossPlatformMetadata],
      rules: [passRule],
    });

    expect(
      result.report.components[0]?.platforms.map(({ platform }) => platform)
    ).toEqual(['react', 'react-native']);
  });

  it('rejects unsupported platform selection', async () => {
    await expect(
      runComponentQualityCheck({
        metadataRegistry: [webOnlyMetadata],
        platform: 'native',
        rules: [passRule],
      })
    ).rejects.toThrow('does not support platform');
  });

  it('rejects malformed metadata predictably', async () => {
    await expect(
      runComponentQualityCheck({
        metadataRegistry: [malformedMetadata],
        rules: [passRule],
      })
    ).rejects.toThrow('Invalid metadata for MalformedFixture');
  });

  it('keeps the V1 machine-readable report contract stable', async () => {
    const result = await runComponentQualityCheck({
      metadataRegistry: [crossPlatformMetadata],
      rules: [passRule, warnRule],
    });

    expect(result.report).toMatchObject({
      schemaVersion: '1',
      components: [
        {
          componentName: 'CrossPlatformFixture',
          status: 'warn',
        },
      ],
    });

    expect(
      result.report.components[0]?.findings.map(({ ruleId }) => ruleId)
    ).toEqual(['fixture.pass', 'fixture.warn', 'fixture.pass', 'fixture.warn']);
  });
});

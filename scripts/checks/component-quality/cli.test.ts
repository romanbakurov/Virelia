import { describe, expect, it } from 'vitest';

import { runCli } from './cli';
import type { ComponentQualityRunResult } from './types';

describe('component quality CLI', () => {
  it('prints deterministic human-readable output', async () => {
    const output: string[] = [];

    const exitCode = await runCli(['Button'], (message) =>
      output.push(message)
    );

    expect(exitCode).toBe(0);

    const report = output.join('\n');

    expect(report).toContain('Button: PASS');
    expect(report).toContain('react: PASS');
    expect(report).toContain('react-native: PASS');
    expect(report).toContain('[PASS] api.public-surface');
    expect(report).toContain('[NOT-APPLICABLE] api.controlled-contract');
    expect(report).toContain('[PASS] api.declared-capabilities');
  });

  it('prints the V1 report as JSON', async () => {
    const output: string[] = [];

    const exitCode = await runCli(['Button', '--json'], (message) =>
      output.push(message)
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(output[0] ?? '{}')).toMatchObject({
      schemaVersion: '1',
      components: [{ componentName: 'Button' }],
    });
  });

  it('returns runtime exit code 2 for invalid input', async () => {
    const errors: string[] = [];

    const exitCode = await runCli(
      ['Button', '--platform', 'desktop'],
      () => undefined,
      (message) => errors.push(message)
    );

    expect(exitCode).toBe(2);
    expect(errors[0]).toContain('Expected --platform');
  });

  it('returns exit code 0 for warning-only quality results', async () => {
    const runCheck = async (): Promise<ComponentQualityRunResult> => ({
      status: 'warn',
      report: {
        schemaVersion: '1',
        components: [],
      },
    });

    const exitCode = await runCli(
      ['--all'],
      () => undefined,
      () => undefined,
      runCheck
    );

    expect(exitCode).toBe(0);
  });

  it('returns exit code 1 for blocking quality failures', async () => {
    const runCheck = async (): Promise<ComponentQualityRunResult> => ({
      status: 'fail',
      report: {
        schemaVersion: '1',
        components: [],
      },
    });

    const exitCode = await runCli(
      ['--all'],
      () => undefined,
      () => undefined,
      runCheck
    );

    expect(exitCode).toBe(1);
  });

  it('returns exit code 2 for checker runtime failures', async () => {
    const errors: string[] = [];

    const runCheck = async (): Promise<ComponentQualityRunResult> => {
      throw new Error('fixture runtime failure');
    };

    const exitCode = await runCli(
      ['--all'],
      () => undefined,
      (message) => errors.push(message),
      runCheck
    );

    expect(exitCode).toBe(2);
    expect(errors[0]).toContain('fixture runtime failure');
  });
});

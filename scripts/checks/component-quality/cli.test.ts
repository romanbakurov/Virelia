import { describe, expect, it } from 'vitest';

import { runCli } from './cli';

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
});

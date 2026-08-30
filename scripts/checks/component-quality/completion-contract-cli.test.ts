import { describe, expect, it } from 'vitest';

import { runCompletionContractCli } from './completion-contract-cli';
import type { ComponentQualityCompletionContractV1 } from './completion-contract';

const fixtureContract: ComponentQualityCompletionContractV1 = {
  schemaVersion: '1',
  componentName: 'Avatar',
  platforms: [
    {
      platform: 'react',
      requirements: [],
    },
  ],
};

describe('component quality completion contract CLI', () => {
  it('prints the V1 completion contract as JSON', async () => {
    const output: string[] = [];

    const buildContract = async () => fixtureContract;

    const exitCode = await runCompletionContractCli(
      ['Avatar'],
      (message) => output.push(message),
      () => undefined,
      buildContract
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(output[0] ?? '{}')).toEqual(fixtureContract);
  });

  it('passes platform selection to the contract builder', async () => {
    let receivedOptions: unknown;

    const buildContract = async (
      options: Parameters<
        typeof import('./completion-contract').buildComponentQualityCompletionContract
      >[0]
    ) => {
      receivedOptions = options;
      return fixtureContract;
    };

    const exitCode = await runCompletionContractCli(
      ['Avatar', '--platform', 'native'],
      () => undefined,
      () => undefined,
      buildContract
    );

    expect(exitCode).toBe(0);
    expect(receivedOptions).toEqual({
      componentName: 'Avatar',
      platform: 'native',
    });
  });

  it('requires exactly one component name', async () => {
    const errors: string[] = [];

    const exitCode = await runCompletionContractCli(
      [],
      () => undefined,
      (message) => errors.push(message)
    );

    expect(exitCode).toBe(2);
    expect(errors[0]).toContain('Provide exactly one component name');
  });

  it('rejects invalid platform selection', async () => {
    const errors: string[] = [];

    const exitCode = await runCompletionContractCli(
      ['Avatar', '--platform', 'desktop'],
      () => undefined,
      (message) => errors.push(message)
    );

    expect(exitCode).toBe(2);
    expect(errors[0]).toContain('Expected --platform');
  });

  it('returns exit code 2 for contract runtime failures', async () => {
    const errors: string[] = [];

    const buildContract =
      async (): Promise<ComponentQualityCompletionContractV1> => {
        throw new Error('fixture runtime failure');
      };

    const exitCode = await runCompletionContractCli(
      ['Avatar'],
      () => undefined,
      (message) => errors.push(message),
      buildContract
    );

    expect(exitCode).toBe(2);
    expect(errors[0]).toContain('fixture runtime failure');
  });
});

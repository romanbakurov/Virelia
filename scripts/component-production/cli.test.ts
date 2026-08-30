import { describe, expect, it } from 'vitest';

import type {
  ComponentProductionInputV1,
  ComponentProductionResultV1,
} from './contracts';
import { runComponentProductionCli } from './cli';

const SPEC: ComponentProductionInputV1 = {
  schemaVersion: '1',
  componentName: 'Avatar',
  platform: 'both',
  layer: 'primitives',
  category: 'data-display',
  profile: 'base',
  capabilities: [],
  parts: [],
};

describe('runComponentProductionCli', () => {
  it('reads an explicit JSON specification and emits the production result', async () => {
    const output: string[] = [];
    let observedInput: unknown;

    const exitCode = await runComponentProductionCli(
      ['--spec', 'avatar.json'],
      {
        root: '/tmp/vellira-production',
        readFile: (filePath) => {
          expect(filePath).toBe('/tmp/vellira-production/avatar.json');

          return JSON.stringify(SPEC);
        },
        runProduction: async ({ root, input }) => {
          expect(root).toBe('/tmp/vellira-production');

          observedInput = input;

          return readyResult();
        },
        write: (message) => {
          output.push(message);
        },
      }
    );

    expect(exitCode).toBe(0);
    expect(observedInput).toEqual(SPEC);

    expect(JSON.parse(output[0] ?? '')).toMatchObject({
      schemaVersion: '1',
      status: 'ready',
      readyForReview: true,
    });
  });

  it('uses exit code 1 for a deterministic blocked result', async () => {
    const exitCode = await runComponentProductionCli(
      ['--spec', 'avatar.json'],
      {
        readFile: () => JSON.stringify(SPEC),
        runProduction: async () => ({
          ...readyResult(),
          status: 'blocked',
          readyForReview: false,
          stages: [
            {
              id: 'preflight',
              status: 'blocked',
              summary: 'Preflight blocked.',
              findings: [
                {
                  id: 'preflight:repository-safety',
                  stage: 'preflight',
                  severity: 'blocking',
                  message: 'Protected branch.',
                },
              ],
              artifacts: [],
            },
          ],
          blockingFindings: [
            {
              id: 'preflight:repository-safety',
              stage: 'preflight',
              severity: 'blocking',
              message: 'Protected branch.',
            },
          ],
        }),
        write: () => undefined,
      }
    );

    expect(exitCode).toBe(1);
  });

  it('uses exit code 2 for runtime production failure', async () => {
    const exitCode = await runComponentProductionCli(
      ['--spec', 'avatar.json'],
      {
        readFile: () => JSON.stringify(SPEC),
        runProduction: async () => ({
          ...readyResult(),
          status: 'failed',
          readyForReview: false,
        }),
        write: () => undefined,
      }
    );

    expect(exitCode).toBe(2);
  });

  it('returns a machine-readable error for malformed JSON', async () => {
    const errors: string[] = [];

    const exitCode = await runComponentProductionCli(
      ['--spec', 'avatar.json'],
      {
        readFile: () => '{bad json',
        writeError: (message) => {
          errors.push(message);
        },
      }
    );

    expect(exitCode).toBe(2);

    expect(JSON.parse(errors[0] ?? '')).toMatchObject({
      schemaVersion: '1',
      status: 'error',
      error: {
        message: expect.stringContaining(
          'Unable to read component production specification'
        ),
      },
    });
  });

  it('rejects missing or unknown CLI arguments', async () => {
    const errors: string[] = [];

    expect(
      await runComponentProductionCli([], {
        writeError: (message) => errors.push(message),
      })
    ).toBe(2);

    expect(
      await runComponentProductionCli(['--force'], {
        writeError: (message) => errors.push(message),
      })
    ).toBe(2);

    expect(errors.join('\n')).toContain('component-production:json --spec');

    expect(errors.join('\n')).toContain('Unknown component production option');
  });
});

function readyResult(): ComponentProductionResultV1 {
  return {
    schemaVersion: '1',
    input: SPEC,
    status: 'ready',
    readyForReview: true,
    stages: [],
    blockingFindings: [],
    artifacts: [],
    outputs: {
      generation: {
        status: 'passed',
        artifacts: [],
      },
      metadata: {
        generated: false,
        artifacts: [],
      },
      testGeneration: {
        generated: false,
        artifacts: [],
      },
      docsGeneration: {
        generated: false,
        artifacts: [],
      },
      websiteGeneration: {
        generated: false,
        artifacts: [],
      },
    },
    validationSummary: {
      status: 'ready',
      passedStages: [],
      blockedStages: [],
      failedStages: [],
      skippedStages: [],
    },
    completeness: null,
    quality: null,
  };
}

import { describe, expect, it } from 'vitest';

import type { ComponentCompletenessResult } from '../checks/component-completeness/types';
import type { ComponentQualityRunResult } from '../checks/component-quality/types';

import type { ComponentProductionInputV1 } from './contracts';
import {
  runComponentProductionStructuredValidation,
  type ComponentProductionStructuredValidationWorkerExecution,
} from './structured-validation';
import type { ComponentProductionValidationWorkerResult } from './structured-validation-protocol';

const INPUT: ComponentProductionInputV1 = {
  schemaVersion: '1',
  componentName: 'Avatar',
  platform: 'both',
  layer: 'primitives',
  category: 'data-display',
  profile: 'base',
  capabilities: [],
  parts: [],
};

describe('runComponentProductionStructuredValidation', () => {
  it('runs validation against a fresh canonical candidate context', async () => {
    let observedPlatform: string | undefined;

    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      runner: (params) => {
        observedPlatform = params.platform;

        return workerSuccess({
          completeness: [
            {
              componentName: 'Avatar',
              ready: true,
              checks: [],
            },
          ],
          quality: passingQuality(),
        });
      },
    });

    expect(observedPlatform).toBe('all');

    expect(result.stages.map((stage) => [stage.id, stage.status])).toEqual([
      ['completeness', 'passed'],
      ['quality', 'passed'],
    ]);
  });

  it('blocks when the generated component is not registered in canonical metadata', async () => {
    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      runner: () =>
        workerResult({
          schemaVersion: '1',
          status: 'blocked',
          componentName: 'Avatar',
          code: 'component-not-registered',
          message: 'Avatar is not registered in canonical component metadata.',
        }),
    });

    expect(result.stages[0]).toMatchObject({
      id: 'completeness',
      status: 'blocked',
      findings: [
        {
          id: 'completeness:avatar:metadata-registration',
          severity: 'blocking',
        },
      ],
    });

    expect(result.stages[1].status).toBe('skipped');
  });

  it('converts completeness failures into blocking findings', async () => {
    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      runner: () =>
        workerSuccess({
          completeness: [
            {
              componentName: 'Avatar',
              ready: false,
              checks: [
                {
                  name: 'implementation',
                  platform: 'react',
                  ok: false,
                  details: 'Missing Avatar implementation.',
                },
              ],
            },
          ],
          quality: passingQuality(),
        }),
    });

    expect(result.stages[0]).toMatchObject({
      status: 'blocked',
      findings: [
        {
          id: 'completeness:avatar:react:implementation',
          platform: 'react',
          severity: 'blocking',
        },
      ],
    });

    expect(result.stages[1].status).toBe('skipped');
    expect(result.quality).toBeNull();
  });

  it('preserves blocking and advisory quality findings', async () => {
    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      runner: () =>
        workerSuccess({
          completeness: [
            {
              componentName: 'Avatar',
              ready: true,
              checks: [],
            },
          ],
          quality: {
            status: 'fail',
            report: {
              schemaVersion: '1',
              components: [
                {
                  componentName: 'Avatar',
                  status: 'fail',
                  platforms: [],
                  findings: [
                    {
                      ruleId: 'platform.accessibility-semantics',
                      dimension: 'accessibility',
                      severity: 'required',
                      evaluation: 'automated',
                      status: 'fail',
                      platform: 'react',
                      message: 'Avatar lacks accessibility semantics.',
                    },
                    {
                      ruleId: 'conformity.hardcoded-geometry',
                      dimension: 'design-system',
                      severity: 'recommended',
                      evaluation: 'automated',
                      status: 'warn',
                      platform: 'react',
                      message: 'Avatar uses hardcoded geometry.',
                    },
                  ],
                },
              ],
            },
          },
        }),
    });

    expect(result.stages[1].status).toBe('blocked');

    expect(
      result.stages[1].findings.map((finding) => finding.severity)
    ).toEqual(['blocking', 'warning']);
  });

  it('keeps warning-only quality results non-blocking', async () => {
    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      runner: () =>
        workerSuccess({
          completeness: [
            {
              componentName: 'Avatar',
              ready: true,
              checks: [],
            },
          ],
          quality: {
            status: 'warn',
            report: {
              schemaVersion: '1',
              components: [
                {
                  componentName: 'Avatar',
                  status: 'warn',
                  platforms: [],
                  findings: [
                    {
                      ruleId: 'conformity.hardcoded-geometry',
                      dimension: 'design-system',
                      severity: 'recommended',
                      evaluation: 'automated',
                      status: 'warn',
                      platform: 'react',
                      message: 'Hardcoded geometry.',
                    },
                  ],
                },
              ],
            },
          },
        }),
    });

    expect(result.stages[1].status).toBe('passed');

    expect(result.stages[1].findings[0]?.severity).toBe('warning');
  });

  it('fails closed on worker runtime failure', async () => {
    const result = await runComponentProductionStructuredValidation({
      root: '/tmp/vellira-production',
      input: INPUT,
      runner: () => ({
        exitCode: 2,
        stdout: '',
        stderr: 'Unable to load generated metadata.',
        timedOut: false,
      }),
    });

    expect(result.stages.map((stage) => stage.status)).toEqual([
      'failed',
      'skipped',
    ]);

    expect(result.completeness).toBeNull();
    expect(result.quality).toBeNull();
  });
});

function workerSuccess(params: {
  completeness: readonly ComponentCompletenessResult[];
  quality: ComponentQualityRunResult;
}): ComponentProductionStructuredValidationWorkerExecution {
  return workerResult({
    schemaVersion: '1',
    status: 'ok',
    componentName: 'Avatar',
    completeness: params.completeness,
    quality: params.quality,
  });
}

function workerResult(
  result: ComponentProductionValidationWorkerResult
): ComponentProductionStructuredValidationWorkerExecution {
  return {
    exitCode: 0,
    stdout: JSON.stringify(result),
    stderr: '',
    timedOut: false,
  };
}

function passingQuality() {
  return {
    status: 'pass' as const,
    report: {
      schemaVersion: '1' as const,
      components: [
        {
          componentName: 'Avatar',
          status: 'pass' as const,
          platforms: [],
          findings: [],
        },
      ],
    },
  };
}

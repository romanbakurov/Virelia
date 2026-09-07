import { describe, expect, it } from 'vitest';

import type {
  ComponentProductionFinding,
  ComponentProductionInputV1,
  ComponentProductionStageId,
  ComponentProductionStageResult,
} from './contracts';
import {
  runComponentProduction,
  runComponentProductionValidation,
  validateComponentProductionCandidate,
} from './run';

const RAW_INPUT: ComponentProductionInputV1 = {
  schemaVersion: '1',
  componentName: 'Avatar',
  platform: 'both',
  layer: 'primitives',
  category: 'data-display',
  profile: 'base',
  capabilities: [],
  componentTokens: 'standard',
  parts: [],
};

const INPUT = RAW_INPUT;

describe('runComponentProduction', () => {
  it('orchestrates generation and every canonical validation stage', async () => {
    const calls: string[] = [];

    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => {
          calls.push('generation');

          return {
            preflight: passedStage('preflight'),
            generation: {
              ...passedStage('generation'),
              artifacts: [
                'apps/docs/src/react/avatar.md',
                'apps/website/src/component-catalog/components/Avatar/index.ts',
                'packages/metadata/src/components/Avatar.metadata.ts',
                'packages/react/src/primitives/Avatar/Avatar.test.tsx',
                'packages/react/src/primitives/Avatar/Avatar.tsx',
              ],
            },
            generatedArtifacts: [
              'apps/docs/src/react/avatar.md',
              'apps/website/src/component-catalog/components/Avatar/index.ts',
              'packages/metadata/src/components/Avatar.metadata.ts',
              'packages/react/src/primitives/Avatar/Avatar.test.tsx',
              'packages/react/src/primitives/Avatar/Avatar.tsx',
            ],
          };
        },
        runCommandValidation: () => {
          calls.push('command-validation');

          return {
            stages: commandStages(),
          };
        },
        runStructuredValidation: async () => {
          calls.push('structured-validation');

          return {
            stages: [passedStage('completeness'), passedStage('quality')],
            completeness: [
              {
                componentName: 'Avatar',
                ready: true,
                checks: [],
              },
            ],
            quality: passingQuality(),
          };
        },
      },
    });

    expect(calls).toEqual([
      'generation',
      'command-validation',
      'structured-validation',
    ]);

    expect(result.status).toBe('ready');
    expect(result.readyForReview).toBe(true);

    expect(result.stages.map((stage) => stage.id)).toEqual([
      'preflight',
      'generation',
      'format',
      'lint',
      'tests',
      'typecheck',
      'build',
      'storybook',
      'docs',
      'website',
      'completeness',
      'quality',
    ]);

    expect(result.outputs).toMatchObject({
      generation: {
        status: 'passed',
      },
      metadata: {
        generated: true,
        artifacts: ['packages/metadata/src/components/Avatar.metadata.ts'],
      },
      testGeneration: {
        generated: true,
        artifacts: ['packages/react/src/primitives/Avatar/Avatar.test.tsx'],
      },
      docsGeneration: {
        generated: true,
        artifacts: ['apps/docs/src/react/avatar.md'],
      },
      websiteGeneration: {
        generated: true,
        artifacts: [
          'apps/website/src/component-catalog/components/Avatar/index.ts',
        ],
      },
    });

    expect(result.validationSummary).toMatchObject({
      status: 'ready',
      blockedStages: [],
      failedStages: [],
      skippedStages: [],
    });

    expect(result.artifacts).toEqual([
      'apps/docs/src/react/avatar.md',
      'apps/website/src/component-catalog/components/Avatar/index.ts',
      'packages/metadata/src/components/Avatar.metadata.ts',
      'packages/react/src/primitives/Avatar/Avatar.test.tsx',
      'packages/react/src/primitives/Avatar/Avatar.tsx',
    ]);
  });

  it('stops before validation when deterministic preflight blocks', async () => {
    let validationCalled = false;

    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => ({
          preflight: {
            id: 'preflight',
            status: 'blocked',
            summary: 'Preflight blocked.',
            findings: [
              {
                id: 'preflight:1',
                stage: 'preflight',
                severity: 'blocking',
                message: 'Component already exists.',
              },
            ],
            artifacts: [],
          },
          generation: {
            id: 'generation',
            status: 'skipped',
            summary: 'Generation skipped.',
            findings: [],
            artifacts: [],
          },
          generatedArtifacts: [],
        }),
        runCommandValidation: () => {
          validationCalled = true;

          return {
            stages: commandStages(),
          };
        },
        runStructuredValidation: async () => {
          validationCalled = true;

          return {
            stages: [passedStage('completeness'), passedStage('quality')],
            completeness: [],
            quality: passingQuality(),
          };
        },
      },
    });

    expect(validationCalled).toBe(false);
    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);

    expect(
      result.stages.slice(2).every((stage) => stage.status === 'skipped')
    ).toBe(true);

    expect(result.blockingFindings).toEqual([
      {
        id: 'preflight:1',
        stage: 'preflight',
        severity: 'blocking',
        message: 'Component already exists.',
      },
    ]);
  });

  it('stops before structured validation after deterministic command blocking', async () => {
    const testFinding: ComponentProductionFinding = {
      id: 'tests:react-tests',
      stage: 'tests',
      severity: 'blocking',
      message: 'Avatar tests failed.',
    };

    let structuredValidationCalled = false;

    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => ({
          preflight: passedStage('preflight'),
          generation: passedStage('generation'),
          generatedArtifacts: [],
        }),
        runCommandValidation: () => ({
          stages: commandStages({
            tests: blockedStage('tests', testFinding),
          }),
        }),
        runStructuredValidation: async () => {
          structuredValidationCalled = true;

          return {
            stages: [passedStage('completeness'), passedStage('quality')],
            completeness: [],
            quality: passingQuality(),
          };
        },
      },
    });

    expect(structuredValidationCalled).toBe(false);
    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);
    expect(result.blockingFindings).toEqual([testFinding]);

    expect(
      result.stages.find((stage) => stage.id === 'completeness')?.status
    ).toBe('skipped');

    expect(result.stages.find((stage) => stage.id === 'quality')?.status).toBe(
      'skipped'
    );
  });

  it('gives runtime validation failure precedence over repairable blocking', async () => {
    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => ({
          preflight: passedStage('preflight'),
          generation: passedStage('generation'),
          generatedArtifacts: [],
        }),
        runCommandValidation: () => ({
          stages: commandStages({
            lint: {
              id: 'lint',
              status: 'failed',
              summary: 'Lint runner failed.',
              findings: [
                {
                  id: 'lint:runtime',
                  stage: 'lint',
                  severity: 'blocking',
                  message: 'Lint runner unavailable.',
                },
              ],
              artifacts: [],
            },
          }),
        }),
        runStructuredValidation: async () => ({
          stages: [passedStage('completeness'), passedStage('quality')],
          completeness: [],
          quality: passingQuality(),
        }),
      },
    });

    expect(result.status).toBe('failed');
    expect(result.readyForReview).toBe(false);
  });
});

describe('runComponentProductionValidation', () => {
  it('returns a versioned review-ready validation-only result', async () => {
    const result = await runComponentProductionValidation({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runCommandValidation: () => ({
          stages: commandStages(),
        }),
        runStructuredValidation: async () => ({
          stages: [passedStage('completeness'), passedStage('quality')],
          completeness: [
            {
              componentName: 'Avatar',
              ready: true,
              checks: [],
            },
          ],
          quality: passingQuality(),
        }),
      },
    });

    expect(result).toMatchObject({
      schemaVersion: '1',
      status: 'ready',
      readyForReview: true,
      blockingFindings: [],
      validationSummary: {
        status: 'ready',
        blockedStages: [],
        failedStages: [],
        skippedStages: [],
      },
    });

    expect(result.validationSummary.passedStages).toEqual([
      'format',
      'lint',
      'tests',
      'typecheck',
      'build',
      'storybook',
      'docs',
      'website',
      'completeness',
      'quality',
    ]);
  });

  it('returns machine-readable blocking findings without generation', async () => {
    const finding: ComponentProductionFinding = {
      id: 'tests:react-tests',
      stage: 'tests',
      severity: 'blocking',
      message: 'Avatar tests failed.',
    };

    const result = await runComponentProductionValidation({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runCommandValidation: () => ({
          stages: commandStages({
            tests: blockedStage('tests', finding),
          }),
        }),
        runStructuredValidation: async () => ({
          stages: [passedStage('completeness'), passedStage('quality')],
          completeness: [],
          quality: passingQuality(),
        }),
      },
    });

    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);
    expect(result.blockingFindings).toEqual([finding]);
    expect(result.validationSummary.blockedStages).toEqual(['tests']);
  });
});

describe('validateComponentProductionCandidate', () => {
  it('reruns deterministic validation without invoking generation', async () => {
    const calls: string[] = [];

    const result = await validateComponentProductionCandidate({
      root: '/tmp/vellira-production',
      input: INPUT,
      dependencies: {
        runCommandValidation: () => {
          calls.push('command-validation');

          return {
            stages: commandStages(),
          };
        },
        runStructuredValidation: async () => {
          calls.push('structured-validation');

          return {
            stages: [passedStage('completeness'), passedStage('quality')],
            completeness: [],
            quality: passingQuality(),
          };
        },
      },
    });

    expect(calls).toEqual(['command-validation', 'structured-validation']);

    expect(result.stages.map((stage) => stage.id)).toEqual([
      'format',
      'lint',
      'tests',
      'typecheck',
      'build',
      'storybook',
      'docs',
      'website',
      'completeness',
      'quality',
    ]);
  });
});

function commandStages(
  overrides: Partial<
    Record<ComponentProductionStageId, ComponentProductionStageResult>
  > = {}
): ComponentProductionStageResult[] {
  return [
    'format',
    'lint',
    'tests',
    'typecheck',
    'build',
    'storybook',
    'docs',
    'website',
  ].map((id) => {
    const stageId = id as ComponentProductionStageId;

    return overrides[stageId] ?? passedStage(stageId);
  });
}

function passedStage(
  id: ComponentProductionStageId
): ComponentProductionStageResult {
  return {
    id,
    status: 'passed',
    summary: `${id} passed.`,
    findings: [],
    artifacts: [],
  };
}

function blockedStage(
  id: ComponentProductionStageId,
  finding: ComponentProductionFinding
): ComponentProductionStageResult {
  return {
    id,
    status: 'blocked',
    summary: `${id} blocked.`,
    findings: [finding],
    artifacts: [],
  };
}

function passingQuality() {
  return {
    status: 'pass' as const,
    report: {
      schemaVersion: '1' as const,
      components: [],
    },
  };
}

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
  it('stops at the semantic-completion boundary after deterministic generation', async () => {
    const calls: string[] = [];
    const artifacts = [
      'apps/docs/src/react/avatar.md',
      'apps/website/src/component-catalog/components/Avatar/index.ts',
      'packages/metadata/src/components/Avatar.metadata.ts',
      'packages/react/src/primitives/Avatar/Avatar.stories.tsx',
      'packages/react/src/primitives/Avatar/Avatar.test.tsx',
      'packages/react/src/primitives/Avatar/Avatar.tsx',
      'packages/tokens/src/factories/avatar.ts',
      'packages/types/src/avatar.ts',
    ];

    const result = await runComponentProduction({
      root: '/tmp/vellira-production',
      input: RAW_INPUT,
      dependencies: {
        runGeneration: async () => {
          calls.push('generation');
          return {
            preflight: passedStage('preflight'),
            generation: { ...passedStage('generation'), artifacts },
            generatedArtifacts: artifacts,
          };
        },
        runCommandValidation: () => {
          calls.push('command-validation');
          return { stages: commandStages() };
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

    expect(calls).toEqual(['generation']);
    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);
    expect(result.lifecycle).toEqual({
      current: 'semantic-completion-required',
      completed: ['scaffolded'],
      semanticCompletionRequired: true,
      readyForReview: false,
    });
    expect(result.blockingFindings).toEqual([
      expect.objectContaining({
        id: 'semantic-completion:required',
        stage: 'semantic-completion',
      }),
    ]);
    expect(
      result.stages.find((stage) => stage.id === 'semantic-completion')
    ).toMatchObject({
      status: 'blocked',
    });
    expect(
      result.stages.slice(3).every((stage) => stage.status === 'skipped')
    ).toBe(true);
    expect(result.outputs.runtimeRenderers.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.tsx',
    ]);
    expect(result.outputs.sharedContracts.artifacts).toEqual([
      'packages/types/src/avatar.ts',
    ]);
    expect(result.outputs.designResources.artifacts).toEqual([
      'packages/tokens/src/factories/avatar.ts',
    ]);
    expect(result.outputs.storyGeneration.artifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.stories.tsx',
    ]);
  });

  it('stops before semantic completion when deterministic preflight blocks', async () => {
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
          return { stages: commandStages() };
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
    expect(result.lifecycle.current).toBe('scaffolded');
    expect(
      result.stages.find((stage) => stage.id === 'semantic-completion')?.status
    ).toBe('skipped');
    expect(
      result.stages.slice(3).every((stage) => stage.status === 'skipped')
    ).toBe(true);
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
      lifecycle: {
        current: 'ready-for-review',
        semanticCompletionRequired: false,
        readyForReview: true,
      },
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
    expect(result.lifecycle.current).toBe('candidate');
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

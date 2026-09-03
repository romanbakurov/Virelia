import { describe, expect, it } from 'vitest';

import {
  COMPONENT_PRODUCTION_STAGE_IDS,
  createComponentProductionResult,
  parseComponentProductionInput,
  type ComponentProductionFinding,
  type ComponentProductionInputV1,
  type ComponentProductionStageId,
  type ComponentProductionStageResult,
  type ComponentProductionStageStatus,
} from './contracts';

const BASE_INPUT: ComponentProductionInputV1 = {
  schemaVersion: '1',
  componentName: 'Avatar',
  platform: 'both',
  layer: 'primitives',
  category: 'data-display',
  profile: 'base',
  capabilities: ['keyboard'],
  parts: [],
};

describe('parseComponentProductionInput', () => {
  it('parses a canonical base component specification', () => {
    expect(
      parseComponentProductionInput({
        schemaVersion: '1',
        componentName: 'Avatar',
        platform: 'both',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        capabilities: ['keyboard'],
        parts: [],
      })
    ).toEqual(BASE_INPUT);
  });

  it('uses the canonical generator validation and defaults', () => {
    expect(
      parseComponentProductionInput({
        schemaVersion: '1',
        componentName: 'Textarea',
        platform: 'web',
        layer: 'primitives',
        category: 'form',
        profile: 'form-control',
      })
    ).toEqual({
      schemaVersion: '1',
      componentName: 'Textarea',
      platform: 'web',
      layer: 'primitives',
      category: 'form',
      profile: 'form-control',
      control: 'value',
      capabilities: [],
      parts: [],
    });
  });

  it('rejects unknown production fields', () => {
    expect(() =>
      parseComponentProductionInput({
        schemaVersion: '1',
        componentName: 'Avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
        force: true,
      })
    ).toThrow('Unknown component production input field "force".');
  });

  it('rejects invalid specifications through the generator contract', () => {
    expect(() =>
      parseComponentProductionInput({
        schemaVersion: '1',
        componentName: 'avatar',
        platform: 'web',
        layer: 'primitives',
        category: 'data-display',
        profile: 'base',
      })
    ).toThrow('Component name must be PascalCase');
  });
});

describe('createComponentProductionResult', () => {
  it('marks a fully passed canonical pipeline ready for review', () => {
    const result = createComponentProductionResult({
      input: BASE_INPUT,
      stages: stages(),
      completeness: [],
      quality: {
        status: 'pass',
        report: {
          schemaVersion: '1',
          components: [],
        },
      },
    });

    expect(result.status).toBe('ready');
    expect(result.readyForReview).toBe(true);
    expect(result.blockingFindings).toEqual([]);
  });

  it('produces a blocked result with deterministic findings', () => {
    const finding: ComponentProductionFinding = {
      id: 'quality:avatar:react:token-integration',
      stage: 'quality',
      severity: 'blocking',
      message: 'Avatar does not satisfy token integration.',
      platform: 'react',
      ruleId: 'conformity.token-integration',
    };

    const result = createComponentProductionResult({
      input: BASE_INPUT,
      stages: stages({
        quality: {
          status: 'blocked',
          findings: [finding],
        },
      }),
      completeness: [],
      quality: {
        status: 'fail',
        report: {
          schemaVersion: '1',
          components: [],
        },
      },
    });

    expect(result.status).toBe('blocked');
    expect(result.readyForReview).toBe(false);
    expect(result.blockingFindings).toEqual([finding]);
  });

  it('gives runtime failure precedence over deterministic blocking', () => {
    const result = createComponentProductionResult({
      input: BASE_INPUT,
      stages: stages({
        lint: {
          status: 'failed',
          findings: [
            {
              id: 'lint:runtime',
              stage: 'lint',
              severity: 'blocking',
              message: 'Lint command could not complete.',
            },
          ],
        },
        quality: {
          status: 'blocked',
          findings: [
            {
              id: 'quality:blocked',
              stage: 'quality',
              severity: 'blocking',
              message: 'Quality validation failed.',
            },
          ],
        },
      }),
      completeness: null,
      quality: null,
    });

    expect(result.status).toBe('failed');
    expect(result.readyForReview).toBe(false);
  });

  it('reports website generation from canonical generation artifacts', () => {
    const websiteArtifacts = [
      'apps/website/src/component-catalog/components/Avatar/index.ts',
      'apps/website/src/component-catalog/registry/components.ts',
    ];

    const result = createComponentProductionResult({
      input: BASE_INPUT,
      stages: stages({
        generation: {
          artifacts: websiteArtifacts,
        },
      }),
      completeness: [],
      quality: {
        status: 'pass',
        report: {
          schemaVersion: '1',
          components: [],
        },
      },
    });

    expect(result.outputs.websiteGeneration).toEqual({
      generated: true,
      artifacts: [...websiteArtifacts].sort(),
    });
  });

  it('requires the complete canonical stage sequence', () => {
    expect(() =>
      createComponentProductionResult({
        input: BASE_INPUT,
        stages: stages().slice(0, -1),
        completeness: null,
        quality: null,
      })
    ).toThrow('must contain every canonical pipeline stage exactly once');
  });
});

function stages(
  overrides: Partial<
    Record<
      ComponentProductionStageId,
      {
        status?: ComponentProductionStageStatus;
        findings?: readonly ComponentProductionFinding[];
        artifacts?: readonly string[];
      }
    >
  > = {}
): ComponentProductionStageResult[] {
  return COMPONENT_PRODUCTION_STAGE_IDS.map((id) => ({
    id,
    status: overrides[id]?.status ?? 'passed',
    summary: `${id} passed.`,
    findings: overrides[id]?.findings ?? [],
    artifacts: overrides[id]?.artifacts ?? [],
  }));
}

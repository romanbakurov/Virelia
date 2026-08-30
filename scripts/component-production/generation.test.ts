import path from 'node:path';

import { describe, expect, it } from 'vitest';

import type { ComponentGenerationPlan } from '../generators/component/plan';

import type { ComponentProductionInputV1 } from './contracts';
import { runComponentProductionGeneration } from './generation';

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

describe('runComponentProductionGeneration', () => {
  it('blocks protected branch writes before planning or generation', async () => {
    let planCalled = false;
    let generatorCalled = false;

    const result = await runComponentProductionGeneration({
      root: '/tmp/vellira-production-test',
      input: INPUT,
      dependencies: {
        validateRepositorySafety: () => ({
          ok: false,
          branch: 'main',
          defaultBranch: 'main',
          reason:
            'Component production refuses direct writes on protected/default branch "main".',
        }),
        createPlan: ({ root }) => {
          planCalled = true;

          return plan(root);
        },
        runGenerator: async () => {
          generatorCalled = true;

          throw new Error('generator must not run');
        },
      },
    });

    expect(planCalled).toBe(false);
    expect(generatorCalled).toBe(false);

    expect(result.preflight).toMatchObject({
      status: 'blocked',
      findings: [
        {
          id: 'preflight:repository-safety',
          severity: 'blocking',
        },
      ],
    });

    expect(result.generation.status).toBe('skipped');
  });

  it('runs deterministic preflight before the canonical generator', async () => {
    const root = path.resolve('/tmp/vellira-production-test');
    const calls: string[] = [];

    const result = await runComponentProductionGeneration({
      root,
      input: INPUT,
      dependencies: {
        validateRepositorySafety: () => ({
          ok: true,
          branch: 'feat/test',
          defaultBranch: 'main',
        }),
        createPlan: ({ root: observedRoot, options }) => {
          calls.push('plan');

          expect(observedRoot).toBe(root);
          expect(options).toMatchObject({
            componentName: 'Avatar',
            platform: 'both',
            force: false,
            dryRun: false,
            check: false,
          });

          return plan(root);
        },
        validatePlan: () => {
          calls.push('preflight');

          return {
            ok: true,
            existingTargets: [],
          };
        },
        runGenerator: async ({ root: observedRoot, options }) => {
          calls.push('generation');

          expect(observedRoot).toBe(root);
          expect(options.force).toBe(false);

          return {
            plan: plan(root),
            createdFiles: [
              path.join(
                root,
                'packages/react/src/primitives/Avatar/Avatar.tsx'
              ),
            ],
            updatedFiles: [
              path.join(root, 'packages/react/src/primitives/index.ts'),
            ],
            dryRun: false,
            check: false,
          };
        },
      },
    });

    expect(calls).toEqual(['plan', 'preflight', 'generation']);

    expect(result.preflight.status).toBe('passed');
    expect(result.generation.status).toBe('passed');
    expect(result.generatedArtifacts).toEqual([
      'packages/react/src/primitives/Avatar/Avatar.tsx',
      'packages/react/src/primitives/index.ts',
    ]);
  });

  it('stops before generation when deterministic preflight blocks', async () => {
    let generatorCalled = false;

    const result = await runComponentProductionGeneration({
      root: '/tmp/vellira-production-test',
      input: INPUT,
      dependencies: {
        validateRepositorySafety: () => ({
          ok: true,
          branch: 'feat/test',
          defaultBranch: 'main',
        }),
        createPlan: ({ root }) => plan(root),
        validatePlan: () => ({
          ok: false,
          errors: ['Missing metadata barrel file.'],
        }),
        runGenerator: async () => {
          generatorCalled = true;
          throw new Error('generator must not run');
        },
      },
    });

    expect(generatorCalled).toBe(false);

    expect(result.preflight.status).toBe('blocked');
    expect(result.preflight.findings).toEqual([
      {
        id: 'preflight:1',
        stage: 'preflight',
        severity: 'blocking',
        message: 'Missing metadata barrel file.',
      },
    ]);

    expect(result.generation.status).toBe('skipped');
    expect(result.generatedArtifacts).toEqual([]);
  });

  it('reports canonical generator runtime failure', async () => {
    const result = await runComponentProductionGeneration({
      root: '/tmp/vellira-production-test',
      input: INPUT,
      dependencies: {
        validateRepositorySafety: () => ({
          ok: true,
          branch: 'feat/test',
          defaultBranch: 'main',
        }),
        createPlan: ({ root }) => plan(root),
        validatePlan: () => ({
          ok: true,
          existingTargets: [],
        }),
        runGenerator: async () => {
          throw new Error('Canonical generator write failed.');
        },
      },
    });

    expect(result.preflight.status).toBe('passed');

    expect(result.generation).toMatchObject({
      id: 'generation',
      status: 'failed',
      findings: [
        {
          id: 'generation:runtime',
          stage: 'generation',
          severity: 'blocking',
          message: 'Canonical generator write failed.',
        },
      ],
    });
  });

  it('fails closed when generator reports an artifact outside the repository', async () => {
    const root = path.resolve('/tmp/vellira-production-test');

    const result = await runComponentProductionGeneration({
      root,
      input: INPUT,
      dependencies: {
        validateRepositorySafety: () => ({
          ok: true,
          branch: 'feat/test',
          defaultBranch: 'main',
        }),
        createPlan: () => plan(root),
        validatePlan: () => ({
          ok: true,
          existingTargets: [],
        }),
        runGenerator: async () => ({
          plan: plan(root),
          createdFiles: [path.resolve(root, '../escaped.ts')],
          updatedFiles: [],
          dryRun: false,
          check: false,
        }),
      },
    });

    expect(result.generation.status).toBe('failed');
    expect(result.generatedArtifacts).toEqual([]);
    expect(result.generation.findings[0]?.message).toContain(
      'escaped the production repository root'
    );
  });
});

function plan(root: string): ComponentGenerationPlan {
  return {
    root,
    componentName: 'Avatar',
    layer: 'primitives',
    category: 'data-display',
    profile: 'base',
    control: 'value',
    capabilities: [],
    force: false,
    parts: [],
    targets: [],
    sharedTypesFile: path.join(root, 'packages/types/src/avatar.ts'),
    sharedTypesBarrelFile: path.join(root, 'packages/types/src/index.ts'),
    metadataFile: path.join(root, 'packages/metadata/src/Avatar.metadata.ts'),
    metadataBarrelFile: path.join(root, 'packages/metadata/src/index.ts'),
    tokenFactoryFile: path.join(
      root,
      'packages/tokens/src/factories/avatar.ts'
    ),
    tokenFactoryBarrelFile: path.join(
      root,
      'packages/tokens/src/factories/index.ts'
    ),
    tokenThemeTargets: [],
    docsRoot: path.join(root, 'apps/docs'),
    docsContractFile: path.join(root, 'apps/docs/src/component-docs/Avatar.ts'),
    docsContractRegistryFile: path.join(
      root,
      'apps/docs/src/component-docs/index.ts'
    ),
  };
}
